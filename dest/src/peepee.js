"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const sleep = (x) => new Promise((r) => setTimeout(r, x));
const lmao = (x) => sleep(Math.random() * 1000).then((_) => x);
const stuff = (0, index_1.liftAsync)([1, 2, 3, 4, 5]).map((x) => lmao(x));
const [i1, i2] = (0, index_1.asyncIterplus)(stuff).tee(2);
// i1.forEach((x) => console.log("i1", x)).then((_) =>
//     i2.forEach((x) => console.log("i2", x))
// );
i1.forEach((x) => console.log("i1", x));
i2.forEach((x) => console.log("i2", x));
// i2.sum().then(console.log);
//# sourceMappingURL=peepee.js.map