import { FirebaseApp, initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    Firestore,
} from "firebase/firestore";
import { AuthService } from "./services/auth";

// import { convertTimestamps, prepareForFirestore } from "./services/firestore";

// Initialize Firebase
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: AuthService | null = null;

async function getApp(): Promise<FirebaseApp> {
    if (app) {
        return Promise.resolve(app);
    }
    const resp = await fetch(browser.runtime.getURL("/firebase_config.json"));
    if (!resp.ok) {
        throw new Error(`Failed to fetch Firebase config: ${resp.statusText}`);
    }
    const firebaseConfig = await resp.json();
    app = initializeApp(firebaseConfig);
    return Promise.resolve(app);
}

async function getDb(): Promise<Firestore> {
    if (db) {
        return Promise.resolve(db);
    }
    db = getFirestore(await getApp());
    return Promise.resolve(db);
}

async function getAuthService(): Promise<AuthService> {
    if (auth) {
        return Promise.resolve(auth);
    }
    auth = new AuthService(await getApp());
    return Promise.resolve(auth);
}

export default defineBackground(() => {
    console.log("Hello background!", { id: browser.runtime.id });

    // Handle messages from popup and content scripts
    chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            // Handle authentication requests
            if (request.type === "SIGN_IN") {
                (await getAuthService())
                    .signInWithChromeIdentity()
                    .then(sendResponse)
                    .catch((error) => sendResponse({ error }));
                return true;
            }
            if (request.type === "SIGN_OUT") {
                (await getAuthService())
                    .signOut()
                    .then(sendResponse)
                    .catch((error) => sendResponse({ error }));
                return true;
            }
            if (request.type === "GET_AUTH_STATE") {
                const user = (await getAuthService()).getUser();
                sendResponse({
                    isAuthenticated: !!user,
                    userId: user?.uid || null,
                });
                return true;
            }
            if (request.type === "TMP_FIRESTORE_TEST") {
                // For now we'll make it the client's responsibility to first say "SIGN_IN"
                const d = await getDoc(
                    doc(collection(await getDb(), "a"), "b")
                );
                if (d.exists()) {
                    console.log("not found");
                } else {
                    console.log(d.data());
                }
                sendResponse({ success: true });
                return true;
            }

            /*
        
                TODO later -- set up the server side of an "RPC" service
                // Handle Firestore operations
                if (request.type === 'FIRESTORE_GET') {
                  handleFirestoreGet(request).then(sendResponse).catch(error => sendResponse({error: error.message}));
                  return true;
                }
              
                if (request.type === 'FIRESTORE_QUERY') {
                  handleFirestoreQuery(request).then(sendResponse).catch(error => sendResponse({error: error.message}));
                  return true;
                }
              
                if (request.type === 'FIRESTORE_ADD') {
                  handleFirestoreAdd(request).then(sendResponse).catch(error => sendResponse({error: error.message}));
                  return true;
                }
              
                if (request.type === 'FIRESTORE_UPDATE') {
                  handleFirestoreUpdate(request).then(sendResponse).catch(error => sendResponse({error: error.message}));
                  return true;
                }
              
                if (request.type === 'FIRESTORE_DELETE') {
                  handleFirestoreDelete(request).then(sendResponse).catch(error => sendResponse({error: error.message}));
                  return true;
                }
              */
            return false;
        }
    );
});

/* Later: Add implementation of service here
// Firestore operation handlers
async function handleFirestoreGet(request) {
    if (!currentUser) return { error: "Not authenticated" };
  
    try {
      const docRef = doc(db, request.collection, request.docId);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        return { 
          exists: true, 
          data: convertTimestamps(docSnap.data()) 
        };
      } else {
        return { exists: false };
      }
    } catch (error) {
      console.error("Firestore get error:", error);
      throw error;
    }
}

async function handleFirestoreQuery(request) {
    if (!currentUser) return { error: "Not authenticated" };
  
    try {
      let q = collection(db, request.collection);
    
      if (request.filters && request.filters.length > 0) {
        q = query(q, ...request.filters.map(f => where(f[0], f[1], f[2])));
      }
    
      const querySnapshot = await getDocs(q);
      const results = [];
    
      querySnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          data: convertTimestamps(doc.data())
        });
      });
    
      return { results };
    } catch (error) {
      console.error("Firestore query error:", error);
      throw error;
    }
}

async function handleFirestoreAdd(request) {
    if (!currentUser) return { error: "Not authenticated" };
  
    try {
      const collectionRef = collection(db, request.collection);
      const dataToAdd = prepareForFirestore(request.data);
    
      // Add user ID to document if not already present
      if (!dataToAdd.userId) {
        dataToAdd.userId = currentUser.uid;
      }
    
      const docRef = await addDoc(collectionRef, dataToAdd);
      return { 
        success: true, 
        docId: docRef.id 
      };
    } catch (error) {
      console.error("Firestore add error:", error);
      throw error;
    }
}

async function handleFirestoreUpdate(request) {
    if (!currentUser) return { error: "Not authenticated" };
  
    try {
      const docRef = doc(db, request.collection, request.docId);
      const dataToUpdate = prepareForFirestore(request.data);
    
      await updateDoc(docRef, dataToUpdate);
      return { success: true };
    } catch (error) {
      console.error("Firestore update error:", error);
      throw error;
    }
}

async function handleFirestoreDelete(request) {
    if (!currentUser) return { error: "Not authenticated" };
  
    try {
      const docRef = doc(db, request.collection, request.docId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error("Firestore delete error:", error);
      throw error;
    }
}

*/
