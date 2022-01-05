import {CommandContext} from "@lib/mini-command";
import {Permissions} from "discord.js";

export default async function auth(ctx: CommandContext) {
    let isAdmin = ctx.message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ?? false
    let userId = ctx.message.member?.id

    let user = await ctx.prisma.user.findFirst({
        where: { id: userId }
    })

    if (user && user.isRoot) return

    if (!isAdmin) throw new Error('You can\'t use this command.')
}