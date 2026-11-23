const registry = new Map<string, Array<{ placeholder: Comment; node: Element }>>()

export const rememberRemoval = (featureKey: string, node: Element): void => {
    if (!node.isConnected) {
        return
    }

    const placeholder = document.createComment("veloxtube")
    node.replaceWith(placeholder)

    let bucket = registry.get(featureKey)

    if (!bucket) {
        bucket = []
        registry.set(featureKey, bucket)
    }

    bucket.push({ placeholder, node })
}

export const restoreRemovals = (featureKey: string): void => {
    const bucket = registry.get(featureKey)

    if (!bucket) {
        return
    }

    for (const entry of bucket) {
        if (!entry.placeholder.parentNode) {
            continue
        }

        entry.placeholder.replaceWith(entry.node)
    }

    registry.delete(featureKey)
}

export const clearAllRemovals = (): void => {
    registry.clear()
}
