import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
export const showPage = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPage.url(args, options),
    method: 'get',
})

showPage.definition = {
    methods: ["get","head"],
    url: '/supervisors/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
showPage.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return showPage.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
showPage.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
showPage.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
const showPageForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
showPageForm.get = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserController::showPage
* @see app/Http/Controllers/UserController.php:52
* @route '/supervisors/{user}'
*/
showPageForm.head = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showPage.form = showPageForm

const supervisors = {
    showPage: Object.assign(showPage, showPage),
}

export default supervisors