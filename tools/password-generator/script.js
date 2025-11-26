(function () {

    "use strict";


    // ===============
    function randomInit(maxValue) {
        if (maxValue <= 0) {
            return 0;
        }

        const maxUint = 0x100000000;
        const limit = Math.floor(maxUint / maxValue) * maxValue;
        const array = new Uint32Array(1);
        let r;

        do {
            crypto.getRandomValues(array);
            r = array[0];
        } while (r >= limit);
        return r % maxValue;
    }


    // ===============
    function shuffle(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j = randomInit(i + 1);

            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;

        }

        return array;
    }


    const similar = new Set(["l", "I", "1", "O", "0"]);
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const lower = "abcdefghijklmnopqrstuvwxyz".split("");
    const digits = "0123456789".split("");
    const symbols = "!@#$%^&*()-_=+[]{};:,.?/~\\\\|<>".split("");


    function filterSimilar(arr, avoidSimilar) {
        if (!avoidSimilar) {
            return arr;
        }

        return arr.filter(item => !similar.has(item));
    }


    function preparePools(options) {

        const upperPool = filterSimilar(upper, options.avoidSimilar);
        const lowerPool = filterSimilar(lower, options.avoidSimilar);
        const digitPool = filterSimilar(digits, options.avoidSimilar);
        const symbolPool = options.includeSymbols ? filterSimilar(symbols, options.avoidSimilar) : [];

        let fullPool = [
            ...upperPool, ...lowerPool, ...digitPool, ...symbolPool
        ]

        if (fullPool.length === 0) {
            fullPool = [...lower];
        }

        const must = [];


        if (options.requireEach) {
            if (upperPool.length) must.push(upperPool[randomInit(upperPool.length)]);
            if (lowerPool.length) must.push(lowerPool[randomInit(lowerPool.length)]);
            if (digitPool.length) must.push(digitPool[randomInit(digitPool.length)]);
            if (symbolPool.length) must.push(symbolPool[randomInit(symbolPool.length)]);
        }

        return {
            upperPool, lowerPool, digitPool, symbolPool, fullPool, must
        }

    }


    function generatePassword(options) {

        const {
            upperPool, lowerPool, digitPool, symbolPool, fullPool, must
        } = preparePools(options);

        const remaining = Math.max(options.length - must.length, 0);
        const result = [...must];
        for (let i = 0; i < remaining; i++) {
            const randomChar = fullPool[randomInit(fullPool.length)];
            result.push(randomChar);
        }
        shuffle(result);

        for (let i = 2; i < result.length; i++) {
            const a = result[i];
            const b = result[i - 1];
            const c = result[i - 2];

            if (a === b && a === c) {
                let replacement;

                do {
                    replacement = fullPool[randomInit(fullPool.length)];
                } while (replacement === a);

                result[i] = replacement;
            }
        }

        return result.join("");

    }

    // ============================================================
    // =============== РАБОТА С ИНТЕРФЕЙСОМ (DOM) =================
    // ============================================================

    const elPassword = document.getElementById("password");
    const elPasswordStat = document.getElementById("password_stat");
    const btnGenerate = document.getElementById("btn_generate");
    const btnCopy = document.getElementById("btn_copy");
    const elLength = document.getElementById("opt_length");
    const elLengthLabel = document.getElementById("length_label");
    const elSymbols = document.getElementById("opt_symbols");
    const elAvoid = document.getElementById("opt_avoid");
    const elRequire = document.getElementById("opt_require");
    const toast = document.getElementById("toast");


    // Храним последний пароль
    let lastPassword = "";

    // Получаем настройки пользователя
    function currentOptions() {
        return {
            length: parseInt(elLength.value, 10) || 20,
            includeSymbols: elSymbols.checked,
            avoidSimilar: elAvoid.checked,
            requireEach: elRequire.checked
        }
    }

    // Обновляем значение длины возле range
    function updateLengthLabel() {
        elLengthLabel.textContent = String(elLength.value);
    }

    // Обновляем значение длины в блок с паролем
    function updatePasswordStat() {
        elPasswordStat.textContent = `длина: ${lastPassword.length}`;
    }

    // Генерируем пароль
    function doGenerate() {
        const options = currentOptions();
        const pwd = generatePassword(options);
        lastPassword = pwd;
        elPassword.textContent = pwd;
        updatePasswordStat();
        btnCopy.disabled = pwd.length === 0;
    }


    // Функция уведомления о копировании
    // todo - нужно будет убрать стили из js
    function showToast(message, success = true) {
        toast.textContent = message;

        toast.style.borderColor = success
            ? "rgba(0, 114, 79, 0.6)"
            : "rgba(239, 68, 68, 0.6)";

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 1600);
    }


    // Делаем копию
    // todo - нужно будет убрать стили из js
    async function doCopy() {
        if (!lastPassword) {
            return;
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(lastPassword);
            } else {
                const ta = document.createElement("textarea");
                ta.value = lastPassword;
                ta.setAttribute("readonly", "");
                ta.style.opacity = "0";
                ta.style.position = "fixed";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                showToast("Пароль скопирован", true);
            }
        } catch {
            showToast("Не удалось скопировать", false);
        }
    }

    elLength.addEventListener('input', updateLengthLabel);
    btnGenerate.addEventListener('click', doGenerate);
    btnCopy.addEventListener('click', doCopy);


    updateLengthLabel();
    doGenerate()


})();