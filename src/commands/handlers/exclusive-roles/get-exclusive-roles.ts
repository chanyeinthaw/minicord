import {CommandContext} from "@lib/mini-command";
import {MessageEmbed} from "discord.js";

export async function getExclusiveRoles(ctx: CommandContext){
    let [spaceRoleId] = ctx.args as [string]

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: {
                equals: spaceRoleId ?? null
            },
        },
        select: {
            id: true,
            exclusiveRoles: {
                select: {
                    roleId: true
                }
            }
        }
    })
    if (!space) throw new Error('Invalid space!')

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