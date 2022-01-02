import {app} from "@app/index";
import createSpace from "@handlers/create-space";
import addExclusiveRole from "@handlers/add-exclusive-roles";
import getExclusiveRoles from "@handlers/get-exclusive-roles";
import setup from "@handlers/setup";
import removeExclusiveRoles from "@handlers/remove-exclusive-roles";

app.on('create-space', createSpace)
    .alias('cs')

app.on('add-exclusive-roles', addExclusiveRole)
    .alias('era')

app.on('get-exclusive-roles', getExclusiveRoles)
    .alias('erg')

app.on('remove-exclusive-roles', removeExclusiveRoles)
    .next(getExclusiveRoles)
    .alias('err')

app.on('setup', setup)