/* =========================================================
   HOUSEMEMORY — SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL =
    "https://bbxqrgevfqrbfhvxojvs.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_RTUqZHz4Ixaiela-gj2MFQ_A0UEdRYb";


/* ---------------------------------------------------------
   CREATE SUPABASE CLIENT
   --------------------------------------------------------- */

if (!window.supabase) {

    console.error(
        "HouseMemory: Supabase library was not loaded."
    );

} else {

    window.houseMemorySupabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

}


/* ---------------------------------------------------------
   GLOBAL HOUSEMEMORY HELPERS
   --------------------------------------------------------- */

window.HouseMemory = {

    supabase: window.houseMemorySupabase,


    /* -----------------------------------------------------
       GET CURRENT USER
       ----------------------------------------------------- */

    async getUser() {

        if (!this.supabase) {
            console.error(
                "HouseMemory: Supabase client unavailable."
            );

            return null;
        }

        try {

            const {
                data,
                error
            } = await this.supabase.auth.getUser();

            if (error) {

                console.error(
                    "HouseMemory: Could not get user.",
                    error
                );

                return null;
            }

            return data?.user || null;

        } catch (error) {

            console.error(
                "HouseMemory: User lookup failed.",
                error
            );

            return null;
        }

    },


    /* -----------------------------------------------------
       GET SESSION
       ----------------------------------------------------- */

    async getSession() {

        if (!this.supabase) {
            return null;
        }

        try {

            const {
                data,
                error
            } = await this.supabase.auth.getSession();

            if (error) {

                console.error(
                    "HouseMemory: Could not get session.",
                    error
                );

                return null;
            }

            return data?.session || null;

        } catch (error) {

            console.error(
                "HouseMemory: Session lookup failed.",
                error
            );

            return null;
        }

    },


    /* -----------------------------------------------------
       SIGN OUT
       ----------------------------------------------------- */

    async signOut() {

        if (!this.supabase) {
            return false;
        }

        try {

            const {
                error
            } = await this.supabase.auth.signOut();

            if (error) {

                console.error(
                    "HouseMemory: Sign out failed.",
                    error
                );

                return false;
            }

            return true;

        } catch (error) {

            console.error(
                "HouseMemory: Sign out error.",
                error
            );

            return false;
        }

    },


    /* -----------------------------------------------------
       GET USER ID
       ----------------------------------------------------- */

    async getUserId() {

        const user = await this.getUser();

        return user ? user.id : null;

    },


    /* -----------------------------------------------------
       GET USER EMAIL
       ----------------------------------------------------- */

    async getUserEmail() {

        const user = await this.getUser();

        return user ? user.email : null;

    },


    /* -----------------------------------------------------
       GET USER DISPLAY NAME
       ----------------------------------------------------- */

    async getDisplayName() {

        const user = await this.getUser();

        if (!user) {
            return "Household Member";
        }

        const metadata =
            user.user_metadata || {};

        return (
            metadata.full_name ||
            metadata.name ||
            metadata.display_name ||
            user.email?.split("@")[0] ||
            "Household Member"
        );

    },


    /* -----------------------------------------------------
       AUTH STATE LISTENER
       ----------------------------------------------------- */

    onAuthChange(callback) {

        if (!this.supabase) {
            return null;
        }

        return this.supabase.auth.onAuthStateChange(
            (event, session) => {

                try {

                    callback(
                        event,
                        session
                    );

                } catch (error) {

                    console.error(
                        "HouseMemory: Auth callback error.",
                        error
                    );

                }

            }
        );

    }

};