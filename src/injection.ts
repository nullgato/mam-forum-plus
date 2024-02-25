import { waitForElem } from "./util"


/**
 * Attempts to inject style.css into the <head> element
 * @returns True upon successful injection, false upon failure
 */
const injectStyle = async (css: string): Promise<boolean> => {
    try {
      const elem = await waitForElem('head')
      if (elem === null) {
        console.warn('<head> element did not properly load in time')
        return false
      }
    
      const globalStyleElement = GM_addStyle(css)
      elem.appendChild(globalStyleElement)
    
      return true
    }
    catch (error) {
      console.error(error)
      return false
    }
}

export { injectStyle }
