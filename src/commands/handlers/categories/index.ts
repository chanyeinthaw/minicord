import {app} from "@app/index";
import {createCategory} from "@handlers/categories/create";
import {listCategories} from "@handlers/categories/list";
import {deleteCategories} from "@handlers/categories/delete";

app.on('categories', async (ctx) => {
    let [spaceRoleId, subCommand, ...args] = ctx.args as string[]

    if (ctx.args.length < 2) throw new Error('Invalid args!')
    ctx.args = [spaceRoleId, ...args]

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: spaceRoleId ?? null
        },
        select: {
            id: true,
            name: true,
            categories: true,
            categoryDefaultPermissions: true
        }
    })

    if (!space) throw new Error('Invalid space!')

    switch (subCommand) {
        case 'c':
        case 'create': return createCategory(ctx, space)
        case 'ls':
        case 'list': return listCategories(ctx, space)
        case 'del':
        case 'delete': return deleteCategories(ctx, space)
    }
}).alias('c')