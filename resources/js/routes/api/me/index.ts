import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::locale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
export const locale = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: locale.url(options),
    method: 'patch',
})

locale.definition = {
    methods: ["patch"],
    url: '/api/me/locale',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\UserController::locale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
locale.url = (options?: RouteQueryOptions) => {
    return locale.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::locale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
locale.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: locale.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\UserController::locale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
const localeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: locale.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserController::locale
* @see app/Http/Controllers/UserController.php:39
* @route '/api/me/locale'
*/
localeForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: locale.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

locale.form = localeForm

const me = {
    locale: Object.assign(locale, locale),
}

export default me