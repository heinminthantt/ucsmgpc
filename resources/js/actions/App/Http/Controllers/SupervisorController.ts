import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/supervisor-dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SupervisorController::index
* @see app/Http/Controllers/SupervisorController.php:15
* @route '/supervisor-dashboard'
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
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
export const pendingProjects = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingProjects.url(options),
    method: 'get',
})

pendingProjects.definition = {
    methods: ["get","head"],
    url: '/api/supervisor/projects/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
pendingProjects.url = (options?: RouteQueryOptions) => {
    return pendingProjects.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
pendingProjects.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingProjects.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
pendingProjects.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingProjects.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
const pendingProjectsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendingProjects.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
pendingProjectsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendingProjects.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SupervisorController::pendingProjects
* @see app/Http/Controllers/SupervisorController.php:20
* @route '/api/supervisor/projects/pending'
*/
pendingProjectsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendingProjects.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pendingProjects.form = pendingProjectsForm

/**
* @see \App\Http\Controllers\SupervisorController::approve
* @see app/Http/Controllers/SupervisorController.php:52
* @route '/api/supervisor/projects/{project}/approve'
*/
export const approve = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/api/supervisor/projects/{project}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SupervisorController::approve
* @see app/Http/Controllers/SupervisorController.php:52
* @route '/api/supervisor/projects/{project}/approve'
*/
approve.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupervisorController::approve
* @see app/Http/Controllers/SupervisorController.php:52
* @route '/api/supervisor/projects/{project}/approve'
*/
approve.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SupervisorController::approve
* @see app/Http/Controllers/SupervisorController.php:52
* @route '/api/supervisor/projects/{project}/approve'
*/
const approveForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SupervisorController::approve
* @see app/Http/Controllers/SupervisorController.php:52
* @route '/api/supervisor/projects/{project}/approve'
*/
approveForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\SupervisorController::reject
* @see app/Http/Controllers/SupervisorController.php:102
* @route '/api/supervisor/projects/{project}/reject'
*/
export const reject = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/api/supervisor/projects/{project}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SupervisorController::reject
* @see app/Http/Controllers/SupervisorController.php:102
* @route '/api/supervisor/projects/{project}/reject'
*/
reject.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupervisorController::reject
* @see app/Http/Controllers/SupervisorController.php:102
* @route '/api/supervisor/projects/{project}/reject'
*/
reject.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SupervisorController::reject
* @see app/Http/Controllers/SupervisorController.php:102
* @route '/api/supervisor/projects/{project}/reject'
*/
const rejectForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SupervisorController::reject
* @see app/Http/Controllers/SupervisorController.php:102
* @route '/api/supervisor/projects/{project}/reject'
*/
rejectForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

const SupervisorController = { index, pendingProjects, approve, reject }

export default SupervisorController