"use strict";

// Selectors
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");

// Events & Functions

// *** COUNTER COMPONENT ***
const inputHandler = () => {
	// determine max number of chars
	const maxNrChars = 150;

	// determine number of chars currently typed
	const nrCharsTyped = textareaEl.value.length;

	// calculate number of chars left
	const charsLeft = maxNrChars - nrCharsTyped;

	// show number of chars left
	counterEl.textContent = charsLeft;
};

textareaEl.addEventListener("input", inputHandler);
