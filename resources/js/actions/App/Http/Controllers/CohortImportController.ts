import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
const template32c8b92a1ad98e557d75b96af28be8d7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template32c8b92a1ad98e557d75b96af28be8d7.url(options),
    method: 'get',
})

template32c8b92a1ad98e557d75b96af28be8d7.definition = {
    methods: ["get","head"],
    url: '/api/admin/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
template32c8b92a1ad98e557d75b96af28be8d7.url = (options?: RouteQueryOptions) => {
    return template32c8b92a1ad98e557d75b96af28be8d7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
template32c8b92a1ad98e557d75b96af28be8d7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template32c8b92a1ad98e557d75b96af28be8d7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
template32c8b92a1ad98e557d75b96af28be8d7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template32c8b92a1ad98e557d75b96af28be8d7.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
const template32c8b92a1ad98e557d75b96af28be8d7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template32c8b92a1ad98e557d75b96af28be8d7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
template32c8b92a1ad98e557d75b96af28be8d7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template32c8b92a1ad98e557d75b96af28be8d7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/admin/import/template'
*/
template32c8b92a1ad98e557d75b96af28be8d7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template32c8b92a1ad98e557d75b96af28be8d7.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

template32c8b92a1ad98e557d75b96af28be8d7.form = template32c8b92a1ad98e557d75b96af28be8d7Form
/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
const template89c01fefa1fa6046c65f7f5ca491db2d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template89c01fefa1fa6046c65f7f5ca491db2d.url(options),
    method: 'get',
})

template89c01fefa1fa6046c65f7f5ca491db2d.definition = {
    methods: ["get","head"],
    url: '/api/department/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
template89c01fefa1fa6046c65f7f5ca491db2d.url = (options?: RouteQueryOptions) => {
    return template89c01fefa1fa6046c65f7f5ca491db2d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
template89c01fefa1fa6046c65f7f5ca491db2d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template89c01fefa1fa6046c65f7f5ca491db2d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
template89c01fefa1fa6046c65f7f5ca491db2d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template89c01fefa1fa6046c65f7f5ca491db2d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
const template89c01fefa1fa6046c65f7f5ca491db2dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template89c01fefa1fa6046c65f7f5ca491db2d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
template89c01fefa1fa6046c65f7f5ca491db2dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template89c01fefa1fa6046c65f7f5ca491db2d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CohortImportController::template
* @see app/Http/Controllers/CohortImportController.php:41
* @route '/api/department/import/template'
*/
template89c01fefa1fa6046c65f7f5ca491db2dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: template89c01fefa1fa6046c65f7f5ca491db2d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

template89c01fefa1fa6046c65f7f5ca491db2d.form = template89c01fefa1fa6046c65f7f5ca491db2dForm

/**
* Multiple routes resolve to \App\Http\Controllers\CohortImportController::template, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `template['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const template = {
    '/api/admin/import/template': template32c8b92a1ad98e557d75b96af28be8d7,
    '/api/department/import/template': template89c01fefa1fa6046c65f7f5ca491db2d,
}

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/admin/import/preview'
*/
const previewf49af7b2a8a653f50d76e8b1e6732c9d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: previewf49af7b2a8a653f50d76e8b1e6732c9d.url(options),
    method: 'post',
})

previewf49af7b2a8a653f50d76e8b1e6732c9d.definition = {
    methods: ["post"],
    url: '/api/admin/import/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/admin/import/preview'
*/
previewf49af7b2a8a653f50d76e8b1e6732c9d.url = (options?: RouteQueryOptions) => {
    return previewf49af7b2a8a653f50d76e8b1e6732c9d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/admin/import/preview'
*/
previewf49af7b2a8a653f50d76e8b1e6732c9d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: previewf49af7b2a8a653f50d76e8b1e6732c9d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/admin/import/preview'
*/
const previewf49af7b2a8a653f50d76e8b1e6732c9dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: previewf49af7b2a8a653f50d76e8b1e6732c9d.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/admin/import/preview'
*/
previewf49af7b2a8a653f50d76e8b1e6732c9dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: previewf49af7b2a8a653f50d76e8b1e6732c9d.url(options),
    method: 'post',
})

previewf49af7b2a8a653f50d76e8b1e6732c9d.form = previewf49af7b2a8a653f50d76e8b1e6732c9dForm
/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/department/import/preview'
*/
const preview657e3f050599c1a4464623093fe8bf8a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview657e3f050599c1a4464623093fe8bf8a.url(options),
    method: 'post',
})

