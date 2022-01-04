import {CommandContext} from "@lib/mini-command";
import * as spaces from "@app/repositories/spaces";

export async function deleteCategories(ctx: CommandContext) {
    let {spaceRoleId, categoryId} = ctx.params
    let space = await spaces.find(spaceRoleId)

    if (!space.categories.find(c => c.discordId === categoryId)) throw new Error('Invalid category id!')

    let category = await ctx.guild?.channels.cache.find(c => c.id === categoryId)
    if (category) {
        let channels = await ctx.guild?.channels.cache.filter(c => c.parentId === category!.id)
        await Promise.all(channels?.map(c => c.delete()) ?? [])
        await category?.delete()
    }

    ctx.prisma.category.deleteMany({
        where: {
            spaceId: space.id,
            discordId: categoryId
        }
    }).then().catch()

    return ctx.message.reply('Category deleted!')
}