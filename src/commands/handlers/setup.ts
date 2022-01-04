import {CommandContext} from "@lib/mini-command";
import {Permissions} from "discord.js";

export default async function setup(ctx: CommandContext) {
    let everyone = ctx.guild!.roles.everyone

    let permissions = everyone!.permissions.remove(Permissions.FLAGS.VIEW_CHANNEL).toArray().map(p => Permissions.FLAGS[p.toString()])
    await everyone!.setPermissions(permissions)

    let rootVisa = await ctx.prisma.visa.create({
        data: { isRoot: true }
    })

    let role = await ctx.guild!.roles.create({
        name: `v-${(rootVisa.id+1).toString(2).padEnd(4, '0')}`
    })

    await ctx.prisma.visa.update({
        where: { id: rootVisa.id },
        data: {
            roleId: role.id
        }
    })

    return ctx.message.reply('`Setup done!`')
}