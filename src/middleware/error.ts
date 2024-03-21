import { Prisma } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err)

    if(err instanceof Prisma.PrismaClientKnownRequestError){
        if (err.code === "P2002") {
            return res.status(400).send("Identificador já utilizado");
        }
        if(err.code === "P2025") {
            return res.status(400).send("Não encontrado")
        }
        if(err.code === "P2003") {
            return res.status(400).send("Entidade relacionada não existe")
        }
    }

    if(err instanceof Prisma.PrismaClientValidationError){
        return res.status(400).send("Os dados enviados estão incompletos ou inválidos")
    }

    return res.status(500).send("Erro interno do servidor")
}
