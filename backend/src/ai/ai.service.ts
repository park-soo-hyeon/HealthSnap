import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';

interface NutritionData {
  food_id: string;
  name_kr: string;
  serving_g: number;
  carb_g: number;
  protein_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
}

interface UserData {
  user: {
    user_id: string;
    name: string;
    sex: string;
    age: number;
    height_cm: number;
    weight_kg: number;
  };
  labs: {
    fasting_glucose_mgdl?: number;
    ldl_mgdl?: number;
    hdl_mgdl?: number;
    tg_mgdl?: number;
    sbp_mmhg?: number;
    dbp_mmhg?: number;
    total_cholesterol_mgdl?: number;
    ast_u_l?: number;
    alt_u_l?: number;
    ggt_u_l?: number;
    creatinine_mgdl?: number;
    hemoglobin_gdl?: number;
  };
}

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private nutritionData: NutritionData[] = [];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.loadNutritionData();
  }

  private loadNutritionData() {
    try {
      const nutritionPath = path.join(__dirname, '../../../data_ai/main/nutrition.csv');
      const csvData = fs.readFileSync(nutritionPath, 'utf8');
      
      const parsed = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });

      this.nutritionData = parsed.data.map((row: any) => ({
        food_id: row.food_id || '',
        name_kr: row.name_kr || '',
        serving_g: parseFloat(row.serving_g) || 0,
        carb_g: parseFloat(row.carb_g) || 0,
        protein_g: parseFloat(row.protein_g) || 0,
        fat_g: parseFloat(row.fat_g) || 0,
        sugar_g: parseFloat(row.sugar_g) || 0,
        sodium_mg: parseFloat(row.sodium_mg) || 0,
      }));

      console.log(`✅ Loaded ${this.nutritionData.length} nutrition records`);
    } catch (error) {
      console.error('❌ Failed to load nutrition data:', error);
      this.nutritionData = [];
    }
  }

  private computeAge(birthDateStr: string): number {
    if (!birthDateStr) return 0;
    try {
      // Handle YYYYMMDD format
      if (birthDateStr.length === 8) {
        const year = parseInt(birthDateStr.substring(0, 4));
        const month = parseInt(birthDateStr.substring(4, 6));
        const day = parseInt(birthDateStr.substring(6, 8));
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return Math.max(0, age);
      }
      
      const birthDate = new Date(birthDateStr);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return Math.max(0, age);
    } catch {
      return 0;
    }
  }

  private transformToUserData(checkup: any): UserData {
    const age = this.computeAge(checkup.birthDate);
    const height_cm = parseFloat(checkup.height) || 0.0;
    const weight_kg = parseFloat(checkup.weight) || 0.0;

    return {
      user: {
        user_id: String(checkup.id || ''),
        name: checkup.name || `user-${checkup.id || ''}`,
        sex: 'U', // Default since not specified in schema
        age,
        height_cm,
        weight_kg
      },
      labs: {
        fasting_glucose_mgdl: checkup.fastingBloodSugar,
        ldl_mgdl: checkup.ldlCholesterol,
        hdl_mgdl: checkup.hdlCholesterol,
        tg_mgdl: checkup.triglycerides,
        sbp_mmhg: checkup.bloodPressureSystolic,
        dbp_mmhg: checkup.bloodPressureDiastolic,
        total_cholesterol_mgdl: checkup.totalCholesterol,
        ast_u_l: checkup.astSgot,
        alt_u_l: checkup.altSgpt,
        ggt_u_l: checkup.gammaGtp,
        creatinine_mgdl: checkup.serumCreatinine,
        hemoglobin_gdl: checkup.hemoglobin,
      }
    };
  }

  private getCandidates(proteinMin: number, sodiumLimit: number): NutritionData[] {
    return this.nutritionData
      .filter(food => 
        food.protein_g >= proteinMin && 
        food.sodium_mg <= sodiumLimit &&
        !this.isSideFood(food.name_kr)
      )
      .sort((a, b) => this.scoreFood(a, proteinMin) - this.scoreFood(b, proteinMin))
      .slice(0, 150);
  }

  private isSideFood(name: string): boolean {
    return ['장아찌', '젓갈', '절임', '피클'].some(keyword => name.includes(keyword));
  }

  private scoreFood(food: NutritionData, proteinTarget: number): number {
    const proteinPenalty = Math.abs(food.protein_g - proteinTarget);
    const sodiumPenalty = Math.max(0, food.sodium_mg - 800) / 800;
    return 0.6 * proteinPenalty + 1.0 * sodiumPenalty;
  }

  private sanitizeNum(value: any, min?: number, max?: number): number | null {
    if (value === null || value === undefined) return null;
    try {
      let num = parseFloat(value);
      if (isNaN(num)) return null;
      if (min !== undefined && num < min) num = min;
      if (max !== undefined && num > max) num = max;
      return num;
    } catch {
      return null;
    }
  }

  private sanitizeHealthMetrics(metrics: any): any {
    const clamps = {
      bmi: [10, 50],
      sbp_mmhg: [70, 200],
      dbp_mmhg: [40, 130],
      hemoglobin_gdl: [5, 20],
      fasting_glucose_mgdl: [60, 300],
      total_cholesterol_mgdl: [80, 400],
      hdl_mgdl: [10, 120],
      tg_mgdl: [30, 800],
      creatinine_mgdl: [0.3, 3.0],
      ldl_mgdl: [30, 300],
      ast_u_l: [5, 300],
      alt_u_l: [5, 300],
      ggt_u_l: [5, 500],
    };

    const result = {};
    for (const [key, [min, max]] of Object.entries(clamps)) {
      result[key] = this.sanitizeNum(metrics[key], min, max);
    }
    return result;
  }

  private calculateOverallHealthScore(userLabs: any, means: any, sds: any): number {
    // 위험도별 가중치 설정 (생명 위험도 기준)
    const riskWeights = {
      // 최고 위험도 (생명 직결)
      'bmi': 3.0,
      'sbp_mmhg': 3.0,
      'dbp_mmhg': 3.0,
      'fasting_glucose_mgdl': 2.5,
      
      // 중간 위험도 (심혈관 질환)
      'total_cholesterol_mgdl': 2.0,
      'ldl_mgdl': 2.0,
      'hdl_mgdl': 2.0,
      'tg_mgdl': 1.8,
      
      // 기본 위험도 (일반 건강 지표)
      'hemoglobin_gdl': 1.5,
      'creatinine_mgdl': 1.5,
      'ast_u_l': 1.2,
      'alt_u_l': 1.2,
      'ggt_u_l': 1.0
    };

    // 절대 위험 임계값 (이 값을 넘으면 강제로 낮은 점수)
    const criticalThresholds = {
      'bmi': { min: 16, max: 35 }, // BMI 35+ 고도비만, 16- 저체중
      'sbp_mmhg': { min: 90, max: 160 }, // 수축기 160+ 고혈압 2단계
      'dbp_mmhg': { min: 60, max: 100 }, // 이완기 100+ 고혈압 2단계
      'fasting_glucose_mgdl': { min: 70, max: 140 }, // 140+ 당뇨병 의심
      'total_cholesterol_mgdl': { min: 120, max: 240 },
      'ldl_mgdl': { min: 50, max: 160 },
      'hdl_mgdl': { min: 35, max: 100 }, // HDL은 높을수록 좋음
      'tg_mgdl': { min: 50, max: 200 }
    };
    
    let totalWeightedPenalty = 0;
    let totalWeight = 0;
    let criticalViolations = 0;
    
    for (const [key, weight] of Object.entries(riskWeights)) {
      const userValue = userLabs[key];
      const meanValue = means[key];
      const sdValue = sds[key];
      
      if (userValue !== null && meanValue !== null && sdValue !== null && sdValue > 0) {
        // Z-Score 계산
        const zScore = Math.abs((userValue - meanValue) / sdValue);
        
        // 절대 위험 임계값 체크
        const threshold = criticalThresholds[key];
        let criticalPenalty = 0;
        
        if (threshold) {
          if (key === 'hdl_mgdl') {
            // HDL은 낮을수록 위험
            if (userValue < threshold.min) criticalPenalty = 30;
          } else {
            // 다른 지표들은 범위를 벗어나면 위험
            if (userValue < threshold.min || userValue > threshold.max) {
              criticalPenalty = 25;
              criticalViolations++;
            }
          }
        }
        
        // 지수적 페널티 적용 (극단값에 더 큰 페널티)
        const exponentialPenalty = Math.pow(zScore, 1.5) * 5;
        const totalPenalty = Math.max(exponentialPenalty, criticalPenalty);
        
        totalWeightedPenalty += totalPenalty * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return 100;

    // 평균 가중 페널티 계산
    const avgWeightedPenalty = totalWeightedPenalty / totalWeight;
    
    // 임계값 위반이 많으면 추가 페널티
    const criticalBonus = criticalViolations * 10;
    
    // 최종 점수 계산 (더 엄격한 기준)
    const finalPenalty = Math.min(85, avgWeightedPenalty + criticalBonus);
    const score = Math.round(100 - finalPenalty);
    
    return Math.max(5, Math.min(100, score)); // 최소 5점 보장
  }

  async processHealthCheckup(checkupData: any): Promise<any> {
    try {
      const userData = this.transformToUserData(checkupData);
      
      // Calculate protein requirements
      const weight = userData.user.weight_kg;
      const proteinPerDay = weight > 0 ? Math.round(1.1 * weight * 10) / 10 : 60.0;
      const proteinPerMeal = Math.round((proteinPerDay / 3) * 10) / 10;
      const proteinMin = Math.round(proteinPerMeal * 0.8 * 10) / 10;
      const sodiumLimit = 800.0;

      // Get food candidates
      const candidates = this.getCandidates(proteinMin, sodiumLimit);

      // Calculate BMI
      const { height_cm, weight_kg } = userData.user;
      const bmi = height_cm && weight_kg ? Math.round((weight_kg / Math.pow(height_cm / 100, 2)) * 10) / 10 : null;

      // Prepare user values with BMI
      const userValues = { ...userData.labs, bmi };

      // Predict averages using AI
      const { means, sds } = await this.predictAverages(userData, userValues);

      // Get food recommendations and comment using AI
      const { foods, comment } = await this.getFoodRecommendations(userData, means, candidates, proteinPerMeal, proteinMin, sodiumLimit);

      // Calculate overall health score
      const healthScore = this.calculateOverallHealthScore(userValues, means, sds);

      // Build response
      const result = {
        overallHealthScore: healthScore,
        finalmessage: comment,
        llmcomment: comment,
        overallComment: comment
      };

      // Add average values
      const aveKeyMap = {
        bmi: 'ave_bmi',
        sbp_mmhg: 'ave_bloodPressureSystolic',
        dbp_mmhg: 'ave_bloodPressureDiastolic',
        hemoglobin_gdl: 'ave_hemoglobin',
        fasting_glucose_mgdl: 'ave_fastingBloodSugar',
        total_cholesterol_mgdl: 'ave_totalCholesterol',
        hdl_mgdl: 'ave_hdlCholesterol',
        tg_mgdl: 'ave_triglycerides',
        creatinine_mgdl: 'ave_serumCreatinine',
        ldl_mgdl: 'ave_ldlCholesterol',
        ast_u_l: 'ave_astSgot',
        alt_u_l: 'ave_altSgpt',
        ggt_u_l: 'ave_gammaGtp',
      };

      for (const [key, aveKey] of Object.entries(aveKeyMap)) {
        result[aveKey] = means[key];
      }

      // Add food recommendations
      for (let i = 1; i <= 6; i++) {
        const food = foods[i - 1];
        if (food) {
          result[`food_name${i}`] = food.name_kr;
          result[`grams${i}`] = food.serving_g;
          result[`carbohydrate${i}`] = food.carb_g;
          result[`protein${i}`] = food.protein_g;
          result[`fat${i}`] = food.fat_g;
          result[`sodium${i}`] = food.sodium_mg;
        } else {
          result[`food_name${i}`] = null;
          result[`grams${i}`] = null;
          result[`carbohydrate${i}`] = null;
          result[`protein${i}`] = null;
          result[`fat${i}`] = null;
          result[`sodium${i}`] = null;
        }
      }

      return result;
    } catch (error) {
      console.error('Error processing health checkup:', error);
      throw error;
    }
  }

  private async predictAverages(userData: UserData, userValues: any): Promise<{ means: any; sds: any }> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash'
      });

      const prompt = `
역할: 건강지표 평균 예측기.
입력된 개인 정보(나이, 성별, 신장, 체중 등)를 바탕으로 '해당 집단에서 일반적인 평균값'을 추정해라.
- 현실적 범위의 수치만 생성(음수 금지, 비상식값 금지).
- 표준편차도 같이 추정해라(현실적 크기).
- 출력은 반드시 순수한 JSON 형식으로만 응답.
- 사용자 실제값(user_values)을 그대로 복사/모사하여 means로 쓰지 말 것(복붙 금지).
- 설명이나 추가 텍스트 없이 JSON만 반환.

입력 데이터:
${JSON.stringify({
  age: userData.user.age,
  sex: userData.user.sex,
  height_cm: userData.user.height_cm,
  weight_kg: userData.user.weight_kg,
  user_values: userValues,
  need_metrics: [
    "bmi","sbp_mmhg","dbp_mmhg","hemoglobin_gdl","fasting_glucose_mgdl",
    "total_cholesterol_mgdl","hdl_mgdl","tg_mgdl","creatinine_mgdl",
    "ldl_mgdl","ast_u_l","alt_u_l","ggt_u_l"
  ]
}, null, 2)}

응답 형식:
{
  "means": {
    "bmi": 22.5,
    "sbp_mmhg": 120,
    "dbp_mmhg": 80,
    ...
  },
  "sds": {
    "bmi": 2.5,
    "sbp_mmhg": 12,
    "dbp_mmhg": 8,
    ...
  }
}`;

      const result = await model.generateContent([
        { text: prompt }
      ]);
      const response = await result.response;
      let responseText = response.text();
      
      // Clean up response text for JSON parsing
      responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      console.log('AI Response for averages:', responseText);
      const data = JSON.parse(responseText);

      const means = this.sanitizeHealthMetrics(data.means || {});
      const sds = this.sanitizeHealthMetrics(data.sds || {});

      // Fill missing values with defaults
      const defaultSds = {
        bmi: 2.5, sbp_mmhg: 12, dbp_mmhg: 8, hemoglobin_gdl: 1.2, fasting_glucose_mgdl: 15,
        total_cholesterol_mgdl: 28, hdl_mgdl: 12, tg_mgdl: 40, creatinine_mgdl: 0.15,
        ldl_mgdl: 25, ast_u_l: 10, alt_u_l: 10, ggt_u_l: 15
      };

      for (const key of Object.keys(defaultSds)) {
        if (means[key] === null) means[key] = userValues[key];
        if (sds[key] === null) sds[key] = defaultSds[key];
      }

      return { means, sds };
    } catch (error) {
      console.error('Error predicting averages:', error);
      // Return fallback values
      return {
        means: {
          bmi: 23.0, sbp_mmhg: 125, dbp_mmhg: 82, hemoglobin_gdl: 13.5, fasting_glucose_mgdl: 95,
          total_cholesterol_mgdl: 200, hdl_mgdl: 55, tg_mgdl: 130, creatinine_mgdl: 0.9,
          ldl_mgdl: 115, ast_u_l: 25, alt_u_l: 25, ggt_u_l: 30
        },
        sds: {
          bmi: 2.5, sbp_mmhg: 12, dbp_mmhg: 8, hemoglobin_gdl: 1.2, fasting_glucose_mgdl: 15,
          total_cholesterol_mgdl: 28, hdl_mgdl: 12, tg_mgdl: 40, creatinine_mgdl: 0.15,
          ldl_mgdl: 25, ast_u_l: 10, alt_u_l: 10, ggt_u_l: 15
        }
      };
    }
  }

  private async getFoodRecommendations(
    userData: UserData, 
    means: any, 
    candidates: NutritionData[], 
    proteinPerMeal: number, 
    proteinMin: number, 
    sodiumLimit: number
  ): Promise<{ foods: NutritionData[]; comment: string }> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash'
      });

      const prompt = `
역할: 영양데이터 기반 추천기.
- 아래 candidates(표 형식 JSON 배열)에서만 6개를 고르라(중복 금지, 사이드 금지).
- 제약: protein_g ≥ ${proteinMin}, sodium_mg ≤ ${sodiumLimit}.
- 'comment'는 반드시 한국어 한 단락:
  1) 먼저 건강상태 '진단 요약'(입력값 vs 예측평균 비교로 핵심만)
  2) 이어서 '이러한 이유로 …을 고려하여' 선정 식단의 근거를 연결(단백질/나트륨/지방 등).
- 출력은 반드시 순수한 JSON 형식으로만 응답.
- 설명이나 추가 텍스트 없이 JSON만 반환.

입력 데이터:
${JSON.stringify({
  user: userData,
  predicted_means: means,
  constraints: {
    protein_target_per_meal: proteinPerMeal,
    protein_min: proteinMin,
    sodium_limit_mg: sodiumLimit
  },
  candidates: candidates.slice(0, 50) // Limit for token size
}, null, 2)}

응답 형식:
{
  "comment": "건강상태 진단과 식단 선정 근거...",
  "foods": [
    {
      "food_id": "ssalbab",
      "name_kr": "쌀밥",
      "serving_g": 210,
      "carb_g": 73.71,
      "protein_g": 5.76,
      "fat_g": 0.45,
      "sodium_mg": 59.4
    }
  ]
}`;

      const result = await model.generateContent([
        { text: prompt }
      ]);
      const response = await result.response;
      let responseText = response.text();
      
      // Clean up response text for JSON parsing
      responseText = responseText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      console.log('AI Response for foods:', responseText);
      const data = JSON.parse(responseText);

      const selectedFoods = data.foods || [];
      const comment = data.comment || '단백질 충족과 저염 기준을 만족하는 항목으로 구성했습니다.';

      // Ensure we have 6 foods, fill with top candidates if needed
      const finalFoods = [];
      const usedIds = new Set();

      for (const food of selectedFoods) {
        if (finalFoods.length >= 6) break;
        if (!usedIds.has(food.food_id)) {
          finalFoods.push(food);
          usedIds.add(food.food_id);
        }
      }

      // Fill remaining slots with top candidates
      for (const candidate of candidates) {
        if (finalFoods.length >= 6) break;
        if (!usedIds.has(candidate.food_id)) {
          finalFoods.push(candidate);
          usedIds.add(candidate.food_id);
        }
      }

      return { foods: finalFoods, comment };
    } catch (error) {
      console.error('Error getting food recommendations:', error);
      // Return fallback
      return {
        foods: candidates.slice(0, 6),
        comment: '단백질 충족과 저염 기준을 만족하는 항목으로 자동 구성했습니다.'
      };
    }
  }
}
