import Head from 'next/head';

export default function Register() {
  const handleLineLogin = () => {
    window.location.href = '/api/auth/line-login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Head>
        <title>เข้าสู่ระบบด้วย LINE - กาดมาลินหน้า มช.</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-800 text-white font-black text-2xl shadow-lg mb-4">
          M
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          กาดมาลิน Malin Plaza
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          ระบบจองแผงค้าและบริหารจัดการตลาดออนไลน์
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100 text-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-1">ยินดีต้อนรับผู้ค้าทุกท่าน</h3>
            <p className="text-xs text-slate-500">
              เข้าสู่ระบบง่ายๆ ผ่านบัญชี LINE โดยไม่ต้องจำรหัสผ่าน
            </p>
          </div>

          <button
            type="button"
            onClick={handleLineLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.99]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.82 2 10.53c0 4.23 3.65 7.78 8.58 8.41.33.07.78.22.89.5.1.26.07.67.03.94l-.15.93c-.05.29-.23 1.13.99.62 1.22-.51 6.59-3.88 8.99-6.64C23.01 13.3 24 11.96 24 10.53 24 5.82 19.52 2 12 2z" />
            </svg>
            เข้าสู่ระบบด้วย LINE
          </button>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>🛡️ ปลอดภัยตามมาตรฐาน PDPA</span>
            <a href="/" className="text-emerald-700 font-semibold hover:underline">
              กลับหน้าแรก
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
