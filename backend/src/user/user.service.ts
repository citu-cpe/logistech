import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDTO } from '../authentication/dto/register-user.dto';
import bcrypt from 'bcrypt';
import { PrismaService } from '../global/prisma/prisma.service';
import { Company, User } from '@prisma/client';
import { UserDTO, UserRoleEnum } from './dto/user.dto';
import { CompanyTypeEnum } from '../company/dto/company.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { v2 as cloudinary } from 'cloudinary';
import { deleteFile } from '../shared/utils/deleteFile';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariableKeys } from '../shared/constants/environment-variable-keys';
import { GoogleMapsGeocoding } from '../shared/types/google-maps-geocoding';

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

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
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { company: true },
    });

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
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    let addressLatitude: number;
    let addressLongitude: number;

    if (user.address !== dto.address) {
      const uriEncodedAddress = encodeURI(dto.address);
      const apiKey = this.configService.get(
        EnvironmentVariableKeys.GOOGLE_MAPS_API_KEY
      );

      const response = await firstValueFrom(
        this.httpService.get<GoogleMapsGeocoding>(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${apiKey}`
        )
      );

      addressLatitude = response.data.results[0].geometry.location.lat;
      addressLongitude = response.data.results[0].geometry.location.lng;
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { ...dto, addressLatitude, addressLongitude },
    });

    return this.getById(userId);
  }

  public async uploadProfilePicture(
    userId: string,
    image: Express.Multer.File
  ) {
    let imageUrl: string;
    let cloudinaryPublicId: string;

    if (image) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path
      );
      imageUrl = secure_url;
      cloudinaryPublicId = public_id;
      deleteFile(image.path);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { imageUrl, cloudinaryPublicId },
    });

    return this.getById(userId);
  }

  public async removeProfilePicture(userId: string) {
    const user = await this.findById(userId);

    if (user.cloudinaryPublicId) {
      cloudinary.uploader.destroy(user.cloudinaryPublicId);
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: { imageUrl: null, cloudinaryPublicId: null },
    });

    return this.getById(userId);
  }

  public static convertToDTO(user: User & { company?: Company }): UserDTO {
    const {
      id,
      createdAt,
      updatedAt,
      email,
      username,
      role,
      company,
      imageUrl,
      address,
      addressLongitude,
      addressLatitude,
    } = user;

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
      imageUrl,
      address,
      addressLongitude,
      addressLatitude,
    };

    return userDTO;
  }
}
