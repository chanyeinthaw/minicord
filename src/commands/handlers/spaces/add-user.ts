import {CommandContext} from "@lib/mini-command";
import * as spaces from '@app/repositories/spaces'
import {checkUsers} from "@handlers/spaces/shared/check-users";

export async function addUser(ctx: CommandContext) {
    let {spaceRoleId, userId} = ctx.params

    userId = [...new Set(userId.split(' '))]

    let space = await spaces.find(spaceRoleId, 'name')

    checkUsers(userId, ctx.guild)

    ctx.prisma.space.update({
        where: { id: space.id },
        data: {
            users: {
                create: userId.map(userId => ({
                    user: {
                        connectOrCreate: {
                            create: { id: userId },
                            where: { id: userId }
                        }
                    }
                }))
            }
        }
    }).then(() => ctx.message.reply('\`User added!\`'))
        .catch((e) => {
            ctx.message.reply('\`User is already assigned to space!\`')
        })
}