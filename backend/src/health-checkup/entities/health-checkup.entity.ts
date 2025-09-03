import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('health_checkups')
export class HealthCheckup {
  @ApiProperty({ description: '검진 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '사용자 ID', example: 1 })
  @Column({ type: 'integer' })
  userId: number;

  // 사용자와의 관계
  @ManyToOne(() => User, user => user.healthCheckups)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: '성명', example: '홍길동' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: '주민등록번호 (생년월일)', example: '19851225' })
  @Column({ type: 'varchar', length: 8 })
  birthDate: string;

  @ApiProperty({ description: '성별', example: '남' })
  @Column({ type: 'varchar', length: 1 })
  sex: string;

  @ApiProperty({ description: '신장(cm)', example: 170.0 })
  @Column({ type: 'float' })
  height: number;

  @ApiProperty({ description: '체중(kg)', example: 65.5 })
  @Column({ type: 'float' })
  weight: number;

  @ApiProperty({ description: '허리둘레(cm)', example: 80.0 })
  @Column({ type: 'float' })
  waistCircumference: number;

  @ApiProperty({ description: '체질량지수(kg/m²)', example: 22.6 })
  @Column({ type: 'float' })
  bmi: number;

  @ApiProperty({ description: '질병 진단 여부', example: true })
  @Column({ type: 'boolean' })
  hasDiagnosis: boolean;

  @ApiProperty({ description: '복용 중인 약물 여부', example: false })
  @Column({ type: 'boolean' })
  isMedicated: boolean;

  @ApiProperty({ description: '외상 또는 후유증 여부', example: false })
  @Column({ type: 'boolean' })
  hasTraumaOrAftereffects: boolean;

  @ApiProperty({ description: '생활습관', example: '보통' })
  @Column({ type: 'varchar', length: 50 })
  lifestyle: string;

  @ApiProperty({ description: '전반적 건강상태', example: '정상' })
  @Column({ type: 'varchar', length: 50 })
  generalCondition: string;

  @ApiProperty({ description: '시력(좌)', example: 1.2 })
  @Column({ type: 'float' })
  visionLeft: number;

  @ApiProperty({ description: '시력(우)', example: 1.0 })
  @Column({ type: 'float' })
  visionRight: number;

  @ApiProperty({ description: '청력(좌) 정상 여부', example: true })
  @Column({ type: 'boolean' })
  isHearingLeftNormal: boolean;

  @ApiProperty({ description: '청력(우) 정상 여부', example: true })
  @Column({ type: 'boolean' })
  isHearingRightNormal: boolean;

  @ApiProperty({ description: '최고 혈압', example: 130 })
  @Column({ type: 'int' })
  bloodPressureSystolic: number;

  @ApiProperty({ description: '최저 혈압', example: 85 })
  @Column({ type: 'int' })
  bloodPressureDiastolic: number;

  @ApiProperty({ description: '요단백 양성 여부', example: false })
  @Column({ type: 'boolean' })
  isProteinuriaPositive: boolean;

  @ApiProperty({ description: '혈색소', example: 13.8 })
  @Column({ type: 'float' })
  hemoglobin: number;

  @ApiProperty({ description: '식전혈당', example: 90.0 })
  @Column({ type: 'float' })
  fastingBloodSugar: number;

  @ApiProperty({ description: '총콜레스테롤', example: 195.0 })
  @Column({ type: 'float' })
  totalCholesterol: number;

  @ApiProperty({ description: 'HDL-콜레스테롤', example: 60.0 })
  @Column({ type: 'float' })
  hdlCholesterol: number;

  @ApiProperty({ description: '트리글리세라이드', example: 120.0 })
  @Column({ type: 'float' })
  triglycerides: number;

  @ApiProperty({ description: 'LDL-콜레스테롤', example: 105.0 })
  @Column({ type: 'float' })
  ldlCholesterol: number;

  @ApiProperty({ description: '혈청크레아티닌', example: 0.8 })
  @Column({ type: 'float' })
  serumCreatinine: number;

  @ApiProperty({ description: 'AST(SGOT)', example: 20.0 })
  @Column({ type: 'float' })
  astSgot: number;

  @ApiProperty({ description: 'ALT(SGPT)', example: 22.0 })
  @Column({ type: 'float' })
  altSgpt: number;

  @ApiProperty({ description: '감마지티피(γ-GTP)', example: 35.0 })
  @Column({ type: 'float' })
  gammaGtp: number;

  @ApiProperty({ description: 'B형간염항원 양성 여부', example: false })
  @Column({ type: 'boolean', nullable: true })
  isHepatitisBAntigenPositive: boolean;

  @ApiProperty({ description: 'B형간염항체 양성 여부', example: false })
  @Column({ type: 'boolean', nullable: true })
  isHepatitisBAntibodyPositive: boolean;

  @ApiProperty({ description: '흉부방사선검사 정상 여부', example: true })
  @Column({ type: 'boolean' })
  isChestXrayNormal: boolean;

  @ApiProperty({ description: '검진일', example: '2024-03-10' })
  @Column({ type: 'date' })
  checkupDate: string;

  @ApiProperty({ description: '검진기관명', example: '서울건강검진센터' })
  @Column({ type: 'varchar', length: 200 })
  checkupCenterName: string;

