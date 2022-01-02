import {app} from "@app/index";
import {addExclusiveRole} from "./add-exclusive-roles";
import {getExclusiveRoles} from "./get-exclusive-roles";
import {removeExclusiveRoles} from "./remove-exclusive-roles";

app.on('add-exclusive-roles', addExclusiveRole)
    .alias('era')

app.on('get-exclusive-roles', getExclusiveRoles)
    .alias('er')

app.on('remove-exclusive-roles', removeExclusiveRoles)
    .next(getExclusiveRoles)
    .alias('err')