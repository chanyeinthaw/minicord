import {CommandContext} from "@lib/mini-command";

export default async function addExclusiveRole(ctx: CommandContext){
    let [spaceRoleId] = ctx.args as [string]
    let roles = (ctx.args as string[])

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: spaceRoleId,
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

    if (!space) return ctx.message.reply('Invalid space!')

    let discordRoles = await ctx.guild?.roles.cache.filter(role => {
        return roles.indexOf(role.id) >= 0
    })

    if (!space || !discordRoles?.find(role => role.id === spaceRoleId)) return ctx.message.reply(`Invalid space role!`)
    roles = roles.filter(roleId => !space!.exclusiveRoles.find(role => role.roleId === roleId))

    if (discordRoles?.size !== roles.length) return ctx.message.reply('Invalid roles')

    roles = roles.splice(1)

    await ctx.prisma.space.update({
        where: {
            id: space.id
        },
        data: {
            exclusiveRoles: {
                create: roles.map(roleId => ({ roleId }))
            }
        }
    })

    return ctx.message.reply(`Roles: ${roles.map(roleId => `<@&${roleId}>`).join(' ')} added to space ${space.name}<&@${spaceRoleId}>.`)
}