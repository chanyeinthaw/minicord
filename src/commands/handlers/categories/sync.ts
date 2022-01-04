import {CommandContext} from "@lib/mini-command";
import {GuildChannel} from "discord.js";
import * as spaces from "@app/repositories/spaces";

export async function syncCategories(ctx: CommandContext) {
    let {spaceRoleId, except} = ctx.params
    let space = await spaces.find(spaceRoleId)

    except = except?.split(' ') ?? []

    let categoryIds = space.categories.map(c => c.discordId).filter(c => except.indexOf(c) < 0)
    let categories = await ctx.guild?.channels.cache.filter(c => categoryIds.indexOf(c.id) > -1 && c.type === 'GUILD_CATEGORY')

    let defaultPermissionOverwrites = space!.categoryDefaultPermissions.reduce((acc, cv) => {
        let overwrite: any = acc[cv.roleId] ?? { }

        overwrite[cv.permission] = cv.type === 1

        acc[cv.roleId] = overwrite

        return acc
    }, {})

    let message = await ctx.message.reply('Synchronizing categories...')

    let promises = categories?.map(async c => {
        let category = c as GuildChannel
        category.permissionOverwrites.cache.map(po => {
            if (po.id === space.roleId) return

            po.delete()
        })

        for(let key in defaultPermissionOverwrites) {
            await category.permissionOverwrites.create(key, defaultPermissionOverwrites[key])
        }
    })

    await Promise.all(promises ?? [])

    await message.edit('Categories synced!')
}