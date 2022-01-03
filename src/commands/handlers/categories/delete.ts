import {CommandContext} from "@lib/mini-command";
import {ChannelTypes} from "discord.js/typings/enums";
import {MessageEmbed, Permissions} from "discord.js";

export async function deleteCategories(ctx: CommandContext, space: any) {
    let [_, categoryId] = ctx.args as string[]
    if (ctx.args.length < 2) throw new Error('Invalid args!')

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