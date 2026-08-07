import React, { useState } from 'react';

// Real coordinates representing the Malin Plaza DWG map in vector SVG coordinates (viewBox="0 0 850 550")
const INITIAL_STALLS = [
  // Zone 1 (Left - Rotated blocks)
  { id: 'z1_1', stall_number: '1-01', zone: '1', price: 250, status: 'AVAILABLE', x: 25, y: 390, w: 26, h: 40, r: -22 },
  { id: 'z1_2', stall_number: '1-02', zone: '1', price: 250, status: 'AVAILABLE', x: 50, y: 380, w: 26, h: 40, r: -22 },
  { id: 'z1_3', stall_number: '1-03', zone: '1', price: 250, status: 'BOOKED', bookedBy: 'เก๋ แฟชั่น', phone: '081-111-2222', paymentType: 'PromptPay', x: 75, y: 370, w: 26, h: 40, r: -22 },
  { id: 'z1_4', stall_number: '1-04', zone: '1', price: 250, status: 'AVAILABLE', x: 100, y: 360, w: 26, h: 40, r: -22 },
  { id: 'z1_5', stall_number: '1-05', zone: '1', price: 250, status: 'PENDING', bookedBy: 'นัท เสื้อผ้า', phone: '082-222-3333', paymentType: 'TrueMoney', x: 125, y: 350, w: 26, h: 40, r: -22 },
  
  { id: 'z1_6', stall_number: '1-10', zone: '1', price: 250, status: 'AVAILABLE', x: 95, y: 475, w: 26, h: 40, r: -35 },
  { id: 'z1_7', stall_number: '1-11', zone: '1', price: 250, status: 'AVAILABLE', x: 116, y: 460, w: 26, h: 40, r: -35 },
  { id: 'z1_8', stall_number: '1-12', zone: '1', price: 250, status: 'BOOKED', bookedBy: 'มาลี เครื่องประดับ', phone: '083-333-4444', paymentType: 'PromptPay', x: 137, y: 445, w: 26, h: 40, r: -35 },

  // Zone 2 (Center diagonal lane)
  { id: 'z2_1', stall_number: '2-01', zone: '2', price: 300, status: 'AVAILABLE', x: 300, y: 360, w: 18, h: 36, r: 72 },
  { id: 'z2_2', stall_number: '2-02', zone: '2', price: 300, status: 'AVAILABLE', x: 310, y: 330, w: 18, h: 36, r: 72 },
  { id: 'z2_3', stall_number: '2-03', zone: '2', price: 300, status: 'BOOKED', bookedBy: 'เจ๊ดา ส้มตำ', phone: '084-444-5555', paymentType: 'PromptPay', x: 320, y: 300, w: 18, h: 36, r: 72 },
  { id: 'z2_4', stall_number: '2-04', zone: '2', price: 300, status: 'AVAILABLE', x: 330, y: 270, w: 18, h: 36, r: 72 },

  // Zone 3, 5, 6 (Center bottom diagonal blocks)
  { id: 'z3_1', stall_number: '3-01', zone: '3', price: 200, status: 'AVAILABLE', x: 380, y: 470, w: 22, h: 32, r: -45 },
  { id: 'z3_2', stall_number: '3-02', zone: '3', price: 200, status: 'PENDING', bookedBy: 'ชานมไข่มุก', phone: '085-555-6666', paymentType: 'TrueMoney', x: 400, y: 450, w: 22, h: 32, r: -45 },
  { id: 'z5_1', stall_number: '5-01', zone: '5', price: 200, status: 'AVAILABLE', x: 440, y: 410, w: 22, h: 32, r: -45 },
  { id: 'z5_2', stall_number: '5-02', zone: '5', price: 200, status: 'MAINTENANCE', x: 460, y: 390, w: 22, h: 32, r: -45 },
  { id: 'z6_1', stall_number: '6-01', zone: '6', price: 180, status: 'AVAILABLE', x: 500, y: 350, w: 22, h: 32, r: -45 },
  { id: 'z6_2', stall_number: '6-02', zone: '6', price: 180, status: 'AVAILABLE', x: 520, y: 330, w: 22, h: 32, r: -45 },

  // Zone 8 (Souvenirs / Right bottom block)
  { id: 'z8_1', stall_number: '8-01', zone: '8', price: 220, status: 'AVAILABLE', x: 530, y: 450, w: 24, h: 32, r: -15 },
  { id: 'z8_2', stall_number: '8-02', zone: '8', price: 220, status: 'AVAILABLE', x: 560, y: 440, w: 24, h: 32, r: -15 },

  // Zone 9 (Center horizontal top row)
  { id: 'z9_1', stall_number: '9-01', zone: '9', price: 220, status: 'AVAILABLE', x: 450, y: 200, w: 24, h: 32, r: 8 },
  { id: 'z9_2', stall_number: '9-02', zone: '9', price: 220, status: 'AVAILABLE', x: 476, y: 203, w: 24, h: 32, r: 8 },
  { id: 'z9_3', stall_number: '9-03', zone: '9', price: 220, status: 'PENDING', bookedBy: 'อมรรัตน์ กิฟต์', phone: '086-666-7777', paymentType: 'TrueMoney', x: 502, y: 206, w: 24, h: 32, r: 8 },

  // Zone 10 (Top center)
  { id: 'z10_1', stall_number: '10-01', zone: '10', price: 280, status: 'AVAILABLE', x: 490, y: 145, w: 22, h: 28, r: 8 },
  { id: 'z10_2', stall_number: '10-02', zone: '10', price: 280, status: 'BOOKED', bookedBy: 'โกโก้เข้มข้น', phone: '087-777-8888', paymentType: 'PromptPay', x: 512, y: 148, w: 22, h: 28, r: 8 },

  // Zone 11 (Top horizontal long block)
  { id: 'z11_1', stall_number: '11-01', zone: '11', price: 350, status: 'AVAILABLE', x: 530, y: 110, w: 20, h: 48, r: 8 },
  { id: 'z11_2', stall_number: '11-02', zone: '11', price: 350, status: 'AVAILABLE', x: 550, y: 113, w: 20, h: 48, r: 8 },
  { id: 'z11_3', stall_number: '11-03', zone: '11', price: 350, status: 'BOOKED', bookedBy: 'เป้ รองเท้า', phone: '088-888-9999', paymentType: 'PromptPay', x: 570, y: 116, w: 20, h: 48, r: 8 },

  // Zone 12 (Far Right slanted corner)
  { id: 'z12_1', stall_number: '12-01', zone: '12', price: 200, status: 'AVAILABLE', x: 740, y: 55, w: 24, h: 38, r: -35 },
  { id: 'z12_2', stall_number: '12-02', zone: '12', price: 200, status: 'MAINTENANCE', x: 762, y: 40, w: 24, h: 38, r: -35 }
];

