import { User, UserRole } from '@prisma/client';
import { LoginUserDTO } from '../../../src/authentication/dto/login-user.dto';
import { RegisterUserDTO } from '../../../src/authentication/dto/register-user.dto';
import bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { LoginResponseDTO } from '../../../src/authentication/dto/login-response.dto';
import { AuthenticationController } from '../../../src/authentication/authentication.controller';
import { request } from '../setup';
import { testSupplierCompany } from '../../../src/global/test-data/company-test-data.service';
import { UserRoleEnum } from '../../../src/user/dto/user.dto';

const authRoute = AuthenticationController.AUTH_API_ROUTE;
const registerRoute = authRoute + AuthenticationController.REGISTER_API_ROUTE;
const loginRoute = authRoute + AuthenticationController.LOGIN_API_ROUTE;

export const testRegisterUser: RegisterUserDTO = {
  username: 'test_register',
  email: 'test_register@test.com',
  password: 'test',
  companyId: testSupplierCompany.id,
  role: UserRoleEnum.SUPPLIER_SUPERVISOR,
  address: 'Punta Princesa, Cebu City',
};

export const createUser = async (
  user: LoginUserDTO | RegisterUserDTO
): Promise<User> => {
  const newUser: User = {
    id: '',
    email: user.email,
    username: 'test_user',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: await bcrypt.hash(user.password, 10),
    currentHashedRefreshToken: null,
    companyId: testSupplierCompany.id,
    role: UserRole.SUPPLIER_SUPERVISOR,
    imageUrl: null,
    cloudinaryPublicId: null,
    address: 'Punta Princesa, Cebu City',
    addressLatitude: 0,
    addressLongitude: 0,
  };

  if (user instanceof RegisterUserDTO) {
    newUser.username = user.username;
  }

  return newUser;
};

export const registerUser = async (
  dto: RegisterUserDTO
): Promise<LoginResponseDTO> => {
  const registerUser = await createUser(dto);

  const { body } = await request
    .post(registerRoute)
    .send(dto)
    .expect(HttpStatus.CREATED);

  const { user, tokens } = body as LoginResponseDTO;
  const { accessToken, refreshToken } = tokens;

  expect(user.email).toBe(registerUser.email);
  expect(accessToken).toBeTruthy();
  expect(refreshToken).toBeTruthy();

  return body;
};

export const logIn = async (): Promise<LoginResponseDTO> => {
  const loginUserDTO: LoginUserDTO = {
    email: 'test@test.com',
    password: 'test',
  };

  const { body } = await request
    .post(loginRoute)
    .send(loginUserDTO)
    .expect(HttpStatus.OK);

  return body as LoginResponseDTO;
};
