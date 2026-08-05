import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Ensure 32-byte key from environment or fallback hash
const SECRET_KEY = crypto
  .createHash('sha256')
  .update(process.env.ENCRYPTION_KEY || 'malin-market-pdpa-secret-key-2026')
  .digest();

/**
 * Encrypts a plain text string (e.g. Thai Citizen ID) using AES-256-GCM.
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted string format: "iv_hex:auth_tag_hex:encrypted_hex"
 */
export function encryptID(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM cipher text back to plain text.
 * @param {string} cipherText - Format: "iv_hex:auth_tag_hex:encrypted_hex"
 * @returns {string} Decrypted plain text
 */
export function decryptID(cipherText) {
  if (!cipherText || !cipherText.includes(':')) return '';
  try {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return '[ENCRYPTED_DATA]';
  }
}
