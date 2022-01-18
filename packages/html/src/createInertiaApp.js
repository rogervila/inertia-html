import load from './load'

export default async function ({ id = 'app', resolve, setup, page }) {
    const isServer = typeof window === 'undefined'
    const el = isServer ? null : document.getElementById(id)
    const initialPage = page || JSON.parse(el.dataset.page)
    const resolveComponent = name => Promise.resolve(resolve(name))

    let head = []

    const htmlApp = await resolveComponent(initialPage.component).then(initialComponent => {
        return setup({
            el,
            isServer,
            load,
            props: {
                initialPage,
                initialComponent,
                resolveComponent,
                onHeadUpdate: isServer ? elements => (head = elements) : null,
            },
        })
    })

    if (isServer) {
        // TODO
    }
}
