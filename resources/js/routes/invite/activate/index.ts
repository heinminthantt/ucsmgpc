import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InviteActivationController::store
* @see app/Http/Controllers/InviteActivationController.php:42
* @route '/invite/activate/{token}'
*/
export const store = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/invite/activate/{token}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InviteActivationController::store
* @see app/Http/Controllers/InviteActivationController.php:42
* @route '/invite/activate/{token}'
*/
store.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InviteActivationController::store
* @see app/Http/Controllers/InviteActivationController.php:42
* @route '/invite/activate/{token}'
*/
store.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InviteActivationController::store
* @see app/Http/Controllers/InviteActivationController.php:42
* @route '/invite/activate/{token}'
*/
const storeForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InviteActivationController::store
* @see app/Http/Controllers/InviteActivationController.php:42
* @route '/invite/activate/{token}'
*/
storeForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const activate = {
    store: Object.assign(store, store),
}

export default activate