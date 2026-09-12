// user.js
// This file holds every piece of text the user sees.
// No other file is allowed to contain a string that the user reads on screen.

export const USER_MESSAGES = {
    APP_TITLE: "Memory Game",
    LABEL_HOW_MANY: "How many buttons to create?",
    BTN_GO: "Go",
    ERROR_INVALID_NUMBER: (min, max) => `Please enter a whole number between ${min} and ${max}.`,
    MSG_WATCH_CLOSELY: "Watch closely...",
    MSG_YOUR_TURN: "Your turn! Click the buttons in the order they first appeared.",
    MSG_EXCELLENT: "Excellent memory!",
    MSG_WRONG_ORDER: "Wrong order!"
};
