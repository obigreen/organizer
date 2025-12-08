(function () {
    "use strict";


    const textarea = document.getElementById("texttools_input");
    const toolbarButtons = document.querySelectorAll(".texttools_btn");
    const charsCounter = document.getElementById("texttools_chars");
    const linesCounter = document.getElementById("texttools_lines");


    // 2. СОСТОЯНИЕ ФИЛЬТРОВ (пока пустое)
    const state = {
        upper: false,
        lower: false,
        spacer: false,
        layout: false,
    }

    // 3. ПУСТАЯ applyFilters() – добавим позже
    function applyFilters(text) {

        let result = text;

        if (state.upper) {
            result = applyUpper(result)
        }
        if (state.lower) {
            result = applyLower(result);
        }
        // if (state.spacer) {
        //     result = applySpacer(result);
        // }
        if (state.layout) {
            result = applyLayout(result);
        }

        return result;
    }

    function applyUpper(text) {
        return text.toUpperCase();
    }

    function applyLower(text) {
        return text.toLowerCase();
    }

    // function applySpacer(text) {
    //
    //
    //     // +++
    //     return text.split("\n").map(line =>
    //         line.split("").join(" ")
    //     ).join("\n");
    //
    //
    //     // return text
    //     //     .split("\n")
    //     //     .map(line => {
    //     //         // убираем все пробельные символы внутри строки
    //     //         const compact = line.replace(/\s+/g, "");
    //     //         // вставляем один пробел между каждым символом
    //     //         return compact.split("").join(" ");
    //     //     })
    //     //     .join("\n");
    // }






    function applyLayout(text) {
        // Карта RU → EN
        const ru = "ёйцукенгшщзхъфывапролджэячсмитьбю";
        const en = "`qwertyuiop[]asdfghjkl;'zxcvbnm,.";

        const mapRuToEn = {};
        // en → ru
        const mapEnToRu = {};

        for (let i = 0; i < ru.length; i++) {
            mapRuToEn[ru[i]] = en[i];
        }
        for (let i = 0; i < en.length; i++) {
            mapEnToRu[en[i]] = ru[i];
        }

        // Для заглавных букв — такие же пары
        for (let i = 0; i < ru.length; i++) {
            mapRuToEn[ru[i].toUpperCase()] = en[i].toUpperCase();
            mapEnToRu[en[i].toUpperCase()] = ru[i].toUpperCase();
        }

        let result = "";

        for (const ch of text) {
            if (mapRuToEn[ch]) {
                result += mapRuToEn[ch]; // RU → EN
            } else if (mapEnToRu[ch]) {
                result += mapEnToRu[ch]; // EN → RU
            } else {
                result += ch; // символ без пары (пробел, цифра, знак)
            }
        }

        return result;
    }



    // 4. ОБНОВЛЕНИЕ СЧЁТЧИКОВ (добавим позже)
    function updateCounters() {

        const text = textarea.value;

        // Вариант семантики
        // charsCounter.textContent = `Symbols: ${text.length}`;

        // ver 2, без подсчета строк как символов
        const visibleChars = text.replace(/\n/g, "").length;
        charsCounter.textContent = `Symbols: ${visibleChars}`;


        const lines = text.split("\n").length;
        linesCounter.textContent = "Lines" + ": " + lines;


    }

    // 5. ПРИМЕНИТЬ ФИЛЬТРЫ К ТЕКУЩЕМУ ТЕКСТУ
    function applyCurrentText() {
        const raw = textarea.value;
        const processed = applyFilters(raw);
        textarea.value = processed;
        updateCounters()
    }

    // 6. ОБРАБОТЧИКИ СОБЫТИЙ (добавим позже)
    textarea.addEventListener("paste", (e) => {
        setTimeout(() => {
            if (state.layout) {
                applyCurrentText();
            }
        }, 0);
    });

    function skipTextareaSymbols() {

        // textarea.value = textarea.value.replace(/^\s+|\s+$/g, "");
        // Тоже самое только .trim
        textarea.value = textarea.value.trim();
    }

    toolbarButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            const action = btn.dataset.action;
            toggleFilter(action)
        })
    })

    skipTextareaSymbols()
    updateCounters();

    function toggleFilter(action) {

        if (action === "upper") {
            state.upper = !state.upper;
            if (state.upper) {
                state.lower = false
            }
        }

        if (action === "lower") {
            state.lower = !state.lower;
            if (state.lower) {
                state.upper = false
            }
        }

        // if (action === "spacer") {
        //     state.spacer = !state.spacer;
        // }

        if (action === "layout") {
            state.layout = !state.layout;
        }


        applyCurrentText();
        updateToolbarUI()

    }


    function updateToolbarUI() {
        toolbarButtons.forEach(btn => {
            // уточнить за dataset
            const action = btn.dataset.action;


            // попробовать удалить && state.upper и тд
            const isActive =
                (action === "upper" && state.upper) || (action === "lower" && state.lower) || (action === "spacer" && state.spacer) || (action === "layout" && state.layout);


            // уточнить за all, toggle
            btn.classList.toggle("active", isActive);

        })
    }


})();