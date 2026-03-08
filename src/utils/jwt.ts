import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const accessTokenSecret = process.env.JWT_SECRET || 'fallback_secret';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, accessTokenSecret, {
    ...(options && options),
    expiresIn: options?.expiresIn || '15m',
  });
};

export const signRefreshJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, refreshTokenSecret, {
    ...(options && options),
    expiresIn: options?.expiresIn || '7d',
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
};

export const verifyRefreshJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, refreshTokenSecret);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
};
