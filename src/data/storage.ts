const categoryIsCollapsedPrefix = 'categoryIsCollapsed_'

const getIsCategoryCollapsed = (name: string): boolean => {
    return GM_getValue<boolean>(categoryIsCollapsedPrefix + name, false)
}

const setIsCategoryCollapsed = (name: string, value: boolean) => {
    GM_setValue<boolean>(categoryIsCollapsedPrefix + name, value)
}

export { getIsCategoryCollapsed, setIsCategoryCollapsed }
