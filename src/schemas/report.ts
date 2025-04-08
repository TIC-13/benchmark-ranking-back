import { z } from 'zod'

const reportSchema = z.object({
    type: z.string(),
    user_description: z.string(),
    conversation: z.string(),
    model: z.string(),
})

export { reportSchema }