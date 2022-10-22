/* Please, don't do shit-code  */
Element.prototype.closest || (Element.prototype.closest = function(t) { for (var e = this; e;) { if (e.matches(t)) return e;e = e.parentElement } return null });

Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);

Object.assign || Object.defineProperty(Object, "assign", { enumerable: !1, configurable: !0, writable: !0, value: function(e) { "use strict"; if (null == e) throw new TypeError("Cannot convert first argument to object"); for (var t = Object(e), n = 1; n < arguments.length; n++) { var o = arguments[n]; if (null != o) for (var a = Object.keys(Object(o)), c = 0, b = a.length; c < b; c++) { var i = a[c], l = Object.getOwnPropertyDescriptor(o, i); void 0 !== l && l.enumerable && (t[i] = o[i]) } } return t } });

window.NodeList && !NodeList.prototype.forEach && (NodeList.prototype.forEach = Array.prototype.forEach);

function $$(e, o, t) { "function" != typeof o ? o = o || document : (t = o, o = document); var c = o.querySelectorAll(e); return c = Array.prototype.slice.call(o.querySelectorAll(e)), "function" == typeof t && c.forEach(function(e, o, c) { t(e, o, c) }), c }

// function addCss(r, s) { var a = function(r) { Object.assign(r.style, s) }; if (Array.isArray(r))
//         for (var n = r.length - 1; n >= 0; n--) a(r[n]);
//     else a(r) } 


// function getElementIndex(e) { for (var n = 0; e = e.previousElementSibling;) n++; return n }

function h_el(r) { return !!(Array.isArray(r) && r.length > 0) }

function debugging() { [].forEach.call($$("*"), function(n) { n.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16) }) }


function scrollToNextBlock({buttonSelector, nextBlockSelector}) {
	$$(buttonSelector)[0].addEventListener('click', () => {
		window.scrollTo({
			top: $$(nextBlockSelector)[0].offsetTop,
			behavior: "smooth"
		});
	})
}

function initSlider() {
	var swiper = new Swiper(".benefits__slider", {
		slidesPerView: 3,
		loop: true,
		pagination: {
			el: ".swiper-pagination",
			type: "fraction",
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});
}

function resetPopups() {
	$$('.popup', popup => {
		if (popup.classList.contains('popup-enabled')) {
			popup.classList.remove('popup-enabled')
			popup.classList.add('popup-disabled')
		}
	});
}

function openPopup(popupSelector) {
	resetPopups();
	$$(popupSelector)[0].classList.contains('popup-disabled') && $$(popupSelector)[0].classList.remove('popup-disabled');
	$$(popupSelector)[0].classList.add('popup-enabled');
}

function onButtonClickOpenPopup() {
	$$('.popup_open', btn => btn.addEventListener('click', () => openPopup('.popup_form')))
}

function closePopup() {
	$$('.popup__close', btn => btn.addEventListener('click', () => {
		btn.closest('.popup').classList.add('popup-disabled')
		setTimeout(() => {
			btn.closest('.popup').classList.remove('popup-enabled') 
		}, 200);
	}))
}

// form
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePhone = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    );
};

function checkFieldErrors({input, value, fieldName}) {
	const parentLabel = input.closest('label');
	let haveErrors = false;
	console.log('value:', value, fieldName);

	if (value === "") {
		haveErrors = true;
		!parentLabel.classList.contains('error') && parentLabel.classList.add('error');
	} else if (fieldName === "email") {
		validateEmail(value) ? parentLabel.classList.contains('error') && parentLabel.classList.remove('error') : !parentLabel.classList.contains('error') && parentLabel.classList.add('error');
		haveErrors = parentLabel.classList.contains('error');
		if (haveErrors === true) return haveErrors;
	} else if (fieldName === "phone") {
		validatePhone(value) ? parentLabel.classList.contains('error') && parentLabel.classList.remove('error') : !parentLabel.classList.contains('error') && parentLabel.classList.add('error');
		haveErrors = parentLabel.classList.contains('error');
		if (haveErrors === true) return haveErrors;
	} else {
		haveErrors = false;
		parentLabel.classList.contains('error') && parentLabel.classList.remove('error');
	}
	
	return haveErrors;
}

function checkFormValidation(data) {
	Object.entries(data).forEach(([key, value]) => {
		if (key === 'price') return;
		!checkFieldErrors({
			input: document.getElementsByName(key)[0],
			value: value,
			fieldName: key
		});
	});

	return Object.entries(data).every(([key, value]) => {
		if (key === 'price') return true;
		const validated = !checkFieldErrors({
			input: document.getElementsByName(key)[0],
			value: value,
			fieldName: key
		});

		return validated === true;
	});
}

function onInput() {
	$$('input', input => {
		input.addEventListener('input', e => {
			checkFieldErrors({
				input: input,
				value: e.target.value,
				fieldName: e.target.name
			});
		})
	})

	$$('select', input => {
		input.addEventListener('change', e => {
			checkFieldErrors({
				input: input,
				value: e.target.value,
				fieldName: e.target.name
			});
		})
	})
}

function selectsCheck() {
	const [timeFrom, timeTo] = $$('.form__select');
	let timeFromPrevValue = timeFrom.value;
	let timeToPrevValue = timeTo.value;
	const priceInput = $$('.form__priceInput')[0]
	const formPrice = $$('.form__price span')[0]
	
	timeFrom.addEventListener('change', e => {
		if (timeTo.value === '') return; 
		if (Number(timeFrom.value) >= Number(timeTo.value)) {
			timeFrom.value = timeFromPrevValue;
			return;
		}
		priceInput.value = Number(priceInput.dataset.price) * (Number(timeTo.value) - Number(timeFrom.value));
		formPrice.innerText = priceInput.value + '$';
		timeFromPrevValue = timeFrom.value;
	})
	
	timeTo.addEventListener('change', e => {
		if (Number(timeFrom.value) >= Number(timeTo.value)) {
			timeTo.value = timeToPrevValue
		}
		priceInput.value = Number(priceInput.dataset.price) * (Number(timeTo.value) - Number(timeFrom.value));
		formPrice.innerText = priceInput.value + '$';
		timeToPrevValue = timeTo.value;
	})
}

function getFormData() {
	const form = $$('.form')[0];
	const formData = new FormData(form);
	const [timeFrom, timeTo] = $$('.form__select');

	formData.append('timeFrom', timeFrom.value)
	formData.append('timeTo', timeTo.value)
	return Object.fromEntries(formData);
}

function sendFormData() {
	const button = $$('.form__button')[0]
	
	button.addEventListener('click', () => {
		const data = getFormData();
		const formValidation = checkFormValidation(data);

		if (formValidation === true) {
			fetch("send.php", {
				method: 'POST', 
				body: JSON.stringify({ data })
			})
			.then((data) => {
				if (data.status === "success") {
					openPopup('.popup_success')
				} else if(data.status === "error") {
					openPopup('.popup_error')
				}
			})
		}
	})
}

onInput()
selectsCheck()
sendFormData()
onButtonClickOpenPopup();
closePopup();
initSlider();
scrollToNextBlock({
	buttonSelector: '.about__more', 
	nextBlockSelector: '.offer'
});