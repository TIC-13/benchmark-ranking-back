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
        prisma.inference.findMany({ where: selectionArgs }),

    getRankingData: async (selectionArgs: Prisma.InferenceWhereInput | undefined) => {
        const inferences = await prisma.inference.findMany({ where: selectionArgs });
        if (inferences.length === 0) return null

        let totalSpeed = 0
        let speedSamples = 0

        let totalPower = 0
        let totalEnergy = 0
        let powerEnergySamples = 0


        for (let inf of inferences) {

            if (inf.inf_speed !== null) {
                totalSpeed += inf.inf_speed * inf.num_images
                speedSamples += inf.num_images
            }

            if(inf.power !== null && inf.energy !== null) {
                totalPower += inf.power * inf.num_images
                totalEnergy += inf.energy * inf.num_images
                powerEnergySamples += inf.num_images
            }

        }
 
        return {
            speed: parseInt((totalSpeed / speedSamples).toString()),
            power: totalPower/powerEnergySamples,
            energy: totalEnergy/powerEnergySamples,
            samples: inferences
                .map(x => x.num_images)
                .reduce((acc, curr) => acc + curr)
        }
    },

    getInference: (id: number) =>
        prisma.inference.findFirstOrThrow({ where: { id } }),

    createInference: (data: Prisma.InferenceCreateInput) =>
        prisma.inference.create({ data }),

}

export default inferenceServices