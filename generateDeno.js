const fs = require("fs");
const path = require("path");

function* walkDir(dirname) {
    for (const dirent of fs.readdirSync(dirname, {
        withFileTypes: true
    })) {
        const direntPath = path.join(dirname, dirent.name);
        if (dirent.isDirectory()) {
            yield* walkDir(direntPath);
        } else {
            yield direntPath;
        }
    }
}

function changeImports(str) {
    return str.replace(/^\s*(import|export)\s+(.+)\s+from\s*['"](.+)['"];\s*$/mg, `$1 $2 from "$3.ts";`);
}

const srcDir = "src";
const destDir = "deno_compat";
for (const file of walkDir(path.join(__dirname, srcDir))) {
    const dest = file.replace(srcDir, "deno_compat");
    if (path.extname(file) == ".ts") {
        fs.writeFileSync(dest, changeImports(fs.readFileSync(file, "utf8")), "utf8");
    } else {
        fs.copyFileSync(file, dest);
    }
}
