
/**
 * @remarks 
 * Sourced from afTimer by GardenShade
 * @see {@link https://github.com/gardenshade/mam-plus/blob/master/src/util.ts#L11}
 * 
 * @returns A resolution upon receiving the next frame
 */
const waitOneFrame = (): Promise<number> => {
    return new Promise(resolve => {
      requestAnimationFrame(resolve)
    })
  }

/**
 * @remarks 
 * Based on waitForElem by GardenShade
 * @see {@link https://github.com/gardenshade/mam-plus/blob/master/src/check.ts#L14}
 * 
 * @param selector The css selector to query and wait for if not yet loaded
 * @returns The element upon query/load or null if wait is unsuccessful
 */
const waitForElem = async (selector: string): Promise<HTMLElement | null> => {
const intervalLimit = 200

let elem: HTMLElement | null
for (let intervalCount = 0; intervalCount < intervalLimit; intervalCount++) {
    elem = document.querySelector(selector)
    if (elem !== null) break

    await waitOneFrame()
}

return elem
}

export { waitForElem }
