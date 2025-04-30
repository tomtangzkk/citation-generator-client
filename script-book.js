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
let combinationPool = [];
let shownTextPairs = new Set(); // 防止重复内容

function loadAllCitations() {
  db.collection('citations').orderBy('timestamp', 'asc').get()
    .then(snapshot => {
      citations = snapshot.docs.map(doc => doc.data());
      if (citations.length > 1) {
        createCombinationPool();
        loadRandomCitation();
      } else {
        document.getElementById('left-page').textContent = citations[0]?.citation_text || "No citation.";
        document.getElementById('right-page').textContent = "";
      }
    })
    .catch(error => {
      console.error("Error loading citations:", error);
    });
}

function createCombinationPool() {
  combinationPool = [];
  shownTextPairs.clear(); // 新一轮重置历史组合

  for (let i = 0; i < citations.length; i++) {
    for (let j = i + 1; j < citations.length; j++) {
      const text1 = citations[i].citation_text?.trim();
      const text2 = citations[j].citation_text?.trim();
      if (text1 && text2 && text1 !== text2) {
        combinationPool.push([i, j]);
      }
    }
  }
  shuffleArray(combinationPool);
}

function loadRandomCitation() {
  if (combinationPool.length === 0) {
    createCombinationPool(); // 重置组合池
  }

  // 防止死循环，最多尝试100次
  for (let attempt = 0; attempt < 100; attempt++) {
    if (combinationPool.length === 0) {
      createCombinationPool();
    }

    const [i1, i2] = combinationPool.pop();
    const text1 = citations[i1].citation_text?.trim() || "";
    const text2 = citations[i2].citation_text?.trim() || "";

    // 创建组合键（无序组合），确保镜像也算重复
    const key = [text1, text2].sort().join("||");

    if (!shownTextPairs.has(key)) {
      shownTextPairs.add(key);

      document.getElementById('left-page').textContent = text1;
      document.getElementById('right-page').textContent = text2;
      return;
    }
  }

  // 如果所有组合都展示过，开始新一轮
  document.getElementById('left-page').textContent = "You've read everything.";
  document.getElementById('right-page').textContent = "Restarting soon...";
  setTimeout(() => {
    createCombinationPool();
    loadRandomCitation();
  }, 1000);
}

// 洗牌算法
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadAllCitations();
