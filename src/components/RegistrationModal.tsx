import React, { useState } from 'react';
import { Language, UserAccount } from '../types';
import { translations } from '../i18n';
import {
  Sparkles,
  Phone,
  KeyRound,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Lock,
  Ticket,
  ShieldCheck,
  X,
  ArrowRight,
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onUserRegistered: (user: UserAccount, ticket: any) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  lang,
  onUserRegistered,
}) => {
  const t = translations[lang];

  const [step, setStep] = useState<'MOBILE' | 'OTP' | 'SUCCESS'>('MOBILE');
  const [mobile, setMobile] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [simulatedReceivedOtp, setSimulatedReceivedOtp] = useState<string | null>(null);
  const [dob, setDob] = useState('1996-05-15');
  const [stateCode, setStateCode] = useState('MH');
  const [quantity, setQuantity] = useState('1');
  const [termsConsent, setTermsConsent] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [issuedTicket, setIssuedTicket] = useState<any>(null);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (data.success) {
        setSimulatedReceivedOtp(data.simulatedOtp);
        setStep('OTP');
      } else {
        setErrorMsg(data.error || 'Failed to dispatch OTP.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Issue Simulated Ticket
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsConsent) {
      setErrorMsg('You must agree to the Terms of Service and Simulation Protocol.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // First verify OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          otp,
          dob,
          state: stateCode,
          termsAccepted: termsConsent,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setErrorMsg(verifyData.error || 'Verification failed.');
        setIsLoading(false);
        return;
      }

      const user = verifyData.user;
      setRegisteredUser(user);

      // Issue simulated ticket
      const ticketRes = await fetch('/api/register/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          quantity: parseInt(quantity, 10) || 1,
        }),
      });

      const ticketData = await ticketRes.json();
      if (ticketData.success) {
        setIssuedTicket(ticketData.tickets[0]);
        setStep('SUCCESS');
        onUserRegistered(user, ticketData.tickets[0]);
      } else {
        setErrorMsg(ticketData.error || 'Ticket simulation failed.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration processing error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.regModal.title}</span>
          </div>
          <h3 className="text-xl font-luxury font-bold text-slate-100">
            {step === 'SUCCESS' ? 'Entry Confirmed' : '₹1,000 Simulated Entry'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.regModal.subtitle}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Mobile Input */}
        {step === 'MOBILE' && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                {t.regModal.mobileLabel}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono-num text-xs focus:border-amber-400 focus:outline-none"
                  placeholder="+919876543210"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard Indian 10-digit mobile number format.
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Simulation Sandbox Mode</span>
              </div>
              <div>Clicking send will simulate an SMS gateway dispatch and generate an instant test OTP.</div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.regModal.sendOtpBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP & DOB Eligibility */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4 text-xs">
            {simulatedReceivedOtp && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Simulated SMS Code:</span>
                  <span className="text-amber-300 font-mono-num font-bold text-sm">
                    {simulatedReceivedOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(simulatedReceivedOtp)}
                  className="px-2.5 py-1 text-[11px] bg-amber-400 text-black font-semibold rounded hover:bg-amber-300"
                >
                  {t.regModal.autofillOtpBtn}
                </button>
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                {t.regModal.otpLabel}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono-num text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  {t.regModal.dobLabel}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  {t.regModal.stateLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={stateCode}
                    onChange={e => setStateCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="MH">Maharashtra (Permitted)</option>
                    <option value="DL">Delhi NCR (Permitted)</option>
                    <option value="KA">Karnataka (Permitted)</option>
                    <option value="TN">Tamil Nadu (Permitted)</option>
                    <option value="UP">Uttar Pradesh (Permitted)</option>
                    <option value="GA">Goa (Permitted)</option>
                    <option value="SK">Sikkim (Permitted)</option>
                    <option value="TS">Telangana (Restricted)</option>
                    <option value="AP">Andhra Pradesh (Restricted)</option>
                    <option value="AS">Assam (Restricted)</option>
                    <option value="OR">Odisha (Restricted)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jurisdiction Warning if restricted state selected */}
            {['TS', 'AP', 'AS', 'OR'].includes(stateCode) && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-[11px] text-rose-300 leading-relaxed">
                {t.regModal.stateRestrictedWarning}
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-medium">
                Entry Quantity (₹1,000 / entry)
              </label>
              <select
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-amber-400 focus:outline-none"
              >
                <option value="1">1 Simulated Entry (₹1,000 test tokens)</option>
                <option value="2">2 Simulated Entries (₹2,000 test tokens)</option>
                <option value="5">5 Simulated Entries (₹5,000 test tokens)</option>
              </select>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsConsent}
                onChange={e => setTermsConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-amber-500"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug">
                {t.regModal.termsConsent}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-black font-bold rounded-xl transition-all shadow-md"
            >
              {isLoading ? 'Processing Verification...' : t.regModal.submitRegistrationBtn}
            </button>
          </form>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 'SUCCESS' && issuedTicket && registeredUser && (
          <div className="text-xs space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-100">
                Simulated Entry Issued Successfully
              </h4>
              <p className="text-slate-400 text-[11px] mt-1">
                Your entry has been assigned a cryptographic identifier and registered in the eligible pool.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/40 text-left font-mono-num space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center gap-1.5 font-sans">
                  <Ticket className="w-4 h-4" />
                  <span>Entry Identifier</span>
                </span>
                <span>{issuedTicket.ticketId}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Anonymous Participant ID:</span>
                <span className="text-slate-200 font-semibold">{registeredUser.id}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Simulation Amount:</span>
                <span className="text-slate-200">₹1,000 (Test Token)</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Welcome Bonus Credited:</span>
                <span className="text-emerald-400 font-bold">+100 Reward Coins</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors"
            >
              Continue to Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
