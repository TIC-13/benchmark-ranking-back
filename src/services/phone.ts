import { prisma } from "../utils/prismaClient"
import { Prisma } from "@prisma/client"

const phoneServices = {

    getAllPhones: () => prisma.phone.findMany(),

    getPhone: (id: number) => prisma.phone.findFirstOrThrow({ where: {id} }),

    createPhone: (data: Prisma.PhoneCreateInput) =>
        prisma.phone.create({ data }),

}

export default phoneServices