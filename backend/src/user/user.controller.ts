import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller(UserController.USER_API_ROUTE)
export class UserController {
  public static readonly USER_API_ROUTE = '/user';
  public static readonly PROFILE_PICTURE_API_ROUTE = '/profile-picture';

  constructor(private readonly userService: UserService) {}

  @Get()
  public getUser(@Req() { user }: RequestWithUser): Promise<UserDTO> {
    return this.userService.getById(user.id);
  }

  @Post()
  public updateUser(
    @Req() { user }: RequestWithUser,
    @Body() dto: UpdateUserDTO
  ): Promise<UserDTO> {
    return this.userService.updateUser(user.id, dto);
  }

  @Post(UserController.PROFILE_PICTURE_API_ROUTE)
  @UseInterceptors(FileInterceptor('profilePicture', { dest: 'images' }))
  public uploadProfilePicture(
    @Req() { user }: RequestWithUser,
    @UploadedFile() image: Express.Multer.File
  ): Promise<UserDTO> {
    return this.userService.uploadProfilePicture(user.id, image);
  }

  @Delete(UserController.PROFILE_PICTURE_API_ROUTE)
  public removeProfilePicture(
    @Req() { user }: RequestWithUser
  ): Promise<UserDTO> {
    return this.userService.removeProfilePicture(user.id);
  }
}
