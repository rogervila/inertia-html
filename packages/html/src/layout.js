import { Inertia } from '@inertiajs/inertia'

export default async (html, extendsAttribute = 'data-inertia-extends', slotAttribute = 'data-inertia-slot') => {
    const parser = new DOMParser()
    const mime_html = 'text/html'

    let dom = parser.parseFromString(html, mime_html);
    let extend = dom.querySelector(`[${extendsAttribute}]`)

    if (!extend) {
        return html
    }

    let component = await Inertia.resolveComponent(extend.getAttribute(extendsAttribute))
    let layout = parser.parseFromString(component, mime_html);
    let slot = layout.querySelector(`[${slotAttribute}]`)

    if (!slot) {
        return html
    }

    slot.innerHTML = html

    return layout.body.innerHTML
}
