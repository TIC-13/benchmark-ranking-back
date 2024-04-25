import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import inferenceServices from "../services/inference";

const inferenceController = {

    getAllInferences: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const phones = await inferenceServices.getAllInferences()
            return res.status(200).json(phones)
        } catch (error) {
            next(error)
        }
    },

    getAllModels: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const models = await inferenceServices.getAllModels()
            return res.status(200).json(models)
        } catch (error) {
            next(error)
        }
    },

    getAllQuantizations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const quant = await inferenceServices.getAllQuantizations()
            return res.status(200).json(quant)
        } catch (error) {
            next(error)
        }
    },

    getInference: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string }
            const numericId = parseInt(id)
            if(isNaN(numericId))
                return res.status(400).send("ID deve ser numérico")
            const phone = await inferenceServices.getInference(numericId)
            return res.status(200).json(phone)
        } catch (error) {
            next(error)
        }
    },

    createInference: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as CreatedInferenceWithPhone
            const createdInference = await inferenceServices.createInference({...body.inference, phone: {
                connectOrCreate: {
                    where: { phone_model: body.phone.phone_model },
                    create: body.phone
                }
            }})
            return res.status(200).json(createdInference)
        } catch (error) {
            next(error)
        }
    }
}

type CreatedInferenceWithPhone = {phone: Prisma.PhoneCreateWithoutInferenceInput, inference: Prisma.InferenceCreateWithoutPhoneInput}

export default inferenceController