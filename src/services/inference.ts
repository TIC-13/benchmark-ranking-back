import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

const inferenceServices = {

    getAllInferences: () => prisma.inference.findMany(),

    getInference: (id: number) => prisma.inference.findFirstOrThrow({ where: {id} }),

    createInference: (data: Prisma.InferenceCreateInput) =>
        prisma.inference.create({ data }),

}

export default inferenceServices