import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';

export default function Register() {
  const router = useRouter();
  const { line_user_id, display_name, avatar_url } = router.query;

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showContactBox, setShowContactBox] = useState(false);

  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setShowContactBox(false);

    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }

    if (!line_user_id) {
      setErrorMsg('ไม่พบข้อมูล LINE ID กรุณากลับไปเข้าสู่ระบบผ่าน LINE ใหม่อีกครั้ง');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line_user_id,
          display_name,
          avatar_url,
          phone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // บันทึก User Session ลง LocalStorage แล้วพาเข้าหน้าหลัก
        localStorage.setItem('malin_user', JSON.stringify(data.user));
        alert('🎉 ยืนยันตัวตนสำเร็จ! ระบบได้ผูกบัญชี LINE กับเบอร์โทรของคุณเรียบร้อยแล้ว');
        window.location.href = '/';
      } else {
        setErrorMsg(data.message || 'เกิดข้อผิดพลาดในการตรวจสอบ');
        if (data.not_found) {
          setShowContactBox(true);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Kanit', sans-serif" }}>
      <Head>
        <title>ยืนยันตัวตนผู้ค้า - Malin Plaza</title>
      </Head>

      <div style={{ width: '100%', maxWidth: 440, background: '#FFFFFF', borderRadius: 24, padding: '32px 28px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: '#0A3A2F', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
            M
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F382E', margin: '0 0 6px' }}>ยืนยันตัวตนผู้ค้า</h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>กรอกเบอร์โทรศัพท์ที่เคยลงทะเบียนไว้ใน Google Form</p>
        </div>

        {/* แสดงข้อมูล LINE ของผู้ใช้ */}
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
          <div style={{ marginBottom: 16, background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '12px 14px', borderRadius: 8, fontSize: 12, color: '#B91C1C', fontWeight: 600, lineHeight: 1.5 }}>
            {errorMsg}
          </div>
        )}

        {/* กล่องแนะนำเมื่อไม่พบเบอร์ในระบบ */}
        {showContactBox && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 16, padding: '16px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 10 }}>
              ยังไม่ได้ลงทะเบียน หรือต้องการติดต่อแอดมิน?
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https%3A%2F%2Fline.me%2FR%2Fti%2Fp%2F%40769kvfhj"
                alt="LINE OA QR Code"
                style={{ width: 110, height: 110, borderRadius: 10, border: '1px solid #CBD5E1' }}
              />
            </div>
            <a
              href="https://line.me/R/ti/p/@769kvfhj"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: '#059669',
                textDecoration: 'none'
              }}
            >
              💬 แอด LINE OA: @769kvfhj
            </a>
          </div>
        )}

        <form onSubmit={handleVerifyPhone} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
              เบอร์โทรศัพท์ที่ลงทะเบียนไว้ *
            </label>
            <input
              type="tel"
              placeholder="เช่น 0812345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#FAFBFB', boxSizing: 'border-box' }}
              required
            />
            <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 6, display: 'block' }}>🔒 ข้อมูลจะถูกจับคู่กับข้อมูลที่แอดมินอนุมัติไว้ในระบบ</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#94A3B8' : '#0A3A2F',
              color: '#FFFFFF',
              fontWeight: 800,
              padding: '13px',
              borderRadius: 12,
              border: 'none',
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(10, 58, 47, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ยืนยันและผูกบัญชี LINE'}
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
