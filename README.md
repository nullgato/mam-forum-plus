# MAM Forum+

[![GitHub release](https://img.shields.io/github/release/nullgato/mam-forum-plus?include_prereleases=&sort=semver&color=blue)](https://github.com/nullgato/mam-forum-plus/releases/)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

This project is meant to primarily be a design overhaul first, and provide additional functionality second. Some current features include: forum page searching, hiding/showing entire forum categories.

MAM Forum+ does not require [MAM+](https://github.com/gardenshade/mam-plus) to work, but I do personally recommend MAM+ to enhance the site experience. This project is heavily inspired by MAM+ and draws from a couple blocks worth of code within that project. A big big thanks to [GardenShade](https://github.com/gardenshade) for open sourcing and their work that I learned from.

## Installation

The first step is installing a browser extension that allows userscripts. Userscripts are files that can be used alongside a website's existing files to run code that the site doesn't have. I use [Violentmonkey](https://violentmonkey.github.io/get-it/) primarily because that's what MAM+ suggests.

After you do that you can click the image underneath this line of text to install straight from GitHub!

[current-release]: https://github.com/nullgato/mam-forum-plus/releases/latest/download/mam-forum-forum.user.js

[![Install - Via Github](https://img.shields.io/badge/Install-Via_Github-2ea44f?style=for-the-badge&logo=tampermonkey)][current-release]

<small>\* MAM Forum+ officially supports Chrome, Edge, and Firefox, but has also been tested with Arc (1.30.0) and Opera GX (105). Other browsers may work if they have a userscript extension.</small>

## Development

### Requirements

-   Node.js
-   Supported Browser with [Violentmonkey](https://violentmonkey.github.io/get-it/) (Chrome and Firefox have the best dev experience)

### Setup

-   Clone this project or download the source code .zip in Releases
-   Open a terminal window and point it the mam-forum-plus folder
    -   `cd <file path to folder>`
-   Run `npm install`

### Usage

This project uses [TypeScript (TS)](https://www.typescriptlang.org/) which is a superset of JavaScript (JS). These days modern JS is fairly similar to TS making it incredibly easy to get started with. This project includes a transpiler that will process the `.ts` and `.tsx` files located in the `src` directory into JS.

The included bundler [Rollup](https://rollupjs.org) is a tool which will take that JavaScript along with the CSS files and wrap it up into one minified JavaScript file (`mam-forum-plus.user.js`) for performance purposes. You will not need to modify this minifiled file and is best left alone.

This project also includes [ESLint](https://eslint.org/) which is a tool that analyzes your code to find problems according to the standards defined within the `.eslintrc.js` file. Using that file you can modify the linting to keep the code styling aligned to your standards or even disable aspects of linting entirely.

To build the project, run `npm run build` in the terminal. This will transpile the `.ts` and `.tsx` files into `dist/mam-forum-plus.js`. In order to automate the build process while you're actively developing you can run `npm run dev` which will build and watch files for changes. Upon a change, it will rebuild the project (this takes a second or two in Violentmonkey).

In order to load this script into Violentmonkey, you will locate the `mam-forum-plus/dist/mam-forum-plus.user.js` file and drag the file into the browser tabs area of Chrome or \*Firefox. The Violentmonkey extension should automatically detect this an prompt you to take action on the userscript in a new tab. Within this tab, you'll want to click the `Track external edits` button. The checkbox directly to the right of this button will make this tracking automatically when you do this process in the future. Keep this tab open.

If you browse to MAM's forum, you should now be able to see the changes affected by the project.

<small>\*Firefox requires the raw mam-forum-plus.user.js file to remain open <strong>with</strong> the extension tab.</small>

## License

Released under [MIT](/LICENSE) by [@nullgato](https://github.com/nullgato).

## Acknowledgments

MAM Forum+ uses several open-source libraries and dependencies to provide its functionality:

-   [mam-plus](https://github.com/gardenshade/mam-plus): Primary inspiration and timing function for detecting elements.
-   [Violentmonkey](https://violentmonkey.github.io/): For their guide and API.
-   [Solid.js](https://www.solidjs.com): The UI framework seen in the .tsx files.
