export default (content) => {
    const start = '_inertia_head_start'
    const end = '_inertia_head_end'

    // Delete previous head elements
    let inRange = false

    document.head.querySelectorAll('*').forEach(item => {
        const isMetaTag = item.tagName.toLocaleLowerCase() === 'meta'

        if (isMetaTag && item.name === start) {
            inRange = true
        }

        if (inRange) {
            document.head.removeChild(item)
        }

        if (isMetaTag && item.name === end) {
            inRange = false
        }
    })

    document.head.append(
        document.createRange().createContextualFragment(`<meta name="${start}" content="" />${content}<meta name="${end}" content="" />`)
    )
}

