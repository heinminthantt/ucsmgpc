import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::index
* @see app/Http/Controllers/CourseController.php:15
* @route '/api/courses'
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
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
export const show = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/courses/{course}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
show.url = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
    }

    return show.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
show.get = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
show.head = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
const showForm = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
showForm.get = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::show
* @see app/Http/Controllers/CourseController.php:37
* @route '/api/courses/{course}'
*/
showForm.head = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
export const byDepartment = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDepartment.url(args, options),
    method: 'get',
})

byDepartment.definition = {
    methods: ["get","head"],
    url: '/api/departments/{department}/courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
byDepartment.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { department: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { department: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            department: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        department: typeof args.department === 'object'
        ? args.department.id
        : args.department,
    }

    return byDepartment.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
byDepartment.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDepartment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
byDepartment.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byDepartment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
const byDepartmentForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byDepartment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
byDepartmentForm.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byDepartment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CourseController::byDepartment
* @see app/Http/Controllers/CourseController.php:26
* @route '/api/departments/{department}/courses'
*/
byDepartmentForm.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: byDepartment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

byDepartment.form = byDepartmentForm

/**
* @see \App\Http\Controllers\CourseController::store
* @see app/Http/Controllers/CourseController.php:48
* @route '/api/courses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/courses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CourseController::store
* @see app/Http/Controllers/CourseController.php:48
* @route '/api/courses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CourseController::store
* @see app/Http/Controllers/CourseController.php:48
* @route '/api/courses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CourseController::store
* @see app/Http/Controllers/CourseController.php:48
* @route '/api/courses'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CourseController::store
* @see app/Http/Controllers/CourseController.php:48
* @route '/api/courses'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CourseController::update
* @see app/Http/Controllers/CourseController.php:65
* @route '/api/courses/{course}'
*/
export const update = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/courses/{course}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CourseController::update
* @see app/Http/Controllers/CourseController.php:65
* @route '/api/courses/{course}'
*/
update.url = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
    }

    return update.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CourseController::update
* @see app/Http/Controllers/CourseController.php:65
* @route '/api/courses/{course}'
*/
update.put = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CourseController::update
* @see app/Http/Controllers/CourseController.php:65
* @route '/api/courses/{course}'
*/
const updateForm = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CourseController::update
* @see app/Http/Controllers/CourseController.php:65
* @route '/api/courses/{course}'
*/
updateForm.put = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\CourseController::destroy
* @see app/Http/Controllers/CourseController.php:82
* @route '/api/courses/{course}'
*/
export const destroy = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/courses/{course}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CourseController::destroy
* @see app/Http/Controllers/CourseController.php:82
* @route '/api/courses/{course}'
*/
destroy.url = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { course: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { course: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            course: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        course: typeof args.course === 'object'
        ? args.course.id
        : args.course,
    }

    return destroy.definition.url
            .replace('{course}', parsedArgs.course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CourseController::destroy
* @see app/Http/Controllers/CourseController.php:82
* @route '/api/courses/{course}'
*/
destroy.delete = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CourseController::destroy
* @see app/Http/Controllers/CourseController.php:82
* @route '/api/courses/{course}'
*/
const destroyForm = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CourseController::destroy
* @see app/Http/Controllers/CourseController.php:82
* @route '/api/courses/{course}'
*/
destroyForm.delete = (args: { course: string | number | { id: string | number } } | [course: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const CourseController = { index, show, byDepartment, store, update, destroy }

export default CourseController