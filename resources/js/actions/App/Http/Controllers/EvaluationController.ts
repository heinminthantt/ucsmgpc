import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
export const show = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/projects/{project}/evaluation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
show.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
show.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
show.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
const showForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
showForm.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::show
* @see app/Http/Controllers/EvaluationController.php:26
* @route '/api/projects/{project}/evaluation'
*/
showForm.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\EvaluationController::assignExaminer
* @see app/Http/Controllers/EvaluationController.php:84
* @route '/api/projects/{project}/assign-examiner'
*/
export const assignExaminer = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignExaminer.url(args, options),
    method: 'post',
})

assignExaminer.definition = {
    methods: ["post"],
    url: '/api/projects/{project}/assign-examiner',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluationController::assignExaminer
* @see app/Http/Controllers/EvaluationController.php:84
* @route '/api/projects/{project}/assign-examiner'
*/
assignExaminer.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return assignExaminer.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::assignExaminer
* @see app/Http/Controllers/EvaluationController.php:84
* @route '/api/projects/{project}/assign-examiner'
*/
assignExaminer.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignExaminer.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::assignExaminer
* @see app/Http/Controllers/EvaluationController.php:84
* @route '/api/projects/{project}/assign-examiner'
*/
const assignExaminerForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignExaminer.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::assignExaminer
* @see app/Http/Controllers/EvaluationController.php:84
* @route '/api/projects/{project}/assign-examiner'
*/
assignExaminerForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: assignExaminer.url(args, options),
    method: 'post',
})

assignExaminer.form = assignExaminerForm

/**
* @see \App\Http\Controllers\EvaluationController::resolveEvaluation
* @see app/Http/Controllers/EvaluationController.php:143
* @route '/api/projects/{project}/resolve-evaluation'
*/
export const resolveEvaluation = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveEvaluation.url(args, options),
    method: 'post',
})

resolveEvaluation.definition = {
    methods: ["post"],
    url: '/api/projects/{project}/resolve-evaluation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluationController::resolveEvaluation
* @see app/Http/Controllers/EvaluationController.php:143
* @route '/api/projects/{project}/resolve-evaluation'
*/
resolveEvaluation.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return resolveEvaluation.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::resolveEvaluation
* @see app/Http/Controllers/EvaluationController.php:143
* @route '/api/projects/{project}/resolve-evaluation'
*/
resolveEvaluation.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveEvaluation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::resolveEvaluation
* @see app/Http/Controllers/EvaluationController.php:143
* @route '/api/projects/{project}/resolve-evaluation'
*/
const resolveEvaluationForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveEvaluation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::resolveEvaluation
* @see app/Http/Controllers/EvaluationController.php:143
* @route '/api/projects/{project}/resolve-evaluation'
*/
resolveEvaluationForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolveEvaluation.url(args, options),
    method: 'post',
})

resolveEvaluation.form = resolveEvaluationForm

/**
* @see \App\Http\Controllers\EvaluationController::publish
* @see app/Http/Controllers/EvaluationController.php:171
* @route '/api/projects/{project}/publish'
*/
export const publish = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/api/projects/{project}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluationController::publish
* @see app/Http/Controllers/EvaluationController.php:171
* @route '/api/projects/{project}/publish'
*/
publish.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::publish
* @see app/Http/Controllers/EvaluationController.php:171
* @route '/api/projects/{project}/publish'
*/
publish.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::publish
* @see app/Http/Controllers/EvaluationController.php:171
* @route '/api/projects/{project}/publish'
*/
const publishForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::publish
* @see app/Http/Controllers/EvaluationController.php:171
* @route '/api/projects/{project}/publish'
*/
publishForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: publish.url(args, options),
    method: 'post',
})

publish.form = publishForm

/**
* @see \App\Http\Controllers\EvaluationController::unpublish
* @see app/Http/Controllers/EvaluationController.php:201
* @route '/api/projects/{project}/unpublish'
*/
export const unpublish = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

