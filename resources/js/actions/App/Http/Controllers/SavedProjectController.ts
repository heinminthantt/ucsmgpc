import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/api/saved-projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::list
* @see app/Http/Controllers/SavedProjectController.php:19
* @route '/api/saved-projects'
*/
listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

list.form = listForm

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
export const check = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(options),
    method: 'get',
})

check.definition = {
    methods: ["get","head"],
    url: '/api/saved-projects/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
check.url = (options?: RouteQueryOptions) => {
    return check.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
check.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
check.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: check.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
const checkForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: check.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
checkForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: check.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavedProjectController::check
* @see app/Http/Controllers/SavedProjectController.php:32
* @route '/api/saved-projects/check'
*/
checkForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: check.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

check.form = checkForm

/**
* @see \App\Http\Controllers\SavedProjectController::toggle
* @see app/Http/Controllers/SavedProjectController.php:41
* @route '/api/saved-projects/toggle'
*/
export const toggle = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/api/saved-projects/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SavedProjectController::toggle
* @see app/Http/Controllers/SavedProjectController.php:41
* @route '/api/saved-projects/toggle'
*/
toggle.url = (options?: RouteQueryOptions) => {
    return toggle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavedProjectController::toggle
* @see app/Http/Controllers/SavedProjectController.php:41
* @route '/api/saved-projects/toggle'
*/
toggle.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavedProjectController::toggle
* @see app/Http/Controllers/SavedProjectController.php:41
* @route '/api/saved-projects/toggle'
*/
const toggleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavedProjectController::toggle
* @see app/Http/Controllers/SavedProjectController.php:41
* @route '/api/saved-projects/toggle'
*/
toggleForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

toggle.form = toggleForm

const SavedProjectController = { index, list, check, toggle }

export default SavedProjectController