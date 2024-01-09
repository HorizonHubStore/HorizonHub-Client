import {jwtDecode} from 'jwt-decode' // import dependency

interface DecodedToken {
    _id: string;
    // Add other fields from your JWT payload
}

export const extractUserIdFromToken = (token: string): string | null => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);

        return decoded._id;
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
};
