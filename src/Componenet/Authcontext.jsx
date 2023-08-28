// AuthContext.js
import { createContext, useContext } from 'react';
import { auth } from './firestoreconfig';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const value = {
        auth,
        // You can add more authentication related functions here
        signOut: async () => {
            await auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