preview657e3f050599c1a4464623093fe8bf8a.definition = {
    methods: ["post"],
    url: '/api/department/import/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/department/import/preview'
*/
preview657e3f050599c1a4464623093fe8bf8a.url = (options?: RouteQueryOptions) => {
    return preview657e3f050599c1a4464623093fe8bf8a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/department/import/preview'
*/
preview657e3f050599c1a4464623093fe8bf8a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview657e3f050599c1a4464623093fe8bf8a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/department/import/preview'
*/
const preview657e3f050599c1a4464623093fe8bf8aForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preview657e3f050599c1a4464623093fe8bf8a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::preview
* @see app/Http/Controllers/CohortImportController.php:54
* @route '/api/department/import/preview'
*/
preview657e3f050599c1a4464623093fe8bf8aForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preview657e3f050599c1a4464623093fe8bf8a.url(options),
    method: 'post',
})

preview657e3f050599c1a4464623093fe8bf8a.form = preview657e3f050599c1a4464623093fe8bf8aForm

/**
* Multiple routes resolve to \App\Http\Controllers\CohortImportController::preview, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `preview['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const preview = {
    '/api/admin/import/preview': previewf49af7b2a8a653f50d76e8b1e6732c9d,
    '/api/department/import/preview': preview657e3f050599c1a4464623093fe8bf8a,
}

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/admin/import/confirm'
*/
const confirm95887c8f65f825cc47a3947f19ae7947 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm95887c8f65f825cc47a3947f19ae7947.url(options),
    method: 'post',
})

confirm95887c8f65f825cc47a3947f19ae7947.definition = {
    methods: ["post"],
    url: '/api/admin/import/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/admin/import/confirm'
*/
confirm95887c8f65f825cc47a3947f19ae7947.url = (options?: RouteQueryOptions) => {
    return confirm95887c8f65f825cc47a3947f19ae7947.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/admin/import/confirm'
*/
confirm95887c8f65f825cc47a3947f19ae7947.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm95887c8f65f825cc47a3947f19ae7947.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/admin/import/confirm'
*/
const confirm95887c8f65f825cc47a3947f19ae7947Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirm95887c8f65f825cc47a3947f19ae7947.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/admin/import/confirm'
*/
confirm95887c8f65f825cc47a3947f19ae7947Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirm95887c8f65f825cc47a3947f19ae7947.url(options),
    method: 'post',
})

confirm95887c8f65f825cc47a3947f19ae7947.form = confirm95887c8f65f825cc47a3947f19ae7947Form
/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/department/import/confirm'
*/
const confirmb6f9f93c3ca6cd9758a6468a24a61b7a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmb6f9f93c3ca6cd9758a6468a24a61b7a.url(options),
    method: 'post',
})

confirmb6f9f93c3ca6cd9758a6468a24a61b7a.definition = {
    methods: ["post"],
    url: '/api/department/import/confirm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/department/import/confirm'
*/
confirmb6f9f93c3ca6cd9758a6468a24a61b7a.url = (options?: RouteQueryOptions) => {
    return confirmb6f9f93c3ca6cd9758a6468a24a61b7a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/department/import/confirm'
*/
confirmb6f9f93c3ca6cd9758a6468a24a61b7a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmb6f9f93c3ca6cd9758a6468a24a61b7a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/department/import/confirm'
*/
const confirmb6f9f93c3ca6cd9758a6468a24a61b7aForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmb6f9f93c3ca6cd9758a6468a24a61b7a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CohortImportController::confirm
* @see app/Http/Controllers/CohortImportController.php:68
* @route '/api/department/import/confirm'
*/
confirmb6f9f93c3ca6cd9758a6468a24a61b7aForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmb6f9f93c3ca6cd9758a6468a24a61b7a.url(options),
    method: 'post',
})

confirmb6f9f93c3ca6cd9758a6468a24a61b7a.form = confirmb6f9f93c3ca6cd9758a6468a24a61b7aForm

/**
* Multiple routes resolve to \App\Http\Controllers\CohortImportController::confirm, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `confirm['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const confirm = {
    '/api/admin/import/confirm': confirm95887c8f65f825cc47a3947f19ae7947,
    '/api/department/import/confirm': confirmb6f9f93c3ca6cd9758a6468a24a61b7a,
}

const CohortImportController = { template, preview, confirm }

export default CohortImportController