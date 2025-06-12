import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Expected Firestore 'orders' document structure:
// {
//   orderId: string, (usually the document ID itself)
//   userId: string,
//   items: array,
//   orderDate: admin.firestore.Timestamp, // Firestore Timestamp
//   status: string, // e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
//   shipmentStatus: string, // e.g., 'label_created', 'in_transit', 'out_for_delivery', 'failed_attempt'
//   shippingAddress: object,
//   trackingNumber?: string, // Optional, for external carrier
//   carrier?: string, // Optional
//   liveLocationDetails?: string | object, // Placeholder for live location info. Could be text or structured data.
//   estimatedDelivery?: admin.firestore.Timestamp // Firestore Timestamp, optional
// }

interface GetOrderTrackingInfoData {
  orderId: string;
}

/**
 * Callable Cloud Function to get order tracking information.
 *
 * @param request The request object from the client, containing data and context.
 *                For v1 onCall, data is the first argument, but TS seems to be inferring v2 types here.
 * @param context Metadata about the call, including auth status.
 */
export const getOrderTrackingInfo = functions.https.onCall(async (requestOrData: GetOrderTrackingInfoData | functions.https.CallableRequest<GetOrderTrackingInfoData>, context) => {

  // Try to determine if it's v1 data or v2 request structure based on type system's complaint
  // This is a workaround for the confusing type error.
  // The runtime behavior for firebase-functions v6.x.x should be that 'requestOrData' IS 'GetOrderTrackingInfoData'.
  // However, the TypeScript error "Property 'orderId' does not exist on type 'CallableRequest<any>'" for 'data.orderId'
  // suggests that during type checking (perhaps in the test environment), 'requestOrData' is seen as 'CallableRequest'.

  let actualData: GetOrderTrackingInfoData;
  if ('data' in requestOrData && typeof requestOrData.data === 'object' && requestOrData.data !== null && 'orderId' in requestOrData.data) {
    // This path suggests it's being treated as a v2-like CallableRequest<T>
    actualData = requestOrData.data as GetOrderTrackingInfoData;
    console.log("Interpreted as v2 request structure. Received request.data:", actualData);
  } else if ('orderId' in requestOrData) {
    // This path suggests it's v1 data directly
    actualData = requestOrData as GetOrderTrackingInfoData;
    console.log("Interpreted as v1 data structure. Received data:", actualData);
  } else {
    // Fallback or throw error if data structure is completely unexpected
    console.error("Validation Error: Data structure is unexpected.", requestOrData);
    throw new functions.https.HttpsError('invalid-argument', 'Unexpected data structure.');
  }

  const orderId = actualData.orderId;

  // Log the incoming data for debugging
  // console.log("Received data:", actualData); // Already logged above based on path

  // Ensure the user is authenticated if necessary (optional, based on your app's auth requirements)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'The function must be called while authenticated.'
  //   );
  // }

  if (!orderId || typeof orderId !== 'string') {
    console.error("Validation Error: orderId is missing or not a string.", actualData);
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a valid "orderId" string argument.'
    );
  }

  const db = admin.firestore();

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      console.log(`Order with ID: ${orderId} not found.`);
      throw new functions.https.HttpsError(
        'not-found',
        `Order with ID ${orderId} not found.`
      );
    }

    const orderData = orderDoc.data();

    if (!orderData) {
      // This case should ideally not happen if orderDoc.exists is true, but good for safety.
      console.error(`No data found for existing order ID: ${orderId}`);
      throw new functions.https.HttpsError(
        'internal',
        `Could not retrieve data for order ID ${orderId}.`
      );
    }

    // Construct the response object
    // Ensure all fields accessed from orderData are handled safely if they might be undefined
    const response = {
      orderId: orderId, // Use the extracted orderId
      status: orderData.status || 'N/A',
      shipmentStatus: orderData.shipmentStatus || 'N/A',
      liveLocation: orderData.liveLocationDetails || 'Location tracking details are not yet available.',
      // Add any other relevant fields from orderData, ensuring they are safely accessed
      orderDate: orderData.orderDate ? orderData.orderDate.toDate().toISOString() : 'N/A', // Example: Convert Timestamp to ISO string
      estimatedDelivery: orderData.estimatedDelivery ? orderData.estimatedDelivery.toDate().toISOString() : 'N/A',
      trackingNumber: orderData.trackingNumber || 'N/A',
      carrier: orderData.carrier || 'N/A',
    };

    console.log(`Returning tracking info for order ID: ${orderId}`, response);
    return response;

  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    if (error instanceof functions.https.HttpsError) {
      throw error; // Re-throw HttpsError as is
    }
    // For other types of errors, throw a generic internal error
    throw new functions.https.HttpsError(
      'internal',
      `An unexpected error occurred while fetching tracking information for order ${orderId}.`
    );
  }
});