  @ApiProperty({ description: '간염 검사 여부', example: true })
  @Column({ type: 'boolean', nullable: true })
  hepatitis: boolean;

  // AI 분석 결과 필드들
  @ApiProperty({ description: '건강점수', example: 85 })
  @Column({ type: 'int', nullable: true })
  healthScore: number;

  @ApiProperty({ description: 'AI 종합 소견', example: '전반적으로 양호한 상태입니다.' })
  @Column({ type: 'text', nullable: true })
  finalmessage: string;

  // 예측 평균값들
  @ApiProperty({ description: '평균 BMI', example: 23.0 })
  @Column({ type: 'float', nullable: true })
  ave_bmi: number;

  @ApiProperty({ description: '평균 수축기 혈압', example: 125 })
  @Column({ type: 'float', nullable: true })
  ave_bloodPressureSystolic: number;

  @ApiProperty({ description: '평균 이완기 혈압', example: 80 })
  @Column({ type: 'float', nullable: true })
  ave_bloodPressureDiastolic: number;

  @ApiProperty({ description: '평균 혈색소', example: 13.5 })
  @Column({ type: 'float', nullable: true })
  ave_hemoglobin: number;

  @ApiProperty({ description: '평균 식전혈당', example: 95 })
  @Column({ type: 'float', nullable: true })
  ave_fastingBloodSugar: number;

  @ApiProperty({ description: '평균 총콜레스테롤', example: 200 })
  @Column({ type: 'float', nullable: true })
  ave_totalCholesterol: number;

  @ApiProperty({ description: '평균 HDL콜레스테롤', example: 55 })
  @Column({ type: 'float', nullable: true })
  ave_hdlCholesterol: number;

  @ApiProperty({ description: '평균 중성지방', example: 130 })
  @Column({ type: 'float', nullable: true })
  ave_triglycerides: number;

  @ApiProperty({ description: '평균 혈청크레아티닌', example: 0.9 })
  @Column({ type: 'float', nullable: true })
  ave_serumCreatinine: number;

  @ApiProperty({ description: '평균 LDL콜레스테롤', example: 115 })
  @Column({ type: 'float', nullable: true })
  ave_ldlCholesterol: number;

  @ApiProperty({ description: '평균 AST', example: 25 })
  @Column({ type: 'float', nullable: true })
  ave_astSgot: number;

  @ApiProperty({ description: '평균 ALT', example: 25 })
  @Column({ type: 'float', nullable: true })
  ave_altSgpt: number;

  @ApiProperty({ description: '평균 감마지티피', example: 30 })
  @Column({ type: 'float', nullable: true })
  ave_gammaGtp: number;

  // 추천 식품들 (6개)
  @ApiProperty({ description: '추천 식품 1', example: '현미밥' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  food_name1: string;

  @ApiProperty({ description: '추천 식품 1 중량', example: 150 })
  @Column({ type: 'float', nullable: true })
  grams1: number;

  @ApiProperty({ description: '추천 식품 1 탄수화물', example: 45 })
  @Column({ type: 'float', nullable: true })
  carbohydrate1: number;

  @ApiProperty({ description: '추천 식품 1 단백질', example: 3 })
  @Column({ type: 'float', nullable: true })
  protein1: number;

  @ApiProperty({ description: '추천 식품 1 지방', example: 1 })
  @Column({ type: 'float', nullable: true })
  fat1: number;

  @ApiProperty({ description: '추천 식품 1 나트륨', example: 5 })
  @Column({ type: 'float', nullable: true })
  sodium1: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food_name2: string;
  @Column({ type: 'float', nullable: true })
  grams2: number;
  @Column({ type: 'float', nullable: true })
  carbohydrate2: number;
  @Column({ type: 'float', nullable: true })
  protein2: number;
  @Column({ type: 'float', nullable: true })
  fat2: number;
  @Column({ type: 'float', nullable: true })
  sodium2: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food_name3: string;
  @Column({ type: 'float', nullable: true })
  grams3: number;
  @Column({ type: 'float', nullable: true })
  carbohydrate3: number;
  @Column({ type: 'float', nullable: true })
  protein3: number;
  @Column({ type: 'float', nullable: true })
  fat3: number;
  @Column({ type: 'float', nullable: true })
  sodium3: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food_name4: string;
  @Column({ type: 'float', nullable: true })
  grams4: number;
  @Column({ type: 'float', nullable: true })
  carbohydrate4: number;
  @Column({ type: 'float', nullable: true })
  protein4: number;
  @Column({ type: 'float', nullable: true })
  fat4: number;
  @Column({ type: 'float', nullable: true })
  sodium4: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food_name5: string;
  @Column({ type: 'float', nullable: true })
  grams5: number;
  @Column({ type: 'float', nullable: true })
  carbohydrate5: number;
  @Column({ type: 'float', nullable: true })
  protein5: number;
  @Column({ type: 'float', nullable: true })
  fat5: number;
  @Column({ type: 'float', nullable: true })
  sodium5: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  food_name6: string;
  @Column({ type: 'float', nullable: true })
  grams6: number;
  @Column({ type: 'float', nullable: true })
  carbohydrate6: number;
  @Column({ type: 'float', nullable: true })
  protein6: number;
  @Column({ type: 'float', nullable: true })
  fat6: number;
  @Column({ type: 'float', nullable: true })
  sodium6: number;

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn()
  updatedAt: Date;
}
