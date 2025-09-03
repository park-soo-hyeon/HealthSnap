import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// 아이콘 SVG 컴포넌트
const IconDocument = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"></path><path d="M4.5 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V3.5a.5.5 0 0 1 .5-.5zm0 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V6.5a.5.5 0 0 1 .5-.5zm0 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V9.5a.5.5 0 0 1 .5-.5zm4-5.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V3.5a.5.5 0 0 1 .5-.5zm0 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V6.5a.5.5 0 0 1 .5-.5zm0 3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V9.5a.5.5 0 0 1 .5-.5z"></path></svg>;
const IconHeart = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.748-.717 8.354A5.002 5.002 0 0 0 1.5 14.545l6.5-6.502 6.5 6.502a5.002 5.002 0 0 0 2.217-6.191L8 2.748z"></path><path d="M8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path></svg>;
const IconCalendar = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"></path></svg>;
const IconTrash = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path></svg>;
const IconClose = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg>;
const IconBMI = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM7 8a5 5 0 0 0 10 0A5 5 0 0 0 7 8zm0 9a3 3 0 0 0-3 3v1h16v-1a3 3 0 0 0-3-3H7z"></path></svg>;

// ✅ DetailModal에서 쓰는 아이콘 보강
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="currentColor">
    <path d="M12 2s6 7.1 6 11a6 6 0 1 1-12 0c0-3.9 6-11 6-11z"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="currentColor">
    <path d="M12 2l7 3v6c0 5-3.4 9.5-7 11-3.6-1.5-7-6-7-11V5l7-3z"/>
  </svg>
);

// ✅ 점수 상태 아이콘
const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm-1 14-4-4 1.414-1.414L11 12.172l4.586-4.586L17 9l-6 7z"/>
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2V10z"/>
  </svg>
);
const IconXCircle = () => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3.5 13.1-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4L13.4 12l2.1 2.1z"/>
  </svg>
);

// ✅ 점수 → 상태(색/배경/아이콘) 매핑
function getScoreStatus(score) {
  const s = Number(score);
  if (!Number.isFinite(s)) {
    return { label: '—', color: '#6b7280', bgColor: '#f3f4f6', icon: <IconDocument/> };
  }
  if (s >= 80)   return { label: '양호', color: '#15803d', bgColor: '#dcfce7', icon: <IconCheckCircle/> };
  if (s >= 60)   return { label: '주의', color: '#b45309', bgColor: '#fef3c7', icon: <IconAlert/> };
  return { label: '위험', color: '#991b1b', bgColor: '#fee2e2', icon: <IconXCircle/> };
}

// (선택) 날짜 표기 깔끔하게
function formatDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? d ?? 'N/A'
    : dt.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}


const styles = {
    pageContainer: { padding: '3rem 1.5rem', fontFamily: 'sans-serif', backgroundColor: '#f9fafb' },
    contentWrapper: { maxWidth: '64rem', margin: '0 auto' },
    title: { fontSize: '2rem', fontWeight: '700', color: '#1f2937', textAlign: 'center' },
    subtitle: { fontSize: '1.125rem', color: '#6b7280', textAlign: 'center', marginBottom: '2.5rem' },
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' },
    summaryCard: { backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' },
    summaryIcon: { color: '#3b82f6', backgroundColor: '#eff6ff', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    summaryLabel: { fontSize: '0.875rem', color: '#6b7280' },
    summaryValue: { fontSize: '1.5rem', fontWeight: '700' },
    historySection: { backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' },
    historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' },
    primaryButton: { fontWeight: '600', borderRadius: '0.5rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', textDecoration: 'none', border: 'none', cursor: 'pointer' },
    historyItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' },
    historyIcon: { borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    historyDate: { fontSize: '1rem', fontWeight: '600', minWidth: '100px' },
    historyScore: { backgroundColor: '#f0fdf4', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500' },
    historyInfo: { color: '#6b7280', fontSize: '0.875rem', flexGrow: 1 },
    historyActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
    link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' },
    tipsBox: { backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '2rem' },
    tipsList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    tipsItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white', borderRadius: '0.75rem',
        width: '90%', maxWidth: '800px',
        maxHeight: '90vh', overflowY: 'auto',
        padding: '1.5rem', position: 'relative',
    },
    modalHeader: { paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' },
    modalTitle: { fontSize: '1.25rem', fontWeight: '600' },
    modalSubtitle: { fontSize: '0.875rem', color: '#6b7280' },
    modalCloseButton: { position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer' },
    scoreBox: { backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    legendGuide: { display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    statusDot: { width: '10px', height: '10px', borderRadius: '50%' },
    detailCard: { borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem', border: '1px solid' },
    detailCardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
    detailCardTitle: { fontWeight: '600' },
    detailCardBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    valueText: { fontSize: '1.5rem', fontWeight: '700' },
    statusText: { fontSize: '0.875rem', fontWeight: '500' },
    detailCardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' },
    recommendationBox: { backgroundColor: '#eff6ff', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '1.5rem' },
    recommendationList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' },
};

const DetailModal = ({ record, onClose }) => {
    // 상태(정상/경고/위험)에 따른 스타일 정보
    const statusInfo = {
        normal: { text: '정상', color: '#22c55e', bgColor: '#f0fdf4', borderColor: '#bbf7d0' },
        caution: { text: '경고', color: '#f97316', bgColor: '#fffbeb', borderColor: '#fde68a' },
        danger: { text: '위험', color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca' },
    };

    // 값과 평균을 비교하여 상태를 결정하는 함수
    const getStatusFromAverage = (value, average, isHigherBetter = false) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || !average) return 'normal';

        if (isHigherBetter) { // 높은 것이 좋은 수치 (e.g., HDL)
            if (numValue >= average) return 'normal';
            if (numValue >= average * 0.8) return 'caution';
            return 'danger';
        } else { // 낮은 것이 좋은 수치 (대부분)
            if (numValue <= average) return 'normal';
            if (numValue <= average * 1.2) return 'caution';
            return 'danger';
        }
    };
    
    // 모달에 표시할 상세 수치 목록을 설정합니다.
    const detailsConfig = [
        { key: 'bmi', icon: <IconBMI/>, title: 'BMI (체질량지수)', unit: 'kg/m²', avgKey: 'ave_bmi' },
        { key: 'bloodPressureSystolic', icon: <IconHeart/>, title: '혈압 (최고)', unit: 'mmHg', avgKey: 'ave_bloodPressureSystolic' },
        { key: 'bloodPressureDiastolic', icon: <IconHeart/>, title: '혈압 (최저)', unit: 'mmHg', avgKey: 'ave_bloodPressureDiastolic' },
        { key: 'fastingBloodSugar', icon: <IconDroplet/>, title: '식전혈당', unit: 'mg/dL', avgKey: 'ave_fastingBloodSugar' },
        { key: 'totalCholesterol', icon: <IconShield/>, title: '총콜레스테롤', unit: 'mg/dL', avgKey: 'ave_totalCholesterol' },
        { key: 'hdlCholesterol', icon: <IconShield/>, title: 'HDL-콜레스테롤', unit: 'mg/dL', avgKey: 'ave_hdlCholesterol', higherIsBetter: true },
        { key: 'ldlCholesterol', icon: <IconShield/>, title: 'LDL-콜레스테롤', unit: 'mg/dL', avgKey: 'ave_ldlCholesterol' },
        { key: 'triglycerides', icon: <IconShield/>, title: '중성지방', unit: 'mg/dL', avgKey: 'ave_triglycerides' },
    ];

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>검진 상세 결과</h2>
                    <p style={styles.modalSubtitle}>{record.checkupDate} · {record.checkupCenterName}</p>
                </div>
                <button style={styles.modalCloseButton} onClick={onClose}><IconClose /></button>
                
                <div style={styles.scoreBox}>
                    <div>
                        <div style={{fontSize: '0.875rem', color: '#6b7280'}}>종합 건강점수</div>
                        <div style={{fontSize: '1.125rem', fontWeight: 500}}>전체적인 건강 상태 평가</div>
                    </div>
                    <div style={{fontSize: '2rem', fontWeight: 700, color: '#1d4ed8'}}>{record.healthScore} <span style={{fontSize: '1rem'}}>/ 100점</span></div>
                </div>

                <div style={styles.legendGuide}>
                    <div style={styles.legendItem}><div style={{...styles.statusDot, backgroundColor: statusInfo.normal.color}}></div> 정상: 건강한 범위 내</div>
                    <div style={styles.legendItem}><div style={{...styles.statusDot, backgroundColor: statusInfo.caution.color}}></div> 경고: 주의가 필요한 수치</div>
                    <div style={styles.legendItem}><div style={{...styles.statusDot, backgroundColor: statusInfo.danger.color}}></div> 위험: 즉시 관리가 필요</div>
                </div>

                <h3 style={{fontSize: '1.25rem', fontWeight: 600, margin: '2rem 0 1rem 0'}}>상세 검진 수치</h3>
                
                {/* ✨ 2. 임시 데이터 대신, 설정(config)과 실제 데이터(record)를 매핑하여 동적으로 UI를 생성합니다. */}
                {detailsConfig.map(item => {
                    const value = record[item.key];
                    const avg = record[item.avgKey];
                    const status = getStatusFromAverage(value, avg, item.higherIsBetter);
                    const currentStatus = statusInfo[status];
                    const change = (value - avg).toFixed(1);

                    return (
                        <div key={item.key} style={{...styles.detailCard, backgroundColor: currentStatus.bgColor, borderColor: currentStatus.borderColor}}>
                            <div style={styles.detailCardHeader}>
                                <div style={{color: currentStatus.color}}>{item.icon}</div>
                                <div style={styles.detailCardTitle}>{item.title}</div>
                            </div>
                            <div style={styles.detailCardBody}>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem'}}>
                                    <span style={{...styles.valueText, color: currentStatus.color}}>{value}</span>
                                    <span style={{fontSize: '0.875rem', color: '#6b7280'}}>{item.unit}</span>
                                </div>
                                <div style={{...styles.statusText, color: currentStatus.color}}>{currentStatus.text}</div>
                            </div>
                            <div style={styles.detailCardFooter}>
                                <span>평균치: {avg} {item.unit}</span>
                                <span>{change >= 0 ? '+' : ''}{change} {item.unit}</span>
                            </div>
                        </div>
                    );
                })}

                <div style={styles.recommendationBox}>
                    <h4 style={{fontSize: '1rem', fontWeight: 600}}>권장사항</h4>
                    <ul style={{...styles.recommendationList, listStyle: 'disc', paddingLeft: '1rem'}}>
                        <li>이상 수치에 대해 전문의 상담을 받아보세요</li>
                        <li>정기적인 모니터링을 통해 변화를 추적하세요</li>
                        <li>생활습관 개선을 통해 건강을 관리하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};


const Mypage = () => {
    const { isAuthenticated, getAuthHeaders } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 비로그인 사용자 처리
    if (!isAuthenticated()) {
        return (
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    maxWidth: '400px',
                    width: '100%'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                    <h2 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        color: '#1f2937', 
                        marginBottom: '1rem' 
                    }}>
                        로그인이 필요합니다
                    </h2>
                    <p style={{ 
                        color: '#6b7280', 
                        marginBottom: '2rem',
                        lineHeight: '1.6'
                    }}>
                        검진 기록을 확인하려면 로그인 후 이용해주세요.<br/>
                        개인 건강 정보는 안전하게 보호됩니다.
                    </p>
                    <Link 
                        to="/login" 
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.75rem 2rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                        로그인하기
                    </Link>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const response = await fetch('http://localhost:3000/Ai/history', {
                headers: getAuthHeaders(),
            });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // id가 최신인 순서대로 정렬하여 상태에 저장
                setHistoryData(data.sort((a, b) => b.id - a.id));
            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch history data:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistoryData();
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

    const handleOpenModal = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const totalCount = historyData.length;
    const latestScore = totalCount > 0 ? historyData[0]?.healthScore || 'N/A' : 'N/A';
    const lastCheckupDate = totalCount > 0 
        ? new Date(historyData[0]?.checkupDate).toLocaleDateString('ko-KR')
        : 'N/A';

    return (
        <>
            <div style={styles.pageContainer}>
                <div style={styles.contentWrapper}>
                    <h1 style={styles.title}>검진 기록</h1>
                    <p style={styles.subtitle}>지금까지의 건강검진 기록을 확인하고 건강 변화 추이를 살펴보세요</p>

                    <div style={styles.summaryGrid}>
                        <div style={styles.summaryCard}>
                            <div style={styles.summaryIcon}><IconDocument /></div>
                            <div>
                                <div style={styles.summaryLabel}>총 검진 횟수</div>
                                <div style={styles.summaryValue}>{totalCount}</div>
                            </div>
                        </div>
                        <div style={styles.summaryCard}>
                            <div style={styles.summaryIcon}><IconHeart /></div>
                            <div>
                                <div style={styles.summaryLabel}>최근 건강점수</div>
                                <div style={styles.summaryValue}>{latestScore}</div>
                            </div>
                        </div>
                        <div style={styles.summaryCard}>
                            <div style={styles.summaryIcon}><IconCalendar /></div>
                            <div>
                                <div style={styles.summaryLabel}>마지막 검진일</div>
                                <div style={styles.summaryValue}>{lastCheckupDate}</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.historySection}>
                        <div style={styles.historyHeader}>
                            <h2 style={styles.sectionTitle}>검진 기록 목록</h2>
                            <Link to="/input" style={styles.primaryButton}>새 검진 입력</Link>
                        </div>
                        <div>
                            {historyData.map((item) => {
                                const scoreStatus = getScoreStatus(item.healthScore);
                                return (
                                    <div key={item.id} style={styles.historyItem}>
                                        <div style={{...styles.historyIcon, backgroundColor: scoreStatus.bgColor, color: scoreStatus.color}}>
                                            {scoreStatus.icon}
                                        </div>
                                        <div style={styles.historyDate}>{item.checkupDate}</div>
                                        <div style={{...styles.historyScore, backgroundColor: scoreStatus.bgColor, color: scoreStatus.color}}>
                                            건강점수 {item.healthScore}
                                        </div>
                                        <div style={styles.historyInfo}>
                                            <span>{item.checkupCenterName}</span>
                                        </div>
                                        <div style={styles.historyActions}>
                                            <button onClick={() => handleOpenModal(item)} style={{...styles.link, background: 'none', border: 'none', cursor: 'pointer'}}>상세 보기</button>
                                            <Link to="/result" state={{ results: item }} style={styles.link}>결과 보기</Link>
                                            <button style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af'}}><IconTrash /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={styles.tipsBox}>
                        <h3 style={{...styles.sectionTitle, fontSize: '1.25rem'}}>건강 관리 팁</h3>
                        <ul style={styles.tipsList}>
                            <li style={styles.tipsItem}><span>💡</span> 정기적인 건강검진으로 변화를 모니터링하세요</li>
                            <li style={styles.tipsItem}><span>💡</span> 균형잡힌 식단과 규칙적인 운동을 실천하세요</li>
                            <li style={styles.tipsItem}><span>💡</span> 충분한 수면과 스트레스 관리가 중요합니다</li>
                            <li style={styles.tipsItem}><span>💡</span> 금연과 절주로 건강한 생활습관을 유지하세요</li>
                        </ul>
                    </div>
                </div>
            </div>
            {isModalOpen && <DetailModal record={selectedRecord} onClose={handleCloseModal} />}
        </>
    );
};

export default Mypage;