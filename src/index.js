import "./style.css";

const log = console.log;
const postalCodes = require("postal-codes-js");

(function() {

    //helper functions
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
    function zipCodeMatchesCountryFormat(countryId, zipCode) {

        return typeof postalCodes.validate(countryId, zipCode) === 'string'
            ? false
            : true;
    }
    function passwordRequirements(password) {
        let validationResults = [];

        if (password.length < 8) {
            validationResults.push('Password must be at least 8 characters.');
        }
        if (!/[0-9]/.test(password)) {
            validationResults.push('Password must contain at least 1 number.');
        }
        if (!/[a-z]/.test(password)) {
            validationResults.push('Password must contain at least 1 lower case character.');
        }
        if (!/[A-Z]/.test(password)) {
            validationResults.push('Password must contain at least 1 upper case character.');
        }
        
        return validationResults;
    }        
    function clearElement(element) {
        element.replaceChildren();
    }

    //validation functions
    function validateEmail() {
        const validity = formInputs.email.input.validity;
        const feedback = formInputs.email.feedback;
        let str = "";

        if (validity.valueMissing) {
            str = "This is a required field.";
            show(feedback);
        } else if (validity.typeMismatch) {
            str = "Please enter a valid email address.";
            show(feedback);
        } else {
            hide(feedback);
        }
        feedback.textContent = str;
    }
    function validateCountry() {
        const validity = formInputs.country.input.validity;
        const feedback = formInputs.email.feedback;
        let str = '';

        if (validity.valueMissing) {
            str = "This is a required field.";
            show(feedback);
        } else {
            hide(feedback);
        }
    }
    function validateZipCode() {
        const validity = formInputs.zipCode.input.validity;
        const feedback = formInputs.zipCode.feedback;
        let str = "";

        const countryId = document.querySelector("#country").value;
        const zipCodeValue = document.querySelector("#zip-code").value;

        if (validity.valueMissing) {
            str = "This is a required field.";
            show(feedback);
        } else if (!zipCodeMatchesCountryFormat(countryId, zipCodeValue)) {
            str = "Please enter a valid zip code for your country.";
            show(feedback);
        } else {
            hide(feedback);
        }
        feedback.textContent = str;
    }
    function validatePassword() {
        const validity = formInputs.password.input.validity;
        const feedback = formInputs.password.feedback;

        const passwordValue = document.querySelector("#password").value;
        let str = "";

        if (validity.valueMissing) {
            str = "This is a required field.";
            clearElement(feedback);
            feedback.textContent = str;
            show(feedback);
        } else if (passwordRequirements(passwordValue).length) {
            clearElement(feedback);
            for (const requirement of passwordRequirements(passwordValue)) {
                const newP = document.createElement('p');
                newP.textContent = requirement;
                feedback.appendChild(newP);
            }
            show(feedback);
        } else {
            clearElement(feedback);
            feedback.textContent = str;
            hide(feedback);
        }
    }
    function validateConfirmPassword() {
        const validity = formInputs.confirmPassword.input.validity;
        const feedback = formInputs.confirmPassword.feedback;

        const passwordValue = document.querySelector("#password").value;
        const confirmPasswordValue = document.querySelector("#confirm-password").value;
        let str = "";

        if (validity.valueMissing) {
            str = 'This is a required field.';
            show(feedback);
        } else if (passwordValue !== confirmPasswordValue) {
            str = 'Passwords must match.';
            show(feedback);
        } else {
            hide(feedback);
        }
        feedback.textContent = str;
    }

    const form = document.querySelector("form");
    const submitButton = document.querySelector("button.submit");
    submitButton.addEventListener("click", (event) => {
        //this function can be cleaned up
        //ideally this would show which field(s) are invalid.
        //  this would be difficult to implement at this stage
        //  one way to avoid this would be to make each element
        //  in javascript and deal with it there rather than dom.
        //  Then, an input element would have a method to validate itself
        //  so that it could be easy to call a specific validation
        //  for a specific element elsewhere
        event.preventDefault();
        let formValid = true;
        for (const inputWrapper of document.querySelectorAll("form div.input-wrapper")) {
            if (!inputWrapper.querySelector("input, select").checkValidity()) {
                log(kebabToCamel(inputWrapper.querySelector("input, select").id));
                log("Form is invalid and has not been submitted. Please check the error messages.");
                return;
            }
        }
        log("Form is valid and has been submitted, thank you.");
    });

    const formInputs = {};
    for (const inputWrapper of document.querySelectorAll("form div.input-wrapper")) {
        formInputs[kebabToCamel(inputWrapper.querySelector("input, select").id)] = {
            label: inputWrapper.querySelector("label"),
            input: inputWrapper.querySelector("input, select"),
            feedback: inputWrapper.querySelector(".validation-feedback")
        };
    };

    formInputs.email.input.addEventListener("blur", validateEmail);
    formInputs.country.input.addEventListener("blur", validateCountry);
    formInputs.zipCode.input.addEventListener("blur", validateZipCode);
    formInputs.password.input.addEventListener('blur', validatePassword);
    formInputs.confirmPassword.input.addEventListener('blur', validateConfirmPassword);
})();
