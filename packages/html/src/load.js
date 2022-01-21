import { Inertia } from '@inertiajs/inertia'
import render from './render'
import head from './head'

export default async ({ target, isServer, props }) => {
    Inertia.init({
        initialPage: props.initialPage,
        resolveComponent: props.resolveComponent,
        swapComponent: async ({ component, page, preserveState }) => {
            window.Inertia = Inertia

            if (!window.Head) {
                window.Head = head
            }

            await render({ html: component, target })

            const method = page.component.replaceAll('/', '_')

            if (!window[method]) {
                return
            }

            try {
                window[method]()
            } catch (error) {
                console.error(`window.${method}() execution failed!`)
                console.error({ error })
            }
        }
    })
}
