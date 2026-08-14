import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import { supabase } from '../src/lib/supabase';

export default function Register() {
  const router = useRouter();
  const { line_user_id, display_name, avatar_url } = router.query;

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone || phone.length < 9) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }

    if (!line_user_id) {
      setErrorMsg('ไม่พบข้อมูล LINE ID กรุณาเข้าสู่ระบบผ่าน LINE ใหม่');
      return;
    }

    setLoading(true);
    try {
      // บันทึกข้อมูลผู้ใช้ใหม่ลง Supabase
      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            line_user_id,
            display_name: display_name || 'ผู้ใช้งาน LINE',
            avatar_url: avatar_url || '',
            phone_number: phone,
            role: 'vendor',
          },
          { onConflict: 'line_user_id' }
        )
        .select()
        .single();

      if (error) throw error;

      // บันทึก Session เข้า LocalStorage
      const userData = {
        id: data?.id,
        username: display_name || phone,
        phone_number: phone,
        role: 'vendor',
        avatar: avatar_url || '',
        line_user_id,
      };
      localStorage.setItem('malin_user', JSON.stringify(userData));

      alert('🎉 สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ Malin Plaza');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาด: ' + (err.message || 'ไม่สามารถบันทึกข้อมูลได้'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 font-sans">
      <Head>
        <title>ลงทะเบียนสมาชิก - กาดมาลินหน้า มช.</title>
      </Head>

      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A3A2F] text-white font-black text-2xl shadow-md mb-3">
            M
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">ลงทะเบียนสมาชิก</h2>
          <p className="text-xs text-slate-500 mt-1">กรอกเบอร์โทรศัพท์เพื่อเปิดใช้งานบัญชีผู้ค้า Malin Plaza</p>
        </div>

        {/* แสดงข้อมูลที่ดึงมาจาก LINE */}
        {line_user_id && (
          <div className="flex items-center gap-3.5 p-3.5 mb-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            {avatar_url ? (
              <img src={avatar_url} alt="Profile" className="w-12 h-12 rounded-full border-2 border-emerald-600 shadow-sm" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                LINE
              </div>
            )}
            <div>
              <p className="font-bold text-slate-800 text-sm">{display_name || 'บัญชี LINE'}</p>
              <p className="text-xs text-emerald-700 font-semibold">🟢 เชื่อมต่อผ่าน LINE สำเร็จ</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              เบอร์โทรศัพท์มือถือ *
            </label>
            <input
              type="tel"
              placeholder="08XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">🔒 ข้อมูลได้รับการคุ้มครองความปลอดภัยตามมาตรฐาน PDPA</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:bg-slate-300"
          >
            {loading ? 'กำลังบันทึก...' : 'ยืนยันการสมัครสมาชิก'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <a href="/" className="text-xs text-slate-500 hover:text-emerald-700 font-semibold">
            ← กลับหน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
}
