import crypto from 'crypto';

// 加密配置
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES-256-CBC 需要 16 字节 IV

/**
 * 从密码派生密钥
 * @param password 用户输入的密码
 * @returns 派生的 32 字节密钥
 */
export function deriveKey(password: string): Buffer {
  return crypto.pbkdf2Sync(password, 'won-blog-salt', 100000, 32, 'sha256');
}

/**
 * 加密文本
 * @param text 要加密的文本
 * @param password 加密密码
 * @returns 加密后的字符串（包含 IV）
 */
export function encrypt(text: string, password: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(password);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return iv.toString('base64') + ':' + encrypted;
}

/**
 * 解密文本
 * @param encryptedText 加密的文本
 * @param password 解密密码
 * @returns 解密后的文本
 */
export function decrypt(encryptedText: string, password: string): string {
  try {
    const [ivBase64, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const key = deriveKey(password);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('解密失败，请检查密码是否正确');
  }
}

/**
 * 前端使用的 Web Crypto API 解密函数
 * @param encryptedText 加密的文本
 * @param password 解密密码
 * @returns 解密后的文本
 */
export async function decryptWithWebCrypto(encryptedText: string, password: string): Promise<string> {
  try {
    const [ivBase64, encryptedData] = encryptedText.split(':');
    const iv = new Uint8Array(Buffer.from(ivBase64, 'base64'));
    const encrypted = new Uint8Array(Buffer.from(encryptedData, 'base64'));
    
    // 从密码派生密钥
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('won-blog-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-CBC',
        length: 256
      },
      false,
      ['decrypt']
    );
    
    // 解密
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv
      },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error('解密失败，请检查密码是否正确');
  }
}
