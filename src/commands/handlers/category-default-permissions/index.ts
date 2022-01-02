import {app} from "@app/index";
import get from './get'
import add from './add'
import remove from './remove'

app.on('category-default-permissions', async ctx => {
    if (ctx.args.length < 2) throw new Error('Invalid args!')
    let [spaceRoleId, subCmd, ...args] = ctx.args as string[]

    ctx.args = [spaceRoleId, ...args]

    switch (subCmd) {
        case 'ls':
        case 'list': return get(ctx)
        case 'add': return add(ctx)
        case 'rm':
        case 'remove': return remove(ctx)
    }
}).alias('cdp')