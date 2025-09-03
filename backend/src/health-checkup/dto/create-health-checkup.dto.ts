import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsDateString, IsOptional, Min, Max } from 'class-validator';

export class CreateHealthCheckupDto {
  @ApiProperty({ description: '성명', example: '홍길동' })
  @IsString()
  name: string;

  @ApiProperty({ description: '주민등록번호 (생년월일)', example: '19851225' })
  @IsString()
  birthDate: string;

  @ApiProperty({ description: '성별', example: '남', enum: ['남', '여'] })
  @IsString()
  sex: string;

  @ApiProperty({ description: '신장(cm)', example: 170.0 })
  @IsNumber()
  @Min(100, { message: '신장은 100cm 이상이어야 합니다.' })
  @Max(250, { message: '신장은 250cm 이하여야 합니다.' })
  height: number;

  @ApiProperty({ description: '체중(kg)', example: 65.5 })
  @IsNumber()
  @Min(20, { message: '체중은 20kg 이상이어야 합니다.' })
  @Max(300, { message: '체중은 300kg 이하여야 합니다.' })
  weight: number;

  @ApiProperty({ description: '허리둘레(cm)', example: 80.0 })
  @IsNumber()
  @Min(40, { message: '허리둘레는 40cm 이상이어야 합니다.' })
  @Max(200, { message: '허리둘레는 200cm 이하여야 합니다.' })
  waistCircumference: number;

  @ApiProperty({ description: '체질량지수(kg/m²)', example: 22.6 })
  @IsNumber()
  @Min(12, { message: 'BMI는 12 이상이어야 합니다. (극심한 저체중 미만 값은 입력할 수 없습니다)' })
  @Max(45, { message: 'BMI는 45 이하여야 합니다. (극도 고도비만 초과 값은 입력할 수 없습니다)' })
  bmi: number;

  @ApiProperty({ description: '질병 진단 여부', example: true })
  @IsBoolean()
  hasDiagnosis: boolean;

  @ApiProperty({ description: '복용 중인 약물 여부', example: false })
  @IsBoolean()
  isMedicated: boolean;

  @ApiProperty({ description: '외상 또는 후유증 여부', example: false })
  @IsBoolean()
  hasTraumaOrAftereffects: boolean;

  @ApiProperty({ description: '생활습관', example: '보통' })
  @IsString()
  lifestyle: string;

  @ApiProperty({ description: '전반적 건강상태', example: '정상' })
  @IsString()
  generalCondition: string;

  @ApiProperty({ description: '시력(좌)', example: 1.2 })
  @IsNumber()
  @Min(0.0, { message: '시력은 0.0 이상이어야 합니다.' })
  @Max(3.0, { message: '시력은 3.0 이하여야 합니다.' })
  visionLeft: number;

  @ApiProperty({ description: '시력(우)', example: 1.0 })
  @IsNumber()
  @Min(0.0, { message: '시력은 0.0 이상이어야 합니다.' })
  @Max(3.0, { message: '시력은 3.0 이하여야 합니다.' })
  visionRight: number;

  @ApiProperty({ description: '청력(좌) 정상 여부', example: true })
  @IsBoolean()
  isHearingLeftNormal: boolean;

  @ApiProperty({ description: '청력(우) 정상 여부', example: true })
  @IsBoolean()
  isHearingRightNormal: boolean;

  @ApiProperty({ description: '최고 혈압', example: 130 })
  @IsNumber()
  @Min(80, { message: '수축기 혈압은 80mmHg 이상이어야 합니다. (극도 저혈압 미만 값은 입력할 수 없습니다)' })
  @Max(200, { message: '수축기 혈압은 200mmHg 이하여야 합니다. (고혈압 위기 초과 값은 입력할 수 없습니다)' })
  bloodPressureSystolic: number;

  @ApiProperty({ description: '최저 혈압', example: 85 })
  @IsNumber()
  @Min(50, { message: '이완기 혈압은 50mmHg 이상이어야 합니다. (극도 저혈압 미만 값은 입력할 수 없습니다)' })
  @Max(120, { message: '이완기 혈압은 120mmHg 이하여야 합니다. (고혈압 위기 초과 값은 입력할 수 없습니다)' })
  bloodPressureDiastolic: number;

  @ApiProperty({ description: '요단백 양성 여부', example: false })
  @IsBoolean()
  isProteinuriaPositive: boolean;

