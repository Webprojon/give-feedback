"use strict";

// SELECTERS & GLOBAL STUFFS
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");

const MAX_CHARS = 150;

// EVENTS & FUNCTIONS

// *** COUNTER COMPONENT ***
const inputHandler = () => {
	// determine max number of chars
	const maxNrChars = MAX_CHARS;

	// determine number of chars currently typed
	const nrCharsTyped = textareaEl.value.length;

	// calculate number of chars left
	const charsLeft = maxNrChars - nrCharsTyped;

	// show number of chars left
	counterEl.textContent = charsLeft;
};

textareaEl.addEventListener("input", inputHandler);

// *** FORM COMPONENT ***
const showVisualIndicator = (textCheck) => {
	const className = textCheck === "valid" ? "form--valid" : "form--invalid";

	// show valid indicator
	formEl.classList.add(className);

	// remove visual indicator
	setTimeout(() => {
		formEl.classList.remove(className);
	}, 2000);
};

const submitHandler = (event) => {
	// prevent default browser action
	event.preventDefault();

	// get text from textarea
	const text = textareaEl.value;

	// validate text
	if (text.includes("#") && text.length >= 5) {
		showVisualIndicator("valid");
	} else {
		showVisualIndicator("invalid");

		// focus textarea
		textareaEl.focus();

		// stop this function execution
		return;
	}

	// we have text, now extract other info text
	const hashtag = text.split(" ").find((word) => word.includes("#"));
	const company = hashtag.substring(1);
	const badgeLetter = company.substring(0, 1).toUpperCase();
	const upvoteCount = 0;
	const daysAgo = 0;

	// new feedback item HTML
	const feedbackItemHTML = `
	<li class="feedback">
	<button>
	<i class="fa-solid fa-caret-up upvote__icon"></i>
	<span class="upvote__count">${upvoteCount}</span>
	</button>

	<sevtion class="feedback__badge">
     <p class="feedback__letter">${badgeLetter}</p>
	</sevtion>

	<div class="feedback__content">
	<p class="feedback__company">${company}</p>
	<p class="feedback__text">${text}</p>
	</div>

	<p class="feedback__date">${daysAgo === 0 ? "NEW" : `${daysAgo}d`}</p>
	</li>
	`;

	// insert new item
	feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);

	// clear textarea
	textareaEl.value = "";

	// blur submit button
	submitBtnEl.blur();

	// reset counter
	counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);

// *** FEEDBACK LIST COMPONENT ***
