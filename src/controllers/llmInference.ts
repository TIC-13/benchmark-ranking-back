import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prismaClient";
import { llmInferenceSchema } from "../schemas/llmInference";

const llmInferenceController = {

    getAllLLMInferences: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const llmInf = await prisma.lLMInference.findMany({include: {
                ram: true,
                gpu: true,
                cpu: true,
                prefill: true,
                decode: true
            }})
            return res.status(200).json(llmInf)
        } catch (error) {
            next(error)
        }
    },

    createLLMInference: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { data, success, error } = llmInferenceSchema.safeParse(req.body) 

            if(!success || data == undefined){
                console.log(error)
                return res.status(400).send("Erro nos valores passados como input")
            }
                
            const createdInference = await prisma.lLMInference.create({data: {
                ...data,
                ram: { create: data.ram },
                gpu: { create: data.cpu },
                cpu: { create: data.cpu },
                prefill: { create: data.prefill },
                decode: { create: data.decode },
                phone: { 
                    connectOrCreate: {
                        where: {
                            phone_model: data.phone.phone_model
                        },
                        create: data.phone
                    }
                }},
            })
            return res.status(200).json(createdInference)
        } catch (error) {
            next(error)
        }
    }
}

export default llmInferenceController