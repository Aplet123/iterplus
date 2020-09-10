const fs = require("fs");
const path = require("path");

function genNewSrc(src) {
    const newSrc = src.replace(
        /(\s*)\/\*\s*([or]):([^]+?)\s*\*\/(\s*)(\w*)(\s*)/g,
        function (_, bws, type, replacement, ews, ident, iws) {
            let ret = "";
            if (replacement.startsWith("-")) {
                replacement = replacement.substring(1);
            } else {
                ret += bws;
            }
            if (type == "r") {
                if (replacement.endsWith("-")) {
                    replacement = replacement.substring(0, replacement.length - 1);
                    iws = "";
                }
                ret += replacement + iws;
            } else if (replacement.endsWith("-")) {
                ret += replacement.substring(0, replacement.length - 1) + ident + iws;
            } else {
                ret += replacement + ews + ident + iws;
            }
            return ret;
        }
    );
    return newSrc;
}

const pairs = [["src/IterPlus.ts", "src/AsyncIterPlus.ts"]];

for (const [src, dest] of pairs) {
    fs.writeFileSync(
        path.join(__dirname, dest),
        genNewSrc(fs.readFileSync(path.join(__dirname, src), "utf8")),
        "utf8"
    );
}
