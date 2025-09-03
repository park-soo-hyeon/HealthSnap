import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import IconBMI from '@/components/icons/IconBMI';

const IconForkKnife = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 8.5A1.5 1.5 0 0 1 0 7V1.5A1.5 1.5 0 0 1 1.5 0h2A1.5 1.5 0 0 1 5 1.5v13A1.5 1.5 0 0 1 3.5 16h-2A1.5 1.5 0 0 1 0 14.5V11h1.5v3.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5V7c0 .276.224.5.5.5h1v1H1.5Z"></path><path d="M16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 11 14.5V1.5A1.5 1.5 0 0 1 12.5 0h2A1.5 1.5 0 0 1 16 1.5ZM12.5 1h-2a.5.5 0 0 0-.5.5V12h3V1.5a.5.5 0 0 0-.5-.5Z"></path><path d="M8.5 7.043V1.5a.5.5 0 0 0-1 0V7.043C7.22 7.24 7 7.592 7 8v8h1V8c0-.408-.22-.76-.5-1.043ZM6 1V7c0 .552-.448 1-1 1s-1-.448-1-1V1h2Z"></path></svg>;
const IconCheck = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path></svg>;
const IconDoctor = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5a5.5 5.5 0 0 1 5.5 5.5c0 1.54-.64 2.92-1.68 3.93a.5.5 0 0 1-.32.07H8.5a.5.5 0 0 1-.32-.07A5.5 5.5 0 0 1 6.5 8a5.5 5.5 0 0 1 5.5-5.5ZM12 3.5A4.5 4.5 0 0 0 7.5 8c0 1.65 1.01 3.09 2.42 3.83h4.16A4.5 4.5 0 0 0 16.5 8a4.5 4.5 0 0 0-4.5-4.5Z"></path><path d="M8.5 13a1 1 0 0 0-1 1v3.5h-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v1.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V21h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1V14a1 1 0 0 0-1-1h-7ZM8 14h6v3.5H8V14Z"></path></svg>;

// ✨ 스크린샷 UI에 맞춰 스타일 객체를 완전히 새로 구성했습니다.
const styles = {
  pageContainer: {
    padding: '3rem 1.5rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#f9fafb',
  },
  contentWrapper: {
    maxWidth: '64rem', // 너비를 조금 더 넓게
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  summaryCard: {
    backgroundColor: '#fffbeb',
    borderRadius: '0.75rem',
    padding: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  scoreText: {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#1f2937',
  },
  scoreLabel: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#4b5563',
    marginTop: '0.5rem',
  },
  progressBarContainer: {
    width: '50%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    margin: '1.5rem auto',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f59e0b', // amber-500
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out',
  },
  summaryComment: {
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '2px solid #e5e7eb',
    marginBottom: '2rem',
  },
  tabButton: {
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px', // 하단 경계선과 겹치도록
  },
  tabButtonActive: {
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '1rem',
  },
  metricCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontWeight: '600',
    color: '#4b5563',
    fontSize: '0.875rem',
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginTop: '0.25rem',
  },
  metricUnit: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  legendBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: '0.75rem',
    padding: '1rem 1.5rem',
    marginTop: '2rem',
  },
  legendTitle: {
    fontWeight: '600',
    fontSize: '0.875rem',
    marginBottom: '0.75rem',
  },
  legendItems: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  primaryButton: {
    fontWeight: '600',
    borderRadius: '0.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    fontWeight: '600',
    borderRadius: '0.5rem',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  expertOpinionBox: {
        lineHeight: 1.7,
    },
    doctorProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#eff6ff',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        marginBottom: '1.5rem',
    },
    doctorIconWrapper: {
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    doctorName: {
        fontSize: '1.125rem',
        fontWeight: '700',
    },
    doctorSpec: {
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    assessmentBox: {
        padding: '1.5rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        marginBottom: '2rem',
    },
    recommendationSection: {
        marginBottom: '2rem',
    },
    recommendationSectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
    },
    recommendationList: {
        listStyle: 'disc',
        paddingLeft: '1.5rem',
        margin: 0,
        fontSize: '0.875rem',
        color: '#374151',
    },
    followUpBox: {
        backgroundColor: '#fefce8',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #fde047',
    },
    recommendationBox: {
        borderRadius: '0.75rem',
        padding: '1.5rem',
        backgroundColor: '#f0fdf4',
        color: '#15803d',
    },
    recommendationTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.125rem',
        fontWeight: '600',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid rgba(21, 128, 61, 0.2)',
        marginBottom: '1rem',
    },
    recommendationItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem',
    },
};

/* 아이콘들 – 임시 인라인 버전 (원한다면 react-icons로 교체 가능) */
// ⚠️ 만약 별도 파일의 IconBMI를 쓰려면 아래 IconBMI 정의를 지우고 기존 import를 유지하세요.
const IconBMI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 3h10a2 2 0 0 1 2 2v14H5V5a2 2 0 0 1 2-2zm8.5 7a1.5 1.5 0 1 0-3 0c0 .52.27.98.68 1.25L12 16h2l-.18-4.75c.41-.27.68-.73.68-1.25z"/>
  </svg>
);
const IconHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21s-6.716-4.35-9.192-7.23C-0.372 10.63 1.157 6 5.07 6c1.96 0 3.27.94 3.93 1.93C9.66 6.94 10.97 6 12.93 6c3.91 0 5.44 4.63 2.26 7.77C18.716 16.65 12 21 12 21z"/>
  </svg>
);
const IconDroplet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2s6 7.1 6 11a6 6 0 0 1-12 0c0-3.9 6-11 6-11z"/>
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l7 3v6c0 5-3.4 9.5-7 11-3.6-1.5-7-6-7-11V5l7-3z"/>
  </svg>
);

/* 상태 색상 */
const statusColors = {
  normal: '#10b981',   // green-500
  caution: '#f59e0b',  // amber-500
  danger: '#ef4444',   // red-500
};

/* 공통 카드 컴포넌트 */
const MetricCard = ({ label, value, unit = '', status = 'normal', avg }) => (
  <div style={styles.metricCard}>
    <div>
      <div style={styles.metricLabel}>{label}</div>
      <div style={styles.metricValue}>
        {value}<span style={styles.metricUnit}> {unit}</span>
      </div>
      {avg !== undefined && avg !== null && avg !== '' && (
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          평균: {avg}{unit ? ` ${unit}` : ''}
        </div>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ ...styles.statusDot, backgroundColor: statusColors[status] || '#9ca3af' }} />
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        {status === 'normal' ? '정상' : status === 'caution' ? '주의' : '위험'}
      </span>
    </div>
  </div>
);


const SummaryContent = ({ data }) => {
    
    // 현재값과 평균값을 비교하여 상태('normal', 'caution', 'danger') 결정
    const getStatusFromAverage = (value, average, isHigherBetter = false) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || !average) return 'normal';

        if (isHigherBetter) {
            if (numValue >= average) return 'normal';
            if (numValue >= average * 0.8) return 'caution'; // 평균의 80% 이상이면 주의
            return 'danger';
        } else {
            if (numValue <= average) return 'normal';
            if (numValue <= average * 1.2) return 'caution'; // 평균의 120% 이하면 주의
            return 'danger';
        }
    };
    
    const metrics = [
        { key: 'bmi', icon: <IconBMI />, label: 'BMI (체질량지수)', value: data.bmi, unit: 'kg/m²', avg: data.ave_bmi, status: getStatusFromAverage(data.bmi, data.ave_bmi) },
        { key: 'blood_pressure', icon: <IconHeart />, label: '혈압', value: `${data.bloodPressureSystolic} / ${data.bloodPressureDiastolic}`, unit: 'mmHg', avg: `${data.ave_bloodPressureSystolic} / ${data.ave_bloodPressureDiastolic}`, status: getStatusFromAverage(data.bloodPressureSystolic, data.ave_bloodPressureSystolic) },
        { key: 'fasting_glucose', icon: <IconDroplet />, label: '식전혈당', value: data.fastingBloodSugar, unit: 'mg/dL', avg: data.ave_fastingBloodSugar, status: getStatusFromAverage(data.fastingBloodSugar, data.ave_fastingBloodSugar) },
        { key: 'total_cholesterol', icon: <IconShield />, label: '총콜레스테롤', value: data.totalCholesterol, unit: 'mg/dL', avg: data.ave_totalCholesterol, status: getStatusFromAverage(data.totalCholesterol, data.ave_totalCholesterol) },
        { key: 'hdl_cholesterol', icon: <IconShield />, label: 'HDL-콜레스테롤', value: data.hdlCholesterol, unit: 'mg/dL', avg: data.ave_hdlCholesterol, status: getStatusFromAverage(data.hdlCholesterol, data.ave_hdlCholesterol, true) },
        { key: 'proteinuria', label: '요단백', value: data.isProteinuriaPositive ? '양성' : '음성', unit: '', status: data.isProteinuriaPositive ? 'danger' : 'normal' },
    ];

  return (
    <>
      <h2 style={styles.sectionTitle}>주요 검진 수치</h2>
      <div style={{...styles.metricGrid, gridTemplateColumns: 'repeat(3, 1fr)'}}>
        {metrics.map(m => (
          <MetricCard 
            key={m.key}
            label={m.label} 
            value={m.value}
            unit={m.unit}
            status={m.status}
            avg={m.avg}
          />
        ))}
      </div>
      <div style={styles.legendBox}>
        <div style={styles.legendTitle}>수치 해석</div>
        <div style={styles.legendItems}>
            <div style={styles.legendItem}><div style={{...styles.statusDot, backgroundColor: statusColors.normal}}></div> 정상</div>
            <div style={styles.legendItem}><div style={{...styles.statusDot, backgroundColor: statusColors.caution}}></div> 주의</div>
            <div style={styles.legendItem}><div style={{...styles.statusDot, backgroundColor: statusColors.danger}}></div> 위험</div>
        </div>
      </div>
    </>
  );
};

// ✨ 2. '종합 소견 및 식단' 탭 수정: 백엔드 데이터 사용 및 툴팁 기능 추가
const ExpertOpinionContent = ({ data }) => {
    const [hoveredFood, setHoveredFood] = useState(null);

    // 백엔드에서 받은 음식 데이터를 사용하기 쉽게 배열로 변환
    const recommendedFoods = [];
    for (let i = 1; i <= 5; i++) {
        if (data[`food_name${i}`]) {
            recommendedFoods.push({
                name: data[`food_name${i}`],
                grams: data[`grams${i}`],
                carbohydrate: data[`carbohydrate${i}`],
                protein: data[`protein${i}`],
                fat: data[`fat${i}`],
                sodium: data[`sodium${i}`],
            });
        }
    }

    return (
        <div style={styles.expertOpinionBox}>
            <h2 style={styles.sectionTitle}>종합 소견 및 식단</h2>
            <div style={styles.doctorProfile}>
                <div style={styles.doctorIconWrapper}><IconDoctor /></div>
                <div>
                    <div style={styles.doctorName}>김건강 전문의</div>
                    <div style={styles.doctorSpec}>내과 전문의 · 예방의학 석사</div>
                </div>
            </div>
            <div style={styles.assessmentBox}>
                {/* 종합 소견을 백엔드의 finalmessage로 교체 */}
                <p>{data.finalmessage || '종합적인 분석 결과입니다.'}</p>
                
                <div style={styles.recommendationSection}>
                     <div style={{...styles.recommendationBox}}>
                        <h4 style={{...styles.recommendationTitle}}><IconForkKnife/> 권장 식품</h4>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                            {recommendedFoods.map((food, i) => (
                                <li 
                                  key={i} 
                                  style={{...styles.recommendationItem, position: 'relative'}}
                                  onMouseEnter={() => setHoveredFood(i)}
                                  onMouseLeave={() => setHoveredFood(null)}
                                >
                                  <IconCheck/> {food.name}
                                  {/* 툴팁 */}
                                  {hoveredFood === i && (
                                    <div style={{
                                        position: 'absolute', left: '105%', top: '0',
                                        backgroundColor: '#333', color: 'white',
                                        padding: '0.5rem', borderRadius: '4px', zIndex: 10,
                                        fontSize: '0.75rem', whiteSpace: 'nowrap'
                                    }}>
                                        <div>{food.grams}g 기준</div>
                                        <div>탄수화물: {food.carbohydrate}g</div>
                                        <div>단백질: {food.protein}g</div>
                                        <div>지방: {food.fat}g</div>
                                        <div>나트륨: {food.sodium}mg</div>
                                    </div>
                                  )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ResultPage = () => {
  const location = useLocation();
  // 이제 results는 백엔드에서 온 상세 데이터입니다.
  const formData = location.state?.results || {};

  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>건강검진 결과 분석</h1>
        <p style={styles.subtitle}>{formData.name || '사용자'}님의 건강 상태를 종합적으로 분석했습니다</p>

        <div style={styles.summaryCard}>
          {/* healthScore를 백엔드 데이터로 직접 사용 */}
          <div style={styles.scoreText}>{formData.healthScore || 'N/A'}</div>
          <div style={styles.scoreLabel}>종합 건강 점수</div>
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${formData.healthScore || 0}%` }}></div>
          </div>
          <p style={styles.summaryComment}>
            {/* 건강점수 기준으로 간단한 문구만 표시 */}
            {formData.healthScore >= 90 ? "매우 양호한 상태입니다." :
             formData.healthScore >= 80 ? "전반적으로 양호한 상태입니다." :
             formData.healthScore >= 70 ? "일부 개선이 필요합니다." :
             "주의가 필요한 부분이 있습니다."}
          </p>
        </div>

        <div style={styles.tabContainer}>
          <button onClick={() => setActiveTab('summary')} style={{...styles.tabButton, ...(activeTab === 'summary' && styles.tabButtonActive)}}>검진표 확인</button>
          <button onClick={() => setActiveTab('expert')} style={{...styles.tabButton, ...(activeTab === 'expert' && styles.tabButtonActive)}}>종합 소견 및 식단</button>
        </div>

        <div style={styles.tabContent}>
            {activeTab === 'summary' && <SummaryContent data={formData} />}
            {activeTab === 'expert' && <ExpertOpinionContent data={formData} />}
        </div>

        <div style={styles.buttonWrapper}>
            <Link to="/input" style={styles.primaryButton}>새로운 검진 입력</Link>
            <Link to="/history" style={styles.secondaryButton}>검진 기록 보기</Link>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;