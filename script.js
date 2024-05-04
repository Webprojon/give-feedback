"use strict";

// SELECTERS & GLOBAL STUFFS
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const submitBtnEl = document.querySelector(".submit-btn");
const spinnerEL = document.querySelector(".spinner");
const upvoteCountEl = document.querySelector(".upvote__count");
const hashtagsEl = document.querySelector(".hashtags");

const MAX_CHARS = 150;
const BASE_API_URL = "https://bytegrad.com/course-assets/js/1/api";

// EVENTS & FUNCTIONS
const renderFeedbackItems = (feedbackItem) => {
	const { upvoteCount, badgeLetter, company, text, daysAgo } = feedbackItem;
	// new feedback item HTML
	const feedbackItemHTML = `
	<li class="feedback">
	<button class="upvote">
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
};

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
	// render feedback items in list
	const feedbackItems = {
		company,
		badgeLetter,
		upvoteCount,
		text,
		daysAgo,
	};
	renderFeedbackItems(feedbackItems);

	// send feedback item to server
	// MODERAN FETCH
	const fetchPostData = async () => {
		try {
			const response = await fetch(`${BASE_API_URL}/feedbacks`, {
				method: "POST",
				body: JSON.stringify(feedbackItems),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				console.log("Something went wrong");
				return;
			}
			console.log("Successfully submitted");
		} catch (error) {
			console.log(error.message);
		}
	};
	fetchPostData();

	// TRADITIONAL FETCH
	//fetch(`${BASE_API_URL}/feedbacks`, {
	//	method: "POST",
	//	body: JSON.stringify(feedbackItems),
	//	headers: {
	//		Accept: "application/json",
	//		"Content-Type": "application/json",
	//	},
	//})
	//	.then((response) => {
	//		if (!response.ok) {
	//			console.log("Something went wrong");
	//			return;
	//		}

	//		console.log("Successfully submitted");
	//	})
	//	.catch((error) => console.log(error));

	// clear textarea
	textareaEl.value = "";
	// blur submit button
	submitBtnEl.blur();
	// reset counter
	counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener("submit", submitHandler);

// *** FEEDBACK LIST COMPONENT ***
const clickHandler = (event) => {
	// get clicked HTML element
	const clickedEl = event.target;
	// determine if user intended to upvote or expend
	const upvoteIntention = clickedEl.className.includes("upvote");

	// run the appropriate logic
	if (upvoteIntention) {
		// get closest upvote button
		const upvoteBtnEl = clickedEl.closest(".upvote");
		// disable upvote button
		upvoteBtnEl.disabled = true;
		// select the upvote count element within the upvote button
		const upvoteCountEl = upvoteBtnEl.querySelector(".upvote__count");
		// get currently displayed upvote count as number
		let upvoteCount = +upvoteCountEl.textContent;
		// set upvote count and incremented by 1
		upvoteCountEl.textContent = ++upvoteCount;
	} else {
		// expend the clicked feedback item
		clickedEl.closest(".feedback").classList.toggle("feedback--expand");
	}
};

feedbackListEl.addEventListener("click", clickHandler);

// MODERAN FETCH
const fetchGetData = async () => {
	try {
		const response = await fetch(`${BASE_API_URL}/feedbacks`);
		const data = await response.json();
		// remove spinner
		spinnerEL.remove();
		// iterate over each element in feedbacks array and render it in list
		data.feedbacks.map((feedbackItem) => renderFeedbackItems(feedbackItem));
	} catch (error) {
		feedbackListEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
	}
};
fetchGetData();

// TRADITIONAL FETCH
//fetch(`${BASE_API_URL}/feedbacks`)
//	.then((response) => response.json())
//	.then((data) => {
//		// remove spinner
//		spinnerEL.remove();
//		// iterate over each element in feedbacks array and render it in list
//		data.feedbacks.map((feedbackItem) => renderFeedbackItems(feedbackItem));
//	})
//	.catch((error) => {
//		feedbackListEl.textContent = `Failed to fetch feedback items. Error message: ${error.message}`;
//	});

// ***	HASHTAG LIST COMPONENT *** *** IIFE
//
(() => {
	const clickHandler = (event) => {
		const clickedEl = event.target;
		// stop function if click happened in list, but outside buttons
		if (clickedEl.className === "hashtags") return;
		// extract company name
		const companyNameFromHashtag = clickedEl.textContent
			.substring(1)
			.toLowerCase()
			.trim();

		// iterate over each feedback item in the list
		feedbackListEl.childNodes.forEach((childNode) => {
			// stop this iteration if it is a text node
			if (childNode.nodeType === 3) return;
			// extract company name
			const companyNameFromFeedbackItem = childNode
				.querySelector(".feedback__company")
				.textContent.toLowerCase()
				.trim();

			// remove feedback item from list if company names are not equal
			if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
				childNode.remove();
			}
		});
	};
	hashtagsEl.addEventListener("click", clickHandler);
})();
