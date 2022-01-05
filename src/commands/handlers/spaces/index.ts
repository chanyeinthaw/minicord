import createSpace from "@handlers/spaces/create";
import {app} from "@app/index";
import {addUser} from "@handlers/spaces/add-user";
import {removeUser} from "@handlers/spaces/remove-user";
import {listSpaces} from "@handlers/spaces/list";
import {listUsers} from "@handlers/spaces/list-users";

app.on('spaces create :name', createSpace)
app.on('spaces :spaceRoleId add :userId', addUser)
app.on('spaces :spaceRoleId remove :userId', removeUser)
app.on('spaces list', listSpaces)
app.on('spaces :spaceRoleId users', listUsers)