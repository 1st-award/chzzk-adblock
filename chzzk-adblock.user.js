// ==UserScript==
// @name         Chzzk Adblock
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Chzzk Adblock
// @author       1st_award
// @match        https://chzzk.naver.com/live/*
// @match        https://chzzk.naver.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateURL    https://github.com/1st-award/chzzk-adblock/raw/main/chzzk-adblock.user.js
// @downloadURL  https://github.com/1st-award/chzzk-adblock/raw/main/chzzk-adblock.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const DEBUG_MSG = false;
    const AD_BLOCK = true;
    const DONATE_BLOCK = true
    const DONATE_SVG = `<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M256 416c114.9 0 208-93.1 208-208S370.9 0 256 0 48 93.1 48 208s93.1 208 208 208zM233.8 97.4V80.6c0-9.2 7.4-16.6 16.6-16.6h11.1c9.2 0 16.6 7.4 16.6 16.6v17c15.5.8 30.5 6.1 43 15.4 5.6 4.1 6.2 12.3 1.2 17.1L306 145.6c-3.8 3.7-9.5 3.8-14 1-5.4-3.4-11.4-5.1-17.8-5.1h-38.9c-9 0-16.3 8.2-16.3 18.3 0 8.2 5 15.5 12.1 17.6l62.3 18.7c25.7 7.7 43.7 32.4 43.7 60.1 0 34-26.4 61.5-59.1 62.4v16.8c0 9.2-7.4 16.6-16.6 16.6h-11.1c-9.2 0-16.6-7.4-16.6-16.6v-17c-15.5-.8-30.5-6.1-43-15.4-5.6-4.1-6.2-12.3-1.2-17.1l16.3-15.5c3.8-3.7 9.5-3.8 14-1 5.4 3.4 11.4 5.1 17.8 5.1h38.9c9 0 16.3-8.2 16.3-18.3 0-8.2-5-15.5-12.1-17.6l-62.3-18.7c-25.7-7.7-43.7-32.4-43.7-60.1.1-34 26.4-61.5 59.1-62.4zM480 352h-32.5c-19.6 26-44.6 47.7-73 64h63.8c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8h63.8c-28.4-16.3-53.3-38-73-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z"></path></g>`

    if (DEBUG_MSG) console.log("[Chzzk Blocker] Start Chzzk Ads Remover");
    if (AD_BLOCK) removeAdvertise();
    if (DONATE_BLOCK) removeDonateChat();

    function removeAdvertise() {
        setInterval(() => {
            const advertise = document.getElementsByClassName('webplayer-internal-core-ad-ui wpc-full wpc-pos-abs wpc-dis-hid')[0];
            const [video, ads] = document.querySelectorAll('video');
            if (advertise !== undefined && advertise.style.display === "block") {
                // Detect Advertisement
                if (ads.paused === false) {
                    if (DEBUG_MSG) console.log("[Chzzk Blocker] Paued Ads.");
                    ads.pause();
                    if (DEBUG_MSG) console.log("[Chzzk Blocker] Detect Ads. Remove");
                    advertise.style.display = "none"
                    if (DEBUG_MSG) console.log("[Chzzk Blocker] Start Video.");
                    video.play();
                }
            }
        }, 50);
    }

    function sleep(ms) {
        /**
        * 비동기 sleep
        */
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getContainer() {
        /**
        * 체팅 div가 들어가는 최상위 container를 찾는 함수
        * 10ms 간격으로 container를 탐색
        */
        while (true) {
            const container = document.querySelector('#layout-body');
            if (container !== null) {
                if (DEBUG_MSG) console.log("[Chzzk Blocker] Detect Container");
                return container;
            }
            await sleep(10);
        }
    }

    function removeDonateChat() {
        /**
        * 체팅창에 도내이션 출력을 제거하는 함수
        * 체팅창 container에 변경이 감지되면 이벤트가 도네이션 이벤트인지 확인
        * 도네이션 이벤트면 하위 요소와 스타일을 제거
        */
        let runDonateBlock = GM_getValue("blockDonation", true);
        let switchText = (runDonateBlock === true) ? "꺼짐" : "켜짐";
        if (DEBUG_MSG) {
            console.log("[Chzzk Blocker] Run Chat");
            console.log(runDonateBlock, switchText);
        }
        const chatControllerButtonObserver = new MutationObserver((mutations) => {
            // button 변경 감지 이벤트
            mutations.forEach((mutation) => {
                const expanded = mutation.target.getAttribute("aria-expanded");
                if (expanded === "true") {
                    // 도네이션 보기/안보기 버튼 생성
                    const cloneListDiv = mutation.target.parentNode.childNodes[1].childNodes[0].cloneNode(true);
                    const button = cloneListDiv.childNodes[0];
                    const [label, text] = button.childNodes;
                    const [labelImg, title] = label.childNodes;
                    labelImg.innerHTML = DONATE_SVG;
                    labelImg.setAttribute("viewBox", "0 0 512 512");
                    labelImg.setAttribute("fill", "#959DAE");
                    labelImg.style.padding = "0px 5px 0px 6px";
                    labelImg.style.width = "15px";
                    title.nodeValue = "도네이션";
                    text.innerHTML = `<strong>${switchText}</strong>`;
                    button.addEventListener("click", () => {
                        switchText = (switchText === "켜짐") ? "꺼짐" : "켜짐";
                        text.innerHTML = `<strong>${switchText}</strong>`;
                        if (switchText === "켜짐") {
                            runDonateBlock = false;
                        } else {
                            runDonateBlock = true;
                        }
                        GM_setValue("blockDonation", runDonateBlock);
                        console.log(runDonateBlock, switchText);
                    });
                    mutation.target.parentNode.childNodes[1].appendChild(cloneListDiv);
                }
            });
        });
        const containerObserver = new MutationObserver((mutations) => {
            // container 변경 감지 이벤트
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    if (mutation.addedNodes[0]?.classList?.length === 2 && mutation.addedNodes[0]?.classList[1]?.includes("live_chatting_list_donation") && runDonateBlock === true) {
                        // 도네이션 div 탐색 시 실행 코드
                        if (DEBUG_MSG) console.log("[Chzzk Blocker] Detect Donation");
                        const donation = mutation.addedNodes[0];
                        // 치지직에서 체팅을 remove()하고 있으므로 하위요소와 스타일만 제거하여 지운것처럼 위장
                        donation.innerHTML = "";
                        donation.style.padding = "0";
                    }
                    if (mutation.addedNodes[0]?.classList?.length === 1 && mutation.addedNodes[0]?.classList[0]?.includes("live_chatting_list_item")) {
                        // 체팅 div 탐색 시 실행 코드
                        if (DEBUG_MSG) console.log("[Chzzk Blocker] Detect Chat");
                    }
                    if (mutation.addedNodes[0]?.classList?.length === 1 && mutation.addedNodes[0].classList[0]?.includes("live_chatting_list_containe")) {
                        // 채팅 옆에있는 더보기 버튼이 활성화 되면 도네이션 보이기 버튼 생성
                        const button = mutation.addedNodes[0].parentNode.childNodes[0].childNodes[2].childNodes[0];
                        if (DEBUG_MSG) console.log(button);
                        chatControllerButtonObserver.disconnect();
                        chatControllerButtonObserver.observe(button, { attributes: true });
                    }
                }});
        });
        const observerConfig = { attributes: true, childList: true, subtree: true };
        getContainer().then((container) => {
            if (DEBUG_MSG) console.log(container);
            containerObserver.observe(container, observerConfig);
        });
    }
})();
