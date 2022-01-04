import {app} from "@app/index";
import {createVisa} from "@handlers/visas/create";
import {listVisas} from "@handlers/visas/list";

app.on('visa create ?spaces', createVisa)
app.on('visa list ?spaceRoleId', listVisas)