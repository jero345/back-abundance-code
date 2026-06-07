import { v4 as uuidv4 } from 'uuid';
import { findOrderByActivationCode } from '../data/orders.js';

// Generate a unique, human-readable activation code
export const generateActivationCode = async () => {
  let code;
  let isUnique = false;

  while (!isUnique) {
    // Format: AC-XXXX-XXXX (e.g. AC-7F3A-9B21)
    const raw = uuidv4().replace(/-/g, '').toUpperCase().slice(0, 8);
    code = `AC-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    const existing = await findOrderByActivationCode(code);
    if (!existing) isUnique = true;
  }

  return code;
};
