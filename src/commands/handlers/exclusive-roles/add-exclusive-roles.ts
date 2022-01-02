import {CommandContext} from "@lib/mini-command";

export async function addExclusiveRole(ctx: CommandContext){
    let [spaceRoleId] = ctx.args as [string]
    let roles = (ctx.args as string[])

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: {
                equals: spaceRoleId ?? null
            },
        },
        select: {
            id: true,
            name: true,
            exclusiveRoles: {
                select: {
                    roleId: true
                }
            }
        }
    })
    if (!space) throw new Error('Invalid space!')

    let discordRoles = await ctx.guild?.roles.cache.filter(role => {
        return roles.indexOf(role.id) >= 0
    })

    if (!discordRoles?.find(role => role.id === spaceRoleId)) throw new Error(`Invalid space role!`)
    if (discordRoles?.size !== roles.length) throw new Error('Invalid roles')

    roles = roles.splice(1)
    roles = roles.filter(roleId => !space!.exclusiveRoles.find(role => role.roleId === roleId))

    if (roles.length > 0) await ctx.prisma.space.update({
        where: {
            id: space.id
        },
        data: {
            exclusiveRoles: {
                create: roles.map(roleId => ({ roleId }))
            }
        }
    })

    return ctx.message.reply(`\`Roles added.\``)
}