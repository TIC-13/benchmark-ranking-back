import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

class Sampler {
    private total: number = 0
    private numSamples: number = 0

    add = (sample: number) => {
        this.total += sample
        this.numSamples ++
    }

    average = () => {
        if(this.numSamples === 0) return 0
        return this.total/this.numSamples
    }

    averageInt = () => parseInt(this.average().toString())
}


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

        const speed = new Sampler()
        const cpu = new Sampler()
        const gpu = new Sampler()
        const ram = new Sampler()

        for (let {inf_speed, cpu_usage, gpu_usage, ram_usage} of inferences) {

            const pairsToSample = [
                {sample: inf_speed, sampler: speed},
                {sample: cpu_usage, sampler: cpu},
                {sample: ram_usage, sampler: ram},
                {sample: gpu_usage, sampler: gpu}
            ]

            for(let {sample, sampler} of pairsToSample) 
                if(sample !== null)
                    sampler.add(sample)
        }

        return {
            speed: speed.averageInt(),
            cpu: cpu.averageInt(),
            gpu: gpu.averageInt(),
            ram: ram.averageInt(),
            samples: inferences
                .map(x => x.num_images)
                .reduce((acc, curr) => acc + curr)
        }
    },

    getLLMRankingData: async (selectionArgs: Prisma.LLMInferenceWhereInput | undefined) => {
        const inferences = await prisma.lLMInference.findMany({
            where: selectionArgs, include: {
                prefill: true,
                decode: true,
                gpu: true,
                cpu: true,
                ram: true
            }
        });

        const removeNull = <T>(arr: (T | null)[]) => arr.filter(x => x !== null) 

        const sum = (numbers: number[]) => numbers.reduce((prev, curr) => prev + curr, 0)
        const avg = (numbers: number[]) => numbers.length == 0? null: sum(numbers) / numbers.length

        const process = (arr: (number | null)[]) => avg(removeNull(arr) as number[])  

        const prefill = process(inferences.map(x => x.prefill.average))
        const decode = process(inferences.map(x => x.decode.average))
        const power = process(inferences.map(x => x.powerAverage))
        const energy = process(inferences.map(x => x.energyAverage))
        const gpu = process(inferences.map(x => x.gpu?.average ?? null))
        const cpu = process(inferences.map(x => x.cpu?.average ?? null))
        const ram = process(inferences.map(x => x.ram.average))

        if (inferences.length === 0) return null

        return {
            prefill, decode, power, energy, gpu, cpu, ram,
            samples: inferences.length
        }
    },

    getInference: (id: number) =>
        prisma.inference.findFirstOrThrow({ where: { id } }),

    createInference: (data: Prisma.InferenceCreateInput) =>
        prisma.inference.create({ data }),

}

export default inferenceServices