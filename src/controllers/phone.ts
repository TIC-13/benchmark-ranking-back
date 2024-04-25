import { Request, Response, NextFunction } from "express";
import phoneServices from "../services/phone";
import { Phone, Prisma } from "@prisma/client";
import inferenceServices from "../services/inference";

const phoneController = {

    getAllPhones: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phones = await phoneServices.getAllPhones()
            return res.status(200).json(phones)
        } catch (error) {
            next(error)
        }
    },

    getPhone: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string }
            const numericId = parseInt(id)
            if (isNaN(numericId))
                return res.status(400).send("ID deve ser numérico")
            const phone = await phoneServices.getPhone(numericId)
            return res.status(200).json(phone)
        } catch (error) {
            next(error)
        }
    },

    createPhone: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phone = req.body as Prisma.PhoneCreateInput
            const createdPhone = await phoneServices.createPhone(phone)
            return res.status(200).json(createdPhone)
        } catch (error) {
            next(error)
        }
    },

    ranking: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { models, quantizations, modes, manufacturers } = req.query

            const modelsArray: string[] = models ? (models as string).split(',') : [];
            const quantizationsArray: string[] = quantizations ? (quantizations as string).split(',') : [];
            const modesArray: string[] = modes ? (modes as string).split(',') : [];
            const manufacturersArray: string[] = manufacturers ? (manufacturers as string).split(',') : ["Samsung", "Motorola"];

            const phones = (await phoneServices.getAllPhones()).filter(phone => manufacturersArray.includes(phone.manufacturer))
            const ranking = []
            for (let phone of phones) {
                const results = []
                for (let model of modelsArray) {
                    for (let quantization of quantizationsArray) {
                        for (let mode of modesArray) {
                            const uses =
                                mode === "CPU" ? { uses_gpu: false, uses_nnapi: false } :
                                    mode === "GPU" ? { uses_gpu: true, uses_nnapi: false } :
                                        { uses_gpu: false, uses_nnapi: true }
                            const speed = await inferenceServices.getMediumSpeed({ phone_id: phone.id, ml_model: model, quantization: quantization, ...uses })
                            results.push({ model, quantization, speed, mode })
                        }
                    }
                }
                ranking.push({ phone, results })
            }
            return res.status(200).json(ranking)
        } catch (error) {
            next(error)
        }
    },

    simpleRanking: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { models } = req.query

            const modelsArray: string[] = models ? (models as string).split(',') : [];

            const modes = [
                {
                    name: "CPU",
                    uses: { uses_gpu: false, uses_nnapi: false}
                },
                {
                    name: "GPU",
                    uses: { uses_gpu: true, uses_nnapi: false}
                },
                {
                    name: "NNAPI",
                    uses: { uses_gpu: false, uses_nnapi: true}
                },
            ]

            const phones = await phoneServices.getAllPhones()
            const results = []
            for(let phone of phones){
                const phoneResult: any = { phone: phone }
                for(let mode of modes){
                    const mediumSpeed = await inferenceServices.getMediumSpeed({
                        phone_id: phone.id, 
                        ...mode.uses, 
                        ml_model:{in: modelsArray}
                    })
                    phoneResult[mode.name] = mediumSpeed
                }
                results.push(phoneResult)
            }
            return res.status(200).send(results)
        } catch (error) {
            next(error)
        }
    }
}

export default phoneController