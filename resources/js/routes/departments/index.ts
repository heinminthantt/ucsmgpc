import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
export const showPage = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPage.url(args, options),
    method: 'get',
})

showPage.definition = {
    methods: ["get","head"],
    url: '/departments/{department}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
showPage.url = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return showPage.definition.url
            .replace('{department}', parsedArgs.department.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
showPage.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
showPage.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showPage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
const showPageForm = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
showPageForm.get = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DepartmentController::showPage
* @see app/Http/Controllers/DepartmentController.php:43
* @route '/departments/{department}'
*/
showPageForm.head = (args: { department: string | number | { id: string | number } } | [department: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showPage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showPage.form = showPageForm

const departments = {
    showPage: Object.assign(showPage, showPage),
}

export default departments