  @ApiProperty({ description: '혈색소', example: 13.8 })
  @IsNumber()
  @Min(5.0, { message: '혈색소는 5.0 g/dL 이상이어야 합니다.' })
  @Max(20.0, { message: '혈색소는 20.0 g/dL 이하여야 합니다.' })
  hemoglobin: number;

  @ApiProperty({ description: '식전혈당', example: 90.0 })
  @IsNumber()
  @Min(60, { message: '식전혈당은 60 mg/dL 이상이어야 합니다. (극도 저혈당 미만 값은 입력할 수 없습니다)' })
  @Max(300, { message: '식전혈당은 300 mg/dL 이하여야 합니다. (당뇨 응급상황 초과 값은 입력할 수 없습니다)' })
  fastingBloodSugar: number;

  @ApiProperty({ description: '총콜레스테롤', example: 195.0 })
  @IsNumber()
  @Min(80, { message: '총콜레스테롤은 80 mg/dL 이상이어야 합니다.' })
  @Max(500, { message: '총콜레스테롤은 500 mg/dL 이하여야 합니다.' })
  totalCholesterol: number;

  @ApiProperty({ description: 'HDL-콜레스테롤', example: 60.0 })
  @IsNumber()
  @Min(10, { message: 'HDL-콜레스테롤은 10 mg/dL 이상이어야 합니다.' })
  @Max(150, { message: 'HDL-콜레스테롤은 150 mg/dL 이하여야 합니다.' })
  hdlCholesterol: number;

  @ApiProperty({ description: '트리글리세라이드', example: 120.0 })
  @IsNumber()
  @Min(30, { message: '트리글리세라이드는 30 mg/dL 이상이어야 합니다.' })
  @Max(1000, { message: '트리글리세라이드는 1000 mg/dL 이하여야 합니다.' })
  triglycerides: number;

  @ApiProperty({ description: 'LDL-콜레스테롤', example: 105.0 })
  @IsNumber()
  @Min(30, { message: 'LDL-콜레스테롤은 30 mg/dL 이상이어야 합니다.' })
  @Max(400, { message: 'LDL-콜레스테롤은 400 mg/dL 이하여야 합니다.' })
  ldlCholesterol: number;

  @ApiProperty({ description: '혈청크레아티닌', example: 0.8 })
  @IsNumber()
  @Min(0.3, { message: '혈청크레아티닌은 0.3 mg/dL 이상이어야 합니다.' })
  @Max(5.0, { message: '혈청크레아티닌은 5.0 mg/dL 이하여야 합니다.' })
  serumCreatinine: number;

  @ApiProperty({ description: 'AST(SGOT)', example: 20.0 })
  @IsNumber()
  @Min(5, { message: 'AST는 5 U/L 이상이어야 합니다.' })
  @Max(500, { message: 'AST는 500 U/L 이하여야 합니다.' })
  astSgot: number;

  @ApiProperty({ description: 'ALT(SGPT)', example: 22.0 })
  @IsNumber()
  @Min(5, { message: 'ALT는 5 U/L 이상이어야 합니다.' })
  @Max(500, { message: 'ALT는 500 U/L 이하여야 합니다.' })
  altSgpt: number;

  @ApiProperty({ description: '감마지티피(γ-GTP)', example: 35.0 })
  @IsNumber()
  @Min(5, { message: '감마지티피는 5 U/L 이상이어야 합니다.' })
  @Max(800, { message: '감마지티피는 800 U/L 이하여야 합니다.' })
  gammaGtp: number;

  @ApiProperty({ description: 'B형간염항원 양성 여부', example: false })
  @IsBoolean()
  @IsOptional()
  isHepatitisBAntigenPositive?: boolean;

  @ApiProperty({ description: 'B형간염항체 양성 여부', example: false })
  @IsBoolean()
  @IsOptional()
  isHepatitisBAntibodyPositive?: boolean;

  @ApiProperty({ description: '흉부방사선검사 정상 여부', example: true })
  @IsBoolean()
  isChestXrayNormal: boolean;

  @ApiProperty({ description: '검진일', example: '2024-03-10' })
  @IsDateString()
  checkupDate: string;

  @ApiProperty({ description: '검진기관명', example: '서울건강검진센터' })
  @IsString()
  checkupCenterName: string;

  @ApiProperty({ description: '간염 검사 여부', example: true })
  @IsBoolean()
  @IsOptional()
  hepatitis?: boolean;
}
