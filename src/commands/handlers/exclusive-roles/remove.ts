import {CommandContext} from "@lib/mini-command";

export default async function removeExclusiveRoles(ctx: CommandContext){
    if (ctx.args.length < 2) throw new Error('Invalid args!')
    let roles = (ctx.args as string[])

    roles = roles.splice(1)

    if (roles.length > 0) await ctx.prisma.exclusiveRole.deleteMany({
        where: {
            roleId: {
                in: roles
            }
        }
    })

    return ctx.message.reply(`\`Roles removed.\``)
}