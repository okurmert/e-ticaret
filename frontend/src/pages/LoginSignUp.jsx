import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginSignUp.css';

export default function LoginSignUp() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                setSuccess('Giriş başarılı!');
                setError('');
                navigate('/');
            } else {
                setError(data.error || 'Giriş başarısız');
            }
        } catch {
            setError('Sunucu hatası');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                setSuccess('Kayıt başarılı!');
                setError('');
                navigate('/');
            } else {
                setError(data.error || 'Kayıt başarısız');
            }
        } catch {
            setError('Sunucu hatası');
        }
    };

    return (
        <div className="account-container">
            <div className="account-card">
                <div className="account-header">
                    <h2>Mağazamıza Hoş Geldiniz</h2>
                    <p>{activeTab === 'login' ?
                        "Yeni müşteri misiniz?" :
                        "Zaten hesabınız var mı?"}
                        <button
                            className="switch-tab"
                            onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                        >
                            {activeTab === 'login' ? 'Üye Olun' : 'Giriş Yapın'}
                        </button>
                    </p>
                </div>

                <div className="account-tabs">
                    <button
                        className={activeTab === 'login' ? 'active' : ''}
                        onClick={() => setActiveTab('login')}
                    >
                        Giriş Yap
                    </button>
                    <button
                        className={activeTab === 'signup' ? 'active' : ''}
                        onClick={() => setActiveTab('signup')}
                    >
                        Üye Ol
                    </button>
                </div>

                <div className="account-form-section">
                    {activeTab === 'login' ? (
                        <form className="account-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>E-Posta Adresi</label>
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Şifre</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    required
                                />
                                <a href="#" className="forgot-link">Şifremi Unuttum</a>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            <button type="submit" className="login-signup-btn primary">GİRİŞ YAP</button>

                            <div className="divider">
                                <span>veya</span>
                            </div>

                            <button type="button" className="social-btn google">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4" />
                                    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853" />
                                    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957273C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05" />
                                    <path d="M9 3.5796C10.3214 3.5796 11.5077 4.0336 12.4405 4.9254L15.0218 2.3441C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0169 0.957275 4.9582L3.96409 7.29C4.67182 5.1628 6.65591 3.5796 9 3.5796Z" fill="#EA4335" />
                                </svg>
                                Google ile giriş yap
                            </button>
                        </form>
                    ) : (
                        <form className="account-form" onSubmit={handleSignup}>
                            <div className="form-group">
                                <label>Ad Soyad</label>
                                <input
                                    type="text"
                                    placeholder="Adınız ve soyadınız"
                                    value={signupName}
                                    onChange={e => setSignupName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>E-Posta Adresi</label>
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={signupEmail}
                                    onChange={e => setSignupEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Şifre</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={signupPassword}
                                    onChange={e => setSignupPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Şifre Tekrar</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}
                            <button type="submit" className="login-signup-btn primary">ÜYE OL</button>

                            <div className="terms">
                                Üye olarak <a href="#">Kullanım Koşulları</a>'nı ve <a href="#">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}