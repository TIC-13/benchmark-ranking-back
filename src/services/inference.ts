import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

const inferenceServices = {

    getAllInferences: () => 
        prisma.inference.findMany(),

    getAllModels: async () => {
        const uniqueModels = await prisma.inference.findMany({
            select: {
                ml_model: true,
                category: true
            },
            distinct: ['ml_model']
        });
        return uniqueModels;
    },

    getAllQuantizations: async () => {
        const uniqueModels = await prisma.inference.findMany({
            select: {
                quantization: true
            },
            distinct: ['quantization']
        });
        return uniqueModels.map(model => model.quantization);
    },

    selectInferences: (selectionArgs: Prisma.InferenceWhereInput | undefined) => 
        prisma.inference.findMany({where: selectionArgs}),

    getMediumSpeed: async (selectionArgs:  Prisma.InferenceWhereInput | undefined) => {
        const inferences = await prisma.inference.findMany({where: selectionArgs});
        const inferencesNotNull = inferences.filter(x => x.inf_speed !== null)
        if(inferences.length === 0) return null
        let totalImages = 0
        let totalSpeed = 0
        for(let inf of inferencesNotNull) {
            totalSpeed += inf.inf_speed! * inf.num_images
            totalImages += inf.num_images
        }
        if(totalImages === 0) return null
        return {
            speed: parseInt((totalSpeed / totalImages).toString()),
            samples: inferences
                .map(x => x.num_images)
                .reduce((acc, curr) => acc+curr)
        }
    },

    getInference: (id: number) => 
        prisma.inference.findFirstOrThrow({ where: {id} }),

    createInference: (data: Prisma.InferenceCreateInput) =>
        prisma.inference.create({ data }),

}

export default inferenceServices