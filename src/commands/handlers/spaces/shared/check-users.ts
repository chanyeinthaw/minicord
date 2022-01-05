import {Guild} from "discord.js";

export function checkUsers(userIds: string[], guild: Guild | null) {
    let members: string[] = guild?.members.cache.map(m => m.id) ?? []
    for(let userId of userIds) {
        if (members.indexOf(userId) < 0) throw new Error('Invalid user id.')
    }
}