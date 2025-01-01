import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Firebase конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyCT0puD2gqEj4EYoeC5HtXYI95InuX4z9Q", // Не рекомендуется использовать в фронтенде.
  authDomain: "castify-5c0b6.firebaseapp.com",
  projectId: "castify-5c0b6",
  storageBucket: "castify-5c0b6.appspot.com",
  messagingSenderId: "897995118693",
  appId: "1:897995118693:web:708006eb85fdd77ab5ce8c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Функция проверки запрещенных слов
function containsForbiddenWords(nickname) {
  const forbiddenWords = ['мат', 'пизда', 'ЛГБТ', 'нацизм', 'расизм', 'живодёрство', 'жестокость', 'негатив', 'ненависть', 'сука', 'ебать', 'хуй', 'fuck', 'hitler', 'gay', 'nazi', 'nigga', 'nigger', 'niggia', 'aiggin'];
  return forbiddenWords.some(word => nickname.toLowerCase().includes(word));
}

// Функция проверки уровня пароля
function checkPasswordStrength(password) {
  if (password.length < 6) return "Bad";
  if (password.length <= 8) return "Normal";
  return "Good";
}

// Функция загрузки изображения в Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Castify');

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/ddipbmelm/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image: ' + error.message);
    return null;
  }
}

// Слушатели событий для переключения форм
document.getElementById('show-register').addEventListener('click', () => {
  document.getElementById('login-form-container').style.display = 'none';
  document.getElementById('register-form-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', () => {
  document.getElementById('register-form-container').style.display = 'none';
  document.getElementById('login-form-container').style.display = 'block';
});

// Регистрация
document.getElementById('register-button').addEventListener('click', async () => {
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value.trim();
  const nickname = document.getElementById('nickname').value.trim();
  const profilePicture = document.getElementById('profile-picture').files[0];

  if (!email || !password || !nickname || !profilePicture) {
    alert('Please fill in all required fields and upload a profile picture!');
    return;
  }

  if (containsForbiddenWords(nickname)) {
    alert('Your nickname contains forbidden words!');
    return;
  }

  const passwordStrength = checkPasswordStrength(password);
  if (passwordStrength === "Bad") {
    alert('Password is too weak. Please use at least 6 characters.');
    return;
  }

  const methods = await fetchSignInMethodsForEmail(auth, email);
  if (methods.length > 0) {
    alert('This email is already in use. Please use a different email or login.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const photoURL = await uploadToCloudinary(profilePicture);
    if (!photoURL) {
      alert('Failed to upload profile picture.');
      return;
    }

    await updateProfile(user, { displayName: nickname, photoURL });
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, { email, nickname, photoURL });

    alert('Account successfully created!');
    window.location.href = "https://mostbadgeuser.github.io/Castify.com/";
  } catch (error) {
    console.error('Error during registration:', error);
    alert(`Registration failed: ${error.message}`);
  }
});

// Вход
document.getElementById('login-button').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    alert('Please fill in both fields to login!');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert('Login successful! Redirecting...');
    window.location.href = "https://mostbadgeuser.github.io/Castify.com/";
  } catch (error) {
    console.error('Error during login:', error);
    alert(`Login failed: ${error.message}`);
  }
});