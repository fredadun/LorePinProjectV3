import React from 'react';
import { Admin, Resource } from 'react-admin';
import { UserList, UserEdit, UserCreate } from './components/users';
import { RoleList, RoleEdit, RoleCreate } from './components/roles';
import { ModerationList, ModerationEdit } from './components/moderation';
import { ChallengeList, ChallengeEdit, ChallengeCreate } from './components/challenges';
import Dashboard from './components/Dashboard';
import authProvider from './providers/authProvider';
import dataProvider from './providers/dataProvider';
import theme from './theme';
import { firebaseConfig } from './config/firebase';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Connect to Firebase emulators when running locally
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('Using Firebase emulators');
  
  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('Connected to Auth emulator at localhost:9099');
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator at localhost:8080');
    
    // Connect to Functions emulator
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('Connected to Functions emulator at localhost:5001');
    
    console.log('All Firebase emulators connected successfully');
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
}

const App = () => (
  <Admin 
    dashboard={Dashboard}
    dataProvider={dataProvider}
    authProvider={authProvider}
    theme={theme}
    title="LorePin CMS"
  >
    <Resource 
      name="users" 
      list={UserList} 
      edit={UserEdit} 
      create={UserCreate} 
      options={{ label: 'User Management' }}
    />
    <Resource 
      name="roles" 
      list={RoleList} 
      edit={RoleEdit} 
      create={RoleCreate} 
      options={{ label: 'Role Management' }}
    />
    <Resource 
      name="moderation" 
      list={ModerationList} 
      edit={ModerationEdit} 
      options={{ label: 'Moderation Queue' }}
    />
    <Resource 
      name="challenges" 
      list={ChallengeList} 
      edit={ChallengeEdit} 
      create={ChallengeCreate} 
      options={{ label: 'Challenge Management' }}
    />
  </Admin>
);

export default App; 