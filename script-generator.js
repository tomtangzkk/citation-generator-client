// ====== Your Firebase Config ======
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
  
  // ====== Load IP Location ======
  let userLocation = "Unknown";
  
  fetch('https://ipinfo.io/json?token=ee05a00e89fe82')  // ✅ Your token is now used here
    .then(response => response.json())
    .then(data => {
      userLocation = data.city || "Unknown Location";
      document.getElementById('location').textContent = userLocation;
    })
    .catch(error => {
      console.error('Error fetching location:', error);
      document.getElementById('location').textContent = "Unknown Location";
    });
  
  // ====== Update Current Time Every Second ======
  function updateTime() {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 10);
    document.getElementById('current-time').textContent = timeString;
  }
  setInterval(updateTime, 1000);
  updateTime();
  
  // ====== Add Citation ======
  function addCitation() {
    const name = document.getElementById('name').value.trim();
    const work = document.getElementById('work').value.trim();
    const location = userLocation;
    const now = new Date();
    const timeString = now.toISOString().slice(0, 10);
  
    if (!name || !work) {
      alert("Please fill in both Name and Work Title!");
      return;
    }
  
    const citationText = `${name}, *${work}*, ${location}, ${timeString}.`;
  
    db.collection('citations').add({
      name: name,
      description: work,
      location: location,
      timestamp: now,
      citation_text: citationText
    })
    .then(() => {
      console.log("Citation added!");
      window.location.href = "book.html"; // Go to the citation book
    })
    .catch(error => {
      console.error("Error adding citation:", error);
    });
  }

  // ====== Generate Random Citation ======
async function generateRandom() {
    try {
      const res = await fetch("https://cited-from-within-itself.vercel.app/generate-citation");
      const data = await res.json();
      document.getElementById('name').value = data.name;
      document.getElementById('work').value = data.work;
    } catch (error) {
      console.error("Error generating random citation:", error);
      alert("Failed to generate random citation. Please try again later.");
    }
  }
  
  