import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables');
}

export const signJwt = (payload: object, options?: jwt.SignOptions) => {
  return jwt.sign(payload, accessSecret!, { expiresIn: '15m', ...options });
};

export const signRefreshJwt = (payload: object, options?: jwt.SignOptions) => {
  return jwt.sign(payload, refreshSecret!, { expiresIn: '7d', ...options });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, accessSecret!);
    return { valid: true, expired: false, decoded };
  } catch (e: any) {
    return { valid: false, expired: e.message === 'jwt expired', decoded: null };
  }
};

export const verifyRefreshJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, refreshSecret!);
    return { valid: true, expired: false, decoded };
  } catch (e: any) {
    return { valid: false, expired: e.message === 'jwt expired', decoded: null };
  }
};
