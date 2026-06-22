import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { ENV } from './env.js'; // Import our gatekeeper

/**
 * -----------------------------
 * Firebase Admin initialization
 * -----------------------------
 */

/**
 * Firebase Admin Initialization Strategy
 * Local Dev: Uses stringified JSON service account credentials from ENV.
 * Cloud Run: Automatic fallback to Application Default Credentials (ADC).
 */
try {
  if (getApps().length === 0) {
    if (ENV.FIREBASE_CREDENTIALS) {
      // 1. Local Development Path
      const serviceAccount = JSON.parse(ENV.FIREBASE_CREDENTIALS);
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log(`✅ Firebase Admin initialized via local JSON key: ${serviceAccount.project_id}`);
    } else if (ENV.IS_CLOUD_RUN) {
      // 2. Production Cloud Run Path (ADC)
      initializeApp();
      console.log('✅ Firebase Admin initialized via Cloud Run Ambient Credentials (ADC).');
    } else {
      throw new Error('No valid initialization configuration found.');
    }
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error);
  process.exit(1);
}


// Export clean, direct instances for your application logic
export const db = getFirestore();
export const auth = getAuth();