import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin-dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:16
* @route '/admin-dashboard'
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
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
export const supervisors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisors.url(options),
    method: 'get',
})

supervisors.definition = {
    methods: ["get","head"],
    url: '/api/supervisors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
supervisors.url = (options?: RouteQueryOptions) => {
    return supervisors.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
supervisors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisors.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
supervisors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: supervisors.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
const supervisorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: supervisors.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
supervisorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: supervisors.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::supervisors
* @see app/Http/Controllers/AdminController.php:97
* @route '/api/supervisors'
*/
supervisorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: supervisors.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

supervisors.form = supervisorsForm

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/api/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::users
* @see app/Http/Controllers/AdminController.php:21
* @route '/api/admin/users'
*/
usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: users.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

users.form = usersForm

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
export const projects = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projects.url(options),
    method: 'get',
})

projects.definition = {
    methods: ["get","head"],
    url: '/api/admin/projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
projects.url = (options?: RouteQueryOptions) => {
    return projects.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
projects.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projects.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
projects.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: projects.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
const projectsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projects.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
projectsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projects.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::projects
* @see app/Http/Controllers/AdminController.php:45
* @route '/api/admin/projects'
*/
projectsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: projects.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

projects.form = projectsForm

/**
* @see \App\Http\Controllers\AdminController::updateUserRole
* @see app/Http/Controllers/AdminController.php:71
* @route '/api/admin/users/{user}/role'
*/
export const updateUserRole = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateUserRole.url(args, options),
    method: 'put',
})

updateUserRole.definition = {
    methods: ["put"],
    url: '/api/admin/users/{user}/role',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updateUserRole
* @see app/Http/Controllers/AdminController.php:71
* @route '/api/admin/users/{user}/role'
*/
updateUserRole.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updateUserRole.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateUserRole
* @see app/Http/Controllers/AdminController.php:71
* @route '/api/admin/users/{user}/role'
*/
updateUserRole.put = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateUserRole.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AdminController::updateUserRole
* @see app/Http/Controllers/AdminController.php:71
* @route '/api/admin/users/{user}/role'
*/
const updateUserRoleForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUserRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::updateUserRole
* @see app/Http/Controllers/AdminController.php:71
* @route '/api/admin/users/{user}/role'
*/
updateUserRoleForm.put = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateUserRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateUserRole.form = updateUserRoleForm

/**
* @see \App\Http\Controllers\AdminController::deactivateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/api/admin/users/{user}'
*/
export const deactivateUser = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deactivateUser.url(args, options),
    method: 'delete',
})

deactivateUser.definition = {
    methods: ["delete"],
    url: '/api/admin/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::deactivateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/api/admin/users/{user}'
*/
deactivateUser.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return deactivateUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deactivateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/api/admin/users/{user}'
*/
deactivateUser.delete = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deactivateUser.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/api/admin/users/{user}'
*/
const deactivateUserForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivateUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::deactivateUser
* @see app/Http/Controllers/AdminController.php:89
* @route '/api/admin/users/{user}'
*/
deactivateUserForm.delete = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deactivateUser.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deactivateUser.form = deactivateUserForm

const AdminController = { index, supervisors, users, projects, updateUserRole, deactivateUser }

export default AdminController