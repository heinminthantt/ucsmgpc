import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

const users = {
    me: Object.assign(me, me),
}

export default users