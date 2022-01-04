import {app} from "@app/index";
import add from "./add";
import getExclusiveRoles from "./get";
import removeExclusiveRoles from "./remove";

app.on('exclusive-roles :spaceRoleId list', getExclusiveRoles)
app.on('exclusive-roles :spaceRoleId add :roles', add)
app.on('exclusive-roles :spaceRoleId remove :roles', removeExclusiveRoles)