import { LoginPostDto, RegisterPostDto } from '@/Dtos/auth.dto';

export class AuthService {
  //   constructor() {}

  async signIn(data: LoginPostDto): Promise<LoginPostDto> {
    return data;
  }
  async signUp(data: RegisterPostDto): Promise<RegisterPostDto> {
    return data;
  }
  async fetchAcessToken(token: string): Promise<string> {
    return token;
  }
}
