// ====== Replace with your own firebaseConfig ======
const firebaseConfig = {
    apiKey: "AIzaSyBx7AQZHanzqolsTz9akbUlU5Im_Fh_1z8",
    authDomain: "citedfromwithinitself.firebaseapp.com",
    projectId: "citedfromwithinitself",
    storageBucket: "citedfromwithinitself.appspot.com",
    messagingSenderId: "783270994329",
    appId: "1:783270994329:web:bb54fdaf0374f92b33f308",
    measurementId: "G-72WM88H17N"
  };
  
  
  // ====== Initialize Firebase ======
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // ====== Load existing citations ======
  const citationsList = document.getElementById('citations-list');
  
  function loadCitations() {
    db.collection('citations').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
      citationsList.innerHTML = '';
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'citation-item';
        div.textContent = `${data.citation_text}`;
        citationsList.appendChild(div);
      });
    });
  }
  
  loadCitations();
  
  // ====== Generate a new citation ======
  function generateCitation() {
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    if (!name || !description) {
      alert("Please fill both fields!");
      return;
    }
  
    // Simulate IP for now
    const randomIP = Math.floor(Math.random() * 9000) + 1000;
    const timestamp = new Date();
    const citationText = `${name}, *${description}*, IP ${randomIP}, ${timestamp.toISOString().slice(0, 10)}.`;
  
    // Save to Firestore
    db.collection('citations').add({
      name: name,
      description: description,
      ip: randomIP.toString(),
      timestamp: timestamp,
      citation_text: citationText
    })
    .then(() => {
      console.log("Citation added!");
      // Clear input fields
      document.getElementById('name').value = '';
      document.getElementById('description').value = '';
    })
    .catch(error => {
      console.error("Error adding citation: ", error);
    });
  }
  