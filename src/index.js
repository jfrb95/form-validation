import "./style.css";

const log = console.log;
const postalCodes = require("postal-codes-js");

(function() {

    function kebabToCamel(str) {
        return str.replace(/-./g, x=>x[1].toUpperCase())
    };
    function toggleVisible(element) {
        const style = element.style;

        style.display === 'none'
            ? show(element)
            : hide(element);
    };
    function show(element) {
        element.style.display = '';
    }
    function hide(element) {
        element.style.display = 'none';
    }

    const form = document.querySelector("form");
    const submitButton = document.querySelector("button.submit");
    submitButton.addEventListener("click", (event) => {
        //event.preventDefault();
    });

    const formInputs = {};
    for (const inputWrapper of document.querySelectorAll("form div.input-wrapper")) {
        formInputs[kebabToCamel(inputWrapper.querySelector("input").id)] = {
            label: inputWrapper.querySelector("label"),
            input: inputWrapper.querySelector("input"),
            feedback: inputWrapper.querySelector(".validation-feedback")
        };
    };

    formInputs.email.input.addEventListener("blur", (event) => {
        const validity = formInputs.email.input.validity;
        const feedback = formInputs.email.feedback;
        let str = "";

        if (validity.typeMismatch) {
            str = "Please enter a valid email address.";
            show(formInputs.email.feedback);
        } else if (validity.valueMissing) {
            str = "This is a required field.";
            show(formInputs.email.feedback);
        } else {
            hide(formInputs.email.feedback);
        }
        formInputs.email.feedback.textContent = str;
    });

    /*
    formInputs.country.addEventListener("blur", (event) => {
        let validity = "";
        if (country.validity.tooShort) {
            validity = "Please enter a valid email address.";
        }
        country.setCustomValidity(validity);
        country.reportValidity();
    });
    */
})();
