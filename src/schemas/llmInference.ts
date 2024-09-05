import { z } from "zod"
import { phoneSchema } from "./phone"

const measurementSchema = z.object({
    average: z.number(),
    median: z.number(),
    peak: z.number(),
    std: z.number()
})

const modelSchema = z.object({
    name: z.string()
})

const llmInferenceSchema = z.object({
    llm_model: modelSchema,
    phone: phoneSchema,
    cpu: measurementSchema,
    gpu: measurementSchema,
    ram: measurementSchema,
    prefill: measurementSchema,
    decode: measurementSchema,
    powerAverage: z.number().optional(),
    energyAverage: z.number().optional()
})

export { llmInferenceSchema }