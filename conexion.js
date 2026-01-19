import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc-Sa2PyzbiYW7xNSo7q4WnTyCLwuuqFQ",
  authDomain: "venta-ac7e4.firebaseapp.com",
  projectId: "venta-ac7e4",
  storageBucket: "venta-ac7e4.firebasestorage.app",
  messagingSenderId: "663332154451",
  appId: "1:663332154451:web:821b57e2f0313d61ebeaa6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

