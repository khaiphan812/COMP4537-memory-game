// GameButton.js
// One instance of this class represents one button on the screen.

export class GameButton {

    // color: the CSS background color for this button
    // order: the position (1, 2, 3...) this button should be clicked in
    constructor(color, order) {
        this.color = color;
        this.order = order;
        this.element = this.createElement();
    }

    // Builds the actual <button> DOM element for this GameButton.
    createElement() {
        const button = document.createElement("button");
        button.className = "game-button";
        button.style.backgroundColor = this.color;
        button.textContent = this.order; // shown at first, hidden later
        button.style.position = "absolute";
        return button;
    }

    // Moves this button to an x,y position inside its container.
    setPosition(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    // Hides the number so the user has to rely on memory.
    hideNumber() {
        this.element.textContent = "";
    }

    // Reveals the number again (used when confirming a correct click,
    // or when revealing everything after a mistake).
    revealNumber() {
        this.element.textContent = this.order;
    }

    // Controls whether this button shows a pointer cursor. While
    // scrambling is still in progress, the button must NOT look
    // clickable (no hand cursor), even though clicks are also
    // ignored by MemoryGame at that point.
    setClickable(isClickable) {
        this.element.classList.toggle("clickable", isClickable);
    }
}
