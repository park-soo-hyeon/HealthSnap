import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호 (최소 6자, 영문+숫자 조합)', example: 'password123' })
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자까지 가능합니다.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, { message: '비밀번호는 영문과 숫자를 모두 포함해야 합니다.' })
  password: string;

  @ApiProperty({ description: '사용자명', example: '홍길동' })
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
  @MaxLength(10, { message: '이름은 최대 10자까지 가능합니다.' })
  name: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, { message: '전화번호는 010-0000-0000 형식이어야 합니다.' })
  phone?: string;

  @ApiProperty({ description: '생년월일 (YYYYMMDD)', example: '19900101', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: '생년월일은 YYYYMMDD 형식(8자리)이어야 합니다.' })
  birthDate?: string;

  @ApiProperty({ description: '성별', example: '남', enum: ['남', '여'], required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[남여]$/, { message: '성별은 "남" 또는 "여"만 입력 가능합니다.' })
  gender?: string;
}
