export default async function removeCategoryDefaultPermission(ctx) {
    let {spaceRoleId, roleId, permission, type} = ctx.params

    // @ts-ignore
    type = type === 'allow' ? 1 : 0

    await ctx.prisma.space.update({
        where: {
            name: spaceRoleId ?? null
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