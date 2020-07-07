/* manifest.json file expects .js files, not TypeScript sources.
 * This script copies manifest.json into the `dir` directory, and
 * is to be run after the TS compiler has been called so that the
 *  manifest can find .js files ready to be used.
 */

const fs = require("fs")
const path = require("path")
const process = require('process');


if (process.argv.length < 3) {
    var destDir = "dist"
} else {
    var destDir = process.argv[2]
}
const manifestName = "manifest.json"
fs.promises.copyFile(path.join("reaser", manifestName), path.join(destDir, manifestName))
    .catch((err) => {
        console.error(err.toString())
        process.exit(1)
    })
