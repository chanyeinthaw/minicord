import { Client, Intents } from "discord.js"
import {parseCommand} from "./parse";
import * as path from "path";
import * as fs from "fs";

const handlerCache = new Map<string, any>()
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
    if (!fs.existsSync(handlerPath)) {
        await error()
        return
    }

    let handler = handlerCache[handlerPath]
    if (!handler) {
        handler = await import(handlerPath)
        handlerCache[handlerPath] = handler
    }

    try {
        await handler?.handle(discord, message, command?.args)
    } catch (e) {
        await message.reply('Command failed!')
    }
})
