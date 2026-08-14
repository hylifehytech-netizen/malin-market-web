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
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Kanit', sans-serif" }}>
      <Head>
        <title>ลงทะเบียนสมาชิก - กาดมาลินหน้า มช.</title>
      </Head>

      <div style={{ width: '100%', maxWidth: 440, background: '#FFFFFF', borderRadius: 24, padding: '32px 28px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: '#0A3A2F', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
            M
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F382E', margin: '0 0 6px' }}>ลงทะเบียนสมาชิก</h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>กรอกเบอร์โทรศัพท์เพื่อเปิดใช้งานบัญชีผู้ค้า Malin Plaza</p>
        </div>

        {/* แสดงข้อมูลที่ดึงมาจาก LINE */}
        {line_user_id && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', marginBottom: 24, background: '#ECFDF5', borderRadius: 16, border: '1px solid #A7F3D0' }}>
            {avatar_url ? (
              <img src={avatar_url} alt="Profile" style={{ width: 52, height: 52, minWidth: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }} />
            ) : (
              <div style={{ width: 52, height: 52, minWidth: 52, borderRadius: '50%', background: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                LINE
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 800, color: '#065F46', fontSize: 15, margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{display_name || 'บัญชี LINE'}</p>
              <p style={{ fontSize: 11, color: '#047857', fontWeight: 700, margin: '2px 0 0' }}>🟢 เชื่อมต่อผ่าน LINE สำเร็จ</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div style={{ marginBottom: 16, background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '10px 12px', borderRadius: 8, fontSize: 12, color: '#B91C1C', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
              เบอร์โทรศัพท์มือถือ *
            </label>
            <input
              type="tel"
              placeholder="08XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#FAFBFB', boxSizing: 'border-box' }}
              required
            />
            <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 6, display: 'block' }}>🔒 ข้อมูลได้รับการคุ้มครองความปลอดภัยตามมาตรฐาน PDPA</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#94A3B8' : '#06C755',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '13px',
              borderRadius: 12,
              border: 'none',
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(6, 199, 85, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'กำลังบันทึก...' : 'ยืนยันการสมัครสมาชิก'}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textDecoration: 'none' }}>
            ← กลับหน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
}
