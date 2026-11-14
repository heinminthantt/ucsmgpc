import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
const index7e917e2e569f99df8173fac931f76b96 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'get',
})

index7e917e2e569f99df8173fac931f76b96.definition = {
    methods: ["get","head"],
    url: '/api/admin/cycles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
index7e917e2e569f99df8173fac931f76b96.url = (options?: RouteQueryOptions) => {
    return index7e917e2e569f99df8173fac931f76b96.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
index7e917e2e569f99df8173fac931f76b96.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
index7e917e2e569f99df8173fac931f76b96.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
const index7e917e2e569f99df8173fac931f76b96Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
index7e917e2e569f99df8173fac931f76b96Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/admin/cycles'
*/
index7e917e2e569f99df8173fac931f76b96Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7e917e2e569f99df8173fac931f76b96.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index7e917e2e569f99df8173fac931f76b96.form = index7e917e2e569f99df8173fac931f76b96Form
/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
const index7e864d11c44d20e66adb33985cbbbdef = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'get',
})

index7e864d11c44d20e66adb33985cbbbdef.definition = {
    methods: ["get","head"],
    url: '/api/department/cycles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
index7e864d11c44d20e66adb33985cbbbdef.url = (options?: RouteQueryOptions) => {
    return index7e864d11c44d20e66adb33985cbbbdef.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
index7e864d11c44d20e66adb33985cbbbdef.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
index7e864d11c44d20e66adb33985cbbbdef.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
const index7e864d11c44d20e66adb33985cbbbdefForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
index7e864d11c44d20e66adb33985cbbbdefForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::index
* @see app/Http/Controllers/AcademicCycleController.php:18
* @route '/api/department/cycles'
*/
index7e864d11c44d20e66adb33985cbbbdefForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7e864d11c44d20e66adb33985cbbbdef.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index7e864d11c44d20e66adb33985cbbbdef.form = index7e864d11c44d20e66adb33985cbbbdefForm

/**
* Multiple routes resolve to \App\Http\Controllers\AcademicCycleController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/api/admin/cycles': index7e917e2e569f99df8173fac931f76b96,
    '/api/department/cycles': index7e864d11c44d20e66adb33985cbbbdef,
}

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/admin/cycles'
*/
const store7e917e2e569f99df8173fac931f76b96 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'post',
})

store7e917e2e569f99df8173fac931f76b96.definition = {
    methods: ["post"],
    url: '/api/admin/cycles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/admin/cycles'
*/
store7e917e2e569f99df8173fac931f76b96.url = (options?: RouteQueryOptions) => {
    return store7e917e2e569f99df8173fac931f76b96.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/admin/cycles'
*/
store7e917e2e569f99df8173fac931f76b96.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/admin/cycles'
*/
const store7e917e2e569f99df8173fac931f76b96Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/admin/cycles'
*/
store7e917e2e569f99df8173fac931f76b96Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store7e917e2e569f99df8173fac931f76b96.url(options),
    method: 'post',
})

store7e917e2e569f99df8173fac931f76b96.form = store7e917e2e569f99df8173fac931f76b96Form
/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/department/cycles'
*/
const store7e864d11c44d20e66adb33985cbbbdef = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'post',
})

store7e864d11c44d20e66adb33985cbbbdef.definition = {
    methods: ["post"],
    url: '/api/department/cycles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/department/cycles'
*/
store7e864d11c44d20e66adb33985cbbbdef.url = (options?: RouteQueryOptions) => {
    return store7e864d11c44d20e66adb33985cbbbdef.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/department/cycles'
*/
store7e864d11c44d20e66adb33985cbbbdef.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/department/cycles'
*/
const store7e864d11c44d20e66adb33985cbbbdefForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::store
* @see app/Http/Controllers/AcademicCycleController.php:49
* @route '/api/department/cycles'
*/
store7e864d11c44d20e66adb33985cbbbdefForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store7e864d11c44d20e66adb33985cbbbdef.url(options),
    method: 'post',
})

store7e864d11c44d20e66adb33985cbbbdef.form = store7e864d11c44d20e66adb33985cbbbdefForm

