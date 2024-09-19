import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Define the secret key (must be the same as the one used in the client app)
// Ensure that the key is base64 encoded and 32 bytes (AES-256)

function loadKey() {
    const apiKey = process.env.API_KEY
    if(apiKey == undefined) {
        return null
    }
    return Buffer.from(apiKey, 'base64'); 
}

// Middleware to decrypt AES-encrypted request body
const decryptRequestBody = (req: Request, res: Response, next: NextFunction): void => {
    try {

        const secretKey = loadKey()
        if(secretKey == null){
            res.status(500).json({error: "API_KEY not defined in .env"})
            return 
        }

        if(req.method !== "POST" && req.method !== "PUT"){
            next()
            return 
        }

        // Extract the encrypted data from the request body
        const { encryptedData } = req.body;

        if (!encryptedData) {
            res.status(400).json({ error: 'No encrypted data found' });
            return;
        }

        // Split the encryptedData (format: IV:ciphertext)
        const [ivBase64, encryptedBase64] = encryptedData.split(':');
        if (!ivBase64 || !encryptedBase64) {
            res.status(400).json({ error: 'Invalid encrypted data format' });
            return;
        }

        // Convert IV and encrypted data from Base64 to Buffers
        const iv = Buffer.from(ivBase64, 'base64');
        const encryptedText = Buffer.from(encryptedBase64, 'base64');

        // Create a decipher instance using AES-256-CBC
        const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);

        // Decrypt the data
        let decrypted = decipher.update(encryptedText, undefined, 'utf8');
        decrypted += decipher.final('utf8');

        // Parse the decrypted data (assumes the decrypted string is JSON)
        req.body = JSON.parse(decrypted);

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error decrypting request body:', error);
        res.status(500).json({ error: 'Failed to decrypt request body' });
    }
};

export default decryptRequestBody;
