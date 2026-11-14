import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const Controller980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const Controller980bb49ee7ae63891f1d891d2fbcf1c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.form = Controller980bb49ee7ae63891f1d891d2fbcf1c9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const Controller42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return Controller42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const Controller42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.form = Controller42a740574ecbfbac32f8cc353fc32db9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
const Controlleraca33ce5ffd95ffe89298a487ac9c3ae = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url(options),
    method: 'get',
})

Controlleraca33ce5ffd95ffe89298a487ac9c3ae.definition = {
    methods: ["get","head"],
    url: '/projects/my',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url = (options?: RouteQueryOptions) => {
    return Controlleraca33ce5ffd95ffe89298a487ac9c3ae.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
Controlleraca33ce5ffd95ffe89298a487ac9c3ae.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
Controlleraca33ce5ffd95ffe89298a487ac9c3ae.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
const Controlleraca33ce5ffd95ffe89298a487ac9c3aeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
Controlleraca33ce5ffd95ffe89298a487ac9c3aeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/projects/my'
*/
Controlleraca33ce5ffd95ffe89298a487ac9c3aeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controlleraca33ce5ffd95ffe89298a487ac9c3ae.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controlleraca33ce5ffd95ffe89298a487ac9c3ae.form = Controlleraca33ce5ffd95ffe89298a487ac9c3aeForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
const Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url(options),
    method: 'get',
})

Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.definition = {
    methods: ["get","head"],
    url: '/department',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url = (options?: RouteQueryOptions) => {
    return Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
const Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/department'
*/
Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5.form = Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
const Controller3af707eaba4d5790cccc8b172c3f8f02 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller3af707eaba4d5790cccc8b172c3f8f02.url(options),
    method: 'get',
})

Controller3af707eaba4d5790cccc8b172c3f8f02.definition = {
    methods: ["get","head"],
    url: '/examiner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
Controller3af707eaba4d5790cccc8b172c3f8f02.url = (options?: RouteQueryOptions) => {
    return Controller3af707eaba4d5790cccc8b172c3f8f02.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
Controller3af707eaba4d5790cccc8b172c3f8f02.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller3af707eaba4d5790cccc8b172c3f8f02.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
Controller3af707eaba4d5790cccc8b172c3f8f02.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller3af707eaba4d5790cccc8b172c3f8f02.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
const Controller3af707eaba4d5790cccc8b172c3f8f02Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller3af707eaba4d5790cccc8b172c3f8f02.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
Controller3af707eaba4d5790cccc8b172c3f8f02Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller3af707eaba4d5790cccc8b172c3f8f02.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/examiner'
*/
Controller3af707eaba4d5790cccc8b172c3f8f02Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller3af707eaba4d5790cccc8b172c3f8f02.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller3af707eaba4d5790cccc8b172c3f8f02.form = Controller3af707eaba4d5790cccc8b172c3f8f02Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
const Controller31daec6a6a5c1c1728a97ffa59b08398 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller31daec6a6a5c1c1728a97ffa59b08398.url(options),
    method: 'get',
})

Controller31daec6a6a5c1c1728a97ffa59b08398.definition = {
    methods: ["get","head"],
    url: '/audit-log',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
Controller31daec6a6a5c1c1728a97ffa59b08398.url = (options?: RouteQueryOptions) => {
    return Controller31daec6a6a5c1c1728a97ffa59b08398.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
Controller31daec6a6a5c1c1728a97ffa59b08398.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller31daec6a6a5c1c1728a97ffa59b08398.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
Controller31daec6a6a5c1c1728a97ffa59b08398.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller31daec6a6a5c1c1728a97ffa59b08398.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
const Controller31daec6a6a5c1c1728a97ffa59b08398Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller31daec6a6a5c1c1728a97ffa59b08398.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
Controller31daec6a6a5c1c1728a97ffa59b08398Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller31daec6a6a5c1c1728a97ffa59b08398.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/audit-log'
*/
Controller31daec6a6a5c1c1728a97ffa59b08398Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller31daec6a6a5c1c1728a97ffa59b08398.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller31daec6a6a5c1c1728a97ffa59b08398.form = Controller31daec6a6a5c1c1728a97ffa59b08398Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form

/**
* Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `Controller['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const Controller = {
    '/': Controller980bb49ee7ae63891f1d891d2fbcf1c9,
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/projects/my': Controlleraca33ce5ffd95ffe89298a487ac9c3ae,
    '/department': Controller0c1c2e7e08c65cf2ccd4beae1f50d4c5,
    '/examiner': Controller3af707eaba4d5790cccc8b172c3f8f02,
    '/audit-log': Controller31daec6a6a5c1c1728a97ffa59b08398,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller