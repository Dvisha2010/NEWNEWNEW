/* =========================================================
   HOUSEMEMORY AI ASSISTANT
   Frontend Client
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const SUPABASE_FUNCTION_URL =
        "https://bbxqrgevfqrbfhvxojvs.supabase.co/functions/v1/housememory-ai";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_RTUqZHz4Ixaiela-gj2MFQ_A0UEdRYb";


    /* =====================================================
       STATE
       ===================================================== */

    let chatHistory = [];

    let isOpen = false;

    let isTyping = false;


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initializeHouseMemoryAI() {

        if (document.getElementById("housememory-ai")) {
            return;
        }

        injectStyles();

        createAssistant();

        attachEvents();

        showWelcomeMessage();

    }


    /* =====================================================
       CREATE ASSISTANT
       ===================================================== */

    function createAssistant() {

        const wrapper = document.createElement("div");

        wrapper.id = "housememory-ai";

        wrapper.innerHTML = `

            <!-- =========================================
                 FLOATING BUTTON
                 ========================================= -->

            <button
                class="hm-ai-button"
                id="hmAIButton"
                aria-label="Open HouseMemory AI"
            >

                <span class="hm-ai-orbit orbit-one"></span>

                <span class="hm-ai-orbit orbit-two"></span>

                <span class="hm-ai-spark">✦</span>

                <span class="hm-ai-button-icon">
                    ✦
                </span>

                <span class="hm-ai-pulse"></span>

            </button>


            <!-- =========================================
                 CHAT WINDOW
                 ========================================= -->

            <div
                class="hm-ai-window"
                id="hmAIWindow"
            >

                <!-- HEADER -->

                <div class="hm-ai-header">

                    <div class="hm-ai-header-left">

                        <div class="hm-ai-avatar">

                            <span>✦</span>

                            <div class="hm-ai-avatar-ring"></div>

                        </div>


                        <div class="hm-ai-title-area">

                            <div class="hm-ai-title">

                                HouseMemory AI

                                <span class="hm-ai-status-dot"></span>

                            </div>

                            <div class="hm-ai-subtitle">

                                Your home, understood.

                            </div>

                        </div>

                    </div>


                    <div class="hm-ai-header-actions">

                        <button
                            class="hm-ai-icon-button"
                            id="hmAIClear"
                            title="Clear conversation"
                        >
                            ↺
                        </button>

                        <button
                            class="hm-ai-icon-button"
                            id="hmAIClose"
                            title="Close"
                        >
                            ×
                        </button>

                    </div>

                </div>


                <!-- DECORATIVE LINE -->

                <div class="hm-ai-header-line">

                    <span></span>

                </div>


                <!-- MESSAGES -->

                <div
                    class="hm-ai-messages"
                    id="hmAIMessages"
                ></div>


                <!-- SUGGESTIONS -->

                <div
                    class="hm-ai-suggestions"
                    id="hmAISuggestions"
                >

                    <button
                        class="hm-ai-suggestion"
                        data-message="What maintenance tasks should I remember for my home?"
                    >

                        🔧 Maintenance

                    </button>


                    <button
                        class="hm-ai-suggestion"
                        data-message="How can I organise my household equipment?"
                    >

                        ⚙ Equipment

                    </button>


                    <button
                        class="hm-ai-suggestion"
                        data-message="How should I organise important household documents?"
                    >

                        ◈ Documents

                    </button>


                    <button
                        class="hm-ai-suggestion"
                        data-message="Give me some ideas for preserving memories of my home."
                    >

                        ✦ Memories

                    </button>

                </div>


                <!-- INPUT AREA -->

                <div class="hm-ai-input-area">

                    <div class="hm-ai-input-wrapper">

                        <textarea
                            id="hmAIInput"
                            class="hm-ai-input"
                            placeholder="Ask HouseMemory AI..."
                            rows="1"
                        ></textarea>


                        <button
                            id="hmAISend"
                            class="hm-ai-send"
                            aria-label="Send message"
                        >

                            <span>↑</span>

                        </button>

                    </div>


                    <div class="hm-ai-footer">

                        <span>
                            HouseMemory AI
                        </span>

                        <span class="hm-ai-footer-dot">
                            •
                        </span>

                        <span>
                            Powered by Gemini
                        </span>

                    </div>

                </div>

            </div>

        `;

        document.body.appendChild(wrapper);

    }


    /* =====================================================
       STYLES
       ===================================================== */

    function injectStyles() {

        if (document.getElementById("hm-ai-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "hm-ai-styles";

        style.textContent = `

        /* =================================================
           ROOT
           ================================================= */

        #housememory-ai {

            --hm-purple:
                #8b5cf6;

            --hm-blue:
                #5ee7ff;

            --hm-pink:
                #ec7dff;

            --hm-background:
                rgba(9, 8, 20, .92);

            --hm-border:
                rgba(255,255,255,.12);

            --hm-text:
                #f8f7ff;

            --hm-muted:
                #918da2;

            font-family:
                Inter,
                DM Sans,
                system-ui,
                sans-serif;

        }


        /* =================================================
           BUTTON
           ================================================= */

        .hm-ai-button {

            position: fixed;

            right: 30px;

            bottom: 30px;

            width: 68px;

            height: 68px;

            border: 1px solid
                rgba(255,255,255,.18);

            border-radius: 22px;

            background:
                linear-gradient(
                    135deg,
                    #7656ff,
                    #43dfff
                );

            color: white;

            cursor: pointer;

            z-index: 99990;

            display: flex;

            align-items: center;

            justify-content: center;

            box-shadow:
                0 20px 60px
                rgba(82,70,255,.35),

                inset 0 1px 1px
                rgba(255,255,255,.35);

            transition:
                transform .35s ease,
                box-shadow .35s ease;

            overflow: visible;

        }


        .hm-ai-button:hover {

            transform:
                translateY(-5px)
                scale(1.04);

            box-shadow:
                0 25px 80px
                rgba(82,70,255,.5);

        }


        .hm-ai-button-icon {

            font-size: 27px;

            z-index: 4;

            animation:
                hmFloat 3s ease-in-out infinite;

        }


        @keyframes hmFloat {

            0%,100% {
                transform:
                    translateY(0)
                    rotate(0deg);
            }

            50% {
                transform:
                    translateY(-3px)
                    rotate(8deg);
            }

        }


        /* =================================================
           PULSE
           ================================================= */

        .hm-ai-pulse {

            position: absolute;

            inset: -5px;

            border-radius: 25px;

            border:
                1px solid
                rgba(100,220,255,.4);

            animation:
                hmPulse 2.5s infinite;

        }


        @keyframes hmPulse {

            0% {
                opacity: .8;

                transform:
                    scale(1);
            }

            70% {
                opacity: 0;

                transform:
                    scale(1.35);
            }

            100% {
                opacity: 0;

                transform:
                    scale(1.35);
            }

        }


        /* =================================================
           ORBITS
           ================================================= */

        .hm-ai-orbit {

            position: absolute;

            border-radius: 50%;

            border:
                1px solid
                rgba(255,255,255,.3);

            pointer-events: none;

        }


        .orbit-one {

            width: 82px;

            height: 28px;

            transform:
                rotate(45deg);

            animation:
                hmOrbit 5s linear infinite;

        }


        .orbit-two {

            width: 76px;

            height: 24px;

            transform:
                rotate(-45deg);

            animation:
                hmOrbitReverse 6s linear infinite;

        }


        @keyframes hmOrbit {

            from {
                transform:
                    rotate(45deg);
            }

            to {
                transform:
                    rotate(405deg);
            }

        }


        @keyframes hmOrbitReverse {

            from {
                transform:
                    rotate(-45deg);
            }

            to {
                transform:
                    rotate(-405deg);
            }

        }


        .hm-ai-spark {

            position: absolute;

            top: -11px;

            right: -7px;

            font-size: 14px;

            animation:
                hmSpark 2s infinite;

        }


        @keyframes hmSpark {

            0%,100% {
                opacity: .3;

                transform:
                    scale(.7)
                    rotate(0deg);
            }

            50% {
                opacity: 1;

                transform:
                    scale(1.2)
                    rotate(20deg);
            }

        }


        /* =================================================
           WINDOW
           ================================================= */

        .hm-ai-window {

            position: fixed;

            right: 30px;

            bottom: 112px;

            width: 410px;

            max-width:
                calc(100vw - 30px);

            height: 610px;

            max-height:
                calc(100vh - 145px);

            background:
                linear-gradient(
                    145deg,
                    rgba(18,16,36,.97),
                    rgba(7,7,16,.97)
                );

            border:
                1px solid
                rgba(255,255,255,.13);

            border-radius: 30px;

            backdrop-filter:
                blur(35px);

            -webkit-backdrop-filter:
                blur(35px);

            box-shadow:
                0 40px 100px
                rgba(0,0,0,.55),

                0 0 80px
                rgba(100,80,255,.12),

                inset 0 1px 0
                rgba(255,255,255,.08);

            z-index: 99989;

            display: flex;

            flex-direction: column;

            overflow: hidden;

            opacity: 0;

            pointer-events: none;

            transform:
                translateY(25px)
                scale(.95);

            transition:
                opacity .35s ease,
                transform .45s
                cubic-bezier(.16,1,.3,1);

        }


        .hm-ai-window.open {

            opacity: 1;

            pointer-events: auto;

            transform:
                translateY(0)
                scale(1);

        }


        /* =================================================
           HEADER
           ================================================= */

        .hm-ai-header {

            padding:
                20px 20px 16px;

            display: flex;

            justify-content:
                space-between;

            align-items: center;

        }


        .hm-ai-header-left {

            display: flex;

            align-items: center;

            gap: 12px;

        }


        .hm-ai-avatar {

            width: 44px;

            height: 44px;

            border-radius: 14px;

            background:
                linear-gradient(
                    135deg,
                    #7556ff,
                    #52dfff
                );

            display: flex;

            align-items: center;

            justify-content: center;

            position: relative;

            box-shadow:
                0 8px 30px
                rgba(91,100,255,.3);

        }


        .hm-ai-avatar span {

            font-size: 20px;

            z-index: 2;

        }


        .hm-ai-avatar-ring {

            position: absolute;

            inset: -3px;

            border-radius: 17px;

            border:
                1px solid
                rgba(110,220,255,.5);

            animation:
                hmAvatarRing 3s
                linear infinite;

        }


        @keyframes hmAvatarRing {

            0%,100% {
                transform:
                    scale(1);

                opacity: .5;
            }

            50% {
                transform:
                    scale(1.12);

                opacity: 0;
            }

        }


        .hm-ai-title {

            font-size: 14px;

            font-weight: 700;

            color:
                var(--hm-text);

            display: flex;

            align-items: center;

            gap: 7px;

        }


        .hm-ai-status-dot {

            width: 7px;

            height: 7px;

            border-radius: 50%;

            background:
                #5dffb1;

            box-shadow:
                0 0 12px
                #5dffb1;

        }


        .hm-ai-subtitle {

            color:
                var(--hm-muted);

            font-size: 11px;

            margin-top: 4px;

        }


        .hm-ai-header-actions {

            display: flex;

            gap: 5px;

        }


        .hm-ai-icon-button {

            width: 32px;

            height: 32px;

            border: 0;

            border-radius: 10px;

            background:
                rgba(255,255,255,.05);

            color:
                #aaa6b8;

            cursor: pointer;

            font-size: 17px;

            transition: .25s;

        }


        .hm-ai-icon-button:hover {

            background:
                rgba(255,255,255,.1);

            color:
                white;

        }


        .hm-ai-header-line {

            height: 1px;

            background:
                rgba(255,255,255,.07);

            position: relative;

        }


        .hm-ai-header-line span {

            position: absolute;

            left: 20px;

            top: -1px;

            height: 2px;

            width: 80px;

            background:
                linear-gradient(
                    90deg,
                    #735cff,
                    #59e5ff
                );

            box-shadow:
                0 0 12px
                rgba(90,200,255,.5);

        }


        /* =================================================
           MESSAGES
           ================================================= */

        .hm-ai-messages {

            flex: 1;

            overflow-y: auto;

            padding:
                22px 18px;

            display: flex;

            flex-direction: column;

            gap: 14px;

            scrollbar-width: thin;

            scrollbar-color:
                rgba(255,255,255,.1)
                transparent;

        }


        .hm-ai-message {

            display: flex;

            animation:
                hmMessageIn .4s
                cubic-bezier(.16,1,.3,1);

        }


        @keyframes hmMessageIn {

            from {

                opacity: 0;

                transform:
                    translateY(12px)
                    scale(.97);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        .hm-ai-message.user {

            justify-content:
                flex-end;

        }


        .hm-ai-message.ai {

            justify-content:
                flex-start;

        }


        .hm-ai-bubble {

            max-width: 84%;

            padding:
                12px 14px;

            border-radius: 17px;

            font-size: 13px;

            line-height: 1.55;

        }


        .hm-ai-message.ai
        .hm-ai-bubble {

            background:
                rgba(255,255,255,.055);

            border:
                1px solid
                rgba(255,255,255,.08);

            color:
                #dedbe8;

            border-bottom-left-radius:
                5px;

        }


        .hm-ai-message.user
        .hm-ai-bubble {

            background:
                linear-gradient(
                    135deg,
                    #7657ff,
                    #4ca9ff
                );

            color:
                white;

            border-bottom-right-radius:
                5px;

            box-shadow:
                0 8px 25px
                rgba(90,90,255,.18);

        }


        .hm-ai-message-label {

            font-size: 9px;

            letter-spacing: 1.5px;

            text-transform: uppercase;

            color:
                #817c91;

            margin-bottom: 5px;

        }


        /* =================================================
           TYPING
           ================================================= */

        .hm-ai-typing {

            display: flex;

            gap: 5px;

            align-items: center;

            padding: 3px 2px;

        }


        .hm-ai-typing span {

            width: 6px;

            height: 6px;

            border-radius: 50%;

            background:
                #8d84a6;

            animation:
                hmTyping 1.2s
                infinite;

        }


        .hm-ai-typing span:nth-child(2) {

            animation-delay:
                .15s;

        }


        .hm-ai-typing span:nth-child(3) {

            animation-delay:
                .3s;

        }


        @keyframes hmTyping {

            0%,60%,100% {

                transform:
                    translateY(0);

                opacity: .4;

            }

            30% {

                transform:
                    translateY(-5px);

                opacity: 1;

            }

        }


        /* =================================================
           SUGGESTIONS
           ================================================= */

        .hm-ai-suggestions {

            display: flex;

            gap: 7px;

            overflow-x: auto;

            padding:
                0 17px 13px;

            scrollbar-width: none;

        }


        .hm-ai-suggestions::-webkit-scrollbar {

            display: none;

        }


        .hm-ai-suggestion {

            white-space: nowrap;

            border:
                1px solid
                rgba(255,255,255,.09);

            background:
                rgba(255,255,255,.035);

            color:
                #aaa6b8;

            padding:
                8px 11px;

            border-radius: 100px;

            font-size: 10px;

            cursor: pointer;

            transition: .25s;

        }


        .hm-ai-suggestion:hover {

            background:
                rgba(120,90,255,.14);

            border-color:
                rgba(120,100,255,.35);

            color:
                white;

        }


        /* =================================================
           INPUT
           ================================================= */

        .hm-ai-input-area {

            padding:
                13px 15px 15px;

            border-top:
                1px solid
                rgba(255,255,255,.06);

            background:
                rgba(0,0,0,.12);

        }


        .hm-ai-input-wrapper {

            display: flex;

            align-items:
                flex-end;

            gap: 8px;

            background:
                rgba(255,255,255,.045);

            border:
                1px solid
                rgba(255,255,255,.1);

            border-radius: 17px;

            padding:
                6px 6px 6px 13px;

            transition:
                border .25s,
                box-shadow .25s;

        }


        .hm-ai-input-wrapper:focus-within {

            border-color:
                rgba(100,180,255,.4);

            box-shadow:
                0 0 0 3px
                rgba(90,120,255,.07);

        }


        .hm-ai-input {

            flex: 1;

            resize: none;

            border: 0;

            outline: none;

            background:
                transparent;

            color:
                white;

            font-family:
                inherit;

            font-size: 13px;

            line-height: 1.5;

            max-height: 100px;

            padding:
                7px 0;

        }


        .hm-ai-input::placeholder {

            color:
                #686477;

        }


        .hm-ai-send {

            width: 38px;

            height: 38px;

            border: 0;

            border-radius: 12px;

            background:
                linear-gradient(
                    135deg,
                    #7658ff,
                    #52dfff
                );

            color:
                white;

            cursor: pointer;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 20px;

            transition:
                transform .25s,
                opacity .25s;

            flex-shrink: 0;

        }


        .hm-ai-send:hover {

            transform:
                translateY(-2px);

        }


        .hm-ai-send:disabled {

            opacity: .4;

            cursor:
                not-allowed;

            transform:
                none;

        }


        .hm-ai-footer {

            text-align: center;

            color:
                #575363;

            font-size: 9px;

            margin-top: 9px;

            letter-spacing:
                .4px;

        }


        .hm-ai-footer-dot {

            margin:
                0 5px;

        }


        /* =================================================
           MOBILE
           ================================================= */

        @media(max-width:600px) {

            .hm-ai-button {

                width: 60px;

                height: 60px;

                right: 18px;

                bottom: 18px;

                border-radius: 19px;

            }


            .hm-ai-window {

                right: 10px;

                bottom: 88px;

                width:
                    calc(100vw - 20px);

                height:
                    calc(100vh - 110px);

                max-height:
                    calc(100vh - 110px);

                border-radius: 25px;

            }

        }

        `;

        document.head.appendChild(style);

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    function attachEvents() {

        const button =
            document.getElementById("hmAIButton");

        const close =
            document.getElementById("hmAIClose");

        const clear =
            document.getElementById("hmAIClear");

        const send =
            document.getElementById("hmAISend");

        const input =
            document.getElementById("hmAIInput");


        button.addEventListener(
            "click",
            toggleAssistant
        );


        close.addEventListener(
            "click",
            closeAssistant
        );


        clear.addEventListener(
            "click",
            clearConversation
        );


        send.addEventListener(
            "click",
            sendMessage
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );


        input.addEventListener(
            "input",
            autoResize
        );


        document
            .querySelectorAll(
                ".hm-ai-suggestion"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        function () {

                            const message =
                                this.dataset.message;

                            input.value =
                                message;

                            autoResize();

                            sendMessage();

                        }
                    );

                }
            );

    }


    /* =====================================================
       OPEN / CLOSE
       ===================================================== */

    function toggleAssistant() {

        if (isOpen) {

            closeAssistant();

        } else {

            openAssistant();

        }

    }


    function openAssistant() {

        const windowElement =
            document.getElementById(
                "hmAIWindow"
            );

        isOpen = true;

        windowElement.classList.add(
            "open"
        );

        setTimeout(
            () => {

                document
                    .getElementById(
                        "hmAIInput"
                    )
                    .focus();

            },
            350
        );

    }


    function closeAssistant() {

        const windowElement =
            document.getElementById(
                "hmAIWindow"
            );

        isOpen = false;

        windowElement.classList.remove(
            "open"
        );

    }


    /* =====================================================
       WELCOME MESSAGE
       ===================================================== */

    function showWelcomeMessage() {

        addMessage(
            "ai",
            `
                <div class="hm-ai-message-label">
                    HOUSEMEMORY AI
                </div>

                <div>
                    Hello! ✦ I'm your HouseMemory AI
                    assistant.
                </div>

                <div style="margin-top:8px">
                    I can help you organise your home,
                    think about maintenance, manage
                    equipment and preserve the memories
                    that make your house yours.
                </div>

                <div style="margin-top:8px">
                    What would you like to work on?
                </div>
            `
        );

    }


    /* =====================================================
       ADD MESSAGE
       ===================================================== */

    function addMessage(
        type,
        content
    ) {

        const container =
            document.getElementById(
                "hmAIMessages"
            );

        const message =
            document.createElement("div");

        message.className =
            `hm-ai-message ${type}`;

        const bubble =
            document.createElement("div");

        bubble.className =
            "hm-ai-bubble";

        bubble.innerHTML =
            content;

        message.appendChild(
            bubble
        );

        container.appendChild(
            message
        );

        container.scrollTop =
            container.scrollHeight;

    }


    /* =====================================================
       USER MESSAGE
       ===================================================== */

    function addUserMessage(
        message
    ) {

        addMessage(
            "user",
            escapeHTML(message)
        );

    }


    /* =====================================================
       TYPING INDICATOR
       ===================================================== */

    function showTyping() {

        const container =
            document.getElementById(
                "hmAIMessages"
            );

        const message =
            document.createElement("div");

        message.className =
            "hm-ai-message ai";

        message.id =
            "hmAITypingMessage";

        message.innerHTML = `

            <div class="hm-ai-bubble">

                <div class="hm-ai-message-label">
                    HOUSEMEMORY AI
                </div>

                <div class="hm-ai-typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        `;

        container.appendChild(
            message
        );

        container.scrollTop =
            container.scrollHeight;

    }


    function removeTyping() {

        const typing =
            document.getElementById(
                "hmAITypingMessage"
            );

        if (typing) {

            typing.remove();

        }

    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    async function sendMessage() {

        if (isTyping) {
            return;
        }

        const input =
            document.getElementById(
                "hmAIInput"
            );

        const send =
            document.getElementById(
                "hmAISend"
            );

        const message =
            input.value.trim();

        if (!message) {
            return;
        }


        addUserMessage(
            message
        );


        chatHistory.push({
            role: "user",
            content: message
        });


        input.value = "";

        autoResize();


        isTyping = true;

        send.disabled = true;

        showTyping();


        try {

            const response =
                await fetch(
                    SUPABASE_FUNCTION_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_PUBLISHABLE_KEY

                        },

                        body:
                            JSON.stringify({
                                message:
                                    message
                            })

                    }
                );


            const data =
                await response.json();


            removeTyping();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "HouseMemory AI could not respond."
                );

            }


            const aiMessage =
                data.message;


            chatHistory.push({
                role: "assistant",
                content:
                    aiMessage
            });


            addMessage(
                "ai",
                `
                    <div class="hm-ai-message-label">
                        HOUSEMEMORY AI
                    </div>

                    <div>
                        ${formatAIResponse(
                            aiMessage
                        )}
                    </div>
                `
            );


        } catch (error) {

            removeTyping();

            console.error(
                "HouseMemory AI:",
                error
            );


            addMessage(
                "ai",
                `
                    <div class="hm-ai-message-label">
                        CONNECTION ISSUE
                    </div>

                    <div>
                        I couldn't connect to
                        HouseMemory AI right now.
                    </div>

                    <div
                        style="
                            margin-top:7px;
                            color:#8e899d;
                            font-size:11px;
                        "
                    >
                        Please try again in a moment.
                    </div>
                `
            );

        } finally {

            isTyping = false;

            send.disabled = false;

            input.focus();

        }

    }


    /* =====================================================
       FORMAT AI RESPONSE
       ===================================================== */

    function formatAIResponse(
        text
    ) {

        let safe =
            escapeHTML(text);


        safe =
            safe.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            );


        safe =
            safe.replace(
                /\n/g,
                "<br>"
            );


        return safe;

    }


    /* =====================================================
       CLEAR
       ===================================================== */

    function clearConversation() {

        const container =
            document.getElementById(
                "hmAIMessages"
            );

        container.innerHTML = "";

        chatHistory = [];

        showWelcomeMessage();

    }


    /* =====================================================
       AUTO RESIZE
       ===================================================== */

    function autoResize() {

        const input =
            document.getElementById(
                "hmAIInput"
            );

        input.style.height =
            "auto";

        input.style.height =
            Math.min(
                input.scrollHeight,
                100
            ) + "px";

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            value;

        return div.innerHTML;

    }


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeHouseMemoryAI
        );

    } else {

        initializeHouseMemoryAI();

    }


})();