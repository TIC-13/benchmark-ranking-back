import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prismaClient";
import { llmInferenceSchema } from "../schemas/llmInference";
import inferenceServices from "../services/inference";

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

    getLLMModels: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const models = await prisma.lLMModel.findMany()
            return res.status(200).json(models)
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
                },
                llm_model: {
                    connectOrCreate: {
                        where: {
                            name: data.llm_model.name
                        },
                        create: data.llm_model
                    }
                }
            }})

            return res.status(200).json(createdInference)

        } catch (error) {
            next(error)
        }
    },

    getRanking: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { models } = req.query

            const modelsArray: string[] = models ? (models as string).split(',') : [];

            const phones = await prisma.phone.findMany({
                where: { 
                    LLMInference: { some: {} }
                }})
            const results = []

            for(let phone of phones){
                results.push({ 
                    phone: phone, 
                    result: await inferenceServices.getLLMRankingData({
                        phone_id: phone.id,
                        llm_model: {
                            name: {
                                in: modelsArray
                            }
                        }
                    }) 
                })
            }

            return res.status(200).send(results)
        } catch (error) {
            next(error)
        }
    }
}

export default llmInferenceController