import {app} from "@app/index";
import createSpace from "@handlers/create-space";
import addExclusiveRole from "@handlers/add-exclusive-roles";
import getExclusiveRoles from "@handlers/get-exclusive-roles";
import setup from "@handlers/setup";

app.on('create-space', createSpace)
    .alias('cs')

app.on('add-exclusive-roles', addExclusiveRole)
    .alias('aer')

app.on('get-exclusive-roles', getExclusiveRoles)
    .alias('ger')

app.on('setup', setup)