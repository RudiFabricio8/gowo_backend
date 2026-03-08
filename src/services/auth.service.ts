import prisma from '../config/prisma';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { hashPassword, comparePassword } from '../utils/hash';
import { signJwt, signRefreshJwt, verifyRefreshJwt } from '../utils/jwt';

export class AuthService {
  static async registerUser(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password_hash: hashedPassword,
        role: input.role as any,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // We can also generate an access token upon successful registration if the API contract expects it.
    const token = signJwt({ id: user.id, role: user.role });

    return { user, token };
  }

  static async loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || (!user.password_hash)) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await comparePassword(input.password, user.password_hash);
    
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = signJwt(tokenPayload);
    const refreshToken = signRefreshJwt(tokenPayload);

    return {
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }

  static async refreshAuth(refreshToken: string) {
    const verified = verifyRefreshJwt(refreshToken);

    if (!verified.valid || !verified.decoded) {
      throw new Error('Refresh token inválido o expirado');
    }

    const payload = verified.decoded as { id: string, role: string };
    
    // We should ensure user still exists in DB as an extra protection layer
    const user = await prisma.user.findUnique({
       where: { id: payload.id }
    });
    
    if (!user) {
        throw new Error('Usuario ya no existe');
    }

    const newAccessToken = signJwt({ id: user.id, role: user.role });
    const newRefreshToken = signRefreshJwt({ id: user.id, role: user.role });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
