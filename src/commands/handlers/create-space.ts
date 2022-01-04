import {CommandContext} from "@lib/mini-command";

export default async function createSpace(ctx: CommandContext) {
    if (!ctx.params?.name) throw new Error('Invalid args!')
    let {name} = ctx.params

    let space = await ctx.prisma.space.create({
        data: {
            name,
        }
    })

    let role = await ctx.guild!.roles.create({
        name: `s-${(space.id + 1).toString(2).padEnd(4, '0')}`
    })

    await ctx.prisma.space.update({
        where: { id: space.id },
        data: {
            roleId: role.id
        }
    })

    return ctx.message.reply(`\`Space ${space.name} created.\`\nRole <@&${role.id}>`)
}