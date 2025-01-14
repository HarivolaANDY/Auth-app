import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAmQLx8CMw5VCQzgHIZIP34mUxKQCB2AIE",
  authDomain: "authweb-22cf4.firebaseapp.com",
  projectId: "authweb-22cf4",
  storageBucket: "authweb-22cf4.firebasestorage.app",
  messagingSenderId: "138693279441",
  appId: "1:138693279441:web:1b20eec6994b260a980ff0",
  measurementId: "G-YZR4TWH5YQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity= 1;

  setTimeout(() => {
    messageDiv.style.opacity= 0;
  }, 5000);
}

const signUp = document.getElementById("submitsignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const fName = document.getElementById("fName").value;
  const lName = document.getElementById("lName").value;

  const auth = getAuth();
  const db = getFirestore();
 
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        fName: fName,
        lName: lName
      };
      showMessage('Account Created Successfully', 'signupMessage')
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
      .then(() => {
        window.location.href = "index.html";
      })
       .catch((error) => {
        console.error("Error writing document: ", error);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      if(errorCode == 'auth/email-already-in use') {
        showMessage('Email already in use !', 'signupMessage')}
      else {
        showMessage('unable to create User', 'signupMessage');
      }
    });
});
