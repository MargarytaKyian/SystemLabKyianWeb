document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("authorization-form");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const submitBtn = document.getElementById("submit-btn");
    const showPassword = document.getElementById("show-password");
    const resetBtn = document.getElementById("reset-btn");

    const validationRules = {
        "first-name": (value) => /^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґa-zA-Z'-]*$/.test(value.trim()) && !/\s/.test(value),
        "last-name": (value) => /^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґa-zA-Z'-]*$/.test(value.trim()) && !/\s/.test(value),
        email: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim()) && !/\s/.test(value),
        password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(value.trim()) && !/\s/.test(value) && !/[^\w@$!%*?&]/.test(value),
        "confirm-password": (value) => password.value === value,
    };
    
    const errorMessages = {
        "first-name": {
            "pattern": "Ім'я повинно починатись з великої літери та містити тільки літери, апострофи, дефіси, без цифр.",
            "trim": "Ім'я не повинно містити пробіли на початку чи в кінці.",
            "space": "Ім'я не повинно містити пробіли в середині.",
            "length": "Ім'я повинно містити не менше 2 літер.",
        },
        "last-name": {
            "pattern": "Прізвище повинно починатись з великої літери та містити тільки літери, апострофи, дефіси, без цифр.",
            "trim": "Прізвище не повинно містити пробіли на початку чи в кінці.",
            "space": "Прізвище не повинно містити пробіли в середині.",
            "length": "Прізвище повинно містити не менше 2 літер.",
        },
        email: {
            "pattern": "Некоректний формат e-mail, має бути знак @.",
            "trim": "Електронна пошта не повинна містити пробіли на початку чи в кінці.",
            "latin": "Електронна пошта повинна містити латинські літери.",
            "space": "Електронна пошта не повинна містити пробіли в середині.",
        },
        password: {
            "minLength": "Пароль повинен бути не менше 8 символів та не більше 20.",
            "uppercase": "Пароль має містити хоча б одну велику літеру.",
            "lowercase": "Пароль має містити хоча б одну малу літеру.",
            "number": "Пароль має містити хоча б одну цифру.",
            "specialCharacter": "Пароль має містити хоча б один спеціальний символ.",
            "noSpaces": "Пароль не може містити пробілів.",
            "maxLength": "Пароль не може перевищувати 20 символів.",
            "trim": "Пароль не може містити пробіли на початку чи в кінці.",
            "latin": "Пароль повинен містити латинські літери.",
            "space": "Пароль не може містити пробіли в середині.",
            "invalidChars": "Пароль містить некоректні символи.",
        },
        "confirm-password": "Паролі не співпадають.",
    };
    
    const tooltips = {
        "first-name": "Заповніть це поле своїм ім'ям.",
        "last-name": "Заповніть це поле своїм прізвищем.",
        email: "Введіть дійсну адресу електронної пошти.",
        password: "Пароль повинен бути не менше 8 символів.",
        "confirm-password": "Повторіть введений пароль.",
    };
    
    const validateField = (field) => {
        const value = field.value.trim();
        const fieldId = field.id;
        const errorSpan = document.getElementById(`${fieldId}-error`);
    
        let isValid = true;
        let errorMessage = "";
    
        if (validationRules[fieldId]) {
    
            // Перевірка на пробіли на початку та в кінці
            if (field.value !== value) {
                isValid = false;
                errorMessage = errorMessages[fieldId].trim;
            }
    
            // Перевірка на пробіли всередині
            else if (/\s/.test(value) && !/^\s|\s$/.test(value)) {
                isValid = false;
                errorMessage = errorMessages[fieldId].space;
            }
    
            // Перевірка для first-name і last-name на мінімальну довжину (не менше 2 літер)
            if ((fieldId === "first-name" || fieldId === "last-name") && value.length < 2) {
                isValid = false;
                errorMessage = errorMessages[fieldId].length;
            }
    
            // Перевірка для email
            if (fieldId === "email") {
                if (!validationRules.email(value)) {
                    isValid = false;
                    errorMessage = errorMessages.email.pattern;
                } else if (!/[a-zA-Z]/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.email.latin;
                } else if (/\s/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.email.space;
                }
            }
    
            // Перевірка для first-name і last-name
            else if (fieldId === "first-name" && !validationRules["first-name"](value)) {
                isValid = false;
                errorMessage = errorMessages["first-name"].pattern;
            } else if (fieldId === "last-name" && !validationRules["last-name"](value)) {
                isValid = false;
                errorMessage = errorMessages["last-name"].pattern;
            }
    
            // Перевірка для пароля
            else if (fieldId === "password") {
                if (value.length < 8) {
                    isValid = false;
                    errorMessage = errorMessages.password.minLength;
                } else if (value.length > 20) {
                    isValid = false;
                    errorMessage = errorMessages.password.maxLength;
                } else if (!/[A-ZА-Я]/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.uppercase;
                } else if (!/[a-zа-я]/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.lowercase;
                } else if (!/\d/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.number;
                } else if (!/[!@#$%^&*]/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.specialCharacter;
                } else if (!/[a-zA-Z]/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.latin;
                } else if (/\s/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.noSpaces;
                } else if (/[^\w@$!%*?&]/.test(value)) {
                    isValid = false;
                    errorMessage = errorMessages.password.invalidChars;
                }
            }
    
            // Перевірка для confirm-password
            else if (fieldId === "confirm-password" && value !== password.value && password.value !== "") {
                isValid = false;
                errorMessage = errorMessages["confirm-password"];
            }
    
            // Перевірка для інших полів
            else if (!validationRules[fieldId](value)) {
                isValid = false;
                if (errorMessages[fieldId]) {
                    if (/\s/.test(value)) {
                        errorMessage = errorMessages[fieldId].space;
                    } else if (value.trim() === "") {
                        errorMessage = errorMessages[fieldId].trim;
                    } else {
                        errorMessage = errorMessages[fieldId].pattern;
                    }
                }
            }
    
            // Відображення помилки на основі перевірки
            if (field.dataset.touched) {
                errorSpan.style.display = isValid ? "none" : "block";
            }
    
            // Додавання класів для валідації
            field.classList.toggle("valid", isValid);
            field.classList.toggle("invalid", !isValid);
    
            if (errorMessage) {
                errorSpan.textContent = errorMessage;
            }
        }
    
        return isValid;
    };
      
    const handleFieldBlur = (event) => {
        event.target.dataset.touched = true;
        validateField(event.target);
    };

    const handleFieldFocus = (event) => {
        const tooltipText = tooltips[event.target.id];
        if (tooltipText) {
            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            tooltip.textContent = tooltipText;
            event.target.parentNode.appendChild(tooltip);
            event.target.addEventListener("blur", () => {
                tooltip.remove();
            }, { once: true });
        }
    };

    // Перевірка валідності форми
    const checkFormValidity = () => {
        const isFormValid = [...form.elements]
            .filter((el) => el.tagName === "INPUT" && el.type !== "checkbox")
            .every((el) => validateField(el));

        submitBtn.disabled = !isFormValid;
    };

    form.addEventListener("input", checkFormValidity);
    [firstName, lastName, email, password, confirmPassword].forEach((field) => {
        field.addEventListener("blur", handleFieldBlur);
        field.addEventListener("focus", handleFieldFocus);
    });

    showPassword.addEventListener("change", () => {
        const type = showPassword.checked ? "text" : "password";
        password.type = type;
        confirmPassword.type = type;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if ([...form.elements].every((el) => validateField(el))) {
            alert("Дякуємо за авторизацію! Усі дані валідні.");
            form.reset();
            submitBtn.disabled = true;
        }
    });

    resetBtn.addEventListener("click", () => {
        [...form.elements].forEach((el) => {
            el.classList.remove("valid", "invalid");
            el.removeAttribute("data-touched");
            const errorSpan = document.getElementById(`${el.id}-error`);
            if (errorSpan) errorSpan.style.display = "none";
        });
        submitBtn.disabled = true;
    });
});
