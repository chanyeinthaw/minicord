import dotenv from 'dotenv'
import MiniCommand from "@lib/mini-command";
import {glob} from "glob";

let env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
dotenv.config({ path: process.cwd() + '/.env' + env })

export const app = new MiniCommand(process.env.DISCORD_BOT_TOKEN!)

let commands = glob.sync(process.cwd() + '/src/commands/**/*.ts')

commands.forEach(command => {
    require(command)
})

app.start()