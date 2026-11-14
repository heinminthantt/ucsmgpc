import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
export const publicSupervisorPage = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicSupervisorPage.url(args, options),
    method: 'get',
})

publicSupervisorPage.definition = {
    methods: ["get","head"],
    url: '/supervisors/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
publicSupervisorPage.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return publicSupervisorPage.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
publicSupervisorPage.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicSupervisorPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
publicSupervisorPage.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicSupervisorPage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
const publicSupervisorPageForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicSupervisorPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
publicSupervisorPageForm.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicSupervisorPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::publicSupervisorPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
publicSupervisorPageForm.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicSupervisorPage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

publicSupervisorPage.form = publicSupervisorPageForm

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profile.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::profile
* @see app/Http/Controllers/UserController.php:17
* @route '/profile'
*/
profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profile.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

profile.form = profileForm

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/api/users/me',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
const meForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: me.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
meForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: me.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::me
* @see app/Http/Controllers/UserController.php:22
* @route '/api/users/me'
*/
meForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: me.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

me.form = meForm

/**
* @see \App\Http\Controllers\UserController::updateLocale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
export const updateLocale = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateLocale.url(options),
    method: 'patch',
})

updateLocale.definition = {
    methods: ["patch"],
    url: '/api/me/locale',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\UserController::updateLocale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
updateLocale.url = (options?: RouteQueryOptions) => {
    return updateLocale.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::updateLocale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
updateLocale.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateLocale.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UserController::updateLocale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
const updateLocaleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateLocale.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::updateLocale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
updateLocaleForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateLocale.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateLocale.form = updateLocaleForm

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
export const show = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
show.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
show.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
show.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
const showForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
showForm.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::show
* @see app/Http/Controllers/UserController.php:83
* @route '/api/users/{user}'
*/
showForm.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\UserController::update
* @see app/Http/Controllers/UserController.php:95
* @route '/api/users/{user}'
*/
export const update = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/users/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserController::update
* @see app/Http/Controllers/UserController.php:95
* @route '/api/users/{user}'
*/
update.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::update
* @see app/Http/Controllers/UserController.php:95
* @route '/api/users/{user}'
*/
update.put = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UserController::update
* @see app/Http/Controllers/UserController.php:95
* @route '/api/users/{user}'
*/
const updateForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::update
* @see app/Http/Controllers/UserController.php:95
* @route '/api/users/{user}'
*/
updateForm.put = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\UserController::changePassword
* @see app/Http/Controllers/UserController.php:119
* @route '/api/users/{user}/change-password'
*/
export const changePassword = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(args, options),
    method: 'post',
})

changePassword.definition = {
    methods: ["post"],
    url: '/api/users/{user}/change-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::changePassword
* @see app/Http/Controllers/UserController.php:119
* @route '/api/users/{user}/change-password'
*/
changePassword.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return changePassword.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::changePassword
* @see app/Http/Controllers/UserController.php:119
* @route '/api/users/{user}/change-password'
*/
changePassword.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changePassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::changePassword
* @see app/Http/Controllers/UserController.php:119
* @route '/api/users/{user}/change-password'
*/
const changePasswordForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: changePassword.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::changePassword
* @see app/Http/Controllers/UserController.php:119
* @route '/api/users/{user}/change-password'
*/
changePasswordForm.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: changePassword.url(args, options),
    method: 'post',
})

changePassword.form = changePasswordForm

/**
* @see \App\Http\Controllers\UserController::uploadAvatar
* @see app/Http/Controllers/UserController.php:139
* @route '/api/users/upload-avatar'
*/
export const uploadAvatar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

uploadAvatar.definition = {
    methods: ["post"],
    url: '/api/users/upload-avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::uploadAvatar
* @see app/Http/Controllers/UserController.php:139
* @route '/api/users/upload-avatar'
*/
uploadAvatar.url = (options?: RouteQueryOptions) => {
    return uploadAvatar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::uploadAvatar
* @see app/Http/Controllers/UserController.php:139
* @route '/api/users/upload-avatar'
*/
uploadAvatar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::uploadAvatar
* @see app/Http/Controllers/UserController.php:139
* @route '/api/users/upload-avatar'
*/
const uploadAvatarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadAvatar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::uploadAvatar
* @see app/Http/Controllers/UserController.php:139
* @route '/api/users/upload-avatar'
*/
uploadAvatarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadAvatar.url(options),
    method: 'post',
})

uploadAvatar.form = uploadAvatarForm

/**
* @see \App\Http\Controllers\UserController::destroy
* @see app/Http/Controllers/UserController.php:147
* @route '/api/users/{user}'
*/
export const destroy = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserController::destroy
* @see app/Http/Controllers/UserController.php:147
* @route '/api/users/{user}'
*/
destroy.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::destroy
* @see app/Http/Controllers/UserController.php:147
* @route '/api/users/{user}'
*/
destroy.delete = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserController::destroy
* @see app/Http/Controllers/UserController.php:147
* @route '/api/users/{user}'
*/
const destroyForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::destroy
* @see app/Http/Controllers/UserController.php:147
* @route '/api/users/{user}'
*/
destroyForm.delete = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const UserController = { publicSupervisorPage, profile, me, updateLocale, show, update, changePassword, uploadAvatar, destroy }

export default UserController