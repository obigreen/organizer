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

        const remaing = Math.max(options.length - must.length, 0);
        const result = [...must];
        for (let i = 0; i < remaing; i++) {
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
    }





})