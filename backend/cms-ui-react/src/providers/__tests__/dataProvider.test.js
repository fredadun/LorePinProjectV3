import firebaseDataProvider from '../dataProvider/firebaseDataProvider';
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

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  serverTimestamp: jest.fn(),
  Timestamp: jest.fn()
}));

describe('Firebase Data Provider', () => {
  let dataProvider;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Initialize data provider
    dataProvider = firebaseDataProvider();
    
    // Mock getFirestore
    getFirestore.mockReturnValue({});
  });
  
  describe('getList', () => {
    test('returns list of resources', async () => {
      // Mock query
      query.mockReturnValue('mockQuery');
      
      // Mock getDocs
      const mockDocs = [
        {
          id: 'doc1',
          data: () => ({ name: 'Document 1', createdAt: new Date() })
        },
        {
          id: 'doc2',
          data: () => ({ name: 'Document 2', createdAt: new Date() })
        }
      ];
      getDocs.mockResolvedValue({ docs: mockDocs });
      
      // Call getList
      const result = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
        filter: {}
      });
      
      // Check if query was called
      expect(query).toHaveBeenCalled();
      
      // Check if getDocs was called with the query
      expect(getDocs).toHaveBeenCalledWith('mockQuery');
      
      // Check if the result has the correct structure
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toHaveProperty('id', 'doc1');
      expect(result.data[1]).toHaveProperty('id', 'doc2');
    });
  });
  
  describe('getOne', () => {
    test('returns a single resource', async () => {
      // Mock doc
      doc.mockReturnValue('mockDoc');
      
      // Mock getDoc
      const mockSnapshot = {
        id: 'doc1',
        exists: () => true,
        data: () => ({ name: 'Document 1', createdAt: new Date() })
      };
      getDoc.mockResolvedValue(mockSnapshot);
      
      // Call getOne
      const result = await dataProvider.getOne('users', { id: 'doc1' });
      
      // Check if doc was called with the correct arguments
      expect(doc).toHaveBeenCalledWith({}, 'users', 'doc1');
      
      // Check if getDoc was called with the doc reference
      expect(getDoc).toHaveBeenCalledWith('mockDoc');
      
      // Check if the result has the correct structure
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('id', 'doc1');
      expect(result.data).toHaveProperty('name', 'Document 1');
    });
    
    test('throws error if resource does not exist', async () => {
      // Mock doc
      doc.mockReturnValue('mockDoc');
      
      // Mock getDoc
      const mockSnapshot = {
        id: 'doc1',
        exists: () => false
      };
      getDoc.mockResolvedValue(mockSnapshot);
      
      // Call getOne and expect it to throw
      await expect(dataProvider.getOne('users', { id: 'doc1' })).rejects.toThrow(
        'Resource users with id doc1 not found'
      );
    });
  });
  
  describe('create', () => {
    test('creates a new resource', async () => {
      // Mock collection
      collection.mockReturnValue('mockCollection');
      
      // Mock addDoc
      const mockDocRef = { id: 'newDoc1' };
      addDoc.mockResolvedValue(mockDocRef);
      
      // Mock getDoc
      const mockSnapshot = {
        id: 'newDoc1',
        exists: () => true,
        data: () => ({ name: 'New Document', createdAt: new Date() })
      };
      getDoc.mockResolvedValue(mockSnapshot);
      
      // Mock serverTimestamp
      serverTimestamp.mockReturnValue('timestamp');
      
      // Call create
      const result = await dataProvider.create('users', {
        data: { name: 'New Document' }
      });
      
      // Check if collection was called with the correct arguments
      expect(collection).toHaveBeenCalledWith({}, 'users');
      
      // Check if addDoc was called with the collection reference and data
      expect(addDoc).toHaveBeenCalledWith('mockCollection', {
        name: 'New Document',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      });
      
      // Check if the result has the correct structure
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('id', 'newDoc1');
      expect(result.data).toHaveProperty('name', 'New Document');
    });
  });
}); 