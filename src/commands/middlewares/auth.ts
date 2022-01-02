import {CommandContext} from "@lib/mini-command";
import {Permissions} from "discord.js";

export default function auth(ctx: CommandContext) {
    let isAdmin = ctx.message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ?? false

    if (!isAdmin) throw new Error('You can\'t use this command.')
}