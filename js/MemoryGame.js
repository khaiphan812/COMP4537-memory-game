// MemoryGame.js
// This class runs the whole memory game: creating buttons, showing them
// in a row, scrambling them, then letting the user click them in order.

import { GameButton } from "./GameButton.js";
import { USER_MESSAGES } from "../lang/messages/en/user.js";

// A short list of colors to randomly choose from for each button.
const BUTTON_COLORS = [
    "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
    "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabed4"
];

const SCRAMBLE_INTERVAL_MS = 2000;
const ROW_GAP_PX = 10;
const CONTROLS_GAP_PX = 10; // gap kept below the controls area at all times
const MS_PER_SECOND = 1000;

export class MemoryGame {

    // numButtons: how many buttons to create (3-7)
    // container: the DOM element the buttons will be placed inside
    // uiManager: used only to display messages to the user
    // controlsElement: the header (label/input/Go button/message) that
    //                  buttons must never be placed on top of
    constructor(numButtons, container, uiManager, controlsElement) {
        this.numButtons = numButtons;
        this.container = container;
        this.uiManager = uiManager;
        this.controlsElement = controlsElement;

        this.buttons = [];        // holds all GameButton instances
        this.nextExpectedIndex = 0; // index (in this.buttons) the user must click next
        this.isClickable = false;   // true only once scrambling has finished
        this.buttonWidth = 0;   // measured from the real DOM element, not guessed
        this.buttonHeight = 0;  // measured from the real DOM element, not guessed
    }

    // Starts a brand new round of the game.
    start() {
        this.clearBoard();
        this.createButtons();
        this.arrangeButtonsInRow();
        this.uiManager.showMessage(USER_MESSAGES.MSG_WATCH_CLOSELY);

        // Pause for numButtons seconds before the scrambling begins.
        const pauseMs = this.numButtons * MS_PER_SECOND;
        setTimeout(() => this.runScrambleSequence(0), pauseMs);
    }

    // Removes any buttons left over from a previous round.
    clearBoard() {
        this.container.innerHTML = "";
        this.buttons = [];
        this.nextExpectedIndex = 0;
        this.isClickable = false;
    }

    // Creates numButtons GameButton instances with random colors.
    createButtons() {
        for (let i = 0; i < this.numButtons; i += 1) {
            const color = BUTTON_COLORS[i % BUTTON_COLORS.length];
            const order = i + 1;
            const gameButton = new GameButton(color, order);
            this.buttons.push(gameButton);
            this.container.appendChild(gameButton.element);
        }

        // Read the button's REAL rendered size (including any default
        // browser padding/border) instead of assuming 10em/5em convert
        // to an exact pixel value. This is what keeps buttons fully
        // inside the window during scrambling.
        const firstButton = this.buttons[0].element;
        this.buttonWidth = firstButton.offsetWidth;
        this.buttonHeight = firstButton.offsetHeight;
    }

    // Returns the y coordinate just below the controls area (label,
    // input, Go button, message text). Buttons are never allowed above
    // this line. Measured fresh each time in case the controls' own
    // height changes (e.g. the message text wraps onto two lines).
    getMinY() {
        const controlsBottom = this.controlsElement.getBoundingClientRect().bottom;
        return Math.ceil(controlsBottom) + CONTROLS_GAP_PX;
    }

    // Lines the buttons up in a row, wrapping to a new row if the
    // browser window is too narrow to fit them all on one line.
    // The row always starts below the controls area.
    arrangeButtonsInRow() {
        let x = ROW_GAP_PX;
        let y = this.getMinY();
        const maxWidth = window.innerWidth;

        this.buttons.forEach((gameButton) => {
            if (x + this.buttonWidth > maxWidth) {
                x = ROW_GAP_PX;
                y += this.buttonHeight + ROW_GAP_PX;
            }
            gameButton.setPosition(x, y);
            x += this.buttonWidth + ROW_GAP_PX;
        });
    }

    // Moves every button to a new random spot within the current
    // browser window, always below the controls area. Overlap between
    // buttons themselves is allowed.
    scrambleButtons() {
        const minY = this.getMinY();
        const maxX = Math.max(window.innerWidth - this.buttonWidth, 0);
        const maxY = Math.max(window.innerHeight - this.buttonHeight, minY);

        this.buttons.forEach((gameButton) => {
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = minY + Math.floor(Math.random() * (maxY - minY + 1));
            gameButton.setPosition(randomX, randomY);
        });
    }

    // Scrambles the buttons numButtons times, waiting SCRAMBLE_INTERVAL_MS
    // between each move, then enables clicking once finished.
    runScrambleSequence(scrambleCount) {
        if (scrambleCount >= this.numButtons) {
            this.enableClicking();
            return;
        }

        this.scrambleButtons();
        setTimeout(() => this.runScrambleSequence(scrambleCount + 1), SCRAMBLE_INTERVAL_MS);
    }

    // Hides the numbers and lets the user start clicking buttons.
    enableClicking() {
        this.isClickable = true;
        this.uiManager.showMessage(USER_MESSAGES.MSG_YOUR_TURN);

        this.buttons.forEach((gameButton) => {
            gameButton.hideNumber();
            gameButton.setClickable(true);
            gameButton.element.addEventListener("click", () => this.handleButtonClick(gameButton));
        });
    }

    // Called whenever the user clicks a button during the guessing phase.
    handleButtonClick(gameButton) {
        if (!this.isClickable) {
            return;
        }

        const expectedButton = this.buttons[this.nextExpectedIndex];

        if (gameButton === expectedButton) {
            gameButton.revealNumber();
            this.nextExpectedIndex += 1;

            if (this.nextExpectedIndex === this.buttons.length) {
                this.isClickable = false;
                this.uiManager.showMessage(USER_MESSAGES.MSG_EXCELLENT);
            }
        } else {
            this.isClickable = false;
            this.revealAllNumbers();
            this.uiManager.showMessage(USER_MESSAGES.MSG_WRONG_ORDER);
        }
    }

    // Reveals every button's original number (used after a wrong click).
    revealAllNumbers() {
        this.buttons.forEach((gameButton) => gameButton.revealNumber());
    }
}
