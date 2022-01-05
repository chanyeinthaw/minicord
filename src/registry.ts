import '@handlers/exclusive-roles'
import '@handlers/category-default-permissions'
import '@handlers/categories'
import '@handlers/spaces'

import {app} from "@app/index";
import setup from "@handlers/setup";
import {checkUsers} from "@handlers/spaces/shared/check-users";

app.on('setup', setup)
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
})

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
})