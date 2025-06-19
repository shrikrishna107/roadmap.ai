// lib/firebase/admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n');
};

// Hardcoded service account credentials
const serviceAccount = {
  "type": "service_account",
  "project_id": "roadmap-60145",
  "private_key_id": "b58c5f12c68ca48b90978e1a8fc1138cb5995bf2",
  "private_key": formatPrivateKey("-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkjV488kSxOAam\n8y9HlJEjfBI5n+LuKL4W11RVGcMC37yKA3TOS/xwCzZXc9VlbiPrw8FtvCzaAuth\nBH3AVMUOnRc/eFr0qInKP55Sp+Z5m4qxh1dL1K6xti42+r4eZipVdOvj8xZmzepz\n3H52DluG25QR9UMV+gwGxzuvfV7ySpkAIblwr7aFbNmgOljq97qgBp7K3VAukL/W\n/mGUCOcV2cBwFqln0zMS6HNM2N18BdGNjF784QbLyZ76Nc5BHAO+8QmgS3p4Fapt\nRtaf8hmINyzU4M8F9BgZE5fPMNOQmbIBjF/7Xh1PsDnJ2JbXketsc9R5XDAOXStx\ncYX0OYM9AgMBAAECggEABuFbVqCJo0BUtN/Xsv5BCFMMfwjSqAMfmZxkzA8g8oqQ\n21N0K5kNQ9EQM11mR5Cwo0/C03gKBw6WsW6K5IMW3zrNyUtawD6YzlJVKB8Zma2Z\ngb1HNuY8bLVRnt5imypJ7FtQbq5QGjnTawdF6WFFzfB58ztGVBGptZHYisiq8uX+\n7uMwOIao7uptNpyHx+TSqoONnc/oUQgzuOzXCEi9o+PIwvAYB6hGaEWXy+agvNPx\nAqJZxzzIoovDhoqq7OH2bZq0P0RsLgp0ppyNem+gh98Ae63/6edmF6NJipNdBrES\nsKn/WNY3hbtTpyMf0xIjO7Ik4QZbmzpg3AnrAXvMKQKBgQDSjJeXO/oVx+S9+Tqb\nT6pu+2LGQ/jF4+YTGpg8sq3cSp8fyAm2n00rBbn6Y7b46DGFoz9Kda0VdOsNPeH7\nfIueO69X60sIWWUIhmXn7C4G4bUP1YxLOoqDJu42+XIo2p3W+JdFYc7e60/au9mQ\nxTbchTYb9cZ2CeRDvcgSf6DTiQKBgQDIEuIOnSqklkLA3abKG+NHdFH+753gsH6+\nGb7IQ5Y7bmXYMtG+vz8MRkMuqfxw5tFwXby0V4FO5OdkGADSIe00q4hVzkGuxxIZ\nu5rtcStgonzxJF+ljWXMb2m5IbS1NzlcnNm67X5M/n2HoGjT7rf8Hh1dyQui7yZt\ns0MmTEehFQKBgQC9EOanNYJywJdVSFIqWTVwh2jBJRRljypxCTafesvIv3F4dobS\naOZAtdm1UIljpg2iNV+GG3mbhOv1bhZZYBN3uZzQ1EcCblPdfeJQirMiFtgiKd7b\nRuxOrUzILOMocHfALGaaNSQw5RlGD91ktNN43l4iaWcXY/aIJgldIyJmEQKBgEqV\nd335Kv9mIIZjWpz3Xnexrit6SgGL6gOV92ASifunwQGimDwicS9zNfI8XiX8ddEM\nsJ8OC99MR9IxfITZLuM2msFZ/XRZM68yF6QyTvhcOnVumNVPa8aVNfVU0lfHuXOD\n6Urc4/tx13vq2Yk/8Yhj9ZCTtOnNeybj78FkKEOtAoGBALoTS+VaV5HNGM3Xc2DI\nADPHyFb9edp3iEaPCLLALvQgvotpElmTem8MaRzXQ+/reQU07BbE7869F38eJWkX\n+71JRseIPgtmr2sF5TfsPKoQlKlrpBxFv7SfdxREuK32IeZ9neJoAhDkMx3MPHtK\nX27RodgqWQ9SsDqT4GS/xyvP\n-----END PRIVATE KEY-----\n"),
  "client_email": "firebase-adminsdk-fbsvc@roadmap-60145.iam.gserviceaccount.com",
  "client_id": "107384596215712332702",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40roadmap-60145.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Firebase Admin
function getFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully");
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
      throw new Error("Firebase initialization failed");
    }
  }
  
  return {
    db: getFirestore()
  };
}

// Export the initialized Firestore instance
const { db: adminDb } = getFirebaseAdmin();
export { adminDb };
