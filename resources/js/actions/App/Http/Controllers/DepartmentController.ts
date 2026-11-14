import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
export const publicPage = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicPage.url(args, options),
    method: 'get',
})

publicPage.definition = {
    methods: ["get","head"],
    url: '/departments/{department}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
publicPage.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return publicPage.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
publicPage.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
publicPage.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicPage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
const publicPageForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
publicPageForm.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::publicPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
publicPageForm.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicPage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

publicPage.form = publicPageForm

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/departments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::index
* @see app/Http/Controllers/DepartmentController.php:18
* @route '/api/departments'
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
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
export const show = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/departments/{department}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
show.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
show.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
show.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
const showForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
showForm.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::show
* @see app/Http/Controllers/DepartmentController.php:29
* @route '/api/departments/{department}'
*/
showForm.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DepartmentController::store
* @see app/Http/Controllers/DepartmentController.php:79
* @route '/api/departments'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/departments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DepartmentController::store
* @see app/Http/Controllers/DepartmentController.php:79
* @route '/api/departments'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::store
* @see app/Http/Controllers/DepartmentController.php:79
* @route '/api/departments'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DepartmentController::store
* @see app/Http/Controllers/DepartmentController.php:79
* @route '/api/departments'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DepartmentController::store
* @see app/Http/Controllers/DepartmentController.php:79
* @route '/api/departments'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DepartmentController::update
* @see app/Http/Controllers/DepartmentController.php:92
* @route '/api/departments/{department}'
*/
export const update = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/departments/{department}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DepartmentController::update
* @see app/Http/Controllers/DepartmentController.php:92
* @route '/api/departments/{department}'
*/
update.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::update
* @see app/Http/Controllers/DepartmentController.php:92
* @route '/api/departments/{department}'
*/
update.put = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DepartmentController::update
* @see app/Http/Controllers/DepartmentController.php:92
* @route '/api/departments/{department}'
*/
const updateForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DepartmentController::update
* @see app/Http/Controllers/DepartmentController.php:92
* @route '/api/departments/{department}'
*/
updateForm.put = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DepartmentController::destroy
* @see app/Http/Controllers/DepartmentController.php:105
* @route '/api/departments/{department}'
*/
export const destroy = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/departments/{department}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DepartmentController::destroy
* @see app/Http/Controllers/DepartmentController.php:105
* @route '/api/departments/{department}'
*/
destroy.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::destroy
* @see app/Http/Controllers/DepartmentController.php:105
* @route '/api/departments/{department}'
*/
destroy.delete = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DepartmentController::destroy
* @see app/Http/Controllers/DepartmentController.php:105
* @route '/api/departments/{department}'
*/
const destroyForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DepartmentController::destroy
* @see app/Http/Controllers/DepartmentController.php:105
* @route '/api/departments/{department}'
*/
destroyForm.delete = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const DepartmentController = { publicPage, index, show, store, update, destroy }

export default DepartmentController