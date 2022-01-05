import '@handlers/exclusive-roles'
import '@handlers/category-default-permissions'
import '@handlers/categories'
import '@handlers/spaces'

import {app} from "@app/index";
import setup from "@handlers/setup";
import {checkUsers} from "@handlers/spaces/shared/check-users";
import {find} from "@app/repositories/spaces";

app.on('setup', setup).middleware('auth')
app.on('root :userId', async (ctx) => {
    let {userId} = ctx.params

    checkUsers([userId], ctx.guild)

    let user = await ctx.prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
        await ctx.prisma.user.create({
            data: {
                id: userId,
                isRoot: true
            }
        })
    } else {
       await ctx.prisma.user.update({
           where: { id: userId },
           data: {
               isRoot: true
           }
       })
    }

    return ctx.message.reply('\`Rooted!\`')
}).middleware('auth')

app.on('unroot :userId', async (ctx) => {
    let {userId} = ctx.params

    checkUsers([userId], ctx.guild)

    let user = await ctx.prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
        await ctx.prisma.user.create({
            data: {
                id: userId,
                isRoot: false
            }
        })
    } else {
        await ctx.prisma.user.update({
            where: { id: userId },
            data: {
                isRoot: false
            }
        })
    }

    return ctx.message.reply('\`Unrooted!\`')
}).middleware('auth')

app.on('go :spaceRoleId', async (ctx) => {
    let {spaceRoleId} = ctx.params

    let space = await find(spaceRoleId)
    let user = ctx.message.member
    let currentSpaceRole = user?.roles.cache.find(s => s.name.startsWith('s-'))

    if (space.users.find(u => u.user.id === user?.id)) {
        if (currentSpaceRole) {
            let toRemove = [currentSpaceRole.id]
            let currentSpace = await find(currentSpaceRole.id)

            toRemove.push(...currentSpace.exclusiveRoles.map(e => e.roleId))

            await user?.roles.remove(toRemove)
        }

        await user?.roles.add(spaceRoleId)
    }

    return ctx.message.delete()
})