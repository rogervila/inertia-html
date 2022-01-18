import { Inertia, mergeDataIntoQueryString, shouldIntercept } from '@inertiajs/inertia'

export default (element, attribute = 'data-inertia-link', eventToBeListened = 'click') => {
    const GET = 'get'

    const defaultOptions = {
        method: GET,
        data: {},
        href: null,
        replace: false,
        preserveState: false,
        preserveScroll: false,
        only: [],
        headers: {},
        errorBag: null,
        forceFormData: false,
    }

    const parseOptions = (element) => {
        let options = {}

        try {
            options = { ...options, ...JSON.parse(element.getAttribute(attribute)) }
        } catch (error) {
            // console.warn({ error })
        }

        if (!options.href) {
            options.href = element.href || null
        }

        return { ...defaultOptions, ...options }
    }

    let options = parseOptions(element)

    element.addEventListener(eventToBeListened, (e) => {
        if (!element.href && !options.href) {
            console.error(`${element.tagName} does not have any "href" specified!`)
            console.error({ element })
            return false
        }

        const [href, data] = mergeDataIntoQueryString(options.method || GET, element.href || options.href, options.data || {}, options.queryStringArrayFormat || 'brackets')

        options.data = data

        if (element.tagName.toLowerCase() === 'a' && options.method !== GET) {
            console.warn(`Creating POST/PUT/PATCH/DELETE <a> elements is discouraged as it causes "Open element in New Tab/Window" accessibility issues.\n\nPlease specify a more appropriate element, like <button>`)
        }

        if (shouldIntercept(e)) {
            e.preventDefault();
            Inertia.visit(href, options)
        }
    })
}