/**
* Multiple routes resolve to \App\Http\Controllers\AcademicCycleController::store, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `store['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const store = {
    '/api/admin/cycles': store7e917e2e569f99df8173fac931f76b96,
    '/api/department/cycles': store7e864d11c44d20e66adb33985cbbbdef,
}

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
const showfda8f6e63f7bee6c4f3fc238dc4ad931 = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showfda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'get',
})

showfda8f6e63f7bee6c4f3fc238dc4ad931.definition = {
    methods: ["get","head"],
    url: '/api/admin/cycles/{cycle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
showfda8f6e63f7bee6c4f3fc238dc4ad931.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return showfda8f6e63f7bee6c4f3fc238dc4ad931.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
showfda8f6e63f7bee6c4f3fc238dc4ad931.get = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showfda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
showfda8f6e63f7bee6c4f3fc238dc4ad931.head = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showfda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
const showfda8f6e63f7bee6c4f3fc238dc4ad931Form = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showfda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
showfda8f6e63f7bee6c4f3fc238dc4ad931Form.get = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showfda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/admin/cycles/{cycle}'
*/
showfda8f6e63f7bee6c4f3fc238dc4ad931Form.head = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showfda8f6e63f7bee6c4f3fc238dc4ad931.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showfda8f6e63f7bee6c4f3fc238dc4ad931.form = showfda8f6e63f7bee6c4f3fc238dc4ad931Form
/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
const show4e680a448eac765133afcb82168e0abe = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'get',
})

show4e680a448eac765133afcb82168e0abe.definition = {
    methods: ["get","head"],
    url: '/api/department/cycles/{cycle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
show4e680a448eac765133afcb82168e0abe.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return show4e680a448eac765133afcb82168e0abe.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
show4e680a448eac765133afcb82168e0abe.get = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
show4e680a448eac765133afcb82168e0abe.head = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
const show4e680a448eac765133afcb82168e0abeForm = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
show4e680a448eac765133afcb82168e0abeForm.get = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::show
* @see app/Http/Controllers/AcademicCycleController.php:68
* @route '/api/department/cycles/{cycle}'
*/
show4e680a448eac765133afcb82168e0abeForm.head = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show4e680a448eac765133afcb82168e0abe.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show4e680a448eac765133afcb82168e0abe.form = show4e680a448eac765133afcb82168e0abeForm

/**
* Multiple routes resolve to \App\Http\Controllers\AcademicCycleController::show, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `show['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const show = {
    '/api/admin/cycles/{cycle}': showfda8f6e63f7bee6c4f3fc238dc4ad931,
    '/api/department/cycles/{cycle}': show4e680a448eac765133afcb82168e0abe,
}

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/admin/cycles/{cycle}'
*/
const updatefda8f6e63f7bee6c4f3fc238dc4ad931 = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatefda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'put',
})

updatefda8f6e63f7bee6c4f3fc238dc4ad931.definition = {
    methods: ["put"],
    url: '/api/admin/cycles/{cycle}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/admin/cycles/{cycle}'
*/
updatefda8f6e63f7bee6c4f3fc238dc4ad931.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return updatefda8f6e63f7bee6c4f3fc238dc4ad931.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/admin/cycles/{cycle}'
*/
updatefda8f6e63f7bee6c4f3fc238dc4ad931.put = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatefda8f6e63f7bee6c4f3fc238dc4ad931.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/admin/cycles/{cycle}'
*/
const updatefda8f6e63f7bee6c4f3fc238dc4ad931Form = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatefda8f6e63f7bee6c4f3fc238dc4ad931.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/admin/cycles/{cycle}'
*/
updatefda8f6e63f7bee6c4f3fc238dc4ad931Form.put = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatefda8f6e63f7bee6c4f3fc238dc4ad931.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatefda8f6e63f7bee6c4f3fc238dc4ad931.form = updatefda8f6e63f7bee6c4f3fc238dc4ad931Form
/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/department/cycles/{cycle}'
*/
const update4e680a448eac765133afcb82168e0abe = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'put',
})

update4e680a448eac765133afcb82168e0abe.definition = {
    methods: ["put"],
    url: '/api/department/cycles/{cycle}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/department/cycles/{cycle}'
*/
update4e680a448eac765133afcb82168e0abe.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return update4e680a448eac765133afcb82168e0abe.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/department/cycles/{cycle}'
*/
update4e680a448eac765133afcb82168e0abe.put = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update4e680a448eac765133afcb82168e0abe.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/department/cycles/{cycle}'
*/
const update4e680a448eac765133afcb82168e0abeForm = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update4e680a448eac765133afcb82168e0abe.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::update
* @see app/Http/Controllers/AcademicCycleController.php:73
* @route '/api/department/cycles/{cycle}'
*/
update4e680a448eac765133afcb82168e0abeForm.put = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update4e680a448eac765133afcb82168e0abe.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update4e680a448eac765133afcb82168e0abe.form = update4e680a448eac765133afcb82168e0abeForm

/**
* Multiple routes resolve to \App\Http\Controllers\AcademicCycleController::update, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `update['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const update = {
    '/api/admin/cycles/{cycle}': updatefda8f6e63f7bee6c4f3fc238dc4ad931,
    '/api/department/cycles/{cycle}': update4e680a448eac765133afcb82168e0abe,
}

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/admin/cycles/{cycle}/close'
*/
const close5fe1a5eb7c0a22e5a280e27334fd4444 = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close5fe1a5eb7c0a22e5a280e27334fd4444.url(args, options),
    method: 'post',
})

close5fe1a5eb7c0a22e5a280e27334fd4444.definition = {
    methods: ["post"],
    url: '/api/admin/cycles/{cycle}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/admin/cycles/{cycle}/close'
*/
close5fe1a5eb7c0a22e5a280e27334fd4444.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return close5fe1a5eb7c0a22e5a280e27334fd4444.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/admin/cycles/{cycle}/close'
*/
close5fe1a5eb7c0a22e5a280e27334fd4444.post = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close5fe1a5eb7c0a22e5a280e27334fd4444.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/admin/cycles/{cycle}/close'
*/
const close5fe1a5eb7c0a22e5a280e27334fd4444Form = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close5fe1a5eb7c0a22e5a280e27334fd4444.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/admin/cycles/{cycle}/close'
*/
close5fe1a5eb7c0a22e5a280e27334fd4444Form.post = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close5fe1a5eb7c0a22e5a280e27334fd4444.url(args, options),
    method: 'post',
})

close5fe1a5eb7c0a22e5a280e27334fd4444.form = close5fe1a5eb7c0a22e5a280e27334fd4444Form
/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/department/cycles/{cycle}/close'
*/
const close6c08e986868eb12a09d77a03ff5b8fca = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close6c08e986868eb12a09d77a03ff5b8fca.url(args, options),
    method: 'post',
})

close6c08e986868eb12a09d77a03ff5b8fca.definition = {
    methods: ["post"],
    url: '/api/department/cycles/{cycle}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/department/cycles/{cycle}/close'
*/
close6c08e986868eb12a09d77a03ff5b8fca.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return close6c08e986868eb12a09d77a03ff5b8fca.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/department/cycles/{cycle}/close'
*/
close6c08e986868eb12a09d77a03ff5b8fca.post = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close6c08e986868eb12a09d77a03ff5b8fca.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/department/cycles/{cycle}/close'
*/
const close6c08e986868eb12a09d77a03ff5b8fcaForm = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close6c08e986868eb12a09d77a03ff5b8fca.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::close
* @see app/Http/Controllers/AcademicCycleController.php:98
* @route '/api/department/cycles/{cycle}/close'
*/
close6c08e986868eb12a09d77a03ff5b8fcaForm.post = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close6c08e986868eb12a09d77a03ff5b8fca.url(args, options),
    method: 'post',
})

close6c08e986868eb12a09d77a03ff5b8fca.form = close6c08e986868eb12a09d77a03ff5b8fcaForm

/**
* Multiple routes resolve to \App\Http\Controllers\AcademicCycleController::close, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `close['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const close = {
    '/api/admin/cycles/{cycle}/close': close5fe1a5eb7c0a22e5a280e27334fd4444,
    '/api/department/cycles/{cycle}/close': close6c08e986868eb12a09d77a03ff5b8fca,
}

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
export const openCycles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openCycles.url(options),
    method: 'get',
})

openCycles.definition = {
    methods: ["get","head"],
    url: '/api/cycles/open',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
openCycles.url = (options?: RouteQueryOptions) => {
    return openCycles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
openCycles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openCycles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
openCycles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openCycles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
const openCyclesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: openCycles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
openCyclesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: openCycles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::openCycles
* @see app/Http/Controllers/AcademicCycleController.php:36
* @route '/api/cycles/open'
*/
openCyclesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: openCycles.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

openCycles.form = openCyclesForm

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
export const exportMethod = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/cycles/{cycle}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
exportMethod.url = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cycle: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { cycle: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            cycle: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        cycle: typeof args.cycle === 'object'
        ? args.cycle.id
        : args.cycle,
    }

    return exportMethod.definition.url
            .replace('{cycle}', parsedArgs.cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
exportMethod.get = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
exportMethod.head = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
const exportMethodForm = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
exportMethodForm.get = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::exportMethod
* @see app/Http/Controllers/AcademicCycleController.php:301
* @route '/api/cycles/{cycle}/export'
*/
exportMethodForm.head = (args: { cycle: string | number | { id: string | number } } | [cycle: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
export const board = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: board.url(options),
    method: 'get',
})

board.definition = {
    methods: ["get","head"],
    url: '/api/department/board',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
board.url = (options?: RouteQueryOptions) => {
    return board.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
board.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: board.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
board.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: board.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
const boardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: board.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
boardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: board.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::board
* @see app/Http/Controllers/AcademicCycleController.php:121
* @route '/api/department/board'
*/
boardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: board.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

board.form = boardForm

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/api/department/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcademicCycleController::analytics
* @see app/Http/Controllers/AcademicCycleController.php:191
* @route '/api/department/analytics'
*/
analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: analytics.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

analytics.form = analyticsForm

const AcademicCycleController = { index, store, show, update, close, openCycles, exportMethod, board, analytics, export: exportMethod }

export default AcademicCycleController