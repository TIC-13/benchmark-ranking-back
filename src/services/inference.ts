import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

const inferenceServices = {

    getAllInferences: () => 
        prisma.inference.findMany(),

    selectInferences: (selectionArgs: Prisma.InferenceWhereInput | undefined) => 
        prisma.inference.findMany({where: selectionArgs}),

    getMediumSpeed: async (selectionArgs:  Prisma.InferenceWhereInput | undefined) => {
        const inferences = await prisma.inference.findMany({where: selectionArgs});
        if(inferences.length == 0) return null
        return inferences.map(inf => inf.inf_speed).reduce((acc, curr) => acc + curr) / inferences.length;
    },

    getInference: (id: number) => 
        prisma.inference.findFirstOrThrow({ where: {id} }),

    createInference: (data: Prisma.InferenceCreateInput) =>
        prisma.inference.create({ data }),

}

export default inferenceServices