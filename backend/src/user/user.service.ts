import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDTO } from '../authentication/dto/register-user.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from '../global/prisma/prisma.service';
import { Company, User } from '@prisma/client';
import { UserDTO, UserRoleEnum } from './dto/user.dto';
import { CompanyTypeEnum } from '../company/dto/company.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this email does not exist');
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (user) {
      return user;
    }

    throw new NotFoundException('User with this id does not exist');
  }

  public async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { company: true },
    });

    return UserService.convertToDTO(user);
  }

  public async register(data: RegisterUserDTO): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    userId: string
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      data: { currentHashedRefreshToken },
      where: { id: userId },
    });
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string
  ): Promise<User> {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  public async deleteRefreshToken(userId: string): Promise<User> {
    return this.prismaService.user.update({
      data: { currentHashedRefreshToken: null },
      where: { id: userId },
    });
  }

  public async updateUser(userId: string, dto: UpdateUserDTO) {
    await this.prismaService.user.update({ where: { id: userId }, data: dto });

    return this.getById(userId);
  }

  public static convertToDTO(user: User & { company?: Company }): UserDTO {
    const { id, createdAt, updatedAt, email, username, role, company } = user;

    const userDTO: UserDTO = {
      id,
      createdAt,
      updatedAt,
      email,
      username,
      company: !!company
        ? {
            ...company,
            type: company.type as CompanyTypeEnum,
          }
        : undefined,
      role: role as UserRoleEnum,
    };

    return userDTO;
  }
}
