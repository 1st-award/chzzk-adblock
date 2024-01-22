// ==UserScript==
// @name         Chzzk Adblock
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chzzk Adblock
// @author       1st_award
// @match        https://chzzk.naver.com/live/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://github.com/1st-award/chzzk-adblock/raw/main/chzzk-adblock.js
// @downloadURL  https://github.com/1st-award/chzzk-adblock/raw/main/chzzk-adblock.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const DEBUG_MSG = false;
    const AD_BLOCK = true;

    if (AD_BLOCK) removeAdvertise();
    if (DEBUG_MSG) console.log("Start Chzzk Ads Remover");

    function removeAdvertise() {
        let isRemove = false;
        const run = setInterval(() => {
            const advertise = document.getElementsByClassName('webplayer-internal-core-ad-ui wpc-full wpc-pos-abs wpc-dis-hid')[0];
            const [video, ads] = document.querySelectorAll('video');
            if (advertise !== undefined && advertise.style.display === "block") {
                // Detect Advertisement
                if (ads.paused === false) {
                    if (DEBUG_MSG) console.log("Paued Ads.");
                    ads.pause();
                    if (DEBUG_MSG) console.log("Detect Ads. remove");
                    advertise.style.display = "none"
                    if (DEBUG_MSG) console.log("Start Video.");
                    video.play();
                    if (DEBUG_MSG) console.log("Exit Remover");
                    clearInterval(run);
                }
            }
        }, 50);
    }
})();