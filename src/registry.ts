import {app} from "@app/index";

app.on('create-space', require('@handlers/create-space').default)
    .alias('cs')

app.on('add-exclusive-roles', require('@handlers/add-exclusive-roles').default)
    .alias('aer')

app.on('setup', require('@handlers/setup').default)