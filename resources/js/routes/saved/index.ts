import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/saved-projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::index
* @see app/Http/Controllers/SavedProjectController.php:14
* @route '/saved-projects'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const saved = {
    index: Object.assign(index, index),
}

export default saved