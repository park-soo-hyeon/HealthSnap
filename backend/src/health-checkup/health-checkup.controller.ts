import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HealthCheckupService } from './health-checkup.service';
import { CreateHealthCheckupDto } from './dto/create-health-checkup.dto';
import { UpdateHealthCheckupDto } from './dto/update-health-checkup.dto';
import { HealthCheckup } from './entities/health-checkup.entity';

@ApiTags('건강검진')
@Controller('Ai')
export class HealthCheckupController {
  constructor(private readonly healthCheckupService: HealthCheckupService) {}

  @Post('db')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '건강검진 데이터 생성 및 분석 (로그인 필요)' })
  @ApiBody({ type: CreateHealthCheckupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '건강검진 데이터가 성공적으로 생성되고 분석되었습니다.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: '홍길동' },
        healthScore: { type: 'number', example: 85 },
        finalmessage: { type: 'string', example: '전반적으로 양호한 상태입니다.' },
        bmi: { type: 'number', example: 22.6 },
        ave_bmi: { type: 'number', example: 23.5 },
        bloodPressureSystolic: { type: 'number', example: 130 },
        ave_bloodPressureSystolic: { type: 'number', example: 125 },
        bloodPressureDiastolic: { type: 'number', example: 85 },
        ave_bloodPressureDiastolic: { type: 'number', example: 80 },
        fastingBloodSugar: { type: 'number', example: 90 },
        ave_fastingBloodSugar: { type: 'number', example: 95 },
        totalCholesterol: { type: 'number', example: 195 },
        ave_totalCholesterol: { type: 'number', example: 200 },
        hdlCholesterol: { type: 'number', example: 60 },
        ave_hdlCholesterol: { type: 'number', example: 55 },
        isProteinuriaPositive: { type: 'boolean', example: false },
        food_name1: { type: 'string', example: '현미밥' },
        grams1: { type: 'number', example: 150 },
        carbohydrate1: { type: 'number', example: 45 },
        protein1: { type: 'number', example: 3 },
        fat1: { type: 'number', example: 1 },
        sodium1: { type: 'number', example: 5 },
        food_name2: { type: 'string', example: '연어구이' },
        grams2: { type: 'number', example: 100 },
        carbohydrate2: { type: 'number', example: 0 },
        protein2: { type: 'number', example: 25 },
        fat2: { type: 'number', example: 12 },
        sodium2: { type: 'number', example: 80 },
        food_name3: { type: 'string', example: '브로콜리' },
        grams3: { type: 'number', example: 80 },
        carbohydrate3: { type: 'number', example: 6 },
        protein3: { type: 'number', example: 3 },
        fat3: { type: 'number', example: 0.5 },
        sodium3: { type: 'number', example: 20 },
        food_name4: { type: 'string', example: '아보카도' },
        grams4: { type: 'number', example: 50 },
        carbohydrate4: { type: 'number', example: 4 },
        protein4: { type: 'number', example: 1 },
        fat4: { type: 'number', example: 7 },
        sodium4: { type: 'number', example: 3 },
        food_name5: { type: 'string', example: '견과류' },
        grams5: { type: 'number', example: 30 },
        carbohydrate5: { type: 'number', example: 6 },
        protein5: { type: 'number', example: 6 },
        fat5: { type: 'number', example: 14 },
        sodium5: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async createAndAnalyze(
    @Body() createHealthCheckupDto: CreateHealthCheckupDto,
    @Request() req
  ): Promise<any> {
    return await this.healthCheckupService.createAndAnalyze(createHealthCheckupDto, req.user.id);
  }

  @Post('analyze')
  @ApiOperation({ summary: '건강검진 데이터 분석 (비로그인 사용자용, DB 저장 안함)' })
  @ApiBody({ type: CreateHealthCheckupDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '건강검진 데이터 분석이 완료되었습니다. (DB에 저장되지 않음)',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '홍길동' },
        healthScore: { type: 'number', example: 85 },
        finalmessage: { type: 'string', example: '전반적으로 양호한 상태입니다.' },
        bmi: { type: 'number', example: 22.6 },
        ave_bmi: { type: 'number', example: 23.5 },
        bloodPressureSystolic: { type: 'number', example: 130 },
        ave_bloodPressureSystolic: { type: 'number', example: 125 },
        food_name1: { type: 'string', example: '현미밥' },
        grams1: { type: 'number', example: 150 },
        carbohydrate1: { type: 'number', example: 45 },
        protein1: { type: 'number', example: 3 },
        fat1: { type: 'number', example: 1 },
        sodium1: { type: 'number', example: 5 },
      },
    },
  })
  async analyzeOnly(@Body() createHealthCheckupDto: CreateHealthCheckupDto): Promise<any> {
    return await this.healthCheckupService.analyzeOnly(createHealthCheckupDto);
  }

  @Post()
  @ApiOperation({ summary: '건강검진 데이터 생성' })
  @ApiBody({ type: CreateHealthCheckupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '건강검진 데이터가 성공적으로 생성되었습니다.',
    type: HealthCheckup,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async create(@Body() createHealthCheckupDto: CreateHealthCheckupDto): Promise<HealthCheckup> {
    return await this.healthCheckupService.create(createHealthCheckupDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 건강검진 데이터 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '건강검진 데이터 목록을 성공적으로 조회했습니다.',
    type: [HealthCheckup],
  })
  async findAll(): Promise<HealthCheckup[]> {
    return await this.healthCheckupService.findAll();
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '검진 이력 조회 (최신 10개, 로그인 필요)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '검진 이력이 성공적으로 조회되었습니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: '홍길동' },
          checkupDate: { type: 'string', example: '2024-03-10' },
          bmi: { type: 'number', example: 22.6 },
          bloodPressureSystolic: { type: 'number', example: 130 },
          bloodPressureDiastolic: { type: 'number', example: 85 },
          createdAt: { type: 'string', example: '2024-03-10T09:00:00.000Z' },
        },
      },
    },
  })
  async getHistory(@Request() req): Promise<any[]> {
    const records = await this.healthCheckupService.findByUserId(req.user.id);
    return records.slice(0, 10).map(record => {
      // DB에 저장된 건강점수 사용, 없으면 계산
      const healthScore = record.healthScore || this.calculateBasicHealthScore(record);
      
      return {
        id: record.id,
        name: record.name,
        checkupDate: record.checkupDate,
        checkupCenterName: record.checkupCenterName,
        bmi: record.bmi,
        bloodPressureSystolic: record.bloodPressureSystolic,
        bloodPressureDiastolic: record.bloodPressureDiastolic,
        hemoglobin: record.hemoglobin,
        fastingBloodSugar: record.fastingBloodSugar,
        totalCholesterol: record.totalCholesterol,
        hdlCholesterol: record.hdlCholesterol,
        triglycerides: record.triglycerides,
        ldlCholesterol: record.ldlCholesterol,
        serumCreatinine: record.serumCreatinine,
        astSgot: record.astSgot,
        altSgpt: record.altSgpt,
        gammaGtp: record.gammaGtp,
        healthScore: healthScore,
        finalmessage: record.finalmessage,
        
        // DB에 저장된 평균값들 사용, 없으면 기본값
        ave_bmi: record.ave_bmi || 23.0,
        ave_bloodPressureSystolic: record.ave_bloodPressureSystolic || 125,
        ave_bloodPressureDiastolic: record.ave_bloodPressureDiastolic || 80,
        ave_hemoglobin: record.ave_hemoglobin || 13.5,
        ave_fastingBloodSugar: record.ave_fastingBloodSugar || 95,
        ave_totalCholesterol: record.ave_totalCholesterol || 200,
        ave_hdlCholesterol: record.ave_hdlCholesterol || 55,
        ave_triglycerides: record.ave_triglycerides || 130,
        ave_serumCreatinine: record.ave_serumCreatinine || 0.9,
        ave_ldlCholesterol: record.ave_ldlCholesterol || 115,
        ave_astSgot: record.ave_astSgot || 25,
        ave_altSgpt: record.ave_altSgpt || 25,
        ave_gammaGtp: record.ave_gammaGtp || 30,
        
        // DB에 저장된 추천 식품들
        food_name1: record.food_name1,
        grams1: record.grams1,
        carbohydrate1: record.carbohydrate1,
        protein1: record.protein1,
        fat1: record.fat1,
        sodium1: record.sodium1,
        food_name2: record.food_name2,
        grams2: record.grams2,
        carbohydrate2: record.carbohydrate2,
        protein2: record.protein2,
        fat2: record.fat2,
        sodium2: record.sodium2,
        food_name3: record.food_name3,
        grams3: record.grams3,
        carbohydrate3: record.carbohydrate3,
        protein3: record.protein3,
        fat3: record.fat3,
        sodium3: record.sodium3,
        food_name4: record.food_name4,
        grams4: record.grams4,
        carbohydrate4: record.carbohydrate4,
        protein4: record.protein4,
        fat4: record.fat4,
        sodium4: record.sodium4,
        food_name5: record.food_name5,
        grams5: record.grams5,
        carbohydrate5: record.carbohydrate5,
        protein5: record.protein5,
        fat5: record.fat5,
        sodium5: record.sodium5,
        food_name6: record.food_name6,
        grams6: record.grams6,
        carbohydrate6: record.carbohydrate6,
        protein6: record.protein6,
        fat6: record.fat6,
        sodium6: record.sodium6,
        
        createdAt: record.createdAt,
      };
    });
  }

  private calculateBasicHealthScore(checkup: any): number {
    let score = 100;
    
    // BMI 평가
    if (checkup.bmi >= 30) score -= 25;
    else if (checkup.bmi >= 25) score -= 15;
    else if (checkup.bmi < 18.5) score -= 10;
    
    // 혈압 평가
    if (checkup.bloodPressureSystolic >= 140 || checkup.bloodPressureDiastolic >= 90) score -= 25;
    else if (checkup.bloodPressureSystolic >= 130 || checkup.bloodPressureDiastolic >= 80) score -= 15;
    
    // 혈당 평가
    if (checkup.fastingBloodSugar >= 126) score -= 20;
    else if (checkup.fastingBloodSugar >= 100) score -= 10;
    
    // 콜레스테롤 평가
    if (checkup.totalCholesterol >= 240) score -= 15;
    else if (checkup.totalCholesterol >= 200) score -= 8;
    
    // HDL 콜레스테롤 평가
    if (checkup.hdlCholesterol < 40) score -= 10;
    
    return Math.max(0, Math.round(score));
  }

  @Get('search/by-name')
  @ApiOperation({ summary: '이름으로 건강검진 데이터 검색' })
  @ApiQuery({ name: 'name', description: '검색할 이름', example: '홍길동' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '해당 이름의 건강검진 데이터 목록을 성공적으로 조회했습니다.',
    type: [HealthCheckup],
  })
  async findByName(@Query('name') name: string): Promise<HealthCheckup[]> {
    return await this.healthCheckupService.findByName(name);
  }

  @Get('search/by-date-range')
  @ApiOperation({ summary: '기간별 건강검진 데이터 조회' })
  @ApiQuery({ name: 'startDate', description: '시작일 (YYYY-MM-DD)', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: '종료일 (YYYY-MM-DD)', example: '2024-12-31' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '해당 기간의 건강검진 데이터 목록을 성공적으로 조회했습니다.',
    type: [HealthCheckup],
  })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<HealthCheckup[]> {
    return await this.healthCheckupService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 건강검진 데이터 조회' })
  @ApiParam({ name: 'id', description: '건강검진 ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '건강검진 데이터를 성공적으로 조회했습니다.',
    type: HealthCheckup,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 ID의 건강검진 데이터를 찾을 수 없습니다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HealthCheckup> {
    return await this.healthCheckupService.findOne(id);
  }

  @Get(':id/analyze')
  @ApiOperation({ summary: '건강 위험도 분석' })
  @ApiParam({ name: 'id', description: '건강검진 ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '건강 위험도 분석 결과를 성공적으로 조회했습니다.',
    schema: {
      type: 'object',
      properties: {
        checkupId: { type: 'number', example: 1 },
        name: { type: 'string', example: '홍길동' },
        checkupDate: { type: 'string', example: '2024-03-10' },
        overallRisk: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'MEDIUM' },
        risks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'BMI' },
              level: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'MEDIUM' },
              message: { type: 'string', example: '과체중 (BMI 25-29.9)' },
            },
          },
        },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
          example: ['체중 관리를 위한 균형잡힌 식단과 규칙적인 운동을 권장합니다.'],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 ID의 건강검진 데이터를 찾을 수 없습니다.',
  })
  async analyzeHealthRisk(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.healthCheckupService.analyzeHealthRisk(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '건강검진 데이터 수정' })
  @ApiParam({ name: 'id', description: '건강검진 ID', example: 1 })
  @ApiBody({ type: UpdateHealthCheckupDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '건강검진 데이터가 성공적으로 수정되었습니다.',
    type: HealthCheckup,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 ID의 건강검진 데이터를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHealthCheckupDto: UpdateHealthCheckupDto,
  ): Promise<HealthCheckup> {
    return await this.healthCheckupService.update(id, updateHealthCheckupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '건강검진 데이터 삭제' })
  @ApiParam({ name: 'id', description: '건강검진 ID', example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '건강검진 데이터가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 ID의 건강검진 데이터를 찾을 수 없습니다.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.healthCheckupService.remove(id);
  }
}