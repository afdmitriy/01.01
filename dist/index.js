"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_js_1 = require("./settings.js");
const port = 3000;
settings_js_1.app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
