// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBx7AQZHanzqolsTz9akbUlU5Im_Fh_1z8",
    authDomain: "citedfromwithinitself.firebaseapp.com",
    projectId: "citedfromwithinitself",
    storageBucket: "citedfromwithinitself.appspot.com",
    messagingSenderId: "783270994329",
    appId: "1:783270994329:web:bb54fdaf0374f92b33f308",
    measurementId: "G-72WM88H17N"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  let citations = [];
  
  // Load all citations from Firebase
  function loadAllCitations() {
    db.collection('citations').orderBy('timestamp', 'asc').get()
      .then(snapshot => {
        citations = snapshot.docs.map(doc => doc.data());
        if (citations.length > 0) {
          loadRandomCitation();
        } else {
          document.getElementById('left-page').textContent = "No citations yet.";
          document.getElementById('right-page').textContent = "Add a citation to begin.";
        }
      })
      .catch(error => {
        console.error("Error loading citations:", error);
      });
  }
  
  function loadRandomCitation() {
    if (citations.length < 2) {
      document.getElementById('left-page').textContent = citations[0]?.citation_text || "No citation.";
      document.getElementById('right-page').textContent = "";
      return;
    }
  
    let index1 = Math.floor(Math.random() * citations.length);
    let index2;
    do {
      index2 = Math.floor(Math.random() * citations.length);
    } while (index1 === index2);
  
    document.getElementById('left-page').textContent = citations[index1].citation_text;
    document.getElementById('right-page').textContent = citations[index2].citation_text;
  }
  
  loadAllCitations();
  