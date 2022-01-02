export function parseCommand(message: string) {
    if (!message.startsWith('mc')) return

    message = message
        .replace(/^mc|<@&|<@!|>/g, '')

    let messageLines = message.split('\n').map(s => s.trim())
    let firstLine = messageLines[0]

    if (firstLine === 'query' && messageLines.length > 1) {
        let query = messageLines[1]
        let argsList = messageLines.splice(2),
            args = argsList.reduce((acc, cv) => {
                let arg = cv.split(' ')
                if (arg.length > 1) {
                    acc[arg[0]] = arg.splice(1).join(' ')
                }
                return acc
            }, {})

        return {
            type: 'queries',
            command: query.replace(/ /g, '-'),
            args: args
        }
    } else {
        let commandParts = firstLine.split(' ')

        return {
            type: 'commands',
            command: commandParts[0],
            args: commandParts.splice(1)
        }
    }
}