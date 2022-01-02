import {CommandContext} from "@lib/mini-command";

export default async function createSpace(ctx: CommandContext) {
    if ((ctx.args as string[]).length < 1) throw new Error('Invalid args!')
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

    return ctx.message.reply(`\`Space ${space.name} created. Role <@&${role.id}>.\``)
}