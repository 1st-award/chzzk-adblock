// ==UserScript==
// @name         Chzzk Adblock
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Chzzk Adblock
// @author       1st_award
// @match        https://chzzk.naver.com/*
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
    const DONATE_SVG = `<path d="M234.666667,341.333333 C234.666667,364.897483 215.564149,384 192,384 C168.435851,384 149.333333,364.897483 149.333333,341.333333 L234.666667,341.333333 M192,7.10542736e-15 C109.44,7.10542736e-15 42.6666667,76.3733333 42.6666667,170.666667 L42.6666667,219.52 L1.42108547e-14,341.333333 L106.666667,341.333333 C106.666667,388.461632 144.871701,426.666667 192,426.666667 C239.128299,426.666667 277.333333,388.461632 277.333333,341.333333 L384,341.333333 L341.333333,219.52 L341.333333,176.853333 C341.333333,96 294.186667,21.9733333 225.066667,6.18666667 C214.336364,2.79014004 203.232451,0.712633806 192,7.10542736e-15 Z M60.16,298.666667 L82.9866667,234.666667 L85.3333333,226.773333 L85.3333333,170.666667 C85.3333333,100.053333 133.12,42.6665446 192,42.6665446 C199.693665,42.6542739 207.3598,43.5856735 214.826667,45.44 C262.613333,57.1733333 298.666667,113.28 298.666667,175.786667 L298.666667,226.773333 L301.013333,233.6 L323.84,298.666667 L60.16,298.666667 Z"> </path>`

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
                    labelImg.setAttribute("viewBox", "0 0 415 415");
                    labelImg.setAttribute("fill", "#959DAE");
                    labelImg.style.padding = "0px 5px 0px 6px";
                    labelImg.style.width = "15px";
                    // title.innerHTML = `도네이션/구독알람 <strong>${switchText}</strong>`;
                    title.innerHTML = `도네이션/구독 알람`;
                    text.innerHTML = `<strong>${switchText}</strong>`;
                    button.addEventListener("click", () => {
                        switchText = (switchText === "켜짐") ? "꺼짐" : "켜짐";
                        text.innerHTML = `<strong>${switchText}</strong>`;
                        // title.innerHTML = `도네이션 <strong>${switchText}</strong>`;
                        title.innerHTML = `도네이션/구독 알람`;
                        if (switchText === "켜짐") {
                            runDonateBlock = false;
                        } else {
                            runDonateBlock = true;
                        }
                        GM_setValue("blockDonation", runDonateBlock);
                        if (DEBUG_MSG) console.log(runDonateBlock, switchText);
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
                    if (mutation.addedNodes[0]?.classList?.length === 2 && mutation.addedNodes[0]?.classList[1]?.includes("live_chatting_list_subscription") && runDonateBlock === true) {
                        // 구독 div 탐색 시 실행 코드
                        if (DEBUG_MSG) console.log("[Chzzk Blocker] Detect Subscription");
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
