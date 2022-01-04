import {CommandContext} from "@lib/mini-command";

export default async function removeExclusiveRoles(ctx: CommandContext){
    let {roles} = ctx.params

    if (roles.length > 0) await ctx.prisma.exclusiveRole.deleteMany({
        where: {
            roleId: {
                in: roles
            }
        }
    })

    return ctx.message.reply(`\`Roles removed.\``)
}