// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1eLfwECUvufRcFFwBDaQY6tHHdwkA3Mg", // Updated with a valid API key
  authDomain: "lorebacking-test.firebaseapp.com",
  projectId: "lorebacking-test",
  storageBucket: "lorebacking-test.firebasestorage.app",
  messagingSenderId: "532363101127",
  appId: "1:532363101127:web:645922acc5144943d54fe2",
  measurementId: "G-MSFZ41D7GM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// References to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// DOM elements
const loginContainer = document.getElementById('login-container');
const userContainer = document.getElementById('user-container');
const cmsContent = document.getElementById('cms-content');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');

// Auth elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');

// CMS elements
const checkHealthBtn = document.getElementById('check-health-btn');
const getRolesBtn = document.getElementById('get-roles-btn');
const getUsersBtn = document.getElementById('get-users-btn');
const getQueueBtn = document.getElementById('get-queue-btn');
const getChallengesBtn = document.getElementById('get-challenges-btn');

const healthResult = document.getElementById('health-result');
const rolesResult = document.getElementById('roles-result');
const usersResult = document.getElementById('users-result');
const moderationResult = document.getElementById('moderation-result');
const challengesResult = document.getElementById('challenges-result');

// Auth state observer
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    loginContainer.classList.add('hidden');
    userContainer.classList.remove('hidden');
    cmsContent.classList.remove('hidden');
    
    // Update user info
    userName.textContent = user.displayName || 'User';
    userEmail.textContent = user.email;
    
    // Get ID token for API calls
    user.getIdToken().then(token => {
      window.authToken = token;
    });
  } else {
    // User is signed out
    loginContainer.classList.remove('hidden');
    userContainer.classList.add('hidden');
    cmsContent.classList.add('hidden');
    
    // Clear user info
    userName.textContent = '';
    userEmail.textContent = '';
    window.authToken = null;
  }
});

// Login
loginBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  
  auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      alert(`Login error: ${error.message}`);
    });
});

// Register
registerBtn.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Add user to Firestore with admin role for testing
      return db.collection('users').doc(userCredential.user.uid).set({
        email: email,
        role: 'admin',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .catch(error => {
      alert(`Registration error: ${error.message}`);
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Helper function to make authenticated API calls
async function callApi(endpoint, method = 'GET', body = null) {
  // Use the deployed function URL
  const baseUrl = 'https://europe-west2-lorebacking-test.cloudfunctions.net/cms';
  const url = `${baseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.authToken}`
  };
  
  const options = {
    method,
    headers,
    mode: 'cors'
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Display JSON data in a pretty format
function displayJson(element, data) {
  element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// Health check
checkHealthBtn.addEventListener('click', async () => {
  try {
    const data = await callApi('/health');
    displayJson(healthResult, data);
  } catch (error) {
    healthResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});

// Get roles
getRolesBtn.addEventListener('click', async () => {
  try {
    const data = await callApi('/roles');
    displayJson(rolesResult, data);
  } catch (error) {
    rolesResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});

// Get users
getUsersBtn.addEventListener('click', async () => {
  try {
    const data = await callApi('/users');
    displayJson(usersResult, data);
  } catch (error) {
    usersResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});

// Get moderation queue
getQueueBtn.addEventListener('click', async () => {
  try {
    const data = await callApi('/moderation/queue');
    displayJson(moderationResult, data);
  } catch (error) {
    moderationResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
});

// Get challenges
getChallengesBtn.addEventListener('click', async () => {
  try {
    const data = await callApi('/challenges');
    displayJson(challengesResult, data);
  } catch (error) {
    challengesResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}); 