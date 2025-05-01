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
   
 
// ====== Firebase Config & Initialization ======
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
let historyStack = [];

// ====== 页面加载时启动 ======
window.onload = () => {
  loadAllCitations();
};

// ====== 从 Firebase 加载 citation 并合并本地 static ======
function loadAllCitations() {
  db.collection('citations').orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const liveCitations = snapshot.docs
        .map(doc => doc.data())
        .filter(c => !!c.citation_text?.trim());

      // 合并 static 和 Firebase citation
      const combined = [...staticCitations, ...liveCitations];

      // 判断是否有新增
      const newCitations = combined.filter(c =>
        !allCitations.find(existing => existing.citation_text === c.citation_text)
      );

      if (newCitations.length > 0) {
        // 如果是首次加载
        if (allCitations.length === 0) {
          allCitations = combined;
          resetCitationPool();
          loadNextSpread();
        } else {
          // 增量添加
          allCitations.push(...newCitations);
          citationPool.push(...newCitations);
          shuffleArray(citationPool);
        }
      }
    }, error => {
      console.error("Error in realtime listener:", error);
    });
}


function resetCitationPool() {
  citationPool = [...allCitations];
  shuffleArray(citationPool);
  historyStack = []; // 每次重置也重置历史
}

// ====== Fisher-Yates 洗牌算法 ======
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ====== 下一页 ======
function loadNextSpread() {
  if (citationPool.length < 2) {
    alert("You've finished reading all citations.");
    return;
  }

  const left = citationPool.pop();
  const right = citationPool.pop();

  historyStack.push([left, right]); // 保存历史
  displaySpread(left, right);
}

// ====== 上一页 ======
function loadPreviousSpread() {
  if (historyStack.length < 2) {
    alert("You're at the beginning.");
    return;
  }

  // 当前页退回 citationPool
  const current = historyStack.pop();
  citationPool.push(current[1]);
  citationPool.push(current[0]);

  const previous = historyStack[historyStack.length - 1];
  displaySpread(previous[0], previous[1]);
}

// ====== 通用展示函数 ======
function displaySpread(left, right) {
  document.getElementById('left-page').textContent = left?.citation_text || "—";
  document.getElementById('right-page').textContent = right?.citation_text || "—";
}
