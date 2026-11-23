const registry = new Map<string, Array<{ placeholder: Comment; node: Element }>>()

export const rememberRemoval = (featureKey: string, node: Element): void => {
    const parent = node.parentNode

    if (!parent) {
        return
    }

    const placeholder = document.createComment("veloxtube")
    parent.replaceChild(placeholder, node)

    const entries = registry.get(featureKey)

    if (entries) {
        entries.push({ placeholder, node })
    } else {
        registry.set(featureKey, [{ placeholder, node }])
    }
}

export const restoreRemovals = (featureKey: string): void => {
    const entries = registry.get(featureKey)

    if (!entries) {
        return
    }

    for (const { placeholder, node } of entries) {
        placeholder.parentNode?.replaceChild(node, placeholder)
    }

    registry.delete(featureKey)
}

export const clearAllRemovals = (): void => {
    for (const entries of registry.values()) {
        for (const { placeholder } of entries) {
            placeholder.remove()
        }
    }

    registry.clear()
}