const dict = {
  TH: {
    title: 'ระบบจองล็อกออนไลน์ มาลิน พลาซ่า',
    subtitle: 'โดยกลุ่มบริษัท ไฮไลฟ์ (Hylife Group) — แผนผังเวกเตอร์ SVG แบบเสรีมาร์เก็ต กดจองและเลือกโซนได้ทันที',
    login: 'เข้าสู่ระบบสมาชิก',
    register: 'สมัครสมาชิก',
    logout: 'ออกจากระบบ',
    langBtn: 'EN',
    zone: 'เลือกโซน',
    all: 'ทั้งหมด',
    food: 'โซนอาหาร',
    fashion: 'โซนแฟชั่น',
    gift: 'กิฟต์ช็อป',
    date: 'วันที่จอง',
    statusAvailable: 'ว่าง',
    statusPending: 'รอตรวจสลิป',
    statusBooked: 'จองแล้ว',
    statusMaintenance: 'ปรับปรุง',
    statsAvailable: 'ล็อกว่าง',
    statsPending: 'รอตรวจสอบ',
    statsBooked: 'จองแล้ว',
    statsOccupancy: 'อัตราเช่า',
    mapTitle: 'แผนผังตลาด Malin Plaza (Seri Market Vector Style)',
    mapSubtitle: 'คลิกเลือกล็อกสีต่างๆ บนแผนผังจำลอง เพื่อทำรายการจองหรือดูรายละเอียดล็อกทางแถบด้านขวา',
    entrance: 'ทางเข้าหลัก (ถ.ห้วยแก้ว)',
    exit: 'ทางออก (ฝั่ง มช.)',
    pathway: 'ทางเดินหลัก',
    parking: '🅿️ ที่จอดรถ',
    wc: '🚻 ห้องน้ำ',
    powerPanel: 'แผงควบคุมไฟ',
    sink: 'อ่างล้างมือ',
    viewDetails: 'ดูรายละเอียด',
    rent: 'อัตราค่าเช่า',
    selectedDate: 'วันที่เลือก',
    close: 'ปิด',
    bookNow: 'จองล็อกนี้ทันที',
    bookingFormTitle: 'รายละเอียดจองล็อก',
    fullName: 'ชื่อ-นามสกุลผู้จอง *',
    phoneLabel: 'เบอร์โทรศัพท์มือถือ *',
    citizenId: 'เลขบัตรประชาชน * (สำหรับสัญญากฎหมาย)',
    pdpaNotice: '🔒 ข้อมูลได้รับการรักษาความปลอดภัยตามมาตรฐาน PDPA',
    paymentMethod: 'ช่องทางการชำระเงิน',
    cancel: 'ยกเลิก',
    confirmBooking: 'ยืนยันส่งข้อมูลจอง',
    errorFields: '❌ กรุณากรอกข้อมูลให้ครบถ้วน',
    successBooking: '✅ ส่งข้อมูลคำขอจองสำเร็จ! รอเจ้าหน้าที่ตรวจสอบสลิป',
    loadingBooking: '⏳ กำลังส่งข้อมูล...',
    tabMap: '🗺️ แผนผังจองล็อก',
    tabAdmin: '👮 ระบบเจ้าหน้าที่',
    tabDashboard: '📊 รายงานผู้บริหาร',
    adminPanelTitle: 'รายการรอยืนยันคำขอจอง',
    noBookings: 'ไม่มีรายการจองที่รอการตรวจสอบ',
    colStall: 'ล็อก',
    colName: 'ชื่อผู้จอง',
    colPhone: 'เบอร์โทร',
    colDate: 'วันที่',
    colAmount: 'ยอดชำระ',
    colPayment: 'ช่องทาง',
    colSlip: 'เอกสาร/สลิป',
    colStatus: 'สถานะ',
    colManage: 'จัดการ',
    approve: 'อนุมัติ',
    reject: 'ปฏิเสธ',
    approvedLabel: '✅ อนุมัติแล้ว',
    pendingLabel: '⏳ รอตรวจ',
    rejectedLabel: '❌ ปฏิเสธ',
    execSummary: 'รายงานข้อมูลสรุปสำหรับผู้บริหาร',
    exportPdf: 'ดาวน์โหลด PDF',
    estRevenue: 'รายได้ประมาณการ',
    basedOnApproved: 'คำนวณจากล็อกที่จองสมบูรณ์แล้ว',
    zoneStats: 'อัตราส่วนการเข้าเช่าแยกตามโซน',
    stalls: 'ล็อก',
    loginModalTitle: 'เข้าสู่ระบบ Malin Plaza',
    loginPrompt: 'ระบุเบอร์โทรศัพท์เพื่อรับรหัส OTP',
    getOtp: 'ขอรับรหัส OTP',
    otpLabel: 'รหัส OTP (จำลองเป็น 123456)',
    submitLogin: 'เข้าสู่ระบบ',
    staffLoginLink: 'เข้าสู่ระบบด้วยบัญชีเจ้าหน้าที่ (Staff Login)',
    userLoginLink: 'เข้าสู่ระบบสำหรับผู้เช่า (Tenant Login)',
    staffUser: 'ชื่อบัญชีเจ้าหน้าที่',
    staffPass: 'รหัสผ่าน',
    loginError: '❌ ข้อมูลผู้ใช้งานไม่ถูกต้อง',
    socialLogin: 'หรือเข้าใช้งานด้วยโซเชียลเน็ตเวิร์ก',
    googleLogin: 'เข้าสู่ระบบด้วย Google',
    facebookLogin: 'เข้าสู่ระบบด้วย Facebook',
    clickStallInfo: 'กรุณาคลิกเลือกช่องล็อกบนผังด้านซ้ายเพื่อดูรายละเอียด',
    sizeVal: '3x3 ม. (9 ตร.ม.)',
    size: 'ขนาดพื้นที่'
  },
  EN: {
    title: 'Malin Plaza Online Stall Booking',
    subtitle: 'Managed by Hylife Group — Seri Market Vector SVG map with interactive layout',
    login: 'Member Login',
    register: 'Sign Up',
    logout: 'Logout',
    langBtn: 'TH',
    zone: 'Select Zone',
    all: 'All',
    food: 'Food Zone',
    fashion: 'Fashion Zone',
    gift: 'Gift Zone',
    date: 'Booking Date',
    statusAvailable: 'Available',
    statusPending: 'Pending Slip',
    statusBooked: 'Booked',
    statusMaintenance: 'Maintenance',
    statsAvailable: 'Available',
    statsPending: 'Pending Audit',
    statsBooked: 'Booked',
    statsOccupancy: 'Occupancy',
    mapTitle: 'Malin Plaza Interactive Map Layout',
    mapSubtitle: 'Click on any colored stall box directly in the layout plan to select and book',
    entrance: 'Main Entrance (Huay Kaew Rd.)',
    exit: 'Exit (CMU Side)',
    pathway: 'Main Pathway',
    parking: '🅿️ Parking Area',
    wc: '🚻 WC',
    powerPanel: 'Power Hub',
    sink: 'Wash Basin',
    viewDetails: 'Stall Details',
    rent: 'Rental Rate',
    selectedDate: 'Selected Date',
    close: 'Close',
    bookNow: 'Book Stall Now',
    bookingFormTitle: 'Stall Registration Form',
    fullName: 'Full Name *',
    phoneLabel: 'Mobile Phone *',
    citizenId: 'Citizen ID / Passport *',
    pdpaNotice: '🔒 Data secured in compliance with PDPA standards',
    paymentMethod: 'Payment Option',
    cancel: 'Cancel',
    confirmBooking: 'Confirm Booking Request',
    errorFields: '❌ Please fill in all required fields',
    successBooking: '✅ Booking submitted! Waiting for verification',
    loadingBooking: '⏳ Submitting...',
    tabMap: '🗺️ Interactive Map',
    tabAdmin: '👮 Staff Verification Panel',
    tabDashboard: '📊 Executive Summary',
    adminPanelTitle: 'Pending Booking Approvals',
    noBookings: 'No pending bookings found',
    colStall: 'Stall',
    colName: 'Tenant Name',
    colPhone: 'Phone',
    colDate: 'Date',
    colAmount: 'Amount',
    colPayment: 'Method',
    colSlip: 'Slip File',
    colStatus: 'Status',
    colManage: 'Actions',
    approve: 'Approve',
    reject: 'Reject',
    approvedLabel: '✅ Approved',
    pendingLabel: '⏳ Pending',
    rejectedLabel: '❌ Rejected',
    execSummary: 'Executive Financial Summary & Occupancy Report',
    exportPdf: 'Download PDF',
    estRevenue: 'Estimated Revenue',
    basedOnApproved: 'Based on approved leases',
    zoneStats: 'Stall Occupancy Rates by Zone',
    stalls: 'Stalls',
    loginModalTitle: 'Log In to Malin Plaza Portal',
    loginPrompt: 'Enter phone number to receive OTP',
    getOtp: 'Request OTP',
    otpLabel: 'OTP Code (Mock: 123456)',
    submitLogin: 'Login',
    staffLoginLink: 'Switch to Staff Login Account',
    userLoginLink: 'Switch to Tenant Login',
    staffUser: 'Staff Username',
    staffPass: 'Password',
    loginError: '❌ Invalid credentials',
    socialLogin: 'Or sign in using social network providers',
    googleLogin: 'Sign in with Google',
    facebookLogin: 'Sign in with Facebook',
    clickStallInfo: 'Please click on a stall box in the plan layout',
    sizeVal: '3x3 m. (9 sq.m.)',
    size: 'Stall Size'
  }
};

export default function MalinMarket() {
  const [lang, setLang] = useState('TH');
  const t = dict[lang];

  // States
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('vendor');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStall, setSelectedStall] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stalls, setStalls] = useState(INITIAL_STALLS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [zoomScale, setZoomScale] = useState(1.0);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Auth Forms
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [staffUser, setStaffUser] = useState('');
  const [staffPass, setStaffPass] = useState('');
  const [loginErrorMsg, setLoginErrorMsg] = useState('');

  // Booking Forms
  const [form, setForm] = useState({ name: '', phone: '', citizenId: '', paymentType: 'PROMPTPAY' });
  const [formMsg, setFormMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredStalls = stalls.filter(s => selectedZone === 'ALL' || s.zone === selectedZone);

  const totalStalls = stalls.length;
  const bookedCount = stalls.filter(s => s.status === 'BOOKED').length;
  const pendingCount = stalls.filter(s => s.status === 'PENDING').length;
  const availableCount = stalls.filter(s => s.status === 'AVAILABLE').length;
  const occupancy = ((bookedCount / totalStalls) * 100).toFixed(1);
  const revenue = stalls.filter(s => s.status === 'BOOKED').reduce((sum, s) => sum + s.price, 0);

  const handleStallClick = (stall) => {
    setSelectedStall(stall);
    setFormMsg('');
  };

  const handleZoom = (type) => {
    if (type === 'in') setZoomScale(prev => Math.min(prev + 0.15, 1.8));
    if (type === 'out') setZoomScale(prev => Math.max(prev - 0.15, 0.65));
    if (type === 'reset') setZoomScale(1.0);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.citizenId) {
      setFormMsg(t.errorFields);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const updated = { ...selectedStall, status: 'PENDING', bookedBy: form.name, phone: form.phone, paymentType: form.paymentType };
    setStalls(prev => prev.map(s => s.id === selectedStall.id ? updated : s));
    setBookings(prev => [...prev, {
      id: 'bk_' + Date.now(),
      stall_number: selectedStall.stall_number,
      vendor_name: form.name,
      phone: form.phone,
      booking_date: selectedDate,
      status: 'PENDING',
      payment_type: form.paymentType,
      amount: selectedStall.price,
      slip_url: 'https://placehold.co/400x500/f8fafc/0f172a?text=Payment+Slip',
    }]);
    setFormMsg(t.successBooking);
    setLoading(false);
    setTimeout(() => {
      setShowBookingForm(false);
      setSelectedStall(null);
      setForm({ name: '', phone: '', citizenId: '', paymentType: 'PROMPTPAY' });
    }, 1800);
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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginErrorMsg('');
    if (isStaffLogin) {
      if (staffUser.toLowerCase() === 'admin' && staffPass === 'admin') {
        setCurrentUser({ username: 'Admin Hylife', role: 'ADMIN' });
        setShowLoginModal(false);
        setActiveTab('admin');
      } else if (staffUser.toLowerCase() === 'bod' && staffPass === 'bod') {
        setCurrentUser({ username: 'Director Hylife', role: 'BOD' });
        setShowLoginModal(false);
        setActiveTab('dashboard');
      } else {
        setLoginErrorMsg(t.loginError);
      }
    } else {
      if (loginPhone.length >= 9 && loginOtp === '123456') {
        setCurrentUser({ username: loginPhone, role: 'USER' });
        setShowLoginModal(false);
      } else {
        setLoginErrorMsg(t.loginError);
      }
    }
  };

  const handleSocialLogin = (platform) => {
    setCurrentUser({ username: `${platform} User`, role: 'USER' });
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('vendor');
    setLoginPhone('');
    setLoginOtp('');
    setOtpSent(false);
    setStaffUser('');
    setStaffPass('');
  };

  // Color config matching Seri Market (Clean solid fills, clean labels)
  const statusColors = {
    AVAILABLE:   { fill: '#F59E0B', stroke: '#D97706', text: '#FFFFFF' }, // Golden/Orange available
    PENDING:     { fill: '#FEF08A', stroke: '#F59E0B', text: '#78350F' }, // Light gold pending
    BOOKED:      { fill: '#A7F3D0', stroke: '#10B981', text: '#064E3B' }, // Green booked
    MAINTENANCE: { fill: '#E2E8F0', stroke: '#94A3B8', text: '#475569' }
  };

  const zonesList = [
    { id: 'ALL', label: t.allZones },
    { id: '1', label: 'โซน 1' },
    { id: '2', label: 'โซน 2' },
    { id: '3', label: 'โซน 3' },
    { id: '9', label: 'โซน 9' },
    { id: '10', label: 'โซน 10' },
    { id: '11', label: 'โซน 11' },
    { id: '12', label: 'โซน 12' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Kanit', sans-serif", color: '#1E293B' }}>
      
      {/* ── TOP NAV ── */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 90 }}>
        <div style={{ maxWidth: 1250, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexWrap: 'wrap', gap: 10 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#0A3A2F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 800 }}>M</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#0A3A2F' }}>Malin Plaza</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>Hylife Group Portal</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setLang(l => l === 'TH' ? 'EN' : 'TH')} style={{
              background: 'none', border: '1px solid #CBD5E1', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#475569'
            }}>
              {t.langBtn}
            </button>

            {!currentUser ? (
              <button onClick={() => { setIsStaffLogin(false); setLoginErrorMsg(''); setShowLoginModal(true); }} style={{
                background: '#0A3A2F', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}>
                {t.login}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>👤 {currentUser.username}</span>
                <button onClick={handleLogout} style={{
                  background: 'none', border: '1px solid #FCA5A5', color: '#E11D48', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                }}>
                  {t.logout}
                </button>
              </div>
            )}
          </div>

        </div>

        {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'BOD') && (
          <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ maxWidth: 1250, margin: '0 auto', display: 'flex', gap: 8, padding: '6px 20px' }}>
              <button onClick={() => setActiveTab('vendor')} style={{
                background: activeTab === 'vendor' ? '#0A3A2F' : 'transparent',
                color: activeTab === 'vendor' ? '#FFFFFF' : '#475569',
                border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>{t.tabMap}</button>

              {currentUser.role === 'ADMIN' && (
                <button onClick={() => setActiveTab('admin')} style={{
                  background: activeTab === 'admin' ? '#0A3A2F' : 'transparent',
                  color: activeTab === 'admin' ? '#FFFFFF' : '#475569',
                  border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}>{t.tabAdmin}</button>
              )}

              <button onClick={() => setActiveTab('dashboard')} style={{
                background: activeTab === 'dashboard' ? '#0A3A2F' : 'transparent',
                color: activeTab === 'dashboard' ? '#FFFFFF' : '#475569',
                border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>{t.tabDashboard}</button>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1250, margin: '0 auto', padding: '24px 20px' }}>
        
        {activeTab === 'vendor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Header banner */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A3A2F', margin: '0 0 8px' }}>{t.title}</h2>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, margin: 0 }}>{t.subtitle}</p>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              {[
                { label: t.totalStalls, val: totalStalls },
                { label: t.statsAvailable, val: availableCount, col: '#D97706' },
                { label: t.statsBooked, val: bookedCount, col: '#10B981' },
                { label: t.statsOccupancy, val: occupancy + '%' }
              ].map((m, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: m.col || '#1E293B', marginTop: 4 }}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Zone Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px' }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
                {zonesList.map(z => {
                  const isSelected = selectedZone === z.id;
                  return (
                    <button key={z.id} onClick={() => setSelectedZone(z.id)} style={{
                      whiteSpace: 'nowrap', padding: '6px 14px', borderRadius: 20,
                      border: isSelected ? '1px solid #0A3A2F' : '1px solid #E2E8F0',
                      background: isSelected ? '#0A3A2F' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}>
                      {z.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600, color: '#475569' }}>
                  <input type="checkbox" checked={vacantOnly} onChange={e => setVacantOnly(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#0A3A2F' }} />
                  {t.vacantOnly}
                </label>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', maxWidth: 300, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', background: '#FAFBFB' }}
                />
              </div>
            </div>

            {/* Split screen plan layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
              
              {/* Map Panel (Left: Custom Interactive SVG Seri Market Style) */}
              <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '16px', position: 'relative' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0A3A2F', margin: 0 }}>🗺️ {t.mapTitle}</h3>
                  
                  <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
                    <button onClick={() => handleZoom('out')} style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    <button onClick={() => handleZoom('reset')} style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11 }}>🏠</button>
                    <button onClick={() => handleZoom('in')} style={{ width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>

                {/* Viewport for SVG */}
                <div style={{ overflow: 'auto', minHeight: 480, maxHeight: 600, border: '1px solid #E2E8F0', borderRadius: 8, background: '#FAFBFB', position: 'relative' }}>
                  <div style={{
                    position: 'relative',
                    width: 850,
                    height: 550,
                    transform: `scale(${zoomScale})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.15s ease-out'
                  }}>
                    {/* SVG Graphic Map (Seri Market style vector diagram) */}
                    <svg viewBox="0 0 850 550" width="100%" height="100%" style={{ background: '#F1F5F9' }}>
                      {/* Grid background lines */}
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15, 56, 46, 0.03)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Main Pathways & Street labels */}
                      <rect x="0" y="240" width="850" height="40" fill="#FFFFFF" opacity="0.9" />
                      <text x="320" y="265" fill="#64748B" fontSize="13" fontWeight="800" letterSpacing="4">{t.pathway.toUpperCase()}</text>

                      {/* Entrance & Exit Markers */}
                      <polygon points="380,10 395,30 365,30" fill="#EF4444" />
                      <text x="410" y="25" fill="#EF4444" fontSize="11" fontWeight="800">MAIN ENTRANCE</text>

                      {/* Layout Zones labels */}
                      <text x="140" y="320" fill="#0A3A2F" fontSize="12" fontWeight="800" opacity="0.6">ZONE 1 (FASHION)</text>
                      <text x="240" y="210" fill="#B25000" fontSize="12" fontWeight="800" opacity="0.6">ZONE 2 (DIAGONAL)</text>
                      <text x="440" y="100" fill="#0A3A2F" fontSize="12" fontWeight="800" opacity="0.6">ZONE 10/11 (TOP)</text>
                      <text x="730" y="100" fill="#0A3A2F" fontSize="11" fontWeight="800" opacity="0.6">ZONE 12</text>

                      {/* Render stalls as vector rectangles with text inside */}
                      {filteredStalls.map(s => {
                        const isSelected = selectedStall && selectedStall.id === s.id;
                        const c = statusColors[s.status] || statusColors.MAINTENANCE;
                        
                        return (
                          <g 
                            key={s.id} 
                            onClick={() => handleStallClick(s)}
                            style={{ cursor: s.status === 'MAINTENANCE' ? 'not-allowed' : 'pointer' }}
                          >
                            <rect
                              x={s.x - s.w / 2}
                              y={s.y - s.h / 2}
                              width={s.w}
                              height={s.h}
                              transform={`rotate(${s.r || 0}, ${s.x}, ${s.y})`}
                              fill={c.fill}
                              stroke={isSelected ? '#E77A1F' : c.stroke}
                              strokeWidth={isSelected ? 3.5 : 1.5}
                              rx="3"
                              ry="3"
                              style={{ transition: 'all 0.15s' }}
                            />
                            <text
                              x={s.x}
                              y={s.y + 3}
                              transform={`rotate(${s.r || 0}, ${s.x}, ${s.y})`}
                              fill={c.text}
                              fontSize="8"
                              fontWeight="800"
                              textAnchor="middle"
                              style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                              {s.stall_number}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Detail Panel */}
              <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '20px', minHeight: 340, display: 'flex', flexDirection: 'column' }}>
                {!selectedStall ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#64748B', textAlign: 'center', gap: 10 }}>
                    <div style={{ fontSize: 28 }}>📋</div>
                    <p style={{ fontSize: 12, margin: 0 }}>{t.clickStallInfo}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0A3A2F', margin: 0, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' }}>
                        Stall: {selectedStall.stall_number}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>{t.zone}</span>
                          <strong style={{ color: '#1E293B' }}>{t.zone} {selectedStall.zone}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>{t.size}</span>
                          <strong style={{ color: '#1E293B' }}>{t.sizeVal}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748B' }}>{t.rent}</span>
                          <strong style={{ color: '#1E293B' }}>฿{selectedStall.price} / วัน</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748B' }}>{t.status}</span>
                          <span style={{
                            background: selectedStall.status === 'AVAILABLE' ? '#FEF3C7' : 
                                        selectedStall.status === 'PENDING' ? '#FEF08A' : 
                                        selectedStall.status === 'BOOKED' ? '#E7FDF4' : '#F1F5F9',
                            color: selectedStall.status === 'AVAILABLE' ? '#D97706' : 
                                   selectedStall.status === 'PENDING' ? '#78350F' : 
                                   selectedStall.status === 'BOOKED' ? '#10B981' : '#475569',
                            padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 10
                          }}>
                            {selectedStall.status === 'AVAILABLE' ? t.statusAvailable :
                             selectedStall.status === 'PENDING' ? t.statusPending :
                             selectedStall.status === 'BOOKED' ? t.statusBooked : t.statusMaintenance}
                          </span>
                        </div>

                        {selectedStall.bookedBy && (
                          <div style={{ background: '#FAFBFB', borderRadius: 8, padding: 10, marginTop: 8, border: '1px solid #E2E8F0' }}>
                            <div style={{ fontWeight: 700, color: '#0F382E' }}>👤 {t.colTenant}: {selectedStall.bookedBy}</div>
                            <div style={{ color: '#64748B', marginTop: 4 }}>📞 {t.colPhone}: {selectedStall.phone}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedStall.status === 'AVAILABLE' && (
                      <button onClick={() => setShowBookingForm(true)} style={{
                        background: '#0F382E', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 10, width: '100%'
                      }}>{t.bookBtn}</button>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ── TAB: STAFF VERIFICATION ── */}
        {activeTab === 'admin' && currentUser && currentUser.role === 'ADMIN' && (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F382E', marginBottom: 16 }}>{t.adminPanelTitle}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFBFB', textAlign: 'left' }}>
                    <th style={{ padding: 10 }}>{t.colStall}</th>
                    <th style={{ padding: 10 }}>{t.colName}</th>
                    <th style={{ padding: 10 }}>{t.colPhone}</th>
                    <th style={{ padding: 10 }}>{t.colAmount}</th>
                    <th style={{ padding: 10 }}>{t.colSlip}</th>
                    <th style={{ padding: 10 }}>{t.colStatus}</th>
                    <th style={{ padding: 10 }}>{t.colManage}</th>
                  </tr>
                </thead>
                <tbody>
                  {stalls.filter(s => s.status === 'PENDING').map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: 10, fontWeight: 700 }}>{s.stall_number}</td>
                      <td style={{ padding: 10 }}>{s.bookedBy}</td>
                      <td style={{ padding: 10 }}>{s.phone}</td>
                      <td style={{ padding: 10, fontWeight: 700 }}>฿{s.price}</td>
                      <td style={{ padding: 10 }}>
                        <a href="https://placehold.co/400x500/f8fafc/0f172a?text=Payment+Slip" target="_blank" rel="noreferrer" style={{ color: '#0F382E', fontWeight: 600 }}>View Slip</a>
                      </td>
                      <td style={{ padding: 10 }}>
                        <span style={{ background: '#FEF7E0', color: '#B06000', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700 }}>{t.statusPending}</span>
                      </td>
                      <td style={{ padding: 10 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleApprove(s.id, 'approve')} style={{ background: '#0F382E', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}>{t.approve}</button>
                          <button onClick={() => handleApprove(s.id, 'reject')} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }}>{t.reject}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ── POPUP: MEMBER LOGIN ── */}
      {showLoginModal && (
        <div onClick={() => setShowLoginModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: 12, padding: '24px', maxWidth: 360, width: '100%', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F382E', margin: '0 0 16px' }}>🔑 {t.loginModalTitle}</h3>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!isStaffLogin ? (
                <>
                  <input type="tel" required placeholder="081-234-5678" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} style={{
                    width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none'
                  }} />
                  
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="text" maxLength={6} placeholder="OTP Code" value={loginOtp} onChange={e => setLoginOtp(e.target.value)} style={{
                      flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', textAlign: 'center'
                    }} />
                    <button type="button" onClick={() => setOtpSent(true)} style={{
                      background: '#0F382E', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 11, cursor: 'pointer', fontWeight: 700
                    }}>{t.getOtp}</button>
                  </div>
                  <span style={{ fontSize: 10, color: '#64748B' }}>{t.otpNotice}</span>
                </>
              ) : (
                <>
                  <input type="text" required placeholder="Username" value={staffUser} onChange={e => setStaffUser(e.target.value)} style={{
                    width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none'
                  }} />
                  <input type="password" required placeholder="Password" value={staffPass} onChange={e => setStaffPass(e.target.value)} style={{
                    width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none'
                  }} />
                </>
              )}

              {loginErrorMsg && <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>{loginErrorMsg}</div>}

              <button type="submit" style={{
                background: '#0F382E', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 6
              }}>{t.submitLogin}</button>

              <div style={{ borderTop: '1px solid #E2E8F0', marginTop: 12, paddingTop: 12 }}>
                <span style={{ display: 'block', fontSize: 11, color: '#64748B', textAlign: 'center', marginBottom: 10 }}>{t.socialLogin}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button type="button" onClick={() => handleSocialLogin('Google')} style={{
                    background: '#FFFFFF', color: '#475569', border: '1px solid #CBD5E1', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                    <span>🌐</span> {t.googleLogin}
                  </button>
                  <button type="button" onClick={() => handleSocialLogin('Facebook')} style={{
                    background: '#1877F2', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                    <span>🔵</span> {t.facebookLogin}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button type="button" onClick={() => { setIsStaffLogin(!isStaffLogin); setLoginErrorMsg(''); }} style={{
                  background: 'none', border: 'none', color: '#0F382E', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'
                }}>
                  {isStaffLogin ? t.userLoginLink : t.staffLoginLink}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── POPUP: BOOKING FORM ── */}
      {showBookingForm && selectedStall && (
        <div onClick={() => setShowBookingForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: 12, padding: '24px', maxWidth: 400, width: '100%', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F382E', margin: '0 0 16px' }}>📝 {t.bookingFormTitle} ({selectedStall.stall_number})</h3>

            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{t.fullName}</label>
                <input type="text" required placeholder="e.g. John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{t.phoneLabel}</label>
                <input type="tel" required placeholder="e.g. 081-234-5678" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{t.citizenId}</label>
                <input type="text" required placeholder="13-Digit ID / Passport" value={form.citizenId} onChange={e => setForm(p => ({ ...p, citizenId: e.target.value }))} style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{t.paymentMethod}</label>
                <select value={form.paymentType} onChange={e => setForm(p => ({ ...p, paymentType: e.target.value }))} style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', background: '#FAFBFB'
                }}>
                  <option value="PROMPTPAY">PromptPay QR Code</option>
                  <option value="TRUEMONEY">TrueMoney Wallet</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{t.slipUpload}</label>
                <input type="file" required style={{ fontSize: 11 }} />
              </div>

              <span style={{ fontSize: 10, color: '#64748B' }}>{t.pdpaNotice}</span>

              {formMsg && <div style={{ fontSize: 11, color: '#137333', fontWeight: 600 }}>{formMsg}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowBookingForm(false)} style={{
                  background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}>{t.cancel}</button>
                
                <button type="submit" disabled={loading} style={{
                  background: '#0F382E', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
                }}>{loading ? t.loadingBooking : t.confirmBooking}</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB', color: '#64748B', fontSize: 11, textAlign: 'center', padding: '20px', marginTop: 40 }}>
        © 2026 Hylife Malin Plaza Rental System · Managed by Hylife Group · All Rights Reserved
      </footer>

    </div>
  );
}
