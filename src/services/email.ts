import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const isEmailJSConfigured = Boolean(
  EMAILJS_SERVICE_ID &&
  EMAILJS_TEMPLATE_ID &&
  EMAILJS_PUBLIC_KEY &&
  !EMAILJS_SERVICE_ID.includes('service_your') &&
  !EMAILJS_TEMPLATE_ID.includes('template_your')
);

export interface SendOtpResult {
  success: boolean;
  message: string;
  isMock?: boolean;
  otpCode?: string;
}

export function generate6DigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(email: string, name: string, otp: string): Promise<SendOtpResult> {
  const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_neaohl3').trim();
  const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_w1ri2ip').trim();
  const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'hC0GSiYu3Xk0vuG4P').trim();

  if (!serviceId || !templateId || !publicKey) {
    return {
      success: false,
      message: 'EmailJS credentials missing in .env (Service ID, Template ID, or Public Key).'
    };
  }

  try {
    // Initialize EmailJS with public key
    emailjs.init({ publicKey });

    const templateParams = {
      to_email: email,
      email: email,
      to_name: name || 'User',
      name: name || 'User',
      otp_code: otp,
      passcode: otp,
      code: otp,
      app_name: 'My Resume',
      expires_in: '5 minutes'
    };

    const res = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      { publicKey }
    );

    if (res.status === 200 || res.text === 'OK') {
      return {
        success: true,
        message: `Verification code sent to ${email}. Please check your inbox (or spam folder).`
      };
    } else {
      return {
        success: false,
        message: `EmailJS responded with status ${res.status}: ${res.text}`
      };
    }
  } catch (err: any) {
    console.error('EmailJS delivery error:', err);
    const detail = err?.text || err?.message || 'Email delivery failed';
    return {
      success: false,
      message: `Email delivery error: ${detail}. Please check EmailJS settings.`
    };
  }
}
