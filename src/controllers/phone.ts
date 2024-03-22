import { Request, Response, NextFunction } from "express";
import phoneServices from "../services/phone";
import { Prisma } from "@prisma/client";
import inferenceServices from "../services/inference";


type RankingRequestBody = { models: string[], quantizations: string[]}
type RankingEntry = { model: string, quantization: string, speed: number | null}


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
            const { quantizations, models} = req.body as RankingRequestBody
            const phones = await phoneServices.getAllPhones()
            const ranking = []
            for (let phone of phones) {
                const modelResults: RankingEntry[] = []
                for (let model of models) {
                    const results = await inferenceServices.selectInferences({ phone_id: phone.id, ml_model: model })
                    quantizations.map((quantization) => {
                        const resultsOfQuant = results.filter(result => result.quantization === quantization)
                        return modelResults.push({
                            model,
                            quantization,
                            speed: resultsOfQuant.length !== 0?
                                media(resultsOfQuant
                                    .map(result => result.inf_speed)): null           
                        })
                    })
                }
                ranking.push({
                    phone,
                    results: modelResults
                })
            }
            return res.status(200).json(ranking)
        } catch (error) {
            next(error)
        }
    }
}

const media = (arr: number[]) =>
    arr.reduce((x, y) => x + y) / arr.length

export default phoneController