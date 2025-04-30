// ====== Firebase Config ======
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
fetch('https://ipinfo.io/json?token=ee05a00e89fe82')
  .then(response => response.json())
  .then(data => {
    userLocation = data.city || "Unknown Location";
    const locEl = document.getElementById('location');
    if (locEl) locEl.textContent = userLocation;
  })
  .catch(error => {
    console.error('Error fetching location:', error);
    const locEl = document.getElementById('location');
    if (locEl) locEl.textContent = "Unknown Location";
  });

// ====== Update Current Time on Load ======
const now = new Date();
const timeEl = document.getElementById('current-time');
if (timeEl) timeEl.textContent = now.toLocaleString();

// ====== Add Citation (Manual) ======
async function addCitation() {
  const name = document.getElementById('name').value.trim();
  const work = document.getElementById('work').value.trim();

  if (!name || !work) {
    alert("Please fill in both name and work.");
    return;
  }

  try {
    const response = await fetch('/api/manual-citation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, work })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Submission failed.");
    }

    alert(`Citation added to ${result.volume} successfully!`);
    document.getElementById('current-time').textContent = new Date().toLocaleString();
    document.getElementById('location').textContent = result.citation.location || 'Recorded';

    // Optional: clear form fields after submit
    document.getElementById('name').value = '';
    document.getElementById('work').value = '';
  } catch (err) {
    console.error("Submit error:", err);
    alert("Error adding citation.");
  }
}

// ====== Generate Random Citation ======
async function generateRandom() {
  try {
    const response = await fetch('/api/generate-citation');
    if (!response.ok) throw new Error('Failed to fetch citation');

    const data = await response.json();
    document.getElementById('name').value = data.name;
    document.getElementById('work').value = data.work;
    document.getElementById('location').textContent = data.location;
    document.getElementById('current-time').textContent = new Date().toLocaleString();
  } catch (error) {
    console.error('Error generating citation:', error);
    alert('Failed to generate citation. Please try again.');
  }
}
