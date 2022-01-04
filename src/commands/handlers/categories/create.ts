import {CommandContext} from "@lib/mini-command";
import {ChannelTypes} from "discord.js/typings/enums";
import {Permissions} from "discord.js";
import * as spaces from "@app/repositories/spaces";

export async function createCategory(ctx: CommandContext) {
    let {spaceRoleId, name} = ctx.params
    let space = await spaces.find(spaceRoleId)

    let defaultPermissionOverwrites = space!.categoryDefaultPermissions.reduce((acc, cv) => {
        let overwrite = acc[cv.roleId] ?? { id: cv.roleId, allow:[], deny: []}

        if (cv.type === 1) {
            overwrite.allow.push(Permissions.FLAGS[cv.permission])
        } else {
            overwrite.deny.push(Permissions.FLAGS[cv.permission])
        }

        acc[cv.roleId] = overwrite

        return acc
    }, {})

    let guild = ctx.guild
    let category = await guild?.channels.create(name, {
        type: ChannelTypes.GUILD_CATEGORY,
        permissionOverwrites: [{
            id: spaceRoleId,
            allow: [Permissions.FLAGS.VIEW_CHANNEL]
        }, ...(
           Object.keys(defaultPermissionOverwrites).map(key => defaultPermissionOverwrites[key])
        )]
    })

    if (!category) throw new Error('Fail to create category!')

    let categoryData = await ctx.prisma.category.create({
        data: {
            spaceId: space.id,
            discordId: category!.id
        }
    })

    if (!categoryData) {
        await category.delete()
        throw new Error('Fail to update category data! Category ' + name + ' will be deleted!')
    }

    return ctx.message.reply(`Category created!`)
}