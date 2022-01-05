import '@handlers/exclusive-roles'
import '@handlers/category-default-permissions'
import '@handlers/categories'
import '@handlers/spaces'

import {app} from "@app/index";
import setup from "@handlers/setup";

app.on('setup', setup)