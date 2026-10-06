import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MailCheck, RefreshCw, ArrowRight, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(45);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { pendingVerification, verifyOtp, resendOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect to register if no pending verification is present
  useEffect(() => {
    if (!pendingVerification) {
      navigate('/register');
    }
  }, [pendingVerification, navigate]);

  // Expiration & Cooldown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Single digit input
    const newDigits = [...digits];
    newDigits[index] = cleaned[cleaned.length - 1];
    setDigits(newDigits);

    // Auto-advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(5, pasted.length - 1)]?.focus();
  };

  const fullCode = digits.join('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await verifyOtp(fullCode);
      if (res.success) {
        showToast(res.message, 'success');
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message);
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    setErrorMessage('');

    try {
      const res = await resendOtp();
      if (res.success) {
        showToast(res.message, 'success');
        setCooldown(60);
        setTimeLeft(300);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to resend OTP.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#141417] border border-zinc-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 text-center space-y-6">
          {/* Icon Header */}
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center mx-auto shadow-lg">
            <MailCheck className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Verify your email</h2>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              We've sent a 6-digit verification code to <br />
              <strong className="text-zinc-200">{pendingVerification?.email || 'your email'}</strong>
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-start gap-2 text-rose-300 text-xs text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 6-Digit OTP Boxes */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-white bg-[#09090B] border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all"
                />
              ))}
            </div>

            {/* Timer countdown */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <span>Code expires in:</span>
              <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-rose-400' : 'text-zinc-200'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isVerifying || fullCode.length !== 6 || timeLeft === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 text-black font-semibold text-sm shadow-sm transition-all hover:translate-y-[-0.5px]"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}
                </span>
              </button>
            </div>
          </form>

          <div className="pt-2 text-xs text-zinc-500">
            Wrong email address?{' '}
            <Link to="/register" className="text-zinc-400 hover:text-white underline">
              Register again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
