import link from './link'
import layout from './layout'

export default async ({ html, target }) => {
    let div = document.createElement('div')
    div.dataset.inertia = ''
    div.innerHTML = await layout(html)

    // Recreate script tags to make sure they are evaluated
    div.querySelectorAll('script').forEach(script => {
        let parent = script.parentNode
        parent.removeChild(script)

        let newScript = document.createElement('script')

        for (let key of script.attributes) {
            newScript.setAttributeNode(key.cloneNode(true))
        }

        newScript.innerHTML = script.innerHTML

        parent.appendChild(newScript)
    })

    let child = target.querySelector('[data-inertia]')

    if (child) {
        target.removeChild(child)
    }

    target.appendChild(div)

    target.querySelectorAll(`[data-inertia-link]`).forEach(element => {
        link(element)
    })
}
