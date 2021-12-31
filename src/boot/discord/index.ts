import { Client, Intents } from "discord.js"

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