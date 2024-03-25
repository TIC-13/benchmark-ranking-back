import { Request, Response, NextFunction } from "express";
import phoneServices from "../services/phone";
import { Prisma } from "@prisma/client";
import inferenceServices from "../services/inference";

type RankingRequestBody = { models: string[], quantizations: string[], modes: ("CPU" | "GPU" | "NNAPI")[] }

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
            const { models, quantizations, modes } = req.query

            const modelsArray: string[] = models ? (models as string).split(',') : [];
            const quantizationsArray: string[] = quantizations ? (quantizations as string).split(',') : [];
            const modesArray: string[] = modes ? (modes as string).split(',') : [];

            const phones = await phoneServices.getAllPhones()
            const ranking = []
            for (let phone of phones) {
                const results = []
                for (let model of modelsArray) {
                    for (let mode of modesArray) {
                        const uses =
                            mode === "CPU" ? { uses_gpu: false, uses_nnapi: false } :
                                mode === "GPU" ? { uses_gpu: true, uses_nnapi: false } :
                                    { uses_gpu: false, uses_nnapi: true }
                        for (let quantization of quantizationsArray) {
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
    }
}

export default phoneController