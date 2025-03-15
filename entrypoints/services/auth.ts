import { FirebaseApp, initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithCredential,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
    Auth,
} from "firebase/auth";

export class AuthService {
    private app: FirebaseApp;
    private auth: Auth | null = null;
    private user: User | null = null;
    constructor(app: FirebaseApp) {
        this.app = app;
    }
    /**
     * Sign in using chrome.identity and Firebase
     */
    async signInWithChromeIdentity(): Promise<User> {
        return new Promise((resolve, reject) => {
            // Request token from Chrome
            chrome.identity.getAuthToken(
                { interactive: true },
                async (token) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    try {
                        // Create credential from token
                        const credential = GoogleAuthProvider.credential(
                            null,
                            token
                        );

                        // Sign in to Firebase with credential
                        const userCredential = await signInWithCredential(
                            this.getAuth(),
                            credential
                        );

                        // Return the user
                        resolve(userCredential.user);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    getUser(): User | null {
        return this.user;
    }

    /**
     * Sign out from Google and Firebase.
     * TODO is this the proper way to sign out?
     */
    async signOut(): Promise<void> {
        await chrome.identity.clearAllCachedAuthTokens();
        await this.getAuth().signOut();
    }

    private getAuth(): Auth {
        if (this.auth) {
            return this.auth;
        }
        this.auth = getAuth(this.app);
        onAuthStateChanged(this.auth, (user) => {
            this.user = user;
        });
        return this.auth;
    }
}
