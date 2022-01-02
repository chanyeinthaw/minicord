import {CommandContext} from "@lib/mini-command";

export async function removeExclusiveRoles(ctx: CommandContext){
    let [spaceRoleId] = ctx.args as [string]
    let roles = (ctx.args as string[])

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: {
                equals: spaceRoleId ?? null
            },
        },
        select: {
            exclusiveRoles: {
                select: {
                    roleId: true
                }
            }
        }
    })
    if (!space) throw new Error('Invalid space!')

    roles = roles.splice(1)

    if (roles.length > 0) await ctx.prisma.exclusiveRole.deleteMany({
        where: {
            roleId: {
                in: roles
            }
        }
    })
}