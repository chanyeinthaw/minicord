import {CommandContext} from "@lib/mini-command";
import {MessageEmbed} from "discord.js";
import * as spaces from '@app/repositories/spaces'

export default async function getExclusiveRoles(ctx: CommandContext){
    let {spaceRoleId} = ctx.params
    let space = await spaces.find(spaceRoleId)
    let allRoles = ctx.guild!.roles.cache
    let exclusiveRoles = space!.exclusiveRoles.map(r => r.roleId),
        deletedRoles = exclusiveRoles.filter(id => !allRoles.find(role => role.id === id))

    exclusiveRoles = exclusiveRoles.filter(id => deletedRoles.indexOf(id) < 0)

    ctx.prisma.exclusiveRole.deleteMany({
        where: {
            roleId: {
                in: deletedRoles
            }
        }
    }).then()

    return ctx.message.reply({
        embeds: [
            new MessageEmbed({
                title: 'Channel exclusive roles',
                description: `${exclusiveRoles.map(r => `<@&${r}>`).join('\n')}`
            })
        ]
    })
}