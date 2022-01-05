import dotenv from 'dotenv'
import MiniCommand from "@lib/mini-command";
import auth from "@middlewares/auth";

let env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
dotenv.config({ path: process.cwd() + '/.env' + env })

export const app = new MiniCommand(process.env.DISCORD_BOT_TOKEN!)

app.middlewares({
    auth
})

require('./registry')

app.start()