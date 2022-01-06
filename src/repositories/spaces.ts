import {PrismaClient} from "@prisma/client";
let prisma = new PrismaClient()

export async function findAll() {
    return await prisma.space.findMany({
        select: {
            id: true,
            roleId: true,
            name: true
        }
    })
}

export async function find(spaceRoleId: any, key = 'roleId') {
    let space = await prisma.space.findFirst({
        where: {
            [key]: {
                equals: spaceRoleId ?? null
            },
        },
        select: {
            id: true,
            name: true,
            roleId: true,
            exclusiveRoles: true,
            categoryDefaultPermissions: true,
            users: {
                select: {
                    user: true
                }
            },
            categories: true
        }
    })
    if (!space) throw new Error('Invalid space!')

    return space
}