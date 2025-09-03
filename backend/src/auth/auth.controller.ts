import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ 
    status: 201, 
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: '홍길동' },
            phone: { type: 'string', example: '010-1234-5678' },
            birthDate: { type: 'string', example: '19900101' },
            gender: { type: 'string', example: '남' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: '이미 사용 중인 이메일' })
  @ApiResponse({ status: 400, description: '입력값 검증 실패' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ 
    status: 200, 
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: '홍길동' },
            phone: { type: 'string', example: '010-1234-5678' },
            birthDate: { type: 'string', example: '19900101' },
            gender: { type: 'string', example: '남' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '이메일 또는 비밀번호 불일치' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiResponse({ 
    status: 200, 
    description: '사용자 정보 조회 성공',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: '홍길동' },
        phone: { type: 'string', example: '010-1234-5678' },
        birthDate: { type: 'string', example: '19900101' },
        gender: { type: 'string', example: '남' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async getProfile(@Request() req) {
    const { password, ...userInfo } = req.user;
    return userInfo;
  }
}
