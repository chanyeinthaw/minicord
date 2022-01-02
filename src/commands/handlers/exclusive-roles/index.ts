import {app} from "@app/index";
import add from "./add";
import get from "./get";
import remove from "./remove";

app.on('exclusive-roles', async ctx => {
    if (ctx.args.length < 2) throw new Error('Invalid args!')
    let [spaceRoleId, subCmd, ...args] = ctx.args as string[]

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: {
                equals: spaceRoleId ?? null
            },
        },
        select: {
            id: true,
            name: true,
            exclusiveRoles: {
                select: {
                    roleId: true
                }
            }
        }
    })
    if (!space) throw new Error('Invalid space!')

    ctx.args = [ spaceRoleId, ...args ]

    switch (subCmd) {
        case 'remove':
        case 'rm': return remove(ctx)
        case 'ls':
        case 'list': return get(ctx, space)
        case 'add': return add(ctx, space)
    }
}).alias('er')