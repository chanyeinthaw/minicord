import {app} from "@app/index";

app.on('create-space', require('@handlers/create-space').default)

app.on('add-exclusive-roles', require('@handlers/add-exclusive-roles').default)