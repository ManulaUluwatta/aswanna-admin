// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA4RUxYL6W0ymw_MaIdGovk4phqvw0GR6w",
    authDomain: "aswanna-application.firebaseapp.com",
    projectId: "aswanna-application",
    storageBucket: "aswanna-application.appspot.com",
    messagingSenderId: "320957932986",
    appId: "1:320957932986:web:bd99de1bedd34efc196983"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function getUrlId(param) {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param)
}