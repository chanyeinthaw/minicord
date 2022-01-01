import {Client, Guild, Intents, Message} from "discord.js"
import {parseCommand} from "./parse";
import * as path from "path";
import * as fs from "fs";
import {PrismaClient} from '@prisma/client'

const handlerCache = new Map<string, any>()
const prisma = new PrismaClient()

export type CommandContext = {
    prisma: PrismaClient,
    discord: Client,
    message: Message,
    guild: Guild | null,
    args: any[]|Record<any, any>
}

export const discord = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_PRESENCES,
    ]
})

discord.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => console.log('> Discord bot logged in'))
    .catch((e) => console.log('> Discord bot login error', e))

discord.on("messageCreate", async (message) => {
    if (message.author.id === discord.user?.id) return

    let error = () => message.reply('Invalid command!')
    let command = parseCommand(message.content)
    if (!command) {
        await error()
        return
    }

    let handlerPath = path.join(process.cwd(), 'src', command?.type, command?.command + '.ts')
    let handler = handlerCache[handlerPath]

    if (!handler && !fs.existsSync(handlerPath)) {
        await error()
        return
    }


    if (!handler) {
        handler = await import(handlerPath)
        handlerCache[handlerPath] = handler
        if (handler?.alias)
            handlerCache[handlerPath.replace(command?.command + '.ts', handler?.alias + '.ts')] = handler
    }

    try {
        let context: CommandContext = {
            guild: message.guild,
            discord,
            message,
            prisma,
            args: command?.args
        }

        await handler?.handle(context)
    } catch (e) {
        await message.reply('Command failed!')
    }
})
