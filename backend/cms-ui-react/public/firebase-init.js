// Firebase initialization script
(function() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
  });

  // Initialize Firebase with configuration
  function initializeFirebase() {
    try {
      console.log('Initializing Firebase...');
      
      // Get configuration from window variables (injected by server)
      const firebaseConfig = window.FIREBASE_CONFIG || {
        apiKey: window.process?.env?.REACT_APP_FIREBASE_API_KEY,
        authDomain: window.process?.env?.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: window.process?.env?.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: window.process?.env?.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: window.process?.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: window.process?.env?.REACT_APP_FIREBASE_APP_ID,
        measurementId: window.process?.env?.REACT_APP_FIREBASE_MEASUREMENT_ID
      };
      
      // Validate API key
      if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined' || firebaseConfig.apiKey === '') {
        throw new Error('Firebase API key is missing or invalid. Please check your .env file.');
      }
      
      // Check if we should use emulators
      const useEmulators = window.FIREBASE_USE_EMULATORS || 
                          (window.process?.env?.REACT_APP_USE_EMULATORS === 'true');
      
      // Get emulator configuration
      const emulatorConfig = window.FIREBASE_EMULATOR_CONFIG || {
        auth: window.process?.env?.REACT_APP_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099',
        firestore: window.process?.env?.REACT_APP_FIRESTORE_EMULATOR_HOST || 'localhost:8080',
        functions: window.process?.env?.REACT_APP_FUNCTIONS_EMULATOR_HOST || 'localhost:5001',
        storage: window.process?.env?.REACT_APP_FIREBASE_STORAGE_EMULATOR_HOST || 'localhost:9199'
      };

      // Log configuration
      console.log('Firebase Config:', {
        apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.substr(-6) : 'MISSING',
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        appId: firebaseConfig.appId ? '***' + firebaseConfig.appId.substr(-6) : 'MISSING'
      });
      console.log('Using Emulators:', useEmulators);
      if (useEmulators) {
        console.log('Emulator Config:', emulatorConfig);
      }

      // Initialize Firebase (handle case where it might already be initialized)
      let app;
      try {
        app = firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
      } catch (error) {
        if (error.code === 'app/duplicate-app') {
          console.log('Firebase already initialized, getting existing app');
          app = firebase.app();
        } else {
          throw error;
        }
      }

      // Initialize Firebase services
      const auth = firebase.auth();
      const firestore = firebase.firestore();
      const functions = firebase.functions();
      const storage = firebase.storage();

      // Connect to emulators if needed
      if (useEmulators) {
        connectToEmulators(auth, firestore, functions, storage, emulatorConfig);
      }

      // Make Firebase services available globally
      window.firebaseApp = app;
      window.firebaseAuth = auth;
      window.firebaseFirestore = firestore;
      window.firebaseFunctions = functions;
      window.firebaseStorage = storage;

      // Set persistence to LOCAL for better offline support
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          console.log('Firebase Auth persistence set to LOCAL');
        })
        .catch((error) => {
          console.warn('Could not set persistence:', error.message);
        });

      // Enable offline persistence for Firestore
      firestore.enablePersistence({
        synchronizeTabs: true
      }).catch(function(err) {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence could not be enabled: multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence is not available in this browser');
        } else {
          console.error('Error enabling Firestore persistence:', err);
        }
      });

      // Dispatch event when Firebase is ready
      const event = new CustomEvent('firebase-ready', { 
        detail: { 
          app, 
          auth, 
          firestore, 
          functions, 
          storage,
          usingEmulators: useEmulators
        } 
      });
      document.dispatchEvent(event);
      console.log('Firebase ready event dispatched');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      // Display error message to user
      const errorElement = document.createElement('div');
      errorElement.style.backgroundColor = '#f8d7da';
      errorElement.style.color = '#721c24';
      errorElement.style.padding = '10px';
      errorElement.style.margin = '10px';
      errorElement.style.borderRadius = '5px';
      errorElement.style.position = 'fixed';
      errorElement.style.top = '10px';
      errorElement.style.right = '10px';
      errorElement.style.zIndex = '9999';
      errorElement.innerHTML = `<strong>Firebase Error:</strong> ${error.message}`;
      document.body.appendChild(errorElement);
      
      // Remove error message after 10 seconds
      setTimeout(() => {
        errorElement.remove();
      }, 10000);
    }
  }

  // Connect to Firebase emulators
  function connectToEmulators(auth, firestore, functions, storage, emulatorConfig) {
    try {
      // Connect to Auth emulator
      if (emulatorConfig.auth) {
        const [host, port] = emulatorConfig.auth.split(':');
        auth.useEmulator(`http://${host}:${port}`);
        console.log(`Connected to Auth emulator at ${emulatorConfig.auth}`);
      }

      // Connect to Firestore emulator
      if (emulatorConfig.firestore) {
        const [host, port] = emulatorConfig.firestore.split(':');
        firestore.useEmulator(host, parseInt(port));
        console.log(`Connected to Firestore emulator at ${emulatorConfig.firestore}`);
        
        // Disable persistence warnings in emulator mode
        firestore.settings({
          ignoreUndefinedProperties: true,
          experimentalForceLongPolling: true
        });
      }

      // Connect to Functions emulator
      if (emulatorConfig.functions) {
        const [host, port] = emulatorConfig.functions.split(':');
        functions.useEmulator(host, parseInt(port));
        console.log(`Connected to Functions emulator at ${emulatorConfig.functions}`);
      }

      // Connect to Storage emulator
      if (emulatorConfig.storage) {
        const [host, port] = emulatorConfig.storage.split(':');
        storage.useEmulator(host, parseInt(port));
        console.log(`Connected to Storage emulator at ${emulatorConfig.storage}`);
      }
    } catch (error) {
      console.error('Error connecting to emulators:', error);
      // Continue without emulators
      console.log('Continuing with production services');
    }
  }
})(); 