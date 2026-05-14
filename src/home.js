import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Not logged in, redirect to login page
        window.location.href = "index.html";
    } else {
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = `<p>Welcome, <strong>${user.email}</strong>!</p>`;
        }
    }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            localStorage.removeItem('loggedInUser');
            window.location.href = "index.html";
        }).catch((error) => {
            console.error('Logout Error:', error);
        });
    });
}
