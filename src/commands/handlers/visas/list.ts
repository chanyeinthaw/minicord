import {CommandContext} from "@lib/mini-command";
import {MessageEmbed} from "discord.js";

export async function listVisas(ctx: CommandContext) {
    let {spaceRoleId} = ctx.params

    let visas = await ctx.prisma.visa.findMany({
        where: {
            spaces: !!spaceRoleId ? {
                some: {
                    space: {
                        roleId: spaceRoleId
                    }
                }
            } : undefined
        },
        include: {
            spaces: {
                where: !!spaceRoleId ? {
                    space: {
                        roleId: spaceRoleId
                    }
                } : undefined,
                select: {
                    space: true
                }
            }
        }
    })

    return ctx.message.reply({
        embeds: [new MessageEmbed({
            title: 'Visas',
            description: visas.map(v => `<@&${v.roleId}> - ${v.spaces.map(s => `<@&${s.space.roleId}>`).join(' ')}`).join('\n')
        })]
    })
}