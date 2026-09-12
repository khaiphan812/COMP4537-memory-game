// UIManager.js
// This class builds the setup screen (label, input box, Go button)
// and shows messages to the user. It does not know anything about
// how the game itself is played.

import { USER_MESSAGES } from "../lang/messages/en/user.js";
import { MemoryGame } from "./MemoryGame.js";

const MIN_BUTTONS = 3;
const MAX_BUTTONS = 7;

export class UIManager {

    // rootElement: the DOM element everything gets attached to
    constructor(rootElement) {
        this.rootElement = rootElement;

        this.label = null;
        this.input = null;
        this.goButton = null;
        this.messageArea = null;
        this.controlsArea = null;
        this.gameContainer = null;

        this.currentGame = null;

        document.title = USER_MESSAGES.APP_TITLE;
        this.buildSetupControls();
    }

    // Creates the label, input box, Go button and message area (all
    // wrapped together in one "controlsArea" element so its total
    // height can be measured), and the container the game buttons
    // will later be placed in.
    buildSetupControls() {
        this.label = document.createElement("label");
        this.label.textContent = USER_MESSAGES.LABEL_HOW_MANY;
        this.label.htmlFor = "button-count-input";

        this.input = document.createElement("input");
        this.input.type = "number";
        this.input.id = "button-count-input";
        this.input.min = MIN_BUTTONS;
        this.input.max = MAX_BUTTONS;

        this.goButton = document.createElement("button");
        this.goButton.textContent = USER_MESSAGES.BTN_GO;
        this.goButton.addEventListener("click", () => this.handleGoClicked());

        this.messageArea = document.createElement("p");
        this.messageArea.className = "message-area";

        const inputRow = document.createElement("div");
        inputRow.className = "input-row";
        inputRow.appendChild(this.input);
        inputRow.appendChild(this.goButton);

        const setupRow = document.createElement("div");
        setupRow.className = "setup-row";
        setupRow.appendChild(this.label);
        setupRow.appendChild(inputRow);

        this.controlsArea = document.createElement("div");
        this.controlsArea.className = "controls-area";
        this.controlsArea.appendChild(setupRow);
        this.controlsArea.appendChild(this.messageArea);

        this.gameContainer = document.createElement("div");
        this.gameContainer.className = "game-container";

        this.rootElement.appendChild(this.controlsArea);
        this.rootElement.appendChild(this.gameContainer);
    }

    // Runs when the user presses "Go". Validates the input, then
    // starts a brand new MemoryGame if the number is valid.
    handleGoClicked() {
        const numButtons = Number(this.input.value);
        const isWholeNumber = Number.isInteger(numButtons);
        const isInRange = numButtons >= MIN_BUTTONS && numButtons <= MAX_BUTTONS;

        if (!isWholeNumber || !isInRange) {
            this.showMessage(USER_MESSAGES.ERROR_INVALID_NUMBER(MIN_BUTTONS, MAX_BUTTONS));
            return;
        }

        this.currentGame = new MemoryGame(numButtons, this.gameContainer, this, this.controlsArea);
        this.currentGame.start();
    }

    // Displays a message to the user in the message area.
    showMessage(text) {
        this.messageArea.textContent = text;
    }
}
