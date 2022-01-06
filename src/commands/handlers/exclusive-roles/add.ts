import {CommandContext} from "@lib/mini-command";
import * as spaces from '@app/repositories/spaces'

export default async function addExclusiveRole(ctx: CommandContext){
    let { spaceRoleId, roles } = ctx.params
    let space = await spaces.find(spaceRoleId, 'name')
    roles = roles.split(' ')

    let discordRoles = await ctx.guild?.roles.cache.filter(role => {
        return roles.indexOf(role.id) >= 0
    })

    if (discordRoles?.size !== roles.length) throw new Error('Invalid roles')

    roles = roles.filter(roleId => space!.exclusiveRoles.find(role => role.roleId === roleId) === undefined)

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