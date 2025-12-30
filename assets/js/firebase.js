// Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCM0FHbolc3QT-PfoLixcoeVS3JoWhheEg",
  authDomain: "ultrasound-guidance.firebaseapp.com",
  projectId: "ultrasound-guidance",
  storageBucket: "ultrasound-guidance.firebasestorage.app",
  messagingSenderId: "947728965057",
  appId: "1:947728965057:web:32b2bb26469a78c9762340",
};
firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.firestore();
const firebaseStorage = firebase.storage();
const firebaseAuth = firebase.auth();

// Sign in anonymously to enable authenticated storage access
// This creates a session-based authentication for storage security rules
firebaseAuth.signInAnonymously()
  .then(() => {
    console.log('Firebase: Authenticated successfully');
  })
  .catch((error) => {
    console.error('Firebase: Authentication error:', error);
  });

// Make Firebase services globally accessible
window.firebaseStorage = firebaseStorage;
window.firebaseAuth = firebaseAuth;