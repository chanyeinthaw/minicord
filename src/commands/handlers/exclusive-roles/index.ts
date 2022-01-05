import {app} from "@app/index";
import add from "./add";
import getExclusiveRoles from "./get";
import removeExclusiveRoles from "./remove";

app.on('exclusive-roles :spaceRoleId list', getExclusiveRoles).middleware('auth')
app.on('exclusive-roles :spaceRoleId add :roles', add).middleware('auth')
app.on('exclusive-roles :spaceRoleId remove :roles', removeExclusiveRoles).middleware('auth')