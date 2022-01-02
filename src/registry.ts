import '@handlers/exclusive-roles'
import '@handlers/category-default-permissions'

import {app} from "@app/index";
import createSpace from "@handlers/create-space";
import setup from "@handlers/setup";

app.on('create-space', createSpace)
    .alias('cs')

app.on('setup', setup)