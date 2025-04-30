// ====== Static Citation Data (Archive) ======
const staticCitations = [
  { citation_text: `Tang, Tom. *Filial Scripts.* Ongoing project, Fall 2023.
An exchange of shipment boxes between kin; care circulates silently across distance. A familial bond unfolds through objects in motion.` },
  { citation_text: `Tang, Tom. *Chimeras & Forsaken* (with Jeewon). Web, print, installation, Fall 2023.
Adapters misfit. Meanings dislocate. IP shifts. Belonging fails and forms again—quietly.` },
  { citation_text: `Tang, Tom. *Source.* Website, Fall 2023.
A coded reflection on Baltimore’s gaze. Safety and surveillance blur; interaction becomes exposure.` },
  { citation_text: `Tang, Tom. *Chase.* Code-based web experiment, Fall 2023.
Traces online. Residue follows. Who watches the trail we leave behind?` },
  { citation_text: `Tang, Tom. *It’s on the Stairs.* Interactive web installation, Fall 2023.
You memorize coordinates. Click to match. Your movements become part of the archive.` },
  { citation_text: `Tang, Tom. *Secret Garden.* Offline website, Fall 2023.
Only accessible in absence of internet. Disconnection becomes the only way in.` },
  { citation_text: `Tang, Tom. *Waste.* Photography, Fall 2023.
A taxonomy of neglect. Looking into bins: inverted altars of modern life.` },
  { citation_text: `Tang, Tom. *Faint Spark.* Video, Fall 2023.
New Year in slow burn. Fireworks remembered—not seen, but flickering in thought.` },
  { citation_text: `Tang, Tom. *Unwritten Poem.* Experimental video, Fall 2023.
A poem written without language. Words borrowed, translated into images. A syntax of memory.` },
  { citation_text: `Tang, Tom. *Paprika! (Palimpsest).* Graphic publication, Fall 2023.
The site leaves its own trace. Layers printed, scraped, rewritten. Time thickens on paper.` }
];

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

let allCitations = [];       // 所有 citation 文档
let displayedIndices = new Set();  // 已展示的索引组合

// 页面初次加载
window.onload = async () => {
  try {
    const snapshot = await db.collection("citations")
      .orderBy("timestamp", "desc")
      .get();

    allCitations = snapshot.docs.map(doc => doc.data().citation_text);

    if (allCitations.length < 2) {
      alert("Not enough citations to display.");
      return;
    }

    loadNextSpread();

  } catch (err) {
    console.error("Error loading citations:", err);
  }
};

function loadNextSpread() {
  // 计算所有可能的非重复配对数
  const totalPairs = Math.floor(allCitations.length / 2);

  // 如果所有对都已经展示完了
  if (displayedIndices.size >= totalPairs) {
    alert("You've read all available citations.");
    return;
  }

  let pairIndex;
  let attempts = 0;

  // 尝试找到一个未展示的随机配对对索引
  do {
    pairIndex = Math.floor(Math.random() * totalPairs);
    attempts++;
    if (attempts > 100) {
      alert("Failed to find new citations.");
      return;
    }
  } while (displayedIndices.has(pairIndex));

  displayedIndices.add(pairIndex);

  const left = allCitations[pairIndex * 2];
  const right = allCitations[pairIndex * 2 + 1] || "—";

  document.getElementById("left-page").textContent = left;
  document.getElementById("right-page").textContent = right;
}
