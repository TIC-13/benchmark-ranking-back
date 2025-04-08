import { Request, Response, NextFunction } from "express";
import { reportSchema } from "../schemas/report";
import { prisma } from "../utils/prismaClient";

const reportController = {

    createReport: async (req: Request, res: Response, next: NextFunction) => {
        try{

            console.log("Report body: ", req.body)

            const { data, success, error } = reportSchema.safeParse(req.body) 

            if(!success || data == undefined){
                console.log(error)
                return res.status(400).send("Erro nos valores passados como input " + error)
            }

            const report = await prisma.report.create({data})

            console.log("Report created: ", JSON.stringify(report))

            return res.status(200).json(report)

        }catch (e) {
            next(e)
        }
    }
}

export default reportController