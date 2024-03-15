import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

const phoneServices = {

    getAllPhones: () => prisma.phone.findMany(),

    createPhone: (data: Prisma.PhoneCreateInput) =>
        prisma.phone.create({ data }),

}

export default phoneServices