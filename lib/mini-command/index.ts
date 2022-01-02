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

    private defaultMiddlewares: HandlerFn[] = []
    private commandAliases: Map<string, string> = new Map<string, string>()
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

    public middleware(...handlers: HandlerFn[]) {
        this.defaultMiddlewares.push(...handlers)
    }

    public on(command: string, handler: HandlerFn) {
        this.currentCommand = command
        this.commandHandlers[command] = [handler]

        return this.chainActions()
    }

    private chainActions() {
        return {
            before: this.before.bind(this),
            next: this.after.bind(this),
            alias: this.alias.bind(this)
        }
    }

    private alias(name: string) {
        this.commandAliases[name] = this.currentCommand

        return this.chainActions()
    }

    private after(...handlers: HandlerFn[]) {
        this.commandHandlers[this.currentCommand].push(...handlers)

        return this.chainActions()
    }

    private before(...handlers: HandlerFn[]) {
        this.commandHandlers[this.currentCommand].unshift(...handlers)

        return this.chainActions()
    }

    private async onMessage(message: Message) {
        if (message.author.id === this.client.user?.id) return

        let error = () => new Error('Invalid command!')
        let command = parseCommand(message.content)
        if (!command) throw error()

        let handlers: HandlerFn[]
        if (!this.commandHandlers.has(command?.command)) {
            let aliasedCommand = this.commandAliases[command?.command]

            handlers = this.commandHandlers[aliasedCommand]
        } else {
            handlers = this.commandHandlers[command?.command]
        }

        if (!handlers) throw error()

        let context: CommandContext = {
            prisma: this.prisma,
            message: message,
            guild: message.guild,
            discord: this.client,
            args: command?.args,
            forwardedData: {}
        }

        handlers.unshift(...this.defaultMiddlewares)

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
                    message.reply(`\`${error.message}\``)
                })
        })
    }
}