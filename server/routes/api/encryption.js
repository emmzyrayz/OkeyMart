import { Router } from 'express';
import { encryptDetermined, decryptDetermined } from '../../utils/encryption';

const router = Router();

// Deterministic Encryption
router.post('/encrypt', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    const encrypted = encryptDetermined(text);
    res.json({ encrypted });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Encryption failed' });
  }
});

// Deterministic Decryption
router.post('/decrypt', (req, res) => {
  const { encrypted } = req.body;
  if (!encrypted) {
    return res.status(400).json({ error: 'Encrypted text is required' });
  }
  try {
    const decrypted = decryptDetermined(encrypted);
    res.json({ decrypted });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Decryption failed' });
  }
});

export default router;