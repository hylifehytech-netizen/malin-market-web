import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Register() {
  const [step, setStep] = useState(1); // 1: ขอ OTP, 2: กรอก OTP
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(0);

  // State สำหรับ Modal สแกน LINE
  const [showLineModal, setShowLineModal] = useState(false);
  const [lineModalData, setLineModalData] = useState({ url: '', qr: '' });

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPhone = phone.replace(/-/g, '');

    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/line/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.need_add_line) {
          // ถ้ายังไม่ได้ผูก LINE ให้โชว์ Modal สแกน QR
          setLineModalData({ url: data.line_oa_url, qr: data.qr_code_url });
          setShowLineModal(true);
        } else {
          // ถ้าผูก LINE แล้วให้ไปสเตปกรอก OTP
          setStep(2);
          setTimer(300); // 5 นาที
        }
      } else {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/line/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/-/g, ''), otp_code: otpCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert('🎉 ยืนยันตัวตนสำเร็จ! ยินดีต้อนรับสู่ระบบจองผังตลาดมาลินหน้า มช.');
        window.location.href = '/';
      } else {
        setErrorMessage(data.message || 'รหัส OTP ไม่ถูกต้อง');
      }
    } catch (err) {
      setErrorMessage('เกิดข้อผิดพลาดในการตรวจสอบรหัส');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Head>
        <title>ลงทะเบียนเข้าใช้งาน - กาดมาลินหน้า มช.</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          กาดมาลิน Malin Plaza
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {step === 1 ? 'ลงทะเบียน / เข้าสู่ระบบด้วยเบอร์โทรศัพท์' : 'กรอกรหัส OTP 6 หลักที่ได้รับทาง LINE'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-100">
          {errorMessage && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">เบอร์โทรศัพท์มือถือ</label>
                <input
                  type="tel"
                  required
                  placeholder="08X-XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl text-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 transition"
              >
                {loading ? 'กำลังตรวจสอบ...' : 'ขอรับรหัส OTP ผ่าน LINE'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">รหัส OTP (6 หลัก)</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl text-center font-mono text-3xl tracking-widest focus:ring-emerald-500 focus:border-emerald-500"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>รหัสหมดอายุใน: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} นาที</span>
                  {timer === 0 && (
                    <button type="button" onClick={handleRequestOtp} className="text-emerald-600 font-bold hover:underline">
                      ขอรหัสใหม่
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={loading || timer === 0}
                  className="w-2/3 py-3 rounded-xl text-white font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 transition"
                >
                  {loading ? 'กำลังยืนยัน...' : 'ยืนยัน OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal สแกน QR Code สำหรับแอดเพื่อน LINE OA */}
      {showLineModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">เชื่อมต่อ LINE Official Account</h3>
            <p className="text-sm text-slate-600 mb-4">
              โปรดแอดเพื่อน LINE OA และส่งเบอร์โทร <span className="font-bold text-emerald-600">{phone}</span> ในแชทเพื่อรับรหัส OTP
            </p>

            <div className="flex justify-center mb-4">
              <img src={lineModalData.qr} alt="LINE OA QR Code" className="w-48 h-48 rounded-xl border border-slate-200 shadow-inner" />
            </div>

            <a
              href={lineModalData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl mb-3 transition"
            >
              กดเพื่อแอดไลน์และส่งเบอร์
            </a>

            <button
              onClick={() => {
                setShowLineModal(false);
                setStep(2);
                setTimer(300);
              }}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 text-sm"
            >
              ฉันส่งเบอร์โทรใน LINE แล้ว (ไปหน้ากรอก OTP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
