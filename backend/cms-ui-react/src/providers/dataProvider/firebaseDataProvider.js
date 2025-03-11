import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

/**
 * Firebase Data Provider for React Admin
 * 
 * This provider connects React Admin to Firebase Firestore.
 * It handles CRUD operations and maps them to Firestore operations.
 */
const firebaseDataProvider = () => {
  const db = getFirestore();

  /**
   * Convert Firebase timestamp to ISO string
   */
  const convertTimestampToDate = (entity) => {
    const newEntity = { ...entity };
    
    Object.keys(newEntity).forEach(key => {
      if (newEntity[key] instanceof Timestamp) {
        newEntity[key] = newEntity[key].toDate().toISOString();
      } else if (newEntity[key] && typeof newEntity[key] === 'object') {
        newEntity[key] = convertTimestampToDate(newEntity[key]);
      }
    });
    
    return newEntity;
  };

  /**
   * Map React Admin queries to Firestore queries
   */
  const getQueryForCollection = (resourceName, params) => {
    const collectionRef = collection(db, resourceName);
    let firestoreQuery = query(collectionRef);
    
    // Filter
    if (params.filter) {
      Object.keys(params.filter).forEach(key => {
        if (key === 'q' && params.filter[key]) {
          // Full-text search is not directly supported by Firestore
          // This is a simplified approach that searches in specific fields
          // In a real app, you might want to use Algolia or a similar service
          firestoreQuery = query(
            firestoreQuery,
            where('title', '>=', params.filter[key]),
            where('title', '<=', params.filter[key] + '\uf8ff')
          );
        } else if (key.includes('_gte')) {
          const fieldName = key.replace('_gte', '');
          firestoreQuery = query(
            firestoreQuery,
            where(fieldName, '>=', params.filter[key])
          );
        } else if (key.includes('_lte')) {
          const fieldName = key.replace('_lte', '');
          firestoreQuery = query(
            firestoreQuery,
            where(fieldName, '<=', params.filter[key])
          );
        } else {
          firestoreQuery = query(
            firestoreQuery,
            where(key, '==', params.filter[key])
          );
        }
      });
    }
    
    // Sort
    if (params.sort && params.sort.field) {
      const { field, order } = params.sort;
      firestoreQuery = query(
        firestoreQuery,
        orderBy(field, order.toLowerCase())
      );
    }
    
    // Pagination
    if (params.pagination) {
      const { page, perPage } = params.pagination;
      firestoreQuery = query(
        firestoreQuery,
        limit(perPage)
      );
      
      if (page > 1 && params.pagination.lastDoc) {
        firestoreQuery = query(
          firestoreQuery,
          startAfter(params.pagination.lastDoc)
        );
      }
    }
    
    return firestoreQuery;
  };

  return {
    /**
     * Get a list of resources
     */
    getList: async (resourceName, params) => {
      const firestoreQuery = getQueryForCollection(resourceName, params);
      const snapshot = await getDocs(firestoreQuery);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampToDate(doc.data())
      }));
      
      return {
        data,
        total: data.length, // Firestore doesn't provide a count, so we use the length of the results
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    },
    
    /**
     * Get a single resource by id
     */
    getOne: async (resourceName, params) => {
      const docRef = doc(db, resourceName, params.id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        throw new Error(`Resource ${resourceName} with id ${params.id} not found`);
      }
      
      return {
        data: {
          id: snapshot.id,
          ...convertTimestampToDate(snapshot.data())
        }
      };
    },
    
    /**
     * Get multiple resources by ids
     */
    getMany: async (resourceName, params) => {
      const data = await Promise.all(
        params.ids.map(id => 
          getDoc(doc(db, resourceName, id))
            .then(snapshot => ({
              id: snapshot.id,
              ...convertTimestampToDate(snapshot.data())
            }))
        )
      );
      
      return { data };
    },
    
    /**
     * Get multiple resources by reference field
     */
    getManyReference: async (resourceName, params) => {
      const { target, id } = params;
      const firestoreQuery = query(
        collection(db, resourceName),
        where(target, '==', id)
      );
      
      const snapshot = await getDocs(firestoreQuery);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampToDate(doc.data())
      }));
      
      return {
        data,
        total: data.length
      };
    },
    
    /**
     * Create a resource
     */
    create: async (resourceName, params) => {
      const collectionRef = collection(db, resourceName);
      
      // Add timestamps
      const data = {
        ...params.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Remove id if it exists
      delete data.id;
      
      const docRef = await addDoc(collectionRef, data);
      const snapshot = await getDoc(docRef);
      
      return {
        data: {
          id: docRef.id,
          ...convertTimestampToDate(snapshot.data())
        }
      };
    },
    
    /**
     * Update a resource
     */
    update: async (resourceName, params) => {
      const docRef = doc(db, resourceName, params.id);
      
      // Add timestamp
      const data = {
        ...params.data,
        updatedAt: serverTimestamp()
      };
      
      // Remove id if it exists
      delete data.id;
      
      await updateDoc(docRef, data);
      const snapshot = await getDoc(docRef);
      
      return {
        data: {
          id: snapshot.id,
          ...convertTimestampToDate(snapshot.data())
        }
      };
    },
    
    /**
     * Update multiple resources
     */
    updateMany: async (resourceName, params) => {
      const { ids, data } = params;
      
      await Promise.all(
        ids.map(id => 
          updateDoc(doc(db, resourceName, id), {
            ...data,
            updatedAt: serverTimestamp()
          })
        )
      );
      
      return { data: ids };
    },
    
    /**
     * Delete a resource
     */
    delete: async (resourceName, params) => {
      const docRef = doc(db, resourceName, params.id);
      const snapshot = await getDoc(docRef);
      const data = snapshot.data();
      
      await deleteDoc(docRef);
      
      return {
        data: {
          id: params.id,
          ...convertTimestampToDate(data)
        }
      };
    },
    
    /**
     * Delete multiple resources
     */
    deleteMany: async (resourceName, params) => {
      const { ids } = params;
      
      await Promise.all(
        ids.map(id => deleteDoc(doc(db, resourceName, id)))
      );
      
      return { data: ids };
    }
  };
};

export default firebaseDataProvider; 