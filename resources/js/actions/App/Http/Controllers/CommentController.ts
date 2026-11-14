import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
export const index = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/comments/project/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
index.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
index.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
index.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
const indexForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
indexForm.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:14
* @route '/api/comments/project/{project}'
*/
indexForm.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:36
* @route '/api/comments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:36
* @route '/api/comments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:36
* @route '/api/comments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:36
* @route '/api/comments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:36
* @route '/api/comments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:80
* @route '/api/comments/{comment}'
*/
export const destroy = (args: { comment: string | number | { id: string | number } } | [comment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:80
* @route '/api/comments/{comment}'
*/
destroy.url = (args: { comment: string | number | { id: string | number } } | [comment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { comment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { comment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            comment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return destroy.definition.url
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:80
* @route '/api/comments/{comment}'
*/
destroy.delete = (args: { comment: string | number | { id: string | number } } | [comment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:80
* @route '/api/comments/{comment}'
*/
const destroyForm = (args: { comment: string | number | { id: string | number } } | [comment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:80
* @route '/api/comments/{comment}'
*/
destroyForm.delete = (args: { comment: string | number | { id: string | number } } | [comment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const CommentController = { index, store, destroy }

export default CommentController