// Firebase configuration is loaded from config.js
// The firebaseConfig variable is defined in config.js

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  alert("Error initializing Firebase: " + error.message);
}

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// Connect to Firebase emulators when running locally
if (useEmulators) {
  console.log("Using Firebase emulators");
  
  try {
    // Connect to Auth emulator - IMPORTANT: Use the correct format without http://
    auth.useEmulator("localhost", 9099);
    console.log("Connected to Auth emulator at localhost:9099");
    
    // Connect to Firestore emulator
    db.useEmulator("localhost", 8080);
    console.log("Connected to Firestore emulator at localhost:8080");
    
    // Connect to Functions emulator
    functions.useEmulator("localhost", 5001);
    console.log("Connected to Functions emulator at localhost:5001");
    
    console.log("All Firebase emulators connected successfully");
  } catch (error) {
    console.error("Error connecting to Firebase emulators:", error);
    alert("Error connecting to Firebase emulators: " + error.message);
  }
}

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
    console.log("User is signed in:", user.email);
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
    console.log("User is signed out");
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
  
  // Show loading state
  loginBtn.textContent = 'Logging in...';
  loginBtn.disabled = true;
  
  console.log(`Attempting to sign in user: ${email} with Firebase Auth emulator at localhost:9099`);
  
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("User signed in successfully:", userCredential.user.uid);
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
    })
    .catch(error => {
      console.error("Login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Provide more helpful error messages based on error code
      let errorMessage = error.message;
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error: Please check if the Firebase Auth emulator is running at localhost:9099';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found: Please register first or check your email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password: Please try again';
      }
      
      alert(`Login error: ${errorMessage}`);
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
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
  
  // Show loading state
  registerBtn.textContent = 'Registering...';
  registerBtn.disabled = true;
  
  console.log(`Attempting to register user: ${email} with Firebase Auth emulator at localhost:9099`);
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("User registered successfully:", userCredential.user.uid);
      
      // Add user to Firestore with admin role for testing
      console.log(`Adding user document to Firestore emulator at localhost:8080`);
      return db.collection('users').doc(userCredential.user.uid).set({
        email: email,
        role: 'admin',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      console.log("User document created in Firestore");
      registerBtn.textContent = 'Register';
      registerBtn.disabled = false;
    })
    .catch(error => {
      console.error("Registration error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Provide more helpful error messages based on error code
      let errorMessage = error.message;
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error: Please check if the Firebase Auth emulator is running at localhost:9099';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use: Please login instead';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Weak password: Please use a stronger password';
      }
      
      alert(`Registration error: ${errorMessage}`);
      registerBtn.textContent = 'Register';
      registerBtn.disabled = false;
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      console.log("User signed out");
    })
    .catch(error => {
      console.error("Logout error:", error);
    });
});

// Helper function to make authenticated API calls
async function callApi(endpoint, method = 'GET', body = null) {
  // Use the API URL from config.js
  const baseUrl = getApiUrl();
  
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
    console.log(`Making API call to ${url}`);
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