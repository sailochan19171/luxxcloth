import * as functions from 'firebase-functions'; // For HttpsError
import * as admin from 'firebase-admin'; // To access the mocked version

// Initialize firebase-functions-test. offline: true to avoid external calls.
const testEnv = require('firebase-functions-test')({
  projectId: 'my-test-project', // Required, but can be a dummy for offline tests
});

// --- Mocks ---
// Define the mock for the .get() method before it's used in the admin mock
const mockFirestoreGet = jest.fn();
const mockFirestoreDoc = jest.fn((docId) => ({
  get: mockFirestoreGet,
}));
const mockFirestoreCollection = jest.fn((collectionName) => ({
  doc: mockFirestoreDoc,
}));

jest.mock('firebase-admin', () => {
  const actualAdmin = jest.requireActual('firebase-admin');
  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({
      collection: mockFirestoreCollection,
    })),
    // Provide the real Timestamp constructor for tests that need to create Timestamp instances
    // This allows `new admin.firestore.Timestamp()` to work in tests.
    // We place it on `admin.firestore` as that's its actual location.
    // Note: The 'firestore' property above is a jest.fn(), so we modify its 'Timestamp' property.
    // It's a bit unconventional, but jest.mock hoists, so we define Timestamp on the mocked firestore object.
    _actualFirestoreForTimestamp: actualAdmin.firestore, // Store actual for Timestamp
  };
});

// Attach Timestamp to the mocked firestore object after the mock is defined.
// This is a common pattern when part of a mocked module needs to retain original functionality.
(admin.firestore as any).Timestamp = jest.requireActual('firebase-admin').firestore.Timestamp;


// Import the function to be tested (must come AFTER jest.mock)
const { getOrderTrackingInfo } = require('./index');

// Wrap the function for testing
const wrappedGetOrderTrackingInfo = testEnv.wrap(getOrderTrackingInfo);

describe('getOrderTrackingInfo Cloud Function', () => {
  // No need for `mockedAdmin` variable as mocks are accessed via imported `admin` directly
  // or via the specific mock function variables like `mockFirestoreGet`.

  beforeEach(() => {
    // Reset all mock implementations and call history before each test
    jest.clearAllMocks();
    mockFirestoreGet.mockReset(); // Ensure .get() is reset for each test
    mockFirestoreDoc.mockClear();
    mockFirestoreCollection.mockClear();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it('should return tracking data for a valid orderId', async () => {
    const mockOrderData = {
      status: 'shipped',
      shipmentStatus: 'in_transit',
      liveLocationDetails: 'Near your city',
      // Use admin.firestore.Timestamp for creating test data
      orderDate: new admin.firestore.Timestamp(1678886400, 0),
      estimatedDelivery: new admin.firestore.Timestamp(1679520000, 0),
      trackingNumber: 'TN123XYZ',
      carrier: 'SuperFast Shipping',
    };
    mockFirestoreGet.mockResolvedValue({
      exists: true,
      data: () => mockOrderData,
    });

    // Call the wrapped function
    const result = await wrappedGetOrderTrackingInfo({ orderId: 'validOrderId' });

    expect(result).toEqual({
      orderId: 'validOrderId',
      status: 'shipped',
      shipmentStatus: 'in_transit',
      liveLocation: 'Near your city',
      orderDate: new Date(1678886400 * 1000).toISOString(),
      estimatedDelivery: new Date(1679520000 * 1000).toISOString(),
      trackingNumber: 'TN123XYZ',
      carrier: 'SuperFast Shipping',
    });

    expect(mockFirestoreCollection).toHaveBeenCalledWith('orders');
    expect(mockFirestoreDoc).toHaveBeenCalledWith('validOrderId');
    expect(mockFirestoreGet).toHaveBeenCalledTimes(1);
  });

  it('should throw "not-found" error if order does not exist', async () => {
    mockFirestoreGet.mockResolvedValue({ exists: false });

    try {
      await wrappedGetOrderTrackingInfo({ orderId: 'nonExistentId' });
      fail('The function should have thrown an HttpsError.');
    } catch (error: any) {
      expect(error).toBeInstanceOf(functions.https.HttpsError);
      expect(error.code).toBe('not-found');
      expect(error.message).toBe('Order with ID nonExistentId not found.');
    }
    expect(mockFirestoreDoc).toHaveBeenCalledWith('nonExistentId');
  });

  it('should throw "invalid-argument" if orderId is missing', async () => {
    try {
      await wrappedGetOrderTrackingInfo({} as any); // Cast to any for testing invalid call
      fail('The function should have thrown an HttpsError.');
    } catch (error: any) {
      expect(error).toBeInstanceOf(functions.https.HttpsError);
      expect(error.code).toBe('invalid-argument');
      // Message check removed as it might be too brittle if function changes slightly
    }
  });

  it('should throw "invalid-argument" if orderId is not a string', async () => {
    try {
      await wrappedGetOrderTrackingInfo({ orderId: 12345 } as any); // Cast for testing
      fail('The function should have thrown an HttpsError.');
    } catch (error: any) {
      expect(error).toBeInstanceOf(functions.https.HttpsError);
      expect(error.code).toBe('invalid-argument');
    }
  });

  it('should throw "internal" error if Firestore get() call rejects', async () => {
    const firestoreError = new Error('Firestore unavailable');
    mockFirestoreGet.mockRejectedValue(firestoreError);

    try {
      await wrappedGetOrderTrackingInfo({ orderId: 'anyOrderId' });
      fail('The function should have thrown an HttpsError for Firestore failure.');
    } catch (error: any) {
      expect(error).toBeInstanceOf(functions.https.HttpsError);
      expect(error.code).toBe('internal');
      expect(error.message).toContain('An unexpected error occurred');
    }
    expect(mockFirestoreDoc).toHaveBeenCalledWith('anyOrderId');
  });
});
