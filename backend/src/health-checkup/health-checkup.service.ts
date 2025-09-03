import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHealthCheckupDto } from './dto/create-health-checkup.dto';
import { UpdateHealthCheckupDto } from './dto/update-health-checkup.dto';
import { HealthCheckup } from './entities/health-checkup.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class HealthCheckupService {
  constructor(
    @InjectRepository(HealthCheckup)
    private readonly healthCheckupRepository: Repository<HealthCheckup>,
    private readonly aiService: AiService,
  ) {}

  /**
   * 새로운 건강검진 데이터를 생성하고 AI 분석 결과를 반환합니다.
   */
  async createAndAnalyze(createHealthCheckupDto: CreateHealthCheckupDto, userId: number): Promise<any> {
    try {
      // AI 서비스를 통한 분석 먼저 수행
      const analysisResult = await this.aiService.processHealthCheckup(createHealthCheckupDto);
      
      // 분석 결과를 포함하여 데이터베이스에 저장
      const healthCheckupWithAnalysis = this.healthCheckupRepository.create({
        ...createHealthCheckupDto,
        userId, // 사용자 ID 추가
        // AI 분석 결과 저장
        healthScore: analysisResult.overallHealthScore,
        finalmessage: analysisResult.finalmessage,
        ave_bmi: analysisResult.ave_bmi,
        ave_bloodPressureSystolic: analysisResult.ave_bloodPressureSystolic,
        ave_bloodPressureDiastolic: analysisResult.ave_bloodPressureDiastolic,
        ave_hemoglobin: analysisResult.ave_hemoglobin,
        ave_fastingBloodSugar: analysisResult.ave_fastingBloodSugar,
        ave_totalCholesterol: analysisResult.ave_totalCholesterol,
        ave_hdlCholesterol: analysisResult.ave_hdlCholesterol,
        ave_triglycerides: analysisResult.ave_triglycerides,
        ave_serumCreatinine: analysisResult.ave_serumCreatinine,
        ave_ldlCholesterol: analysisResult.ave_ldlCholesterol,
        ave_astSgot: analysisResult.ave_astSgot,
        ave_altSgpt: analysisResult.ave_altSgpt,
        ave_gammaGtp: analysisResult.ave_gammaGtp,
        // 추천 식품 저장
        food_name1: analysisResult.food_name1,
        grams1: analysisResult.grams1,
        carbohydrate1: analysisResult.carbohydrate1,
        protein1: analysisResult.protein1,
        fat1: analysisResult.fat1,
        sodium1: analysisResult.sodium1,
        food_name2: analysisResult.food_name2,
        grams2: analysisResult.grams2,
        carbohydrate2: analysisResult.carbohydrate2,
        protein2: analysisResult.protein2,
        fat2: analysisResult.fat2,
        sodium2: analysisResult.sodium2,
        food_name3: analysisResult.food_name3,
        grams3: analysisResult.grams3,
        carbohydrate3: analysisResult.carbohydrate3,
        protein3: analysisResult.protein3,
        fat3: analysisResult.fat3,
        sodium3: analysisResult.sodium3,
        food_name4: analysisResult.food_name4,
        grams4: analysisResult.grams4,
        carbohydrate4: analysisResult.carbohydrate4,
        protein4: analysisResult.protein4,
        fat4: analysisResult.fat4,
        sodium4: analysisResult.sodium4,
        food_name5: analysisResult.food_name5,
        grams5: analysisResult.grams5,
        carbohydrate5: analysisResult.carbohydrate5,
        protein5: analysisResult.protein5,
        fat5: analysisResult.fat5,
        sodium5: analysisResult.sodium5,
        food_name6: analysisResult.food_name6,
        grams6: analysisResult.grams6,
        carbohydrate6: analysisResult.carbohydrate6,
        protein6: analysisResult.protein6,
        fat6: analysisResult.fat6,
        sodium6: analysisResult.sodium6,
      });
      
      const savedHealthCheckup = await this.healthCheckupRepository.save(healthCheckupWithAnalysis);
      
      // 저장된 데이터 반환 (분석 결과 포함)
      return {
        id: savedHealthCheckup.id,
        name: savedHealthCheckup.name,
        healthScore: savedHealthCheckup.healthScore,
        
        // 사용자의 실제 건강검진 데이터
        bmi: savedHealthCheckup.bmi,
        bloodPressureSystolic: savedHealthCheckup.bloodPressureSystolic,
        bloodPressureDiastolic: savedHealthCheckup.bloodPressureDiastolic,
        hemoglobin: savedHealthCheckup.hemoglobin,
        fastingBloodSugar: savedHealthCheckup.fastingBloodSugar,
        totalCholesterol: savedHealthCheckup.totalCholesterol,
        hdlCholesterol: savedHealthCheckup.hdlCholesterol,
        triglycerides: savedHealthCheckup.triglycerides,
        serumCreatinine: savedHealthCheckup.serumCreatinine,
        ldlCholesterol: savedHealthCheckup.ldlCholesterol,
        astSgot: savedHealthCheckup.astSgot,
        altSgpt: savedHealthCheckup.altSgpt,
        gammaGtp: savedHealthCheckup.gammaGtp,
        isProteinuriaPositive: savedHealthCheckup.isProteinuriaPositive,
        
        ...analysisResult,
      };
    } catch (error) {
      console.error('AI 분석 중 오류 발생:', error);
      
      // AI 분석 실패 시 기본 데이터만 저장
      const healthCheckup = this.healthCheckupRepository.create({
        ...createHealthCheckupDto,
        userId, // 사용자 ID 추가
      });
      const savedHealthCheckup = await this.healthCheckupRepository.save(healthCheckup);
      
      const fallbackResult = this.getFallbackAnalysis(savedHealthCheckup);
      return {
        id: savedHealthCheckup.id,
        name: savedHealthCheckup.name,
        ...fallbackResult,
      };
    }
  }

  /**
   * 비로그인 사용자를 위한 분석만 수행 (DB 저장 없음)
   */
  async analyzeOnly(createHealthCheckupDto: CreateHealthCheckupDto): Promise<any> {
    try {
      // AI 서비스를 통한 분석만 수행
      const analysisResult = await this.aiService.processHealthCheckup(createHealthCheckupDto);
      
      // 사용자 입력 데이터와 AI 분석 결과를 결합하여 반환
      return {
        // 사용자 실제 데이터
        ...createHealthCheckupDto,
        
        // AI 분석 결과
        healthScore: analysisResult.overallHealthScore,
        finalmessage: analysisResult.finalmessage,
        
        // 예측 평균값들
        ave_bmi: analysisResult.ave_bmi,
        ave_bloodPressureSystolic: analysisResult.ave_bloodPressureSystolic,
        ave_bloodPressureDiastolic: analysisResult.ave_bloodPressureDiastolic,
        ave_hemoglobin: analysisResult.ave_hemoglobin,
        ave_fastingBloodSugar: analysisResult.ave_fastingBloodSugar,
        ave_totalCholesterol: analysisResult.ave_totalCholesterol,
        ave_hdlCholesterol: analysisResult.ave_hdlCholesterol,
        ave_triglycerides: analysisResult.ave_triglycerides,
        ave_serumCreatinine: analysisResult.ave_serumCreatinine,
        ave_ldlCholesterol: analysisResult.ave_ldlCholesterol,
        ave_astSgot: analysisResult.ave_astSgot,
        ave_altSgpt: analysisResult.ave_altSgpt,
        ave_gammaGtp: analysisResult.ave_gammaGtp,
        
        // 추천 식품들
        food_name1: analysisResult.food_name1,
        grams1: analysisResult.grams1,
        carbohydrate1: analysisResult.carbohydrate1,
        protein1: analysisResult.protein1,
        fat1: analysisResult.fat1,
        sodium1: analysisResult.sodium1,
        food_name2: analysisResult.food_name2,
        grams2: analysisResult.grams2,
        carbohydrate2: analysisResult.carbohydrate2,
        protein2: analysisResult.protein2,
        fat2: analysisResult.fat2,
        sodium2: analysisResult.sodium2,
        food_name3: analysisResult.food_name3,
        grams3: analysisResult.grams3,
        carbohydrate3: analysisResult.carbohydrate3,
        protein3: analysisResult.protein3,
        fat3: analysisResult.fat3,
        sodium3: analysisResult.sodium3,
        food_name4: analysisResult.food_name4,
        grams4: analysisResult.grams4,
        carbohydrate4: analysisResult.carbohydrate4,
        protein4: analysisResult.protein4,
        fat4: analysisResult.fat4,
        sodium4: analysisResult.sodium4,
        food_name5: analysisResult.food_name5,
        grams5: analysisResult.grams5,
        carbohydrate5: analysisResult.carbohydrate5,
        protein5: analysisResult.protein5,
        fat5: analysisResult.fat5,
        sodium5: analysisResult.sodium5,
        food_name6: analysisResult.food_name6,
        grams6: analysisResult.grams6,
        carbohydrate6: analysisResult.carbohydrate6,
        protein6: analysisResult.protein6,
        fat6: analysisResult.fat6,
        sodium6: analysisResult.sodium6,
      };
    } catch (error) {
      console.error('AI 분석 중 오류 발생:', error);
      return this.getFallbackAnalysis(createHealthCheckupDto);
    }
  }

  /**
   * AI 분석 실패 시 사용할 기본 분석 결과
   */
  private getFallbackAnalysis(checkup: CreateHealthCheckupDto | HealthCheckup): any {
    const healthScore = this.calculateBasicHealthScore(checkup as any);
    
    return {
      healthScore,
      overallHealthScore: healthScore,
      finalmessage: '건강검진 데이터를 기반으로 기본 분석을 수행했습니다. 균형잡힌 식단과 규칙적인 운동을 권장합니다.',
      llmcomment: '건강검진 데이터를 기반으로 기본 분석을 수행했습니다.',
      overallComment: '건강검진 데이터를 기반으로 기본 분석을 수행했습니다.',
      
      // 사용자의 실제 건강검진 데이터
      bmi: checkup.bmi,
      bloodPressureSystolic: checkup.bloodPressureSystolic,
      bloodPressureDiastolic: checkup.bloodPressureDiastolic,
      hemoglobin: checkup.hemoglobin,
      fastingBloodSugar: checkup.fastingBloodSugar,
      totalCholesterol: checkup.totalCholesterol,
      hdlCholesterol: checkup.hdlCholesterol,
      triglycerides: checkup.triglycerides,
      serumCreatinine: checkup.serumCreatinine,
      ldlCholesterol: checkup.ldlCholesterol,
      astSgot: checkup.astSgot,
      altSgpt: checkup.altSgpt,
      gammaGtp: checkup.gammaGtp,
      isProteinuriaPositive: checkup.isProteinuriaPositive,
      
      // 기본 평균값들
      ave_bmi: 23.0,
      ave_bloodPressureSystolic: 125,
      ave_bloodPressureDiastolic: 80,
      ave_fastingBloodSugar: 95,
      ave_totalCholesterol: 200,
      ave_hdlCholesterol: 55,
      ave_triglycerides: 130,
      ave_hemoglobin: 13.5,
      ave_serumCreatinine: 0.9,
      ave_ldlCholesterol: 115,
      ave_astSgot: 25,
      ave_altSgpt: 25,
      ave_gammaGtp: 30,
      
      // 기본 음식 추천
      food_name1: '현미밥',
      grams1: 150,
      carbohydrate1: 45,
      protein1: 3,
      fat1: 1,
      sodium1: 5,
      
      food_name2: '연어구이',
      grams2: 100,
      carbohydrate2: 0,
      protein2: 25,
      fat2: 12,
      sodium2: 80,
      
      food_name3: '브로콜리',
      grams3: 80,
      carbohydrate3: 6,
      protein3: 3,
      fat3: 0.5,
      sodium3: 20,
      
      food_name4: '아보카도',
      grams4: 50,
      carbohydrate4: 4,
      protein4: 1,
      fat4: 7,
      sodium4: 3,
      
      food_name5: '견과류',
      grams5: 30,
      carbohydrate5: 6,
      protein5: 6,
      fat5: 14,
      sodium5: 2,
      
      food_name6: '요거트',
      grams6: 100,
      carbohydrate6: 12,
      protein6: 4,
      fat6: 3,
      sodium6: 50,
    };
  }

  /**
   * 기본 건강 점수 계산
   */
  private calculateBasicHealthScore(checkup: HealthCheckup): number {
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

  /**
   * 새로운 건강검진 데이터를 생성합니다.
   */
  async create(createHealthCheckupDto: CreateHealthCheckupDto): Promise<HealthCheckup> {
    const healthCheckup = this.healthCheckupRepository.create(createHealthCheckupDto);
    return await this.healthCheckupRepository.save(healthCheckup);
  }

  /**
   * 모든 건강검진 데이터를 조회합니다.
   */
  async findAll(): Promise<HealthCheckup[]> {
    return await this.healthCheckupRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: number): Promise<HealthCheckup[]> {
    return await this.healthCheckupRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 특정 ID의 건강검진 데이터를 조회합니다.
   */
  async findOne(id: number): Promise<HealthCheckup> {
    const healthCheckup = await this.healthCheckupRepository.findOne({
      where: { id },
    });

    if (!healthCheckup) {
      throw new NotFoundException(`건강검진 데이터를 찾을 수 없습니다. ID: ${id}`);
    }

    return healthCheckup;
  }

  /**
   * 특정 사용자의 건강검진 데이터를 조회합니다.
   */
  async findByName(name: string): Promise<HealthCheckup[]> {
    return await this.healthCheckupRepository.find({
      where: { name },
      order: { checkupDate: 'DESC' },
    });
  }

  /**
   * 특정 기간의 건강검진 데이터를 조회합니다.
   */
  async findByDateRange(startDate: string, endDate: string): Promise<HealthCheckup[]> {
    return await this.healthCheckupRepository
      .createQueryBuilder('checkup')
      .where('checkup.checkupDate >= :startDate', { startDate })
      .andWhere('checkup.checkupDate <= :endDate', { endDate })
      .orderBy('checkup.checkupDate', 'DESC')
      .getMany();
  }

  /**
   * 건강검진 데이터를 수정합니다.
   */
  async update(id: number, updateHealthCheckupDto: UpdateHealthCheckupDto): Promise<HealthCheckup> {
    const healthCheckup = await this.findOne(id);
    
    Object.assign(healthCheckup, updateHealthCheckupDto);
    
    return await this.healthCheckupRepository.save(healthCheckup);
  }

  /**
   * 건강검진 데이터를 삭제합니다.
   */
  async remove(id: number): Promise<void> {
    const healthCheckup = await this.findOne(id);
    await this.healthCheckupRepository.remove(healthCheckup);
  }

  /**
   * 건강 위험도를 분석합니다.
   */
  async analyzeHealthRisk(id: number): Promise<any> {
    const checkup = await this.findOne(id);
    
    try {
      // AI 서비스를 통한 위험도 분석
      const analysisResult = await this.aiService.processHealthCheckup(checkup);
      
      return {
        checkupId: id,
        name: checkup.name,
        checkupDate: checkup.checkupDate,
        overallHealthScore: analysisResult.overallHealthScore,
        analysisComment: analysisResult.finalmessage,
        recommendations: [analysisResult.finalmessage],
      };
    } catch (error) {
      console.error('AI 위험도 분석 중 오류 발생:', error);
      
      // 기본 위험도 분석
      return this.getBasicRiskAnalysis(checkup);
    }
  }

  /**
   * 기본 위험도 분석
   */
  private getBasicRiskAnalysis(checkup: HealthCheckup): any {
    const risks = [];
    
    // BMI 분석
    if (checkup.bmi >= 30) {
      risks.push({ type: 'BMI', level: 'HIGH', message: '비만 (BMI ≥ 30)' });
    } else if (checkup.bmi >= 25) {
      risks.push({ type: 'BMI', level: 'MEDIUM', message: '과체중 (BMI 25-29.9)' });
    }
    
    // 혈압 분석
    if (checkup.bloodPressureSystolic >= 140 || checkup.bloodPressureDiastolic >= 90) {
      risks.push({ type: 'BLOOD_PRESSURE', level: 'HIGH', message: '고혈압 (≥140/90 mmHg)' });
    } else if (checkup.bloodPressureSystolic >= 130 || checkup.bloodPressureDiastolic >= 80) {
      risks.push({ type: 'BLOOD_PRESSURE', level: 'MEDIUM', message: '고혈압 전단계 (130-139/80-89 mmHg)' });
    }
    
    // 혈당 분석
    if (checkup.fastingBloodSugar >= 126) {
      risks.push({ type: 'BLOOD_SUGAR', level: 'HIGH', message: '당뇨병 (공복혈당 ≥126 mg/dL)' });
    } else if (checkup.fastingBloodSugar >= 100) {
      risks.push({ type: 'BLOOD_SUGAR', level: 'MEDIUM', message: '공복혈당장애 (100-125 mg/dL)' });
    }
    
    return {
      checkupId: checkup.id,
      name: checkup.name,
      checkupDate: checkup.checkupDate,
      overallRisk: risks.length === 0 ? 'LOW' : 
                   risks.some(r => r.level === 'HIGH') ? 'HIGH' : 'MEDIUM',
      risks: risks,
      recommendations: ['균형잡힌 식단과 규칙적인 운동을 권장합니다.'],
    };
  }
}