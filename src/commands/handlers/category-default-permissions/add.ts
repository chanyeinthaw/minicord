import {Permissions} from "discord.js";

export default async function addCategoryDefaultPermission(ctx) {
    let { spaceRoleId, roleId, permission, type } = ctx.params

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
}