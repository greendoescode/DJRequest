import { useEffect } from "react";
import Cookies from "js-cookie";

function LoginPage() {
    useEffect(() => {
    const user_id = Cookies.get("user_id");
    if (user_id) {
        Cookies.set('user_id', 'adfsda', { expires: 0 })
        Cookies.set('isLoggedIn', 'asdasd', { expires: 0 })
        console.warn("Logged Out.");
        window.location.href = "/";
    } else {
        console.warn("Skipping, Not logged in.")
        window.location.href = "/";
    }
    }),


    <>
 </>
}

export default LoginPage;
