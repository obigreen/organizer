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


    }


})