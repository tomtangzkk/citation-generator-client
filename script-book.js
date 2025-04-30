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
let combinationPool = [];

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

// ✅ 只保留内容不同的组合（解决：两页内容一样）
function createCombinationPool() {
  combinationPool = [];
  for (let i = 0; i < citations.length; i++) {
    for (let j = i + 1; j < citations.length; j++) {
      const text1 = citations[i].citation_text?.trim();
      const text2 = citations[j].citation_text?.trim();
      if (text1 && text2 && text1 !== text2) {
        combinationPool.push([i, j]);
      }
    }
  }
  shuffleArray(combinationPool); // 打乱顺序
}

function loadRandomCitation() {
  if (combinationPool.length === 0) {
    createCombinationPool(); // 用完之后重新生成
  }

  if (combinationPool.length === 0) {
    // 所有内容都一样，无法组合
    document.getElementById('left-page').textContent = "Not enough distinct citations.";
    document.getElementById('right-page').textContent = "";
    return;
  }

  const [i1, i2] = combinationPool.pop(); // 每次拿一个新组合
  document.getElementById('left-page').textContent = citations[i1].citation_text || "Empty";
  document.getElementById('right-page').textContent = citations[i2].citation_text || "Empty";
}

// Fisher-Yates 洗牌算法
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadAllCitations();
