module.exports = {
    roots: ["<rootDir>/test"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testMatch: ["**/test/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
