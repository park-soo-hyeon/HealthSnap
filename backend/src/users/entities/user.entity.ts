import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { HealthCheckup } from '../../health-checkup/entities/health-checkup.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: '사용자 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: '비밀번호 (해시)', example: 'hashed_password' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: '사용자명', example: '홍길동' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: '생년월일', example: '19900101', required: false })
  @Column({ type: 'varchar', length: 8, nullable: true })
  birthDate: string;

  @ApiProperty({ description: '성별', example: '남', required: false })
  @Column({ type: 'varchar', length: 1, nullable: true })
  gender: string;

  @ApiProperty({ description: '활성화 상태', example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn()
  updatedAt: Date;

  // 건강검진 기록과의 관계
  @OneToMany(() => HealthCheckup, healthCheckup => healthCheckup.user)
  healthCheckups: HealthCheckup[];
}
