import {CommandContext} from "@lib/mini-command";
import * as spaces from '@app/repositories/spaces'
import {checkUsers} from "@handlers/spaces/shared/check-users";

export async function removeUser(ctx: CommandContext) {
    let {spaceRoleId, userId} = ctx.params

    userId = [...new Set(userId.split(' '))]

    let space = await spaces.find(spaceRoleId, 'name')

    checkUsers(userId, ctx.guild)

    await ctx.prisma.space.update({
        where: {id: space.id},
        data: {
            users: {
                deleteMany: userId.map(userId => ({
                    userId,
                    spaceId: space.id
                }))
            }
        }
    })

    return ctx.message.reply('\`User removed!\`')
}