import {MessageEmbed} from "discord.js";

export default async function getCategoryDefaultPermissions(ctx) {
    if ((ctx.args as string[]).length < 1) throw new Error('Invalid args')
    let [spaceRoleId] = ctx.args as string[]
    // @ts-ignore

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: spaceRoleId ?? null
        },
        select: {
            categoryDefaultPermissions: {
                select: {
                    roleId: true,
                    permission: true,
                    type: true
                }
            }
        }
    })
    if (!space) throw new Error('Invalid space!')

    return ctx.message.reply({
        embeds: [
            new MessageEmbed({
                title: 'Permissions',
                description: space.categoryDefaultPermissions.map(p => `${p.type === 1 ? 'A' : 'D'} <@&${p.roleId}> \`${p.permission}\``).join('\n')
            })
        ]
    })
}