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
        return text;
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
    textarea.addEventListener("input", updateCounters);
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

        if (action === "spacer") {
            state.spacer = !state.spacer;
        }

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