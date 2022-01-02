import {Client, Guild, Intents, Message} from "discord.js";
import {parseCommand} from "./parse";
import {PrismaClient} from "@prisma/client";

export type CommandContext = {
    prisma: PrismaClient,
    discord: Client,
    message: Message,
    guild: Guild | null,
    args: any[]|Record<any, any>,
    forwardedData: Record<any, any>
}

type HandlerFn = (context: CommandContext) => any

export default class MiniCommand {
    private readonly client: Client
    private readonly prisma: PrismaClient
    private currentCommand: string = ''
    private commandHandlers: Map<string, HandlerFn[]> = new Map<string, HandlerFn[]>()

    public constructor(private token: string) {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_PRESENCES,
            ]
        })

        this.prisma = new PrismaClient()
    }

    public on(command: string, handler: HandlerFn) {
        this.commandHandlers[command] = [handler]

        return {
            before: this.before,
            next: this.after,
        }
    }

    private after(...handlers: HandlerFn[]) {
        this.commandHandlers[this.currentCommand].push(...handlers)
    }

    private before(...handlers: HandlerFn[]) {
        this.commandHandlers[this.currentCommand].unshift(...handlers)
    }

    private async onMessage(message: Message) {
        if (message.author.id === this.client.user?.id) return

        let error = () => new Error('Invalid command!')
        let command = parseCommand(message.content)
        if (!command) throw error()

        let handlers = this.commandHandlers[command?.command]
        if (!handlers) throw error()

        let context: CommandContext = {
            prisma: this.prisma,
            message: message,
            guild: message.guild,
            discord: this.client,
            args: command?.args,
            forwardedData: {}
        }

        for(let handler of handlers) {
            await handler(context)
        }
    }

    public start() {
        this.client.login(this.token)
            .then(() => console.log('> Discord bot logged in'))
            .catch((e) => console.log('> Discord bot login error', e))

        this.client.on('messageCreate', async (message: Message) => {
            this.onMessage(message)
                .then()
                .catch(error => {
                    message.reply(error.message)
                })
        })
    }
}