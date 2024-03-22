import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

const inferenceServices = {

    getAllInferences: () => 
        prisma.inference.findMany(),

    selectInferences: (selectionArgs: Prisma.InferenceWhereInput | undefined) => 
        prisma.inference.findMany({where: selectionArgs}),

    getInference: (id: number) => 
        prisma.inference.findFirstOrThrow({ where: {id} }),

    createInference: (data: Prisma.InferenceCreateInput) =>
        prisma.inference.create({ data }),

}

export default inferenceServices