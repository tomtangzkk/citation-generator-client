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

let allCitations = [];
let citationPool = [];

function loadAllCitations() {
  db.collection('citations').orderBy('timestamp', 'asc').get()
    .then(snapshot => {
      allCitations = snapshot.docs.map(doc => doc.data()).filter(c => !!c.citation_text?.trim());
      if (allCitations.length > 1) {
        resetCitationPool();
        loadNextSpread();
      } else {
        document.getElementById('left-page').textContent = allCitations[0]?.citation_text || "No citation.";
        document.getElementById('right-page').textContent = "";
      }
    })
    .catch(error => {
      console.error("Error loading citations:", error);
    });
}

function resetCitationPool() {
  citationPool = [...allCitations];
  shuffleArray(citationPool);
}

function loadNextSpread() {
  if (citationPool.length < 2) {
    resetCitationPool();
  }

  const left = citationPool.pop();
  const right = citationPool.pop();

  document.getElementById('left-page').textContent = left?.citation_text || "Empty";
  document.getElementById('right-page').textContent = right?.citation_text || "Empty";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadAllCitations();
