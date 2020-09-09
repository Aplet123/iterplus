const fs = require("fs");
const path = require("path");

function genNewSrc(src) {
    const newSrc = src.replace(
        /(\s*)\/\*\s*([or]):(.+?)\s*\*\/(\s*)(\w*)/g,
        function (_, bws, type, replacement, ews, ident) {
            let ret = "";
            if (replacement.startsWith("-")) {
                replacement = replacement.substring(1);
            } else {
                ret += bws;
            }
            if (type == "r") {
                ret += replacement;
            } else if (replacement.endsWith("-")) {
                ret += replacement.substring(0, replacement.length - 1) + ident;
            } else {
                ret += replacement + ews + ident;
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
