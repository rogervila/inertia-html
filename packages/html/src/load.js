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

            if (!window[page.component]) {
                return
            }

            try {
                window[page.component]()
            } catch (error) {
                console.error(`window.${page.component}() execution failed!`)
                console.error({ error })
            }
        }
    })
}
