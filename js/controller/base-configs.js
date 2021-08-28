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

function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}