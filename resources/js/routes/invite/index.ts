import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import activate247610 from './activate'
/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
export const activate = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activate.url(args, options),
    method: 'get',
})

activate.definition = {
    methods: ["get","head"],
    url: '/invite/activate/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
activate.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return activate.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
activate.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
activate.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activate.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
const activateForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
activateForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activate.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InviteActivationController::activate
* @see app/Http/Controllers/InviteActivationController.php:27
* @route '/invite/activate/{token}'
*/
activateForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: activate.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

activate.form = activateForm

const invite = {
    activate: Object.assign(activate, activate247610),
}

export default invite