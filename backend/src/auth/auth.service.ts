import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting user registration for:', registerDto.email);
      
      const user = await this.usersService.create(registerDto);
      console.log('✅ User created successfully:', user.id);
      
      // JWT 토큰 생성
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      const token = this.jwtService.sign(payload);
      console.log('✅ JWT token generated successfully');

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          birthDate: user.birthDate,
          gender: user.gender,
        },
      };
    } catch (error) {
      console.error('❌ Registration error details:', error);
      console.error('❌ Error stack:', error.stack);
      
      if (error instanceof ConflictException) {
        throw error;
      }
      
      // 더 구체적인 에러 메시지 제공
      if (error.message) {
        throw new Error(`회원가입 중 오류가 발생했습니다: ${error.message}`);
      }
      
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // JWT 토큰 생성
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.gender,
      },
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }
}
