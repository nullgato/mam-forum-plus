import { injectStyle } from './injection';
import './meta.js?userscript-metadata';
import { processRouting } from './router';

/**
 * The entry point for the userscript, wrapped in a function to circumvent top-level async/await
 */
const runScript = async () => {
    if (!await injectStyle('')) {
      console.warn('Failure to inject stylesheet, quitting')
      return
    }

    await processRouting()
}
  
runScript()