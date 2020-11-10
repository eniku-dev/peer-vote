import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCY8fq1jgpuZZITP8aClTkFQkM5AOO1xa4",
  authDomain: "peer-vote.firebaseapp.com",
  databaseURL: "https://peer-vote.firebaseio.com",
  projectId: "peer-vote",
  storageBucket: "peer-vote.appspot.com",
  messagingSenderId: "853604315588",
  appId: "1:853604315588:web:946314388eaa95ce277491",
  measurementId: "G-PBEC3B7M9R",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export default firebase;
