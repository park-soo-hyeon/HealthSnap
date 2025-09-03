import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'sans-serif',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  tabContainer: {
    display: 'flex',
    marginBottom: '2rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem',
    padding: '0.25rem',
  },
  tab: {
    flex: 1,
    padding: '0.5rem 1rem',
    textAlign: 'center',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    border: 'none',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: 'white',
    color: '#3b82f6',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  tabInactive: {
    color: '#6b7280',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem',
  },
  buttonHover: {
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
  successMessage: {
    color: '#059669',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
  formRowItem: {
    flex: 1,
  },
  required: {
    color: '#dc2626',
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    birthDate: '',
    gender: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));
    setMessage({ type: '', text: '' });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    
    // 생년월일 필드는 숫자만 입력 허용 (8자리)
    if (name === 'birthDate') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setRegisterData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setRegisterData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    setMessage({ type: '', text: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${process.env.API_BASE_URL || 'https://healthsnap-5stc.onrender.com'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      // AuthContext를 통해 로그인 상태 설정
      login(data.user, data.access_token);

      setMessage({ type: 'success', text: '로그인 성공!' });
      
      // 건강검진 입력 페이지로 리디렉션
      setTimeout(() => {
        navigate('/input');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // 클라이언트 사이드 검증
    if (!registerData.email || !registerData.password || !registerData.name) {
      setMessage({ type: 'error', text: '필수 항목을 모두 입력해주세요.' });
      setIsLoading(false);
      return;
    }

    if (registerData.birthDate && registerData.birthDate.length !== 8) {
      setMessage({ type: 'error', text: '생년월일은 8자리 숫자로 입력해주세요. (예: 19900101)' });
      setIsLoading(false);
      return;
    }

    if (registerData.phone && !/^010-\d{4}-\d{4}$/.test(registerData.phone)) {
      setMessage({ type: 'error', text: '전화번호는 010-0000-0000 형식으로 입력해주세요.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.API_BASE_URL || 'https://healthsnap-5stc.onrender.com'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.message)) {
          throw new Error(data.message.join(', '));
        }
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      // AuthContext를 통해 로그인 상태 설정
      login(data.user, data.access_token);

      setMessage({ type: 'success', text: '회원가입 성공!' });
      
      // 건강검진 입력 페이지로 리디렉션
      setTimeout(() => {
        navigate('/input');
      }, 1000);

    } catch (error) {
      console.error('Register error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>건강 분석 시스템</h1>
        
        {/* 탭 */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'login' ? styles.tabActive : styles.tabInactive),
            }}
            onClick={() => {
              setActiveTab('login');
              setMessage({ type: '', text: '' });
            }}
          >
            로그인
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'register' ? styles.tabActive : styles.tabInactive),
            }}
            onClick={() => {
              setActiveTab('register');
              setMessage({ type: '', text: '' });
            }}
          >
            회원가입
          </button>
        </div>

        {/* 로그인 폼 */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                이메일 <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="example@email.com"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                비밀번호 <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isLoading && styles.buttonDisabled),
              }}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        )}

        {/* 회원가입 폼 */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                이메일 <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="example@email.com"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                비밀번호 <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="영문+숫자 조합, 최소 6자"
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                이름 <span style={styles.required}>*</span>
              </label>
              <input
                style={styles.input}
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="홍길동"
                required
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formRowItem}>
                <label style={styles.label}>전화번호</label>
                <input
                  style={styles.input}
                  type="tel"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  placeholder="010-1234-5678"
                />
              </div>
              <div style={styles.formRowItem}>
                <label style={styles.label}>성별</label>
                <select
                  style={styles.select}
                  name="gender"
                  value={registerData.gender}
                  onChange={handleRegisterChange}
                >
                  <option value="">선택</option>
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>생년월일 (선택사항)</label>
              <input
                style={styles.input}
                type="text"
                name="birthDate"
                value={registerData.birthDate}
                onChange={handleRegisterChange}
                placeholder="19900101 (8자리 숫자)"
                maxLength="8"
              />
              <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                예: 1990년 1월 1일 → 19900101
              </small>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isLoading && styles.buttonDisabled),
              }}
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>
        )}

        {/* 메시지 */}
        {message.text && (
          <div style={message.type === 'error' ? styles.errorMessage : styles.successMessage}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
