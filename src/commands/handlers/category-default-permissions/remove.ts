export default async function removeCategoryDefaultPermission(ctx) {
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

    return ctx.message.reply('Permission removed!')
}