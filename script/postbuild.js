/* manifest.json file expects .js files, not TypeScript sources.
 * This script copies manifest.json into the `dir` directory, and
 * is to be run after the TS compiler has been called so that the
 *  manifest can find .js files ready to be used.
 */

const fs = require("fs")
const path = require("path")
const process = require('process');

const manifestName = "manifest.json"
const src = path.join("reaser", manifestName)
const dst = path.join("dist", manifestName)
fs.promises.copyFile(src, dst, fs.constants.COPYFILE_FICLONE)
    .catch((err) => {
        console.error(err.toString())
        process.exit(1)
    })
