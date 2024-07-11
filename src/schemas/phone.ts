import { z } from 'zod'

const phoneSchema = z.object({
    brand_name: z.string(),
    manufacturer: z.string(),
    phone_model: z.string(),
    total_ram: z.number().int()
})

export { phoneSchema }