unpublish.definition = {
    methods: ["post"],
    url: '/api/projects/{project}/unpublish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluationController::unpublish
* @see app/Http/Controllers/EvaluationController.php:201
* @route '/api/projects/{project}/unpublish'
*/
unpublish.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return unpublish.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::unpublish
* @see app/Http/Controllers/EvaluationController.php:201
* @route '/api/projects/{project}/unpublish'
*/
unpublish.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::unpublish
* @see app/Http/Controllers/EvaluationController.php:201
* @route '/api/projects/{project}/unpublish'
*/
const unpublishForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::unpublish
* @see app/Http/Controllers/EvaluationController.php:201
* @route '/api/projects/{project}/unpublish'
*/
unpublishForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unpublish.url(args, options),
    method: 'post',
})

unpublish.form = unpublishForm

/**
* @see \App\Http\Controllers\EvaluationController::reassignSupervisor
* @see app/Http/Controllers/EvaluationController.php:222
* @route '/api/projects/{project}/reassign-supervisor'
*/
export const reassignSupervisor = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reassignSupervisor.url(args, options),
    method: 'post',
})

reassignSupervisor.definition = {
    methods: ["post"],
    url: '/api/projects/{project}/reassign-supervisor',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluationController::reassignSupervisor
* @see app/Http/Controllers/EvaluationController.php:222
* @route '/api/projects/{project}/reassign-supervisor'
*/
reassignSupervisor.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return reassignSupervisor.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::reassignSupervisor
* @see app/Http/Controllers/EvaluationController.php:222
* @route '/api/projects/{project}/reassign-supervisor'
*/
reassignSupervisor.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reassignSupervisor.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::reassignSupervisor
* @see app/Http/Controllers/EvaluationController.php:222
* @route '/api/projects/{project}/reassign-supervisor'
*/
const reassignSupervisorForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reassignSupervisor.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::reassignSupervisor
* @see app/Http/Controllers/EvaluationController.php:222
* @route '/api/projects/{project}/reassign-supervisor'
*/
reassignSupervisorForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reassignSupervisor.url(args, options),
    method: 'post',
})

reassignSupervisor.form = reassignSupervisorForm

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
export const queue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: queue.url(options),
    method: 'get',
})

queue.definition = {
    methods: ["get","head"],
    url: '/api/examiner/queue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
queue.url = (options?: RouteQueryOptions) => {
    return queue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
queue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: queue.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
queue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: queue.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
const queueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: queue.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
queueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: queue.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::queue
* @see app/Http/Controllers/EvaluationController.php:121
* @route '/api/examiner/queue'
*/
queueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: queue.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

queue.form = queueForm

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
export const defenses = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: defenses.url(args, options),
    method: 'get',
})

defenses.definition = {
    methods: ["get","head"],
    url: '/api/projects/{project}/defense',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
defenses.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return defenses.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
defenses.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: defenses.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
defenses.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: defenses.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
const defensesForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: defenses.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
defensesForm.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: defenses.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvaluationController::defenses
* @see app/Http/Controllers/EvaluationController.php:251
* @route '/api/projects/{project}/defense'
*/
defensesForm.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: defenses.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

defenses.form = defensesForm

/**
* @see \App\Http\Controllers\EvaluationController::storeDefense
* @see app/Http/Controllers/EvaluationController.php:264
* @route '/api/projects/{project}/defense'
*/
export const storeDefense = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDefense.url(args, options),
    method: 'post',
})

storeDefense.definition = {
    methods: ["post"],
    url: '/api/projects/{project}/defense',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvaluationController::storeDefense
* @see app/Http/Controllers/EvaluationController.php:264
* @route '/api/projects/{project}/defense'
*/
storeDefense.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return storeDefense.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvaluationController::storeDefense
* @see app/Http/Controllers/EvaluationController.php:264
* @route '/api/projects/{project}/defense'
*/
storeDefense.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDefense.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::storeDefense
* @see app/Http/Controllers/EvaluationController.php:264
* @route '/api/projects/{project}/defense'
*/
const storeDefenseForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeDefense.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvaluationController::storeDefense
* @see app/Http/Controllers/EvaluationController.php:264
* @route '/api/projects/{project}/defense'
*/
storeDefenseForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeDefense.url(args, options),
    method: 'post',
})

storeDefense.form = storeDefenseForm

const EvaluationController = { show, assignExaminer, resolveEvaluation, publish, unpublish, reassignSupervisor, queue, defenses, storeDefense }

export default EvaluationController