import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
export const status = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/reactions/{project}/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
status.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { project: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return status.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
status.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
status.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
const statusForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
statusForm.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReactionController::status
* @see app/Http/Controllers/ReactionController.php:13
* @route '/api/reactions/{project}/status'
*/
statusForm.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\ReactionController::toggle
* @see app/Http/Controllers/ReactionController.php:25
* @route '/api/reactions/toggle'
*/
export const toggle = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/api/reactions/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReactionController::toggle
* @see app/Http/Controllers/ReactionController.php:25
* @route '/api/reactions/toggle'
*/
toggle.url = (options?: RouteQueryOptions) => {
    return toggle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReactionController::toggle
* @see app/Http/Controllers/ReactionController.php:25
* @route '/api/reactions/toggle'
*/
toggle.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReactionController::toggle
* @see app/Http/Controllers/ReactionController.php:25
* @route '/api/reactions/toggle'
*/
const toggleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReactionController::toggle
* @see app/Http/Controllers/ReactionController.php:25
* @route '/api/reactions/toggle'
*/
toggleForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(options),
    method: 'post',
})

toggle.form = toggleForm

const ReactionController = { status, toggle }

export default ReactionController