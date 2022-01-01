import {CommandContext} from "../services/discord";

/**
 * Command
 *
 * create-space name:string
 */

export async function handle(ctx: CommandContext) {
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

    return ctx.message.reply(`Space ${space.name} created. Role <@&${role.id}>`)
}