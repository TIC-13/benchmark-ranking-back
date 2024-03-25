import { Request, Response, NextFunction } from "express";
import phoneServices from "../services/phone";
import { Prisma } from "@prisma/client";
import inferenceServices from "../services/inference";

type RankingRequestBody = { models: string[], quantizations: string[], modes: ("CPU" | "GPU" | "NNAPI")[]}

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
            const { quantizations, models, modes } = req.body as RankingRequestBody
            const phones = await phoneServices.getAllPhones()
            const ranking = []
            for(let phone of phones) {
                const results = []
                for (let model of models){
                    for (let mode of modes){
                        const uses = 
                            mode === "CPU" ? {uses_gpu: false, uses_nnapi: false}: 
                            mode === "GPU"? {uses_gpu: true, uses_nnapi: false}: 
                            {uses_gpu: false, uses_nnapi: true}
                        for (let quantization of quantizations){
                            const speed = await inferenceServices.getMediumSpeed({phone_id: phone.id, ml_model: model, quantization: quantization, ...uses})
                            results.push({model, quantization, speed, mode})
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