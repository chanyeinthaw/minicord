import {CommandContext} from "@lib/mini-command";

export async function createVisa(ctx: CommandContext) {
    let {spaces: spaceRoleIds} = ctx.params
    spaceRoleIds = spaceRoleIds?.split(' ') ?? []

    let spaces = await ctx.prisma.space.findMany({
        where: {
            roleId: {
                in: spaceRoleIds
            }
        },
        select: {
            id: true
        }
    })


    let visa = await ctx.prisma.visa.create({
        data: {}
    })

    let role = await ctx.guild!.roles.create({
        name: `v-${(+visa.id+1).toString(2).padEnd(4, '0')}`
    })

    await ctx.prisma.visa.update({
        where: { id: visa.id },
        data: {
            roleId: role.id,
            spaces: {
                create: spaces.map(s => ({
                    space: {
                        connect: {
                            id: s.id
                        }
                    }
                }))
            }
        }
    })

    return ctx.message.reply(`\`Visa created!\` <@&${role.id}>`)
}