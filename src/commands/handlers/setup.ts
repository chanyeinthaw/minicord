import {CommandContext} from "@lib/mini-command";
import {Permissions} from "discord.js";

export default async function setup(ctx: CommandContext) {
    let everyone = ctx.guild!.roles.everyone

    let permissions = everyone!.permissions.remove(Permissions.FLAGS.VIEW_CHANNEL).toArray().map(p => Permissions.FLAGS[p.toString()])
    await everyone!.setPermissions(permissions)

    return ctx.message.reply('`Setup done!`')
}