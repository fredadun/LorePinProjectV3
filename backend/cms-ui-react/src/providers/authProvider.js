import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const authProvider = {
  login: ({ username, password }) => {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        // Get user role from Firestore
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Check if user has admin role
          if (userData.role === 'admin' || userData.role === 'super_admin' || userData.role === 'content_admin' || userData.role === 'moderator') {
            localStorage.setItem('auth', JSON.stringify({
              uid: user.uid,
              displayName: user.displayName || userData.displayName || username,
              email: user.email,
              role: userData.role
            }));
            return Promise.resolve();
          } else {
            return signOut(auth).then(() => {
              localStorage.removeItem('auth');
              return Promise.reject({ message: 'Insufficient permissions. You need admin role to access the CMS.' });
            });
          }
        } else {
          return signOut(auth).then(() => {
            localStorage.removeItem('auth');
            return Promise.reject({ message: 'User profile not found.' });
          });
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        return Promise.reject(error);
      });
  },
  
  logout: () => {
    const auth = getAuth();
    return signOut(auth)
      .then(() => {
        localStorage.removeItem('auth');
        return Promise.resolve();
      })
      .catch((error) => {
        console.error('Logout error:', error);
        return Promise.reject(error);
      });
  },
  
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  
  checkAuth: () => {
    return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
  },
  
  getPermissions: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { role } = JSON.parse(auth);
      return Promise.resolve(role);
    }
    return Promise.reject();
  },
  
  getIdentity: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { uid, displayName, email } = JSON.parse(auth);
      return Promise.resolve({ id: uid, fullName: displayName, email });
    }
    return Promise.reject();
  }
};

export default authProvider; 