import { z } from "zod"
import { phoneSchema } from "./phone"

const measurementSchema = z.object({
    average: z.number().optional(),
    median: z.number().optional(),
    peak: z.number().optional(),
    std: z.number().optional()
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