import dotenv from 'dotenv';

dotenv.config();

// Standardizing the check
const firebaseCreds = process.env.FIREBASE_ADMIN_CREDENTIAL;
const isCloudRun = !!process.env.K_SERVICE;

// Only enforce the presence of the credentials string if we are NOT on Cloud Run
if (!firebaseCreds && !isCloudRun) {
   // We throw an error immediately. This stops the app from 
   // starting in a "broken" state.
  throw new Error("❌ MISSING ENVAR: FIREBASE_ADMIN_CREDENTIAL is required for local development.");
}


export const ENV = {
  FIREBASE_CREDENTIALS: firebaseCreds, // String when local, undefined on Cloud Run and TypeScript now knows this is a string
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_CLOUD_RUN: isCloudRun,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string, // Obtained from Stripe Dashboard/CLI
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173', // Your React app URL
} as const;  // 'as const' makes the properties read-only