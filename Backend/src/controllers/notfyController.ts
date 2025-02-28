import { Request, Response } from "express";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { getMessaging } from "firebase-admin/messaging";
import * as admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "dasaram-backend",
  private_key_id: "257ac12d4a2fa8c9b815f2ec699fc38c73df394d",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUfYFlXdboxiwK\ngx3gplUlSW+iyNKyCJXMGczc8b9QUn3BeKD4FNYQmLc51oCeQ+sD08Uv54wcbIK9\nAsAyrtWdL2bXidczY8B1dHtta4TSaoOW6kU5fPqa8190P8NSVjX6FOduwan2/JFZ\nBhkiPQRcr+OLsuAQ33BRHwRW4F1B55Sk8PnEPWqD2Plj5J2ae15d2C3ZXNT7Csd8\nvRo9PpxZhBDwCAKOahlpzqpJ5Y4rHZSFvpyG1CZdJ87LWYkEx4e0pIW/Iz059wgp\nw8p5nfktOTB8CtmhvKuVli8ZWI5zRbEL45srp1hgqMMFaLl00HHDE+PPJHA/R4NU\nbUGADqBbAgMBAAECggEAAItx0Xi0HFSluEEtym2iuj2984TgRWSQPb2zML3N577O\nY7iTcQ9cnR5HGfbazY0PBSt9zemiClCc5S8knvyjv4tnkBXiX1daHvL1fgpQhNmR\nDMn883DGk68cB4hCT+u4p7N2BGqqrN9o3/mMBvJxGGu7AZiryl9IQmz57d8VXh3g\nqIvkrUNEHeT8MFGTJOW7KEGCPbbwmNzGfgEG7/ZoVXuktrouYmU07b64LByItvUl\nddy+p50n45nMsd0cSAHW3FN+zAkqZREiVyhoPEvMLsjKzj7nBLFQpWzQNIWpQb7C\nH2EtGcHuWy+HolhXEwY0D5mjj/1q3zUDL/iYNMfvwQKBgQD86/JbW+FePbYEFbUH\nk1yUxR9kdfLnseUxDFDN2lmOq0RIL+Pgccj7dhOzHWOyYn1ULJJrHsEVb20Vz/nV\nNb8JQKhxvoeB8ZQS4chPArUe6OsOwL/oIckIyb9HKxnguRB1PYosOLe6xBc9NveW\nGC7t9dFgLnoO4kchYuTRSkZe7wKBgQDXE5Uivceo+1CLsx4ec4A6YNmNnpESKJRJ\nD6G4l7PW/YWUYE0bI1kBEr4jnz2NUfsLAHqkq2koKBvLx9xvDtl1Dt7wJTyZZ5Sf\ngL90TDFEC/ZgJmd+Tq6MVc5TnCmuoc3Q7eTkYiA0SnTYSGLI5t/ce2509IFysoLU\nQRp0NZCVVQKBgQDwlXAgPzINdx4gnJVq813plejaoufARZQCJ/jlF4KBF6EIGaXl\n5daMfDEY/CfNk6or24obo1F/llJpoT/A9DMYFg0kxVwY2zdDDsp/fc/T6zNNAUSL\nBzg3x9DPXcxr2x4wp607i2gZnFWOwS6Z878QU/gqSYuJhOyscWm/O6vcuQKBgAeI\n8BiffXc2FsROKif28+8XpYeInpx8P3WvzoKhDfPiPePM2+avflbDSVYGJinlTV49\nTg6m0rBNd2vUPKzHYGbxdm4DX/Qf5N0RraNtZ+xyXtdPgSCzsPnJp8jWF7++e29u\nZi56IZazZRSOtKdFL2KSEHSYfFCAYIT/IuYfWklhAoGBAM7giGUo+oBmIyCR0tLW\nEMVKgH816Wund0K3fDVAev8WeU832pRSkgA8NRkq/JTTQIvwvm5BXleGl1PC59tN\nEoCRjcE1GCoUZwzJNmmnflR366wVHmDCnQFqhIeznY5AQkLGizoU9gY3eB/v1bhY\nhPsf4xwMwpfWAPUWlQgi7IDO\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-7zm8p@dasaram-backend.iam.gserviceaccount.com",
  client_id: "105987484778101420922",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7zm8p%40dasaram-backend.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export async function checkAddToken(req: any, res: any) {
  const { token, standardId } = req.body;
  if (token && standardId) {
    const standardRef = doc(db, "notfy", standardId);
    const docSnap = await getDoc(standardRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.tokens && data.tokens.includes(token)) {
        return res.status(200).json({ message: "Token already exists" });
      } else {
        await updateDoc(standardRef, {
          tokens: arrayUnion(token),
        });
        return res.status(200).json({ message: "Token added" });
      }
    } else {
      await setDoc(standardRef, {
        tokens: [token],
      });
      return res
        .status(200)
        .json({ message: "Standard created and token added" });
    }
  }
  return res.status(400).json({ message: "Token or standardId not provided" });
}

export async function sendNotification(standardId  :any, title: any, body: any) {
  if (standardId && title && body) {
    const standardRef = doc(db, "notfy", standardId);
    const docSnap = await getDoc(standardRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.tokens) {
        // send notification
        sendNotificationToTokens(data.tokens, title, body);
      } else {
      }
    } else {
    }
  }
}

async function sendNotificationToTokens(
  tokens: string[],
  title: string,
  body: string
) {
  const messaging = getMessaging();
  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: tokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}


export async function removeToken(req: any, res: any) {
    const { token, standardId } = req.body;
    if (token && standardId) {
        const standardRef = doc(db, "notfy", standardId);
        const docSnap = await getDoc(standardRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.tokens && data.tokens.includes(token)) {
                const updatedTokens = data.tokens.filter((t: string) => t !== token);
                await updateDoc(standardRef, {
                    tokens: updatedTokens,
                });
                return res.status(200).json({ message: "Token removed" });
            } else {
                return res.status(404).json({ message: "Token not found" });
            }
        } else {
            return res.status(404).json({ message: "Standard not found" });
        }
    }
    return res.status(400).json({ message: "Token or standardId not provided" });

}
