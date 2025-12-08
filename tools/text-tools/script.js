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
        charsCounter.textContent = `Symbols: ${text.length}`;

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
        textarea.addEventListener("input",  updateCounters);

        toolbarButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                // здесь позже появится toggleFilter()
            })
        })


    updateCounters();

})();