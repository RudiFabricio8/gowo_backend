import prisma from '../config/prisma';
import { CreateProfileInput } from '../schemas/profile.schema';

export class ProfileService {
  static async upsertProfile(userId: string, data: CreateProfileInput) {
    const { nombre, experiencia_meses, skills } = data;

    // First: create or update the base profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        nombre,
        experienciaMeses: experiencia_meses ?? 0,
      },
      create: {
        userId,
        nombre,
        experienciaMeses: experiencia_meses ?? 0,
      },
    });

    // Handle skills if provided
    if (skills && skills.length > 0) {
      // Clean previous relationships for this profile (optional, depends on requirement, we assume a full replacement of skills here)
      await prisma.profileSkill.deleteMany({
        where: { profileId: profile.id },
      });

      // Ensure all skills exist in the skills table
      for (const skillName of skills) {
        let skill = await prisma.skill.findUnique({
          where: { name: skillName },
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillName },
          });
        }

        // Create relation in the pivot table
        await prisma.profileSkill.create({
          data: {
            profileId: profile.id,
            skillId: skill.id,
          },
        });
      }
    }

    // Return profile with its skills
    return prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        profileSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  static async getProfiles(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: { role: true, email: true }
          },
          profileSkills: {
            include: { skill: true }
          }
        },
      }),
      prisma.profile.count(),
    ]);

    return {
      profiles,
      total,
      page,
      limit,
    };
  }

  static async getProfileById(profileId: string) {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: { role: true, email: true }
        },
        profileSkills: {
          include: { skill: true }
        }
      },
    });

    if (!profile) {
      throw new Error('Perfil no encontrado');
    }

    return profile;
  }
}
