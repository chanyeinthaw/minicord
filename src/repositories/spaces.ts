import {PrismaClient} from "@prisma/client";

export async function find(spaceRoleId: any) {
    let prisma = new PrismaClient()

    let space = await prisma.space.findFirst({
        where: {
            roleId: {
                equals: spaceRoleId ?? null
            },
        },
        select: {
            id: true,
            name: true,
            exclusiveRoles: true,
            categoryDefaultPermissions: true,
            categories: true
        }
    })
    if (!space) throw new Error('Invalid space!')

    return space
}