import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// 스타일 객체: CSS 코드를 JavaScript 객체 형태로 정의합니다.
const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '3rem 1.5rem',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box',
  },
  contentWrapper: {
    maxWidth: '56rem',
    margin: '0 auto',
  },
  headerText: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  h1: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  p: {
    color: '#6b7280',
    fontSize: '1.125rem',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    padding: '2.5rem',
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    color: '#9ca3af',
    fontWeight: 500,
  },
  stepItemActive: {
    color: '#1f2937',
  },
  stepCircle: {
    width: '2rem',
    height: '2rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
    transition: 'background-color 0.3s, color 0.3s',
    border: '2px solid transparent',
  },
  stepCircleActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  stepCircleCompleted: {
    backgroundColor: 'white',
    color: '#34d399',
    borderColor: '#34d399',
  },
  stepTitle: {
    marginLeft: '0.5rem',
    fontSize: '0.875rem',
  },
  stepConnector: {
    flex: 1,
    height: '2px',
    backgroundColor: '#e5e7eb',
    margin: '0 1rem',
  },
  stepConnectorActive: {
    backgroundColor: '#3b82f6',
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '2rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '1.5rem',
  },
  formGridDesktop: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  formGrid3Cols: {
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '1.5rem',
  },
  gridColSpan2: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  required: {
    color: '#ef4444',
    marginLeft: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputReadOnly: {
    backgroundColor: '#f3f4f6', // 회색 배경
    color: '#6b7280',
    cursor: 'not-allowed',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    minHeight: '100px',
    resize: 'vertical',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  },
  charCounter: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.25rem',
  },
  radioGroup: {
    display: 'flex',
    gap: '2rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '0.5rem',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '2rem',
    marginTop: '2rem',
  },
  btn: {
    fontWeight: '600',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s, transform 0.1s',
    cursor: 'pointer',
    padding: '0.75rem 1.5rem',
    border: 'none',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  btnSuccess: {
    backgroundColor: '#16a34a', // 초록색
    color: 'white',
  },
  btnSecondary: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
  btnDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  // 로딩 오버레이 스타일
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    maxWidth: '400px',
    width: '90%',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem auto',
  },
  loadingTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  }
};

const InputPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, getAuthHeaders } = useAuth();
  
  // CSS 애니메이션 추가
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 로그인 사용자의 기본 정보 설정
  React.useEffect(() => {
    if (isAuthenticated() && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        birthDate: user.birthDate || '',
        gender: user.gender || ''
      }));
    }
  }, [isAuthenticated, user]);
  
  // 현재 단계를 관리하기 위한 상태 (State) - 로그인 사용자는 2단계부터 시작
  const [currentStep, setCurrentStep] = useState(isAuthenticated() ? 2 : 1);

  // 모든 폼 데이터를 담기 위한 상태
  const [formData, setFormData] = useState({
        // 1단계
        name: '',
        birthDate: '',
        gender: '',
        // 2단계
        past_diagnosis: '',
        current_medication: '',
        trauma_aftereffects: '', // 외상 및 후유증 추가
        lifestyle_condition: '',
        general_condition: '',
        // 3단계
        height: '',
        weight: '',
        waist: '',
        systolic_bp: '',
        diastolic_bp: '',
        vision_left: '',
        vision_right: '',
        hearing_left: '',
        hearing_right: '',
        // 4단계
        hemoglobin: '',
        fasting_glucose: '',
        total_cholesterol: '',
        hdl_cholesterol: '',
        ldl_cholesterol: '',
        triglycerides: '',
        ast: '',
        alt: '',
        gamma_gtp: '', // 감마GTP 추가
        serum_creatinine: '',
        // 5단계
        chest_xray: '',
        urine_protein: '',
        checkup_date: '',
        institution_name: '',
    });

  const [bmi, setBmi] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const heightInMeters = parseFloat(formData.height) / 100;
    const weightInKg = parseFloat(formData.weight);

    if (heightInMeters > 0 && weightInKg > 0) {
      const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);
    } else {
      setBmi('');
    }
  }, [formData.height, formData.weight]); // 신장 또는 체중이 변경될 때마다 실행

  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const transformDataForBackend = (data) => {
        // 문자열 'yes'/'no' 등을 boolean으로, 숫자 문자열을 float으로 변환
        const toBoolean = (value) => value === 'yes';
        const toFloat = (value) => parseFloat(value) || 0;

        return {
            name: data.name,
            birthDate: data.birthDate,
            sex: data.gender,
            height: toFloat(data.height),
            weight: toFloat(data.weight),
            waistCircumference: toFloat(data.waist),
            bmi: toFloat(bmi),
            hasDiagnosis: toBoolean(data.past_diagnosis),
            isMedicated: toBoolean(data.current_medication),
            hasTraumaOrAftereffects: toBoolean(data.trauma_aftereffects),
            lifestyle: data.lifestyle_condition,
            generalCondition: data.general_condition,
            visionLeft: toFloat(data.vision_left),
            visionRight: toFloat(data.vision_right),
            isHearingLeftNormal: data.hearing_left === 'normal',
            isHearingRightNormal: data.hearing_right === 'normal',
            bloodPressureSystolic: toFloat(data.systolic_bp),
            bloodPressureDiastolic: toFloat(data.diastolic_bp),
            isProteinuriaPositive: data.urine_protein === 'positive',
            hemoglobin: toFloat(data.hemoglobin),
            fastingBloodSugar: toFloat(data.fasting_glucose),
            totalCholesterol: toFloat(data.total_cholesterol),
            hdlCholesterol: toFloat(data.hdl_cholesterol),
            triglycerides: toFloat(data.triglycerides),
            ldlCholesterol: toFloat(data.ldl_cholesterol),
            serumCreatinine: toFloat(data.serum_creatinine),
            astSgot: toFloat(data.ast),
            altSgpt: toFloat(data.alt),
            gammaGtp: toFloat(data.gamma_gtp),
            isChestXrayNormal: data.chest_xray === 'normal',
            checkupDate: data.checkup_date,
            checkupCenterName: data.institution_name,
        };
    };

// ... (파일 상단의 import, styles, useState, useEffect 등은 모두 동일)

  // handleNext 함수를 아래 내용으로 교체합니다.
  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const backendData = transformDataForBackend(formData);
      
      // 로딩 시작
      setIsLoading(true);
      
      try {
        // API 엔드포인트 결정
        const apiEndpoint = isAuthenticated() 
          ? `${process.env.API_BASE_URL || 'https://healthsnap-5stc.onrender.com'}/Ai/db`      // 로그인: DB 저장
          : `${process.env.API_BASE_URL || 'https://healthsnap-5stc.onrender.com'}/Ai/analyze`; // 비로그인: 분석만
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: isAuthenticated() ? getAuthHeaders() : { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData.message || errorData)}`);
        }
        
        // ✨ 1. 백엔드로부터 받은 응답 데이터를 변수에 저장합니다.
        const responseData = await response.json();
        console.log('Data successfully sent, received response:', responseData);

        // ✨ 2. ResultPage로 이동할 때, 기존 formData 대신 백엔드 응답 데이터(responseData)를 전달합니다.
        navigate('/result', { state: { results: responseData } });

      } catch (error) {
        console.error('Failed to send data to backend:', error);
        alert(`데이터 전송에 실패했습니다.\n\n오류 내용: ${error.message}\n\n입력값을 다시 확인해주세요.`);
      } finally {
        // 로딩 종료
        setIsLoading(false);
      }
    }
  };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
  
  // 진행률 표시줄의 각 단계를 위한 컴포넌트
  const Step = ({ number, title, isActive, isCompleted }) => (
    <div style={{ ...styles.stepItem, ...(isActive && styles.stepItemActive) }}>
      <div style={{ ...styles.stepCircle, ...(isActive && styles.stepCircleActive), ...(isCompleted && styles.stepCircleCompleted) }}>
        {isCompleted && !isActive ? '✓' : number}
      </div>
      <span style={styles.stepTitle}>{title}</span>
      {number < totalSteps && <div style={{ ...styles.stepConnector, ...(isCompleted && styles.stepConnectorActive) }}></div>}
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.headerText}>
          <h1 style={styles.h1}>건강검진 데이터 입력</h1>
          <p style={styles.p}>정확한 건강 분석을 위해 건강검진 결과를 입력해주세요</p>
        </div>

        <div style={styles.formContainer}>
          <div style={styles.progressBar}>
            {['인적사항', '과거병력 및 생활습관', '신체측정', '혈액검사', '기타검사 및 정보'].map((title, index) => (
              <Step
                key={index}
                number={index + 1}
                title={title}
                isActive={currentStep === index + 1}
                isCompleted={currentStep > index + 1}
              />
            ))}
          </div>

          <form id="health-check-form">
            {currentStep === 1 && (
              <div>
                <h2 style={styles.formTitle}>인적사항</h2>
                <div style={{ ...styles.formGrid, ...styles.formGridDesktop }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>성명 <span style={styles.required}>*</span></label>
                    <input style={styles.input} placeholder="홍길동" type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>생년월일 <span style={styles.required}>*</span></label>
                    <input style={styles.input} placeholder="연도. 월. 일." type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                  </div>
                  <div style={{ ...styles.formGroup, ...styles.gridColSpan2 }}>
                    <label style={styles.label}>성별 <span style={styles.required}>*</span></label>
                    <div style={styles.radioGroup}>
                      <label style={styles.radioLabel}>
                        <input style={styles.radioInput} type="radio" value="male" name="gender" checked={formData.gender === 'male'} onChange={handleChange} />
                        남성
                      </label>
                      <label style={styles.radioLabel}>
                        <input style={styles.radioInput} type="radio" value="female" name="gender" checked={formData.gender === 'female'} onChange={handleChange} />
                        여성
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
                <div>
                    <h2 style={styles.formTitle}>과거병력 및 생활습관</h2>
                    <div style={{ ...styles.formGrid, ...styles.formGridDesktop }}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>과거 진단 여부</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="yes" name="past_diagnosis" checked={formData.past_diagnosis === 'yes'} onChange={handleChange} />
                                    예
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="no" name="past_diagnosis" checked={formData.past_diagnosis === 'no'} onChange={handleChange} />
                                    아니오
                                </label>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>약물 치료 여부</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="yes" name="current_medication" checked={formData.current_medication === 'yes'} onChange={handleChange} />
                                    예
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="no" name="current_medication" checked={formData.current_medication === 'no'} onChange={handleChange} />
                                    아니오
                                </label>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>외상 및 후유증 여부</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="yes" name="trauma_aftereffects" checked={formData.trauma_aftereffects === 'yes'} onChange={handleChange} /> 예
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="no" name="trauma_aftereffects" checked={formData.trauma_aftereffects === 'no'} onChange={handleChange} /> 아니오
                                </label>
                            </div>
                        </div>

                        {/* 생활습관 항목 추가 */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>생활습관</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="good" name="lifestyle_condition" checked={formData.lifestyle_condition === 'good'} onChange={handleChange} />
                                    양호
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="caution" name="lifestyle_condition" checked={formData.lifestyle_condition === 'caution'} onChange={handleChange} />
                                    주의
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="danger" name="lifestyle_condition" checked={formData.lifestyle_condition === 'danger'} onChange={handleChange} />
                                    위험
                                </label>
                            </div>
                        </div>

                        {/* 일반상태 항목 추가 */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>일반상태</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="good" name="general_condition" checked={formData.general_condition === 'good'} onChange={handleChange} />
                                    양호
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="caution" name="general_condition" checked={formData.general_condition === 'caution'} onChange={handleChange} />
                                    주의
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="danger" name="general_condition" checked={formData.general_condition === 'danger'} onChange={handleChange} />
                                    위험
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div>
                    <h2 style={styles.formTitle}>신체측정</h2>
                    <div style={{ ...styles.formGrid, ...styles.formGridDesktop }}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>신장 (cm)</label>
                            <input style={styles.input} type="number" name="height" value={formData.height} onChange={handleChange} placeholder="예: 170" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>체중 (kg)</label>
                            <input style={styles.input} type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="예: 70" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>허리둘레 (cm)</label>
                            <input style={styles.input} type="number" name="waist" value={formData.waist} onChange={handleChange} placeholder="예: 80" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>BMI (kg/m²)</label>
                            <input style={{...styles.input, ...styles.inputReadOnly}} type="text" name="bmi" value={bmi} readOnly placeholder="자동 계산됩니다" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>혈압 (최고/mmHg)</label>
                            <input style={styles.input} type="number" name="systolic_bp" value={formData.systolic_bp} onChange={handleChange} placeholder="예: 120" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>혈압 (최저/mmHg)</label>
                            <input style={styles.input} type="number" name="diastolic_bp" value={formData.diastolic_bp} onChange={handleChange} placeholder="예: 80" />
                        </div>
                        {/* 시력 입력란 추가 */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>시력 (좌)</label>
                            <input style={styles.input} type="number" step="0.1" name="vision_left" value={formData.vision_left} onChange={handleChange} placeholder="예: 1.0" />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>시력 (우)</label>
                            <input style={styles.input} type="number" step="0.1" name="vision_right" value={formData.vision_right} onChange={handleChange} placeholder="예: 1.0" />
                        </div>
                        {/* 청력 입력란 추가 */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>청력 (좌)</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="normal" name="hearing_left" checked={formData.hearing_left === 'normal'} onChange={handleChange} />
                                    정상
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="abnormal" name="hearing_left" checked={formData.hearing_left === 'abnormal'} onChange={handleChange} />
                                    비정상
                                </label>
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>청력 (우)</label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="normal" name="hearing_right" checked={formData.hearing_right === 'normal'} onChange={handleChange} />
                                    정상
                                </label>
                                <label style={styles.radioLabel}>
                                    <input style={styles.radioInput} type="radio" value="abnormal" name="hearing_right" checked={formData.hearing_right === 'abnormal'} onChange={handleChange} />
                                    비정상
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {currentStep === 4 && (
              <div>
                <h2 style={styles.formTitle}>혈액검사</h2>
                <div style={{ ...styles.formGrid, ...styles.formGridDesktop }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>혈색소 (g/dL)</label>
                    <input style={styles.input} type="number" name="hemoglobin" value={formData.hemoglobin} onChange={handleChange} placeholder="예: 14.5" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>식전혈당 (mg/dL)</label>
                    <input style={styles.input} type="number" name="fasting_glucose" value={formData.fasting_glucose} onChange={handleChange} placeholder="예: 95" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>총콜레스테롤 (mg/dL)</label>
                    <input style={styles.input} type="number" name="total_cholesterol" value={formData.total_cholesterol} onChange={handleChange} placeholder="예: 180" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>HDL-콜레스테롤 (mg/dL)</label>
                    <input style={styles.input} type="number" name="hdl_cholesterol" value={formData.hdl_cholesterol} onChange={handleChange} placeholder="예: 55" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>LDL-콜레스테롤 (mg/dL)</label>
                    <input style={styles.input} type="number" name="ldl_cholesterol" value={formData.ldl_cholesterol} onChange={handleChange} placeholder="예: 100" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>중성지방(트리글리세라이드) (mg/dL)</label>
                    <input style={styles.input} type="number" name="triglycerides" value={formData.triglycerides} onChange={handleChange} placeholder="예: 120" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>AST (U/L)</label>
                    <input style={styles.input} type="number" name="ast" value={formData.ast} onChange={handleChange} placeholder="예: 25" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>ALT (U/L)</label>
                    <input style={styles.input} type="number" name="alt" value={formData.alt} onChange={handleChange} placeholder="예: 30" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>감마GTP (γ-GTP) (U/L)</label>
                    <input style={styles.input} type="number" name="gamma_gtp" value={formData.gamma_gtp} onChange={handleChange} placeholder="예: 20" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>혈청크레아티닌 (mg/dL)</label>
                    <input style={styles.input} type="number" step="0.1" name="serum_creatinine" value={formData.serum_creatinine} onChange={handleChange} placeholder="예: 0.9" />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 5 && (
              <div>
                <h2 style={styles.formTitle}>기타검사 및 정보</h2>
                <div style={{ ...styles.formGrid, ...styles.formGridDesktop }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>흉부 X-ray</label>
                    <select style={styles.select} name="chest_xray" value={formData.chest_xray} onChange={handleChange}>
                      <option value="" disabled>선택하세요</option>
                      <option value="normal">정상</option>
                      <option value="inactive_calcification">비활동성/석회화</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>요단백</label>
                    <select style={styles.select} name="urine_protein" value={formData.urine_protein} onChange={handleChange}>
                      <option value="" disabled>선택하세요</option>
                      <option value="negative">음성 (-)</option>
                      <option value="positive">양성 (+)</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>검진일 <span style={styles.required}>*</span></label>
                    <input style={styles.input} type="date" name="checkup_date" value={formData.checkup_date} onChange={handleChange} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>검진기관명 <span style={styles.required}>*</span></label>
                    <input style={styles.input} type="text" name="institution_name" value={formData.institution_name} onChange={handleChange} placeholder="OO병원" />
                  </div>
                </div>
              </div>
            )}

            <div style={styles.navigationButtons}>
              <button
                type="button"
                style={{...styles.btn, ...styles.btnSecondary, ...(currentStep === 1 && styles.btnDisabled)}}
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                이전 단계
              </button>
              <button
                type="button"
                style={{
                  ...styles.btn,
                  ...(currentStep === totalSteps ? styles.btnSuccess : styles.btnPrimary),
                  ...(isLoading && styles.btnDisabled),
                }}
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? '분석 중...' : (currentStep === totalSteps ? '분석 결과 확인' : '다음 단계')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.loadingSpinner}></div>
            <h3 style={styles.loadingTitle}>건강 분석 중입니다</h3>
            <p style={styles.loadingText}>
              AI가 귀하의 건강 데이터를 분석하고<br/>
              맞춤형 식단을 추천하고 있습니다.<br/>
              잠시만 기다려주세요...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPage;