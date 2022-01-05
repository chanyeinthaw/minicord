import {app} from "@app/index";
import get from './get'
import add from './add'
import remove from './remove'
import {Permissions} from "discord.js";

app.on('default-perms :spaceRoleId list', get).middleware('auth')
app.on('default-perms :spaceRoleId add :roleId :permission :type', add).middleware('auth')
app.on('default-perms :spaceRoleId remove :roleId :permission :type', remove).middleware('auth')
app.on('permissions', (ctx) => {
    let permissions = Object.keys(Permissions.FLAGS)
    return ctx.message.reply(`\`\`\`${permissions.join('\n')}\`\`\``)
}).middleware('auth')