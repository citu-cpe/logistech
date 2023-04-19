import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller(UserController.USER_API_ROUTE)
export class UserController {
  public static readonly USER_API_ROUTE = '/user';

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
}
