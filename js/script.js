// script.js
// This is the only place in the project that runs outside a class.
// It just finds the page's root element and hands control over to
// a UIManager instance.

import { UIManager } from "./UIManager.js";

const appRoot = document.getElementById("app");
new UIManager(appRoot);
