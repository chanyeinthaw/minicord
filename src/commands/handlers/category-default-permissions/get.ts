import {MessageEmbed} from "discord.js";
import * as spaces from '@app/repositories/spaces'

export default async function getCategoryDefaultPermissions(ctx) {
    let { spaceRoleId } = ctx.params
    let space = await spaces.find(spaceRoleId, 'name')

    return ctx.message.reply({
        embeds: [
            new MessageEmbed({
                title: 'Permissions',
                description: space.categoryDefaultPermissions.map(p => `${p.type === 1 ? 'A' : 'D'} <@&${p.roleId}> \`${p.permission}\``).join('\n')
            })
        ]
    })
}