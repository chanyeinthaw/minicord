import {app} from "@app/index";

app.on('create-space', async (ctx) => {
    let [name] = ctx.args as [string]

    let space = await ctx.prisma.space.create({
        data: {
            name,
        }
    })

    let role = await ctx.guild!.roles.create({
        name: `s-${(+space.id).toString(2).padEnd(4, '0')}`
    })

    await ctx.prisma.space.update({
        where: { id: space.id },
        data: {
            roleId: role.id
        }
    })

    return ctx.message.reply(`Space ${space.name} created. Role <@&${role.id}>.`)
})