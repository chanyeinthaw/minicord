import {CommandContext} from "@lib/mini-command";

export default async function getExclusiveRoles(ctx: CommandContext){
    let [spaceRoleId] = ctx.args as [string]

    let space = await ctx.prisma.space.findFirst({
        where: {
            roleId: spaceRoleId,
        },
        select: {
            exclusiveRoles: {
                select: {
                    roleId: true
                }
            }
        }
    })
    if (!space) throw new Error('Invalid space!')

    let allRoles = ctx.guild!.roles.cache
    let exclusiveRoles = space!.exclusiveRoles.map(r => r.roleId),
        deletedRoles = exclusiveRoles.filter(id => !allRoles.find(role => role.id === id))

    exclusiveRoles = exclusiveRoles.filter(id => deletedRoles.indexOf(id) < 0)

    ctx.prisma.exclusiveRole.deleteMany({
        where: {
            roleId: {
                in: deletedRoles
            }
        }
    }).then()

    return ctx.message.reply(`Channel exclusive roles -\n${exclusiveRoles.map(r => `<@&${r}>`).join('\n')}`)
}