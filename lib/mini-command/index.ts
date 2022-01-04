import {Client, Guild, Intents, Message} from "discord.js";
import {PrismaClient} from "@prisma/client";

export type CommandContext = {
    prisma: PrismaClient,
    discord: Client,
    message: Message,
    guild: Guild | null,
    args: any[]|Record<any, any>,
    params: Record<any, any>
    forwardedData: Record<any, any>
}

type HandlerFn = (context: CommandContext) => any

export default class MiniCommand {
    private readonly client: Client
    private readonly prisma: PrismaClient
    private currentCommand: string = ''

    private defaultMiddlewares: HandlerFn[] = []
    private commandHandlers: Record<string, HandlerFn[]> = {}
    private commandParameterNames: Record<string, string[]> = {}
    private commandPatterns: Record<string, string> = {}

    private paramRegex = /(?=:)(.*?)(?= |$)/g

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
        let commandPattern = command.replace(this.paramRegex, _ => '(.+)')
        this.currentCommand = commandPattern
        this.commandHandlers[commandPattern] = [handler]

        this.paramRegex.lastIndex = 0
        this.commandParameterNames[commandPattern] = command.match(this.paramRegex)?.map(x => x.replace(':', '')) ?? []
        this.commandPatterns[commandPattern.substring(0, commandPattern.indexOf(' '))] = commandPattern

        return this.chainActions()
    }

    private chainActions() {
        return {
            before: this.before.bind(this),
            next: this.after.bind(this),
        }
    }

    private after(...handlers: HandlerFn[]) {
        this.commandHandlers[this.currentCommand].push(...handlers)

        return this.chainActions()
    }

    private before(...handlers: HandlerFn[]) {
        this.commandHandlers[this.currentCommand].unshift(...handlers)

        return this.chainActions()
    }

    private parse(message: string) {
        if (!message.startsWith('mc')) return

        message = message.replace(/^mc|<@&|<@!|>/g, '').trim()

        let params: any = {}
        let command: string | undefined = undefined

        let foundMatches: string[] = []
        for(let commandPattern in this.commandHandlers) {
            let regex = new RegExp(commandPattern, 'g')
            let matches = regex.exec(message)

            if (matches) {
                command = commandPattern
                foundMatches = matches.splice(1)
            }
        }

        let index = 0
        for(let match of foundMatches) {
            params[this.commandParameterNames[command!][index++]] = match
        }

        return { command, params }
    }

    private async onMessage(message: Message) {
        if (message.author.id === this.client.user?.id) return

        let error = () => new Error('Invalid command!')
        let parsed = this.parse(message.content)
        if (!parsed?.command) throw error()

        let handlers: HandlerFn[] = this.commandHandlers[parsed?.command]
        if (!handlers) throw error()

        let context: CommandContext = {
            prisma: this.prisma,
            message: message,
            guild: message.guild,
            discord: this.client,
            args: [],
            params: parsed.params,
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