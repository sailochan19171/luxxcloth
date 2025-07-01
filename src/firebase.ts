import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBZSay1GQz52X40e0txjy14yJAK6sLz5oo",
  authDomain: "luxxcloth.firebaseapp.com",
  projectId: "luxxcloth",
  storageBucket: "luxxcloth.firebasestorage.app",
  messagingSenderId: "775430501629",
  appId: "1:775430501629:web:ba9d84a9a5e1fb30e2ba94"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
