/**
 * Security utilities: Anti-XSS, Hash, File validation, and Rate Limiting
 */

// SHA-256 hashing for admin authentication
export async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Server-side fallback
  try {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(message).digest('hex');
  } catch {
    return message;
  }
}

// Default hashed passkey for admin dashboard
// Default plaintext: "vayu860-kernel"
// Real SHA-256 of "vayu860-kernel":
export const DEFAULT_ADMIN_HASH = "ac3ff3bb5bb1c053c224c3aa8eb8f10d5b9c00ff9c3cfd5e0be90e4a9dd8682b";

// Sanitize user inputs to prevent XSS / script injection
export function sanitizeString(input: string, maxLen = 1000): string {
  if (!input) return '';
  return input
    .slice(0, maxLen)
    .replace(/[<>]/g, '') // remove HTML tags
    .trim();
}

// Validate uploaded image files
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  dataUrl?: string;
}

export async function validateAndReadImageFile(file: File, maxSizeMB = 5): Promise<FileValidationResult> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau GIF.'
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas ${maxSizeMB}MB (Ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Basic check for safe base64 image header
      if (result.startsWith('data:image/')) {
        resolve({ valid: true, dataUrl: result });
      } else {
        resolve({ valid: false, error: 'File gambar tidak valid atau rusak.' });
      }
    };
    reader.onerror = () => {
      resolve({ valid: false, error: 'Gagal membaca file gambar.' });
    };
    reader.readAsDataURL(file);
  });
}
