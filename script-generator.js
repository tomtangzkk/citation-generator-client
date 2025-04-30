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
    document.getElementById('location').textContent = userLocation;
  })
  .catch(error => {
    console.error('Error fetching location:', error);
    document.getElementById('location').textContent = "Unknown Location";
  });

// ====== Time Updater ======
function updateTime() {
  const now = new Date();
  const timeString = now.toISOString().slice(0, 10);
  document.getElementById('current-time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// ====== Add Manual Citation ======
function addCitation() {
  const name = document.getElementById('name').value.trim();
  const work = document.getElementById('work').value.trim();
  const now = new Date();
  const timeString = now.toISOString().slice(0, 10);

  if (!name || !work) {
    alert("Please fill in both Name and Work Title!");
    return;
  }

  const citationText = `${name}, *${work}*, ${userLocation}, ${timeString}.`;

  db.collection('citations').add({
    name,
    description: work,
    location: userLocation,
    timestamp: now,
    citation_text: citationText
  }).then(() => {
    console.log("Manual citation added.");
    window.location.href = "book.html";
  }).catch(error => {
    console.error("Error adding manual citation:", error);
  });
}

// ====== AI Prompt Citation Workflow ======
const promptInput = document.getElementById('customPrompt');
const randomBtn = document.getElementById('randomBtn');
const addGeneratedBtn = document.getElementById('addGeneratedBtn');

// 显示自定义 prompt 输入框
randomBtn.onclick = () => {
  promptInput.style.display = "inline-block";
  addGeneratedBtn.style.display = "inline-block";
  promptInput.focus();
};

// 提交 prompt → 调用 OpenAI → 存入 Firebase
addGeneratedBtn.onclick = async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  try {
    const res = await fetch("https://citedfromwithin-96ns8zeqm-tom-tangzks-projects.vercel.app/api/generate-citation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    const citationText = data.citation;
    const now = new Date();

    await db.collection("citations").add({
      name: "Generated",
      description: prompt,
      location: userLocation,
      timestamp: now,
      citation_text: citationText
    });

    console.log("AI citation added.");
    window.location.href = "book.html";
  } catch (err) {
    console.error("Error generating AI citation:", err);
    alert("Generation failed.");
  }
};
