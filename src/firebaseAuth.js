import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from "./firebaseConfig";

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) {
    console.error(`Element with id ${divId} not found`);
    return;
  }
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;

  setTimeout(() => {
    messageDiv.style.opacity = 0;
    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 500);
  }, 5000);
}

const signUpForm = document.getElementById("submitSignUp");
if (signUpForm) {
  signUpForm.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value;

    const auth = getAuth(app);
    const db = getFirestore(app);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          fName: firstName,
          lName: lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            setTimeout(() => {
              window.location.href = "index.html";
            }, 2000);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email already in use!', 'signUpMessage');
        } else {
          showMessage(`Error: ${error.message}`, 'signUpMessage');
        }
      });
  });
}

const signIn = document.getElementById("submitSignIn");
if (signIn) {
  signIn.addEventListener("click", event => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('loggedInUser', user.uid);
        window.location.href = "home.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
          showMessage('Invalid email or password!', 'signInMessage');
        } else {
          showMessage(`Error: ${error.message}`, 'signInMessage');
        }
      });
  });
}
