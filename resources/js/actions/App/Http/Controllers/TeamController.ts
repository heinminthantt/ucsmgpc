import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
export const mine = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mine.url(options),
    method: 'get',
})

mine.definition = {
    methods: ["get","head"],
    url: '/api/teams/mine',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
mine.url = (options?: RouteQueryOptions) => {
    return mine.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
mine.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mine.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
mine.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mine.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
const mineForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mine.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
mineForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mine.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::mine
* @see app/Http/Controllers/TeamController.php:16
* @route '/api/teams/mine'
*/
mineForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mine.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mine.form = mineForm

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:32
* @route '/api/teams'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/teams',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:32
* @route '/api/teams'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:32
* @route '/api/teams'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:32
* @route '/api/teams'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::store
* @see app/Http/Controllers/TeamController.php:32
* @route '/api/teams'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TeamController::invite
* @see app/Http/Controllers/TeamController.php:74
* @route '/api/teams/{team}/invite'
*/
export const invite = (args: { team: string | number | { id: string | number } } | [team: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

invite.definition = {
    methods: ["post"],
    url: '/api/teams/{team}/invite',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::invite
* @see app/Http/Controllers/TeamController.php:74
* @route '/api/teams/{team}/invite'
*/
invite.url = (args: { team: string | number | { id: string | number } } | [team: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { team: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.id
        : args.team,
    }

    return invite.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::invite
* @see app/Http/Controllers/TeamController.php:74
* @route '/api/teams/{team}/invite'
*/
invite.post = (args: { team: string | number | { id: string | number } } | [team: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::invite
* @see app/Http/Controllers/TeamController.php:74
* @route '/api/teams/{team}/invite'
*/
const inviteForm = (args: { team: string | number | { id: string | number } } | [team: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::invite
* @see app/Http/Controllers/TeamController.php:74
* @route '/api/teams/{team}/invite'
*/
inviteForm.post = (args: { team: string | number | { id: string | number } } | [team: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invite.url(args, options),
    method: 'post',
})

invite.form = inviteForm

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
export const myInvites = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myInvites.url(options),
    method: 'get',
})

myInvites.definition = {
    methods: ["get","head"],
    url: '/api/team-invites/mine',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
myInvites.url = (options?: RouteQueryOptions) => {
    return myInvites.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
myInvites.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: myInvites.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
myInvites.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: myInvites.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
const myInvitesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myInvites.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
myInvitesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myInvites.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TeamController::myInvites
* @see app/Http/Controllers/TeamController.php:135
* @route '/api/team-invites/mine'
*/
myInvitesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: myInvites.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

myInvites.form = myInvitesForm

/**
* @see \App\Http\Controllers\TeamController::confirmInvite
* @see app/Http/Controllers/TeamController.php:154
* @route '/api/team-invites/{invite}/confirm'
*/
export const confirmInvite = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmInvite.url(args, options),
    method: 'post',
})

confirmInvite.definition = {
    methods: ["post"],
    url: '/api/team-invites/{invite}/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::confirmInvite
* @see app/Http/Controllers/TeamController.php:154
* @route '/api/team-invites/{invite}/confirm'
*/
confirmInvite.url = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invite: args }
    }

    if (Array.isArray(args)) {
        args = {
            invite: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invite: args.invite,
    }

    return confirmInvite.definition.url
            .replace('{invite}', parsedArgs.invite.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::confirmInvite
* @see app/Http/Controllers/TeamController.php:154
* @route '/api/team-invites/{invite}/confirm'
*/
confirmInvite.post = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmInvite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::confirmInvite
* @see app/Http/Controllers/TeamController.php:154
* @route '/api/team-invites/{invite}/confirm'
*/
const confirmInviteForm = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmInvite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::confirmInvite
* @see app/Http/Controllers/TeamController.php:154
* @route '/api/team-invites/{invite}/confirm'
*/
confirmInviteForm.post = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmInvite.url(args, options),
    method: 'post',
})

confirmInvite.form = confirmInviteForm

/**
* @see \App\Http\Controllers\TeamController::declineInvite
* @see app/Http/Controllers/TeamController.php:185
* @route '/api/team-invites/{invite}/decline'
*/
export const declineInvite = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineInvite.url(args, options),
    method: 'post',
})

declineInvite.definition = {
    methods: ["post"],
    url: '/api/team-invites/{invite}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TeamController::declineInvite
* @see app/Http/Controllers/TeamController.php:185
* @route '/api/team-invites/{invite}/decline'
*/
declineInvite.url = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invite: args }
    }

    if (Array.isArray(args)) {
        args = {
            invite: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invite: args.invite,
    }

    return declineInvite.definition.url
            .replace('{invite}', parsedArgs.invite.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TeamController::declineInvite
* @see app/Http/Controllers/TeamController.php:185
* @route '/api/team-invites/{invite}/decline'
*/
declineInvite.post = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: declineInvite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::declineInvite
* @see app/Http/Controllers/TeamController.php:185
* @route '/api/team-invites/{invite}/decline'
*/
const declineInviteForm = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineInvite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TeamController::declineInvite
* @see app/Http/Controllers/TeamController.php:185
* @route '/api/team-invites/{invite}/decline'
*/
declineInviteForm.post = (args: { invite: string | number } | [invite: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: declineInvite.url(args, options),
    method: 'post',
})

declineInvite.form = declineInviteForm

const TeamController = { mine, store, invite, myInvites, confirmInvite, declineInvite }

export default TeamController