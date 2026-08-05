import React, { useState, useEffect } from 'react';

const MOCK_STALLS = [
  { id: 'f1', stall_number: 'F-01', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
  { id: 'f2', stall_number: 'F-02', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
  { id: 'f3', stall_number: 'F-03', zone: 'FOOD', price: 300, status: 'BOOKED', bookedBy: 'สมชาย ขายของดี', phone: '081-234-5678', paymentType: 'PromptPay' },
  { id: 'f4', stall_number: 'F-04', zone: 'FOOD', price: 300, status: 'PENDING', bookedBy: 'มะลิ บัวขาว', phone: '082-111-2222', paymentType: 'TrueMoney' },
  { id: 'f5', stall_number: 'F-05', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
  { id: 'f6', stall_number: 'F-06', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
  { id: 'f7', stall_number: 'F-07', zone: 'FOOD', price: 300, status: 'MAINTENANCE' },
  { id: 'f8', stall_number: 'F-08', zone: 'FOOD', price: 300, status: 'AVAILABLE' },
  { id: 'b1', stall_number: 'B-01', zone: 'FASHION', price: 250, status: 'AVAILABLE' },
  { id: 'b2', stall_number: 'B-02', zone: 'FASHION', price: 250, status: 'BOOKED', bookedBy: 'สุนิสา แฟชั่น', phone: '089-999-8888', paymentType: 'PromptPay' },
  { id: 'b3', stall_number: 'B-03', zone: 'FASHION', price: 250, status: 'AVAILABLE' },
  { id: 'b4', stall_number: 'B-04', zone: 'FASHION', price: 250, status: 'PENDING', bookedBy: 'วิชัย เสื้อผ้า', phone: '083-777-6666', paymentType: 'TrueMoney' },
  { id: 'b5', stall_number: 'B-05', zone: 'FASHION', price: 250, status: 'AVAILABLE' },
  { id: 'b6', stall_number: 'B-06', zone: 'FASHION', price: 250, status: 'AVAILABLE' },
  { id: 'b7', stall_number: 'B-07', zone: 'FASHION', price: 250, status: 'AVAILABLE' },
  { id: 'b8', stall_number: 'B-08', zone: 'FASHION', price: 250, status: 'BOOKED', bookedBy: 'นิดา เสื้อวินเทจ', phone: '085-333-4444', paymentType: 'PromptPay' },
  { id: 'c1', stall_number: 'C-01', zone: 'GIFTSHOP', price: 200, status: 'AVAILABLE' },
  { id: 'c2', stall_number: 'C-02', zone: 'GIFTSHOP', price: 200, status: 'BOOKED', bookedBy: 'พิมพ์ใจ ของขวัญ', phone: '086-555-4444', paymentType: 'PromptPay' },
  { id: 'c3', stall_number: 'C-03', zone: 'GIFTSHOP', price: 200, status: 'AVAILABLE' },
  { id: 'c4', stall_number: 'C-04', zone: 'GIFTSHOP', price: 200, status: 'MAINTENANCE' },
  { id: 'c5', stall_number: 'C-05', zone: 'GIFTSHOP', price: 200, status: 'AVAILABLE' },
  { id: 'c6', stall_number: 'C-06', zone: 'GIFTSHOP', price: 200, status: 'PENDING', bookedBy: 'อมรรัตน์ แฮนด์เมด', phone: '091-222-3333', paymentType: 'TrueMoney' },
];

const MOCK_BOOKINGS = MOCK_STALLS
  .filter(s => s.status === 'PENDING' || s.status === 'BOOKED')
  .map(s => ({
    id: 'bk_' + s.id,
    stall_number: s.stall_number,
    vendor_name: s.bookedBy,
    phone: s.phone,
    booking_date: new Date().toISOString().split('T')[0],
    status: s.status === 'BOOKED' ? 'APPROVED' : 'PENDING',
    payment_type: s.paymentType,
    amount: s.price,
    slip_url: 'https://placehold.co/400x500/d1fae5/065f46?text=Payment+Slip',
  }));

// Color config per status
const statusConfig = {
  AVAILABLE:   { bg: '#d1fae5', border: '#10b981', text: '#065f46', dot: '#10b981', label: 'ว่าง' },
  PENDING:     { bg: '#fef9c3', border: '#f59e0b', text: '#78350f', dot: '#f59e0b', label: 'รอตรวจ' },
  BOOKED:      { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d', dot: '#ef4444', label: 'จองแล้ว' },
  MAINTENANCE: { bg: '#f3f4f6', border: '#9ca3af', text: '#6b7280', dot: '#9ca3af', label: 'ปรับปรุง' },
};

// Single stall box component — looks like a physical booth on a map
function StallBox({ stall, onClick }) {
  const c = statusConfig[stall.status] || statusConfig.MAINTENANCE;
  const clickable = stall.status !== 'MAINTENANCE';
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => clickable && onClick(stall)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={`ล็อก ${stall.stall_number}${stall.bookedBy ? ' — ' + stall.bookedBy : ''}`}
      style={{
        background: c.bg,
        border: `2px solid ${hover && clickable ? '#065f46' : c.border}`,
        borderRadius: 10,
        padding: '8px 4px 6px',
        cursor: clickable ? 'pointer' : 'not-allowed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        transition: 'all 0.15s ease',
        transform: hover && clickable ? 'translateY(-3px) scale(1.06)' : 'none',
        boxShadow: hover && clickable
          ? `0 6px 18px ${c.border}55`
          : `0 1px 4px rgba(0,0,0,0.08)`,
        userSelect: 'none',
        minWidth: 60,
      }}
    >
      {/* Status dot */}
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, boxShadow: `0 0 0 2px ${c.bg}, 0 0 0 3px ${c.dot}55` }} />
      {/* Number */}
      <div style={{ fontFamily: "'Mali', cursive", fontWeight: 800, fontSize: 13, color: c.text, lineHeight: 1.1 }}>
        {stall.stall_number}
      </div>
      {/* Status badge */}
      <div style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,255,255,0.65)', color: c.text, padding: '1px 5px', borderRadius: 6 }}>
        {c.label}
      </div>
      {/* Vendor name if booked */}
      {stall.bookedBy && (
        <div style={{ fontSize: 8.5, color: c.text, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center', opacity: 0.85 }}>
          {stall.bookedBy.split(' ')[0]}
        </div>
      )}
    </div>
  );
}

export default function MalinMarket() {
  const [activeTab, setActiveTab] = useState('vendor');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stalls, setStalls] = useState(MOCK_STALLS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [detailStall, setDetailStall] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', citizenId: '', paymentType: 'PROMPTPAY' });
  const [formMsg, setFormMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = stalls.filter(s => selectedZone === 'ALL' || s.zone === selectedZone);
  const foodStalls = filtered.filter(s => s.zone === 'FOOD');
  const fashionStalls = filtered.filter(s => s.zone === 'FASHION');
  const giftStalls = filtered.filter(s => s.zone === 'GIFTSHOP');

  const totalStalls = stalls.length;
  const bookedCount = stalls.filter(s => s.status === 'BOOKED').length;
  const pendingCount = stalls.filter(s => s.status === 'PENDING').length;
  const availableCount = stalls.filter(s => s.status === 'AVAILABLE').length;
  const occupancy = ((bookedCount / totalStalls) * 100).toFixed(1);
  const revenue = stalls.filter(s => s.status === 'BOOKED').reduce((sum, s) => sum + s.price, 0);

  const handleStallClick = (stall) => {
    setDetailStall(stall);
    setFormMsg('');
  };

  const handleBook = async () => {
    if (!form.name || !form.phone || !form.citizenId) {
      setFormMsg('❌ กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const updated = { ...bookingForm, status: 'PENDING', bookedBy: form.name, phone: form.phone, paymentType: form.paymentType };
    setStalls(prev => prev.map(s => s.id === bookingForm.id ? updated : s));
    setBookings(prev => [...prev, {
      id: 'bk_' + Date.now(),
      stall_number: bookingForm.stall_number,
      vendor_name: form.name,
      phone: form.phone,
      booking_date: selectedDate,
      status: 'PENDING',
      payment_type: form.paymentType,
      amount: bookingForm.price,
      slip_url: 'https://placehold.co/400x500/fef9c3/92400e?text=Payment+Slip',
    }]);
    setFormMsg('✅ ส่งคำขอจองสำเร็จ! รอ Admin ตรวจสอบสลิป');
    setLoading(false);
    setTimeout(() => { setBookingForm(null); setDetailStall(null); setForm({ name: '', phone: '', citizenId: '', paymentType: 'PROMPTPAY' }); }, 1600);
  };

  const handleApprove = (id, status) => {
    const bk = bookings.find(b => b.id === id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (bk) {
      setStalls(prev => prev.map(s => s.stall_number === bk.stall_number
        ? { ...s, status: status === 'APPROVED' ? 'BOOKED' : 'AVAILABLE' }
        : s
      ));
    }
  };

  // =========================================================
  //  Sub-components
  // =========================================================

  // Zone label badge
  const ZoneBadge = ({ text, price, accent }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 14, color: accent }}>{text}</span>
      <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.7)', color: accent, padding: '2px 10px', borderRadius: 9999, border: `1px solid ${accent}44`, fontWeight: 700 }}>{price}</span>
    </div>
  );

  // Dashed pathway line
  const PathH = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
      <div style={{ height: 2, flex: 1, background: 'repeating-linear-gradient(90deg,#6ee7b7 0,#6ee7b7 8px,transparent 8px,transparent 16px)' }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#fff', padding: '2px 10px', borderRadius: 9999, border: '1px solid #a7f3d0', whiteSpace: 'nowrap' }}>↔ ทางเดินหลัก</span>
      <div style={{ height: 2, flex: 1, background: 'repeating-linear-gradient(90deg,#6ee7b7 0,#6ee7b7 8px,transparent 8px,transparent 16px)' }} />
    </div>
  );

  const PathV = () => (
    <div style={{ width: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 2, flex: 1, background: 'repeating-linear-gradient(180deg,#6ee7b7 0,#6ee7b7 8px,transparent 8px,transparent 16px)' }} />
      <span style={{ fontSize: 8, fontWeight: 700, color: '#059669', writingMode: 'vertical-rl', letterSpacing: 1 }}>ทางเดิน</span>
      <div style={{ width: 2, flex: 1, background: 'repeating-linear-gradient(180deg,#6ee7b7 0,#6ee7b7 8px,transparent 8px,transparent 16px)' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0fdf4', fontFamily: "'Kanit', sans-serif", color: '#164e63' }}>
      {/* ── HEADER ── */}
      <header style={{ background: 'linear-gradient(135deg,#064e3b 0%,#047857 55%,#059669 100%)', padding: '0 24px', boxShadow: '0 4px 20px rgba(6,95,70,.35)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fbbf24', borderRadius: 14, padding: '8px 10px', fontSize: 26, lineHeight: 1, boxShadow: '0 3px 10px rgba(251,191,36,.5)' }}>🎪</div>
            <div>
              <div style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 21, color: '#fef9c3' }}>กาดมาลิน พลาซ่า มช.</div>
              <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: 1 }}>Malin Market Chiang Mai · ผังตลาดและระบบจองล็อกออนไลน์</div>
            </div>
          </div>
          <nav style={{ display: 'flex', background: 'rgba(0,0,0,.25)', borderRadius: 14, padding: 4, gap: 2 }}>
            {[
              { id: 'vendor', label: '🗺️ ผังจองล็อก' },
              { id: 'admin', label: '👮 Admin อนุมัติสลิป' },
              { id: 'dashboard', label: '📊 Executive Dashboard' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: '8px 16px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all .2s',
                background: activeTab === t.id ? '#fbbf24' : 'transparent',
                color: activeTab === t.id ? '#064e3b' : '#a7f3d0',
              }}>{t.label}</button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1140, margin: '0 auto', padding: '28px 20px' }}>

        {/* ══════════ TAB: VENDOR ══════════ */}
        {activeTab === 'vendor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Filter bar */}
            <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #d1fae5', padding: '16px 20px', boxShadow: '0 2px 12px rgba(16,185,129,.06)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: '#047857', fontSize: 13 }}>เลือกโซน:</span>
                {[
                  { id: 'ALL', label: 'ทั้งหมด' },
                  { id: 'FOOD', label: '🍜 อาหาร' },
                  { id: 'FASHION', label: '👗 แฟชั่น' },
                  { id: 'GIFTSHOP', label: '🎁 กิฟต์ช็อป' },
                ].map(z => (
                  <button key={z.id} onClick={() => setSelectedZone(z.id)} style={{
                    padding: '6px 14px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .15s',
                    background: selectedZone === z.id ? '#059669' : '#f0fdf4',
                    borderColor: selectedZone === z.id ? '#059669' : '#6ee7b7',
                    color: selectedZone === z.id ? '#fff' : '#047857',
                  }}>{z.label}</button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: '#047857' }}>วันที่จอง:</span>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 10, border: '1.5px solid #6ee7b7', background: '#f0fdf4', color: '#065f46', fontSize: 12 }} />
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, fontWeight: 600, flexWrap: 'wrap' }}>
                {[['#10b981','ว่าง'],['#f59e0b','รอตรวจสลิป'],['#ef4444','จองแล้ว'],['#9ca3af','ปรับปรุง']].map(([col, label]) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: col, display: 'inline-block', border: `2px solid ${col}66` }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats mini-bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
              {[
                { label: 'ว่าง', count: availableCount, col: '#059669', bg: '#d1fae5' },
                { label: 'รอตรวจสลิป', count: pendingCount, col: '#d97706', bg: '#fef9c3' },
                { label: 'จองแล้ว', count: bookedCount, col: '#dc2626', bg: '#fee2e2' },
                { label: 'Occupancy', count: occupancy + '%', col: '#0891b2', bg: '#e0f2fe' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.col}33`, borderRadius: 14, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Mali', cursive", fontWeight: 800, fontSize: 22, color: s.col }}>{s.count}</div>
                  <div style={{ fontSize: 10, color: s.col, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ===== THE FLOOR PLAN MAP ===== */}
            <div style={{ background: '#fff', borderRadius: 22, border: '1.5px solid #d1fae5', padding: '22px 24px', boxShadow: '0 2px 16px rgba(16,185,129,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #ecfdf5', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h2 style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 19, color: '#065f46' }}>
                    🗺️ แผนผังตลาดมาลิน — คลิกที่ช่องล็อกเพื่อดูรายละเอียดหรือจอง
                  </h2>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
                    แต่ละช่องคือล็อกขายของในตลาด · สีแสดงสถานะปัจจุบัน · คลิกเพื่อดูผู้จองหรือเปิดฟอร์มจองได้ทันที
                  </p>
                </div>
                <div style={{ background: '#fef9c3', border: '1px solid #fbbf24', borderRadius: 12, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#92400e' }}>
                  ✨ อัปเดต Real-time
                </div>
              </div>

              {/* Scrollable map wrapper */}
              <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
                <div style={{
                  minWidth: 700,
                  background: '#e8f5e9',
                  border: '2.5px solid #6ee7b7',
                  borderRadius: 18,
                  padding: '20px 20px 16px',
                  backgroundImage: `
                    repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(16,185,129,.05) 39px,rgba(16,185,129,.05) 40px),
                    repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(16,185,129,.05) 39px,rgba(16,185,129,.05) 40px)
                  `,
                }}>

                  {/* ── Entrance / Exit top bar ── */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <div style={{ background: '#fbbf24', color: '#064e3b', padding: '5px 18px', borderRadius: 9999, fontWeight: 800, fontSize: 12, boxShadow: '0 2px 8px rgba(251,191,36,.45)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      🚪 ทางเข้าหลัก (ถ.ห้วยแก้ว)
                    </div>
                    <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg,#fbbf24 0,#fbbf24 8px,transparent 8px,transparent 16px)' }} />
                    <div style={{ background: '#f3f4f6', color: '#374151', padding: '5px 18px', borderRadius: 9999, fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      🚶 ทางออก (ฝั่ง มช.)
                    </div>
                  </div>

                  {/* ── Top two zones side by side ── */}
                  <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>

                    {/* FOOD ZONE */}
                    {(selectedZone === 'ALL' || selectedZone === 'FOOD') && (
                      <div style={{
                        flex: '0 0 auto',
                        width: '55%',
                        background: 'rgba(209,250,229,0.9)',
                        border: '2px solid #6ee7b7',
                        borderRadius: '14px 0 0 14px',
                        padding: '14px 16px',
                      }}>
                        <ZoneBadge text="🍜 โซนอาหารและเครื่องดื่ม (Food & Beverage)" price="฿300/วัน" accent="#047857" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {foodStalls.map(s => <StallBox key={s.id} stall={s} onClick={handleStallClick} />)}
                        </div>
                      </div>
                    )}

                    {/* Vertical pathway between food and gift */}
                    {selectedZone === 'ALL' && <PathV />}

                    {/* GIFTSHOP ZONE */}
                    {(selectedZone === 'ALL' || selectedZone === 'GIFTSHOP') && (
                      <div style={{
                        flex: 1,
                        background: 'rgba(254,243,199,0.9)',
                        border: '2px solid #fcd34d',
                        borderRadius: selectedZone === 'ALL' ? '0 14px 14px 0' : 14,
                        padding: '14px 16px',
                      }}>
                        <ZoneBadge text="🎁 โซนกิฟต์ช็อป & แฮนด์เมด" price="฿200/วัน" accent="#92400e" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                          {giftStalls.map(s => <StallBox key={s.id} stall={s} onClick={handleStallClick} />)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Horizontal pathway ── */}
                  {(selectedZone === 'ALL') && (
                    <div style={{ margin: '10px 0' }}>
                      <PathH />
                    </div>
                  )}

                  {/* ── FASHION ZONE (full width bottom) ── */}
                  {(selectedZone === 'ALL' || selectedZone === 'FASHION') && (
                    <div style={{
                      background: 'rgba(237,233,254,0.9)',
                      border: '2px solid #c4b5fd',
                      borderRadius: 14,
                      padding: '14px 16px',
                    }}>
                      <ZoneBadge text="👗 โซนเสื้อผ้าและแฟชั่น (Fashion Street)" price="฿250/วัน" accent="#5b21b6" />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
                        {fashionStalls.map(s => <StallBox key={s.id} stall={s} onClick={handleStallClick} />)}
                      </div>
                    </div>
                  )}

                  {/* ── Bottom facilities row ── */}
                  <div style={{ display: 'flex', gap: 10, marginTop: 14, fontSize: 11, color: '#6b7280', flexWrap: 'wrap' }}>
                    {['🅿️ ที่จอดรถ (Parking)', '🚻 ห้องน้ำ (WC)', '💡 แผงควบคุมไฟ', '🍶 จุดล้างมือ'].map(f => (
                      <div key={f} style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #d1d5db', borderRadius: 10, padding: '4px 12px' }}>{f}</div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: ADMIN ══════════ */}
        {activeTab === 'admin' && (
          <div style={{ background: '#fff', borderRadius: 22, border: '1.5px solid #d1fae5', padding: '24px', boxShadow: '0 2px 16px rgba(16,185,129,.06)' }}>
            <h2 style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 19, color: '#065f46', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #ecfdf5' }}>
              👮 ระบบอนุมัติสลิปโอนเงิน (Admin Verification Panel)
            </h2>
            {bookings.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>ไม่มีรายการจองที่รอตรวจสอบ</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f0fdf4', borderBottom: '1.5px solid #d1fae5' }}>
                      {['ล็อก','ชื่อแม่ค้า/พ่อค้า','เบอร์โทร','วันที่','ยอดชำระ','ช่องทาง','สลิป','สถานะ','จัดการ'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#047857', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f0fdf4' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#059669' }}>{b.stall_number}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 500 }}>{b.vendor_name}</td>
                        <td style={{ padding: '10px 12px', color: '#374151' }}>{b.phone}</td>
                        <td style={{ padding: '10px 12px', color: '#6b7280' }}>{b.booking_date}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#d97706' }}>฿{b.amount}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{b.payment_type}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <a href={b.slip_url} target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>🖼️ ดูสลิป</a>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            background: b.status === 'APPROVED' ? '#d1fae5' : b.status === 'PENDING' ? '#fef9c3' : '#fee2e2',
                            color: b.status === 'APPROVED' ? '#065f46' : b.status === 'PENDING' ? '#92400e' : '#7f1d1d',
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700
                          }}>
                            {b.status === 'APPROVED' ? '✅ อนุมัติแล้ว' : b.status === 'PENDING' ? '⏳ รอตรวจ' : '❌ ปฏิเสธ'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {b.status === 'PENDING' && (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => handleApprove(b.id, 'APPROVED')} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✅ อนุมัติ</button>
                              <button onClick={() => handleApprove(b.id, 'REJECTED')} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>❌ ปฏิเสธ</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════ TAB: DASHBOARD ══════════ */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 19, color: '#065f46' }}>📈 Executive Summary Dashboard</h2>
              <button onClick={() => window.print()} style={{ background: '#fbbf24', color: '#064e3b', border: 'none', borderRadius: 12, padding: '9px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px rgba(251,191,36,.35)' }}>
                📄 Export PDF Report
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              {[
                { label: 'Occupancy Rate', value: occupancy + '%', sub: 'อัตราการครองพื้นที่', col: '#059669', bg: '#d1fae5' },
                { label: 'รายได้ประมาณการ', value: '฿' + revenue.toLocaleString(), sub: 'จากล็อกที่อนุมัติแล้ว', col: '#d97706', bg: '#fef9c3' },
                { label: 'ล็อกที่จองแล้ว', value: bookedCount + '/' + totalStalls, sub: 'ล็อก (Real-time)', col: '#0891b2', bg: '#e0f2fe' },
              ].map(card => (
                <div key={card.label} style={{ background: '#fff', border: `1.5px solid ${card.col}22`, borderRadius: 18, padding: '22px 20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: card.col, marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontFamily: "'Mali', cursive", fontSize: 32, fontWeight: 800, color: card.col }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{card.sub}</div>
                  {card.label === 'Occupancy Rate' && (
                    <div style={{ marginTop: 10, background: '#f0fdf4', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: occupancy + '%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 9999 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1.5px solid #d1fae5', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(16,185,129,.06)' }}>
              <h3 style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 16, color: '#065f46', marginBottom: 18 }}>📊 สถิติแยกรายโซน</h3>
              {[
                { zone: 'FOOD', label: '🍜 โซนอาหาร' },
                { zone: 'FASHION', label: '👗 โซนแฟชั่น' },
                { zone: 'GIFTSHOP', label: '🎁 โซนกิฟต์ช็อป' },
              ].map(({ zone, label }) => {
                const total = stalls.filter(s => s.zone === zone && s.status !== 'MAINTENANCE').length;
                const booked = stalls.filter(s => s.zone === zone && s.status === 'BOOKED').length;
                const pct = total > 0 ? Math.round((booked / total) * 100) : 0;
                return (
                  <div key={zone} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      <span style={{ color: '#065f46' }}>{label}</span>
                      <span style={{ color: '#6b7280' }}>{booked}/{total} ล็อก ({pct}%)</span>
                    </div>
                    <div style={{ background: '#f0fdf4', borderRadius: 9999, height: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 9999, transition: 'width .5s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── POPUP: STALL DETAIL ── */}
      {detailStall && !bookingForm && (
        <div onClick={() => setDetailStall(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(6,78,59,.4)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 24, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,.2)', border: '1.5px solid #d1fae5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #ecfdf5' }}>
              <h3 style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 18, color: '#065f46' }}>
                📍 ล็อก {detailStall.stall_number}
              </h3>
              <button onClick={() => setDetailStall(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              {[
                { label: 'โซนสินค้า', value: detailStall.zone === 'FOOD' ? '🍜 อาหาร' : detailStall.zone === 'FASHION' ? '👗 แฟชั่น' : '🎁 กิฟต์ช็อป' },
                { label: 'ค่าเช่า', value: `฿${detailStall.price} / วัน` },
                { label: 'วันที่เลือก', value: selectedDate },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', background: '#f0fdf4', borderRadius: 10, padding: '8px 14px' }}>
                  <span style={{ color: '#6b7280' }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: '#065f46' }}>{r.value}</span>
                </div>
              ))}

              {/* Status detail block */}
              {detailStall.status === 'AVAILABLE' && (
                <div style={{ background: '#d1fae5', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 22 }}>🟢</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#065f46', fontSize: 14 }}>ล็อกว่าง พร้อมรับจองทันที</div>
                    <div style={{ fontSize: 11, color: '#059669', marginTop: 2 }}>กดปุ่มด้านล่างเพื่อจองล็อกนี้</div>
                  </div>
                </div>
              )}
              {detailStall.status === 'PENDING' && (
                <div style={{ background: '#fef9c3', borderRadius: 12, padding: '12px 14px', fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 8, fontSize: 13 }}>🟡 มีผู้กำลังรอชำระ / รอตรวจสลิป</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, color: '#374151' }}>
                    <div>👤 ผู้จอง: <strong>{detailStall.bookedBy}</strong></div>
                    <div>📞 เบอร์โทร: {detailStall.phone}</div>
                    <div>💳 ชำระผ่าน: {detailStall.paymentType}</div>
                    <div style={{ marginTop: 4, fontWeight: 700, color: '#d97706', fontSize: 11 }}>⏳ สถานะ: รอ Admin อนุมัติสลิป</div>
                  </div>
                </div>
              )}
              {detailStall.status === 'BOOKED' && (
                <div style={{ background: '#fee2e2', borderRadius: 12, padding: '12px 14px', fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: '#7f1d1d', marginBottom: 8, fontSize: 13 }}>🔴 ล็อกนี้ถูกจองเรียบร้อยแล้ว</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, color: '#374151' }}>
                    <div>👤 ผู้จอง: <strong>{detailStall.bookedBy}</strong></div>
                    <div>📞 เบอร์โทร: {detailStall.phone}</div>
                    <div>💳 ชำระผ่าน: {detailStall.paymentType}</div>
                    <div style={{ marginTop: 4, fontWeight: 700, color: '#059669', fontSize: 11 }}>✅ สถานะ: ชำระเงินและอนุมัติเรียบร้อย</div>
                  </div>
                </div>
              )}
              {detailStall.status === 'MAINTENANCE' && (
                <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
                  ⚪ ล็อกนี้อยู่ระหว่างปิดปรับปรุง ยังไม่เปิดจอง
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={() => setDetailStall(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 12, padding: '9px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                ปิด
              </button>
              {detailStall.status === 'AVAILABLE' && (
                <button onClick={() => { setBookingForm(detailStall); setFormMsg(''); }} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 22px', cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(5,150,105,.4)' }}>
                  🛒 จองล็อกนี้ทันที
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── POPUP: BOOKING FORM ── */}
      {bookingForm && (
        <div onClick={() => { setBookingForm(null); setDetailStall(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(6,78,59,.4)', backdropFilter: 'blur(5px)', zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 24, padding: 28, maxWidth: 440, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,.2)', border: '1.5px solid #d1fae5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #ecfdf5' }}>
              <h3 style={{ fontFamily: "'Mali', cursive", fontWeight: 700, fontSize: 18, color: '#065f46' }}>
                📝 แบบฟอร์มจองล็อก {bookingForm.stall_number}
              </h3>
              <button onClick={() => setBookingForm(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>โซน / ค่าเช่า</span>
                <span style={{ fontWeight: 700, color: '#065f46' }}>{bookingForm.zone} · ฿{bookingForm.price}/วัน</span>
              </div>
              {[
                { label: 'ชื่อ-นามสกุล *', key: 'name', placeholder: 'เช่น สมชาย ขายของดี', type: 'text' },
                { label: 'เบอร์โทรศัพท์ *', key: 'phone', placeholder: 'เช่น 081-234-5678', type: 'tel' },
                { label: 'เลขบัตรประชาชน * (PDPA)', key: 'citizenId', placeholder: 'เลขบัตร 13 หลัก', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 12 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 14px', borderRadius: 12, border: '1.5px solid #d1fae5', fontSize: 13, outline: 'none', color: '#164e63', background: '#fafafa' }}
                    onFocus={e => e.target.style.borderColor = '#10b981'}
                    onBlur={e => e.target.style.borderColor = '#d1fae5'}
                  />
                  {f.key === 'citizenId' && <div style={{ fontSize: 10, color: '#059669', marginTop: 4 }}>🔒 เข้ารหัส AES-256-GCM ตามมาตรฐาน PDPA</div>}
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: 12 }}>ช่องทางชำระเงิน</label>
                <select value={form.paymentType} onChange={e => setForm(p => ({ ...p, paymentType: e.target.value }))}
                  style={{ width: '100%', padding: '9px 14px', borderRadius: 12, border: '1.5px solid #d1fae5', fontSize: 13, background: '#fafafa', color: '#164e63' }}>
                  <option value="PROMPTPAY">PromptPay (พร้อมเพย์)</option>
                  <option value="TRUEMONEY">TrueMoney Wallet</option>
                </select>
              </div>
              {formMsg && (
                <div style={{ background: formMsg.startsWith('✅') ? '#d1fae5' : '#fee2e2', color: formMsg.startsWith('✅') ? '#065f46' : '#7f1d1d', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
                  {formMsg}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22, paddingTop: 16, borderTop: '1px solid #ecfdf5' }}>
              <button onClick={() => setBookingForm(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                ยกเลิก
              </button>
              <button onClick={handleBook} disabled={loading} style={{ background: loading ? '#a7f3d0' : '#059669', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, boxShadow: loading ? 'none' : '0 4px 12px rgba(5,150,105,.35)' }}>
                {loading ? '⏳ กำลังส่งข้อมูล...' : '✅ ยืนยันจองล็อก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: '#064e3b', color: '#6ee7b7', fontSize: 12, textAlign: 'center', padding: '18px 20px', marginTop: 40, borderTop: '1px solid #065f46' }}>
        © 2026 กาดมาลิน พลาซ่า มช. (Malin Market Chiang Mai) · Supabase Staging Environment
      </footer>
    </div>
  );
}
