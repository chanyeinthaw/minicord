import {app} from "@app/index";
import {MessageEmbed, Permissions} from "discord.js";

async function getCategoryDefaultPermissions(ctx) {
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

app.on('add-category-default-permissions', async (ctx) => {
    if ((ctx.args as string[]).length < 4) throw new Error('Invalid args!')
    let [spaceRoleId, roleId, permission, type] = ctx.args as string[]

    let permissions = Object.keys(Permissions.FLAGS)
    if (permissions.indexOf(permission) < 0) throw new Error('Invalid permission!')
    // @ts-ignore
    type = type === 'allow' ? 1 : 0

    await ctx.prisma.space.update({
        where: {
            roleId: spaceRoleId ?? null
        },
        data: {
            categoryDefaultPermissions: {
                create: [{
                    roleId,
                    type: +type,
                    permission
                }]
            }
        }
    })

    return ctx.message.reply('`Permission saved!`')
}).alias('cdpa')

app.on('remove-category-default-permissions', async (ctx) => {
    if ((ctx.args as string[]).length < 4) throw new Error('Invalid args!')
    let [spaceRoleId, roleId, permission, type] = ctx.args as string[]

    // @ts-ignore
    type = type === 'allow' ? 1 : 0

    await ctx.prisma.space.update({
        where: {
            roleId: spaceRoleId ?? null
        },
        data: {
            categoryDefaultPermissions: {
                deleteMany: [{
                    roleId, permission, type: +type
                }]
            }
        }
    })
}).alias('cdpr').next(getCategoryDefaultPermissions)

app.on('get-category-default-permissions', getCategoryDefaultPermissions).alias('cdp')