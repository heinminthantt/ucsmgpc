import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/rubric-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::index
* @see app/Http/Controllers/RubricTemplateController.php:21
* @route '/api/rubric-templates'
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
* @see \App\Http\Controllers\RubricTemplateController::store
* @see app/Http/Controllers/RubricTemplateController.php:28
* @route '/api/rubric-templates'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/rubric-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RubricTemplateController::store
* @see app/Http/Controllers/RubricTemplateController.php:28
* @route '/api/rubric-templates'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RubricTemplateController::store
* @see app/Http/Controllers/RubricTemplateController.php:28
* @route '/api/rubric-templates'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::store
* @see app/Http/Controllers/RubricTemplateController.php:28
* @route '/api/rubric-templates'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::store
* @see app/Http/Controllers/RubricTemplateController.php:28
* @route '/api/rubric-templates'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\RubricTemplateController::update
* @see app/Http/Controllers/RubricTemplateController.php:45
* @route '/api/rubric-templates/{template}'
*/
export const update = (args: { template: string | number | { id: string | number } } | [template: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/rubric-templates/{template}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RubricTemplateController::update
* @see app/Http/Controllers/RubricTemplateController.php:45
* @route '/api/rubric-templates/{template}'
*/
update.url = (args: { template: string | number | { id: string | number } } | [template: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { template: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            template: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        template: typeof args.template === 'object'
        ? args.template.id
        : args.template,
    }

    return update.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RubricTemplateController::update
* @see app/Http/Controllers/RubricTemplateController.php:45
* @route '/api/rubric-templates/{template}'
*/
update.put = (args: { template: string | number | { id: string | number } } | [template: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::update
* @see app/Http/Controllers/RubricTemplateController.php:45
* @route '/api/rubric-templates/{template}'
*/
const updateForm = (args: { template: string | number | { id: string | number } } | [template: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RubricTemplateController::update
* @see app/Http/Controllers/RubricTemplateController.php:45
* @route '/api/rubric-templates/{template}'
*/
updateForm.put = (args: { template: string | number | { id: string | number } } | [template: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const RubricTemplateController = { index, store, update }

export default RubricTemplateController