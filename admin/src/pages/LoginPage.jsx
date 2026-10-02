import React, { useState } from 'react';
import { Mail, KeyRound, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { adminApiService } from '../services/adminApiService';

export const LoginPage = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Enter 4-Digit OTP
  const [email, setEmail] = useState('amlanmondal98@gmail.com');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await adminApiService.sendOtp(email);
      setLoading(false);

      if (res.success) {
        setStep(2);
        setSuccessMsg(res.message);
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
        }
      } else {
        setError(res.message || 'Failed to dispatch 4-digit OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error to NestJS Auth Server.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input field
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    const fullOtp = otp.join('');

    if (fullOtp.length < 4) {
      setError('Please enter the complete 4-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const res = await adminApiService.verifyOtp(email, fullOtp);
      setLoading(false);

      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'Verification failed. Incorrect 4-digit OTP.');
      }
    } catch (err) {
      setLoading(false);
      setError('Verification failed. Invalid OTP code.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <img 
            src="/images/bbsc_logo.png" 
            alt="BBSC Official Logo" 
            style={{ width: '80px', height: '80px', objectFit: 'contain', background: 'transparent', margin: '0 auto 1rem', display: 'block', filter: 'drop-shadow(0 4px 14px rgba(30, 58, 138, 0.4))' }} 
          />
          <h2>BBSC Admin Portal</h2>
          <p>Super Admin Authentication via 4-Digit OTP</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {devOtpHint && (
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#92400e' }}>
            🔑 <strong>DEV MODE OTP:</strong> Use code <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', color: '#b45309' }}>{devOtpHint}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Static Authorized Admin Email</label>
              <div className="search-input-box">
                <Mail size={18} color="#64748b" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  style={{ background: '#f1f5f9', cursor: 'not-allowed', fontWeight: '600', color: '#1e293b' }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                4-digit OTP will be dispatched to this static email.
              </span>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : <><ArrowRight size={18} /> Send 4-Digit OTP</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem' }}>Enter 4-Digit OTP Code</label>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    style={{
                      width: '54px',
                      height: '58px',
                      fontSize: '1.6rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      border: '2px solid #cbd5e1',
                      borderRadius: '10px',
                      outline: 'none',
                      backgroundColor: '#f8fafc',
                      transition: 'all 0.2s ease'
                    }}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', marginBottom: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Verifying OTP...' : <><KeyRound size={18} /> Verify OTP & Sign In</>}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button 
                type="button" 
                className="btn-secondary btn-sm" 
                style={{ fontSize: '0.8rem' }}
                onClick={handleSendOtp}
              >
                <RefreshCw size={14} /> Resend 4-Digit OTP
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <p>Target Admin Email: <b>amlanmondal98@gmail.com</b></p>
        </div>
      </div>
    </div>
  );
};
