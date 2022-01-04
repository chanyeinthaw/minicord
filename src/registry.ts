import '@handlers/exclusive-roles'
import '@handlers/category-default-permissions'
import '@handlers/categories'
import '@handlers/visas'

import {app} from "@app/index";
import createSpace from "@handlers/create-space";
import setup from "@handlers/setup";

app.on('create-space :name', createSpace)
app.on('setup', setup)