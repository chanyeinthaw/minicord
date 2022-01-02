import {app} from "@app/index";
import get from './get'
import add from './add'
import remove from './remove'
import {Permissions} from "discord.js";

app.on('category-default-permissions', async ctx => {
    let [spaceRoleId, subCmd, ...args] = ctx.args as string[]
    if (spaceRoleId === 'permissions') {
        let permissions = Object.keys(Permissions.FLAGS)
        return ctx.message.reply(`\`\`\`${permissions.join('\n')}\`\`\``)
    }
    if (ctx.args.length < 2) throw new Error('Invalid args!')

    ctx.args = [spaceRoleId, ...args]

    switch (subCmd) {
        case 'ls':
        case 'list': return get(ctx)
        case 'add': return add(ctx)
        case 'rm':
        case 'remove': return remove(ctx)
    }
}).alias('cdp')