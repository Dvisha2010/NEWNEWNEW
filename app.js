/* =========================================================
   HOUSEMEMORY — GLOBAL APPLICATION
   ========================================================= */


/* =========================================================
   PAGE HELPERS
   ========================================================= */

const HouseMemoryApp = {


    /* -----------------------------------------------------
       INITIALISE
       ----------------------------------------------------- */

    async init() {

        console.log(
            "HouseMemory initialising..."
        );


        this.setupNavigation();

        this.setupScrollEffects();

        this.setupRevealAnimations();

        this.setupPageLinks();

        this.setupAuthListener();

        this.setupLogoutButtons();

        this.setupIntroSafety();

        await this.loadUserInformation();


        console.log(
            "HouseMemory ready."
        );

    },


    /* -----------------------------------------------------
       NAVIGATION
       ----------------------------------------------------- */

    setupNavigation() {

        document
            .querySelectorAll("[data-housememory-link]")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    event => {

                        const destination =
                            link.getAttribute(
                                "data-housememory-link"
                            );

                        if (!destination) {
                            return;
                        }

                        event.preventDefault();

                        window.location.href =
                            destination;

                    }
                );

            });

    },


    /* -----------------------------------------------------
       PAGE LINKS
       ----------------------------------------------------- */

    setupPageLinks() {

        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(element => {

                element.addEventListener(
                    "click",
                    () => {

                        const page =
                            element.dataset.page;

                        if (page) {

                            window.location.href =
                                page;

                        }

                    }
                );

            });

    },


    /* -----------------------------------------------------
       SCROLL EFFECTS
       ----------------------------------------------------- */

    setupScrollEffects() {

        const nav =
            document.querySelector(".nav");

        if (!nav) {
            return;
        }

        const updateNav =
            () => {

                nav.classList.toggle(
                    "scrolled",
                    window.scrollY > 40
                );

            };


        updateNav();


        window.addEventListener(
            "scroll",
            updateNav,
            {
                passive:true
            }
        );

    },


    /* -----------------------------------------------------
       REVEAL ANIMATIONS
       ----------------------------------------------------- */

    setupRevealAnimations() {

        const elements =
            document.querySelectorAll(
                ".reveal"
            );

        if (!elements.length) {
            return;
        }


        if (
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                element => {

                    element.classList.add(
                        "visible"
                    );

                }
            );

            return;
        }


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add("visible");

                            }

                        }
                    );

                },

                {
                    threshold:.08
                }

            );


        elements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    },


    /* -----------------------------------------------------
       INTRO SAFETY
       -----------------------------------------------------

       This is deliberately independent from Supabase.

       Therefore:

       Supabase error
          ↓
       app.js error
          ↓
       intro still disappears

       ----------------------------------------------------- */

    setupIntroSafety() {

        const intro =
            document.getElementById(
                "intro"
            );

        if (!intro) {
            return;
        }


        const hideIntro =
            () => {

                intro.classList.add(
                    "hide"
                );

                setTimeout(
                    () => {

                        intro.style.display =
                            "none";

                    },
                    1200
                );

            };


        /* Normal delay */

        setTimeout(
            hideIntro,
            1000
        );


        /* Emergency fallback */

        setTimeout(
            hideIntro,
            3000
        );

    },


    /* -----------------------------------------------------
       AUTH LISTENER
       ----------------------------------------------------- */

    setupAuthListener() {

        if (
            !window.HouseMemory ||
            !window.HouseMemory.supabase
        ) {

            console.warn(
                "HouseMemory: Supabase unavailable."
            );

            return;
        }


        window.HouseMemory.onAuthChange(
            (event, session) => {

                console.log(
                    "HouseMemory auth:",
                    event
                );


                if (
                    event ===
                    "SIGNED_OUT"
                ) {

                    console.log(
                        "HouseMemory: User signed out."
                    );

                }


                if (
                    event ===
                    "SIGNED_IN"
                ) {

                    console.log(
                        "HouseMemory: User signed in."
                    );

                }

            }
        );

    },


    /* -----------------------------------------------------
       LOAD USER INFORMATION
       ----------------------------------------------------- */

    async loadUserInformation() {

        if (
            !window.HouseMemory
        ) {
            return;
        }


        try {

            const user =
                await window.HouseMemory
                    .getUser();


            if (!user) {

                console.log(
                    "HouseMemory: No active user."
                );

                return;

            }


            console.log(
                "HouseMemory user:",
                user.email
            );


            this.displayUserInformation(
                user
            );


        } catch (error) {

            console.error(
                "HouseMemory: Failed to load user.",
                error
            );

        }

    },


    /* -----------------------------------------------------
       DISPLAY USER INFORMATION
       ----------------------------------------------------- */

    displayUserInformation(user) {

        if (!user) {
            return;
        }


        const metadata =
            user.user_metadata || {};


        const name =
            metadata.full_name ||
            metadata.name ||
            metadata.display_name ||
            user.email?.split("@")[0] ||
            "Household Member";


        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(
                element => {

                    element.textContent =
                        name;

                }
            );


        document
            .querySelectorAll(
                "[data-user-email]"
            )
            .forEach(
                element => {

                    element.textContent =
                        user.email || "";

                }
            );


        document
            .querySelectorAll(
                "[data-user-avatar]"
            )
            .forEach(
                element => {

                    if (
                        metadata.avatar_url
                    ) {

                        element.src =
                            metadata.avatar_url;

                    }

                }
            );

    },


    /* -----------------------------------------------------
       LOGOUT BUTTONS
       ----------------------------------------------------- */

    setupLogoutButtons() {

        document
            .querySelectorAll(
                "[data-logout]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        async event => {

                            event.preventDefault();


                            button.disabled =
                                true;


                            button.style.opacity =
                                ".6";


                            try {

                                const success =
                                    await window
                                        .HouseMemory
                                        .signOut();


                                if (success) {

                                    window.location.href =
                                        "login.html";

                                } else {

                                    button.disabled =
                                        false;

                                    button.style.opacity =
                                        "1";

                                }

                            } catch (error) {

                                console.error(
                                    "HouseMemory logout error:",
                                    error
                                );

                                button.disabled =
                                    false;

                                button.style.opacity =
                                    "1";

                            }

                        }
                    );

                }
            );

    }

};


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        HouseMemoryApp.init();

    }
);


/* =========================================================
   GLOBAL PAGE NAVIGATION
   ========================================================= */

window.openPage =
    function(page) {

        if (!page) {
            return;
        }

        window.location.href =
            page;

    };