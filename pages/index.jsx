import React, { useState, useEffect } from 'react';

// ======================================================
//  MALIN PLAZA – INITIAL_STALLS
//  Coordinates mapped to the real DWG layout plan
//  viewBox="0 0 1100 700"  (landscape, diagonal building)
//
//  Layout orientation: building rotates ~30° CW from north
//  Zones arranged from bottom-left (Zone A/1) to top-right (Zone B/2/outer)
//
//  Each stall: { id, stall_number, zone, price, status,
//               x, y (center), w, h (dims), r (rotation°) }
// ======================================================

// Helper to generate a row of stalls along a diagonal axis
// startX, startY = center of first stall; count = num stalls
// stepX, stepY = how much to move per stall
// zone, price, r, w, h = shared properties
function makeRow(prefix, zone, startX, startY, count, stepX, stepY, r, w, h, price, overrides = {}) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}_${i + 1}`,
    stall_number: `${zone}-${String(i + 1).padStart(2, '0')}`,
    zone,
    price,
    status: 'AVAILABLE',
    x: Math.round(startX + stepX * i),
    y: Math.round(startY + stepY * i),
    w, h, r,
    ...(overrides[i] || {}),
  }));
}

const INITIAL_STALLS = [
  // ──────────────────────────────────────────────────
  // ZONE A  –  ล็อกใหญ่แถวซ้าย (Blue zone in DWG)
  //  ~30 stalls, oriented ~-30° from horizontal
  //  Runs from bottom-left toward center-right
  // ──────────────────────────────────────────────────
  ...makeRow('zA', 'A', 120, 540, 8, 26, -14, -30, 24, 40, 300, {
    2: { status: 'BOOKED', bookedBy: 'สมชาย เครื่องหนัง', phone: '081-001-0001', paymentType: 'PromptPay' },
    5: { status: 'PENDING', bookedBy: 'วาสนา แฟชั่น', phone: '081-001-0002', paymentType: 'TrueMoney' },
  }),
  ...makeRow('zA2', 'A', 147, 546, 8, 26, -14, -30, 24, 40, 300, {
    0: { stall_number: 'A-09' },
    1: { stall_number: 'A-10', status: 'BOOKED', bookedBy: 'นพดล ผ้าไทย', phone: '081-001-0003', paymentType: 'PromptPay' },
    2: { stall_number: 'A-11' },
    3: { stall_number: 'A-12' },
    4: { stall_number: 'A-13' },
    5: { stall_number: 'A-14' },
    6: { stall_number: 'A-15' },
    7: { stall_number: 'A-16' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE B  –  ล็อกกลางแถวใหญ่ (Blue/Orange center rows)
  //  Main diagonal stall block, ~40 stalls per row, 3 rows
  // ──────────────────────────────────────────────────
  ...makeRow('zB1', 'B', 200, 500, 14, 28, -15, -30, 26, 44, 280, {
    0: { status: 'BOOKED', bookedBy: 'เจ๊อ้อย อาหารใต้', phone: '082-002-0001', paymentType: 'PromptPay' },
    3: { status: 'PENDING', bookedBy: 'กิตติ เสื้อยืด', phone: '082-002-0002', paymentType: 'TrueMoney' },
    8: { status: 'BOOKED', bookedBy: 'แม่เล็ก ขนม', phone: '082-002-0003', paymentType: 'PromptPay' },
    11: { status: 'MAINTENANCE' },
  }),
  ...makeRow('zB2', 'B', 228, 507, 14, 28, -15, -30, 26, 44, 280, {
    0: { stall_number: 'B-15' },
    1: { stall_number: 'B-16' },
    2: { stall_number: 'B-17', status: 'BOOKED', bookedBy: 'ป้าแดง กับข้าว', phone: '082-002-0004', paymentType: 'PromptPay' },
    3: { stall_number: 'B-18' },
    4: { stall_number: 'B-19' },
    5: { stall_number: 'B-20' },
    6: { stall_number: 'B-21' },
    7: { stall_number: 'B-22' },
    8: { stall_number: 'B-23' },
    9: { stall_number: 'B-24' },
    10: { stall_number: 'B-25' },
    11: { stall_number: 'B-26' },
    12: { stall_number: 'B-27' },
    13: { stall_number: 'B-28' },
  }),
  ...makeRow('zB3', 'B', 256, 514, 14, 28, -15, -30, 26, 44, 280, {
    0: { stall_number: 'B-29' },
    1: { stall_number: 'B-30', status: 'PENDING', bookedBy: 'สุดา เครื่องสำอาง', phone: '082-002-0005', paymentType: 'TrueMoney' },
    2: { stall_number: 'B-31' },
    3: { stall_number: 'B-32' },
    4: { stall_number: 'B-33' },
    5: { stall_number: 'B-34' },
    6: { stall_number: 'B-35' },
    7: { stall_number: 'B-36' },
    8: { stall_number: 'B-37' },
    9: { stall_number: 'B-38' },
    10: { stall_number: 'B-39' },
    11: { stall_number: 'B-40' },
    12: { stall_number: 'B-41', status: 'BOOKED', bookedBy: 'มานพ รองเท้า', phone: '082-002-0006', paymentType: 'PromptPay' },
    13: { stall_number: 'B-42' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE C  –  แถวกลางขวา (Orange zone)
  //  Diagonal rows, rotated ~-30°
  // ──────────────────────────────────────────────────
  ...makeRow('zC1', 'C', 390, 460, 12, 28, -15, -30, 26, 44, 250, {
    1: { status: 'BOOKED', bookedBy: 'ยุวดี ผักสด', phone: '083-003-0001', paymentType: 'PromptPay' },
    4: { status: 'PENDING', bookedBy: 'อนุชา กล้วยทอด', phone: '083-003-0002', paymentType: 'TrueMoney' },
    9: { status: 'MAINTENANCE' },
  }),
  ...makeRow('zC2', 'C', 418, 467, 12, 28, -15, -30, 26, 44, 250, {
    0: { stall_number: 'C-13' },
    1: { stall_number: 'C-14' },
    2: { stall_number: 'C-15', status: 'BOOKED', bookedBy: 'บุปผา ดอกไม้', phone: '083-003-0003', paymentType: 'PromptPay' },
    3: { stall_number: 'C-16' },
    4: { stall_number: 'C-17' },
    5: { stall_number: 'C-18' },
    6: { stall_number: 'C-19' },
    7: { stall_number: 'C-20' },
    8: { stall_number: 'C-21' },
    9: { stall_number: 'C-22' },
    10: { stall_number: 'C-23' },
    11: { stall_number: 'C-24' },
  }),
  ...makeRow('zC3', 'C', 446, 474, 12, 28, -15, -30, 26, 44, 250, {
    0: { stall_number: 'C-25' },
    1: { stall_number: 'C-26' },
    2: { stall_number: 'C-27' },
    3: { stall_number: 'C-28', status: 'PENDING', bookedBy: 'เจริญ อาหารอีสาน', phone: '083-003-0004', paymentType: 'PromptPay' },
    4: { stall_number: 'C-29' },
    5: { stall_number: 'C-30' },
    6: { stall_number: 'C-31' },
    7: { stall_number: 'C-32' },
    8: { stall_number: 'C-33' },
    9: { stall_number: 'C-34' },
    10: { stall_number: 'C-35' },
    11: { stall_number: 'C-36' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE D  –  แถวบนขวา (Pink/Magenta zone — ของฝาก)
  //  Upper-right block, rotated ~-30°
  // ──────────────────────────────────────────────────
  ...makeRow('zD1', 'D', 570, 380, 10, 28, -15, -30, 26, 44, 320, {
    0: { status: 'BOOKED', bookedBy: 'ดารารัตน์ ของที่ระลึก', phone: '084-004-0001', paymentType: 'PromptPay' },
    3: { status: 'PENDING', bookedBy: 'ไชยา เครื่องดื่ม', phone: '084-004-0002', paymentType: 'TrueMoney' },
  }),
  ...makeRow('zD2', 'D', 598, 387, 10, 28, -15, -30, 26, 44, 320, {
    0: { stall_number: 'D-11' },
    1: { stall_number: 'D-12', status: 'BOOKED', bookedBy: 'วรรณา สินค้าแฮนด์เมด', phone: '084-004-0003', paymentType: 'PromptPay' },
    2: { stall_number: 'D-13' },
    3: { stall_number: 'D-14' },
    4: { stall_number: 'D-15' },
    5: { stall_number: 'D-16' },
    6: { stall_number: 'D-17' },
    7: { stall_number: 'D-18' },
    8: { stall_number: 'D-19' },
    9: { stall_number: 'D-20' },
  }),
  ...makeRow('zD3', 'D', 626, 394, 10, 28, -15, -30, 26, 44, 320, {
    0: { stall_number: 'D-21' },
    1: { stall_number: 'D-22' },
    2: { stall_number: 'D-23', status: 'MAINTENANCE' },
    3: { stall_number: 'D-24' },
    4: { stall_number: 'D-25' },
    5: { stall_number: 'D-26' },
    6: { stall_number: 'D-27' },
    7: { stall_number: 'D-28' },
    8: { stall_number: 'D-29' },
    9: { stall_number: 'D-30' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE E  –  แถวบนสุด (Yellow/เสื้อผ้า)
  //  Long narrow rows at top-right corner
  // ──────────────────────────────────────────────────
  ...makeRow('zE1', 'E', 700, 290, 9, 28, -15, -30, 26, 40, 350, {
    1: { status: 'BOOKED', bookedBy: 'อรวรรณ ผ้าไหม', phone: '085-005-0001', paymentType: 'PromptPay' },
    5: { status: 'PENDING', bookedBy: 'สมศักดิ์ เสื้อโปโล', phone: '085-005-0002', paymentType: 'TrueMoney' },
  }),
  ...makeRow('zE2', 'E', 728, 297, 9, 28, -15, -30, 26, 40, 350, {
    0: { stall_number: 'E-10' },
    1: { stall_number: 'E-11' },
    2: { stall_number: 'E-12', status: 'BOOKED', bookedBy: 'รุจิรา กระเป๋า', phone: '085-005-0003', paymentType: 'PromptPay' },
    3: { stall_number: 'E-13' },
    4: { stall_number: 'E-14' },
    5: { stall_number: 'E-15' },
    6: { stall_number: 'E-16' },
    7: { stall_number: 'E-17' },
    8: { stall_number: 'E-18' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE F  –  มุมขวาบน (Corner block – เครื่องประดับ)
  //  Smaller rotated block at very top-right
  // ──────────────────────────────────────────────────
  ...makeRow('zF1', 'F', 830, 200, 6, 24, -13, -30, 22, 36, 400, {
    0: { status: 'BOOKED', bookedBy: 'ชลิตา เครื่องเงิน', phone: '086-006-0001', paymentType: 'PromptPay' },
    2: { status: 'MAINTENANCE' },
  }),
  ...makeRow('zF2', 'F', 854, 207, 6, 24, -13, -30, 22, 36, 400, {
    0: { stall_number: 'F-07' },
    1: { stall_number: 'F-08', status: 'PENDING', bookedBy: 'ปนัดดา ผ้าซิ่น', phone: '086-006-0002', paymentType: 'TrueMoney' },
    2: { stall_number: 'F-09' },
    3: { stall_number: 'F-10' },
    4: { stall_number: 'F-11' },
    5: { stall_number: 'F-12' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE G  –  ล็อกริมซ้ายล่าง (อาหาร/เครื่องดื่ม)
  //  Bottom-left strip, more horizontal
  // ──────────────────────────────────────────────────
  ...makeRow('zG1', 'G', 80, 580, 10, 30, -5, -30, 28, 36, 200, {
    2: { status: 'BOOKED', bookedBy: 'เพ็ญ ก๋วยเตี๋ยว', phone: '087-007-0001', paymentType: 'PromptPay' },
    6: { status: 'PENDING', bookedBy: 'บำรุง ข้าวมันไก่', phone: '087-007-0002', paymentType: 'TrueMoney' },
  }),
  ...makeRow('zG2', 'G', 80, 608, 10, 30, -5, -30, 28, 36, 200, {
    0: { stall_number: 'G-11' },
    1: { stall_number: 'G-12' },
    2: { stall_number: 'G-13', status: 'BOOKED', bookedBy: 'เมธา ส้มตำ', phone: '087-007-0003', paymentType: 'PromptPay' },
    3: { stall_number: 'G-14' },
    4: { stall_number: 'G-15' },
    5: { stall_number: 'G-16' },
    6: { stall_number: 'G-17' },
    7: { stall_number: 'G-18' },
    8: { stall_number: 'G-19' },
    9: { stall_number: 'G-20' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE H  –  ล็อกกลางล่าง (อาหาร strip กลาง)
  // ──────────────────────────────────────────────────
  ...makeRow('zH1', 'H', 310, 555, 12, 30, -5, -30, 28, 36, 220, {
    1: { status: 'BOOKED', bookedBy: 'ลัดดา ข้าวราดแกง', phone: '088-008-0001', paymentType: 'PromptPay' },
    4: { status: 'PENDING', bookedBy: 'ชัย สุกี้', phone: '088-008-0002', paymentType: 'TrueMoney' },
    9: { status: 'MAINTENANCE' },
  }),
  ...makeRow('zH2', 'H', 310, 583, 12, 30, -5, -30, 28, 36, 220, {
    0: { stall_number: 'H-13' },
    1: { stall_number: 'H-14', status: 'BOOKED', bookedBy: 'นงนุช ขนมจีน', phone: '088-008-0003', paymentType: 'PromptPay' },
    2: { stall_number: 'H-15' },
    3: { stall_number: 'H-16' },
    4: { stall_number: 'H-17' },
    5: { stall_number: 'H-18' },
    6: { stall_number: 'H-19' },
    7: { stall_number: 'H-20' },
    8: { stall_number: 'H-21' },
    9: { stall_number: 'H-22' },
    10: { stall_number: 'H-23' },
    11: { stall_number: 'H-24' },
  }),

  // ──────────────────────────────────────────────────
  // ZONE I  –  อาคารขนาดใหญ่ด้านขวาล่าง (โซนน้ำ/ของสด)
  // ──────────────────────────────────────────────────
  ...makeRow('zI1', 'I', 540, 510, 10, 30, -5, -30, 28, 36, 180, {
    0: { status: 'BOOKED', bookedBy: 'อุทัย ผักสด', phone: '089-009-0001', paymentType: 'PromptPay' },
    3: { status: 'PENDING', bookedBy: 'เกศรา ผลไม้', phone: '089-009-0002', paymentType: 'TrueMoney' },
  }),
  ...makeRow('zI2', 'I', 540, 538, 10, 30, -5, -30, 28, 36, 180, {
    0: { stall_number: 'I-11' },
    1: { stall_number: 'I-12' },
    2: { stall_number: 'I-13', status: 'BOOKED', bookedBy: 'ปรียา ของสด', phone: '089-009-0003', paymentType: 'PromptPay' },
    3: { stall_number: 'I-14' },
    4: { stall_number: 'I-15' },
    5: { stall_number: 'I-16' },
    6: { stall_number: 'I-17' },
    7: { stall_number: 'I-18' },
    8: { stall_number: 'I-19' },
    9: { stall_number: 'I-20' },
  }),
];

// Initial mock data for bookings
const MOCK_BOOKINGS = [
  { id: 'bk_1', stall_number: '1-03', vendor_name: 'เก๋ แฟชั่น', phone: '081-111-2222', booking_date: new Date().toISOString().split('T')[0], status: 'BOOKED', payment_type: 'PromptPay', amount: 250, slip_url: 'https://placehold.co/400x500/f8fafc/0f172a?text=Payment+Slip' },
  { id: 'bk_2', stall_number: '1-05', vendor_name: 'นัท เสื้อผ้า', phone: '082-222-3333', booking_date: new Date().toISOString().split('T')[0], status: 'PENDING', payment_type: 'TrueMoney', amount: 250, slip_url: 'https://placehold.co/400x500/f8fafc/0f172a?text=Payment+Slip' }
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
    allZones: 'ทุกโซน',
    allStatuses: 'ทุกสถานะ',
    filterStatus: 'กรองตามสถานะ',
    vacantOnly: 'เฉพาะล็อกว่าง',
    searchPlaceholder: 'ค้นหาเลขล็อก...',
    totalStalls: 'ล็อกทั้งหมด',
    colTenant: 'ผู้เช่า',
    bookBtn: 'จองล็อกนี้ทันที',
    slipUpload: 'อัปโหลดสลิปการโอนเงิน',
    otpNotice: '* สำหรับทดสอบใช้งาน กดรับ OTP แล้วกรอก 123456',
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
    allZones: 'All Zones',
    allStatuses: 'All Statuses',
    filterStatus: 'Filter by Status',
    vacantOnly: 'Vacant Only',
    searchPlaceholder: 'Search stall number...',
    totalStalls: 'Total Stalls',
    colTenant: 'Tenant',
    bookBtn: 'Book Stall Now',
    slipUpload: 'Upload Payment Slip',
    otpNotice: '* For testing: Click Get OTP then enter 123456',
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
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [vacantOnly, setVacantOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Admin Vendor Whitelist Management States
  const [adminVendors, setAdminVendors] = useState([]);
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorName, setNewVendorName] = useState('');
  const [adminSubTab, setAdminSubTab] = useState('bookings'); // 'bookings' or 'users'
  const [adminUserLoading, setAdminUserLoading] = useState(false);

  const fetchAdminVendors = async () => {
    try {
      setAdminUserLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setAdminVendors(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdminUserLoading(false);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!newVendorPhone) return alert('กรุณาระบุเบอร์โทรศัพท์');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: newVendorPhone,
          display_name: newVendorName || 'ผู้ค้าที่ลงทะเบียน',
          status: 'approved'
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ เพิ่มเบอร์ผู้ค้าเข้าสู่ระบบสำเร็จ! ผู้ค้าสามารถกด Login LINE เข้ามาจับคู่เบอร์นี้ได้ทันที');
        setNewVendorPhone('');
        setNewVendorName('');
        fetchAdminVendors();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!confirm('ยืนยันที่จะลบข้อมูลผู้ค้ารายนี้?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminVendors();
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  useEffect(() => {
    // 1. ตรวจสอบ user จาก LocalStorage
    const savedUser = localStorage.getItem('malin_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    // 2. ตรวจสอบ callback จาก LINE Login
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const loginStatus = urlParams.get('login');
      const userParam = urlParams.get('user');

      if (loginStatus === 'success' && userParam) {
        try {
          const userObj = JSON.parse(decodeURIComponent(userParam));
          const userData = {
            username: userObj.display_name || 'ผู้ใช้งาน LINE',
            role: userObj.role || 'vendor',
            avatar: userObj.avatar_url,
            line_user_id: userObj.line_user_id
          };
          setCurrentUser(userData);
          localStorage.setItem('malin_user', JSON.stringify(userData));
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Failed to parse user data', err);
        }
      } else if (loginStatus === 'error') {
        const errorMsg = urlParams.get('message') || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
        alert('❌ LINE Login Error: ' + decodeURIComponent(errorMsg));
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Booking Forms
  const [form, setForm] = useState({ name: '', phone: '', citizenId: '', paymentType: 'PROMPTPAY' });
  const [formMsg, setFormMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredStalls = stalls.filter(s => {
    if (selectedZone !== 'ALL' && s.zone !== selectedZone) return false;
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    if (vacantOnly && s.status !== 'AVAILABLE') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchNumber = s.stall_number.toLowerCase().includes(q);
      const matchTenant = s.bookedBy && s.bookedBy.toLowerCase().includes(q);
      if (!matchNumber && !matchTenant) return false;
    }
    return true;
  });

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

  const handleRequestOtp = async () => {
    if (!loginPhone) {
      setLoginErrorMsg('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    setLoginErrorMsg('');
    try {
      const res = await fetch('/api/line/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: loginPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setLoginErrorMsg(`✅ ${data.message || 'ส่งรหัส OTP เรียบร้อยแล้ว'}`);
      } else {
        setLoginErrorMsg(data.message || 'เกิดข้อผิดพลาดในการส่ง OTP');
      }
    } catch (err) {
      console.error(err);
      // Fallback สำหรับกรณี Offline หรือ API Error
      setOtpSent(true);
      setLoginErrorMsg('✅ ส่ง OTP สำเร็จ (ใช้รหัสทดสอบ: 123456)');
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('malin_user');
    }
    setActiveTab('vendor');
    setLoginPhone('');
    setLoginOtp('');
    setOtpSent(false);
    setStaffUser('');
    setStaffPass('');
  };

  // Status colors — override zone colors when not AVAILABLE
  const statusColors = {
    AVAILABLE:   null, // → will use zoneColors below
    PENDING:     { fill: '#FEF08A', stroke: '#EAB308', text: '#713F12' },
    BOOKED:      { fill: '#BBF7D0', stroke: '#16A34A', text: '#14532D' },
    MAINTENANCE: { fill: '#E2E8F0', stroke: '#94A3B8', text: '#475569' },
  };

  // Zone-based fill colors matching the DWG color scheme
  const zoneColors = {
    A: { fill: '#60A5FA', stroke: '#2563EB', text: '#1E3A8A' }, // Blue
    B: { fill: '#93C5FD', stroke: '#3B82F6', text: '#1E3A8A' }, // Light blue
    C: { fill: '#FCA5A1', stroke: '#EF4444', text: '#7F1D1D' }, // Red/Orange
    D: { fill: '#F9A8D4', stroke: '#EC4899', text: '#831843' }, // Pink/Magenta
    E: { fill: '#FDE68A', stroke: '#F59E0B', text: '#78350F' }, // Yellow
    F: { fill: '#C4B5FD', stroke: '#7C3AED', text: '#4C1D95' }, // Purple
    G: { fill: '#6EE7B7', stroke: '#10B981', text: '#064E3B' }, // Green
    H: { fill: '#86EFAC', stroke: '#22C55E', text: '#14532D' }, // Light green
    I: { fill: '#A7F3D0', stroke: '#34D399', text: '#065F46' }, // Teal
  };

  const getStallColor = (s) => {
    if (s.status === 'PENDING') return statusColors.PENDING;
    if (s.status === 'BOOKED') return statusColors.BOOKED;
    if (s.status === 'MAINTENANCE') return statusColors.MAINTENANCE;
    return zoneColors[s.zone] || { fill: '#F59E0B', stroke: '#D97706', text: '#FFFFFF' };
  };

  const zonesList = [
    { id: 'ALL', label: t.allZones },
    { id: 'A', label: 'โซน A (แฟชั่น/หนัง)' },
    { id: 'B', label: 'โซน B (อาหาร/เสื้อผ้า)' },
    { id: 'C', label: 'โซน C (อาหาร/ของฝาก)' },
    { id: 'D', label: 'โซน D (ของที่ระลึก)' },
    { id: 'E', label: 'โซน E (ผ้าไหม/กระเป๋า)' },
    { id: 'F', label: 'โซน F (เครื่องประดับ)' },
    { id: 'G', label: 'โซน G (อาหาร/เครื่องดื่ม)' },
    { id: 'H', label: 'โซน H (อาหาร)' },
    { id: 'I', label: 'โซน I (ของสด/ผัก)' },
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
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #0A3A2F' }} />
                ) : (
                  <span style={{ fontSize: 13 }}>👤</span>
                )}
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F382E' }}>{currentUser.username}</span>
                <button onClick={handleLogout} style={{
                  background: 'none', border: '1px solid #FCA5A5', color: '#E11D48', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                }}>
                  {t.logout}
                </button>
              </div>
            )}
          </div>

        </div>

        {currentUser && (
          <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ maxWidth: 1250, margin: '0 auto', display: 'flex', gap: 8, padding: '6px 20px', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveTab('vendor')} style={{
                background: activeTab === 'vendor' ? '#0A3A2F' : 'transparent',
                color: activeTab === 'vendor' ? '#FFFFFF' : '#475569',
                border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>🗺️ {lang === 'TH' ? 'ผังจองล็อก' : 'Stall Map'}</button>

              <button onClick={() => setActiveTab('my-bookings')} style={{
                background: activeTab === 'my-bookings' ? '#0A3A2F' : 'transparent',
                color: activeTab === 'my-bookings' ? '#FFFFFF' : '#475569',
                border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>📑 {lang === 'TH' ? 'ประวัติการจองของฉัน' : 'My Bookings'}</button>

              <button onClick={() => setActiveTab('profile')} style={{
                background: activeTab === 'profile' ? '#0A3A2F' : 'transparent',
                color: activeTab === 'profile' ? '#FFFFFF' : '#475569',
                border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
              }}>👤 {lang === 'TH' ? 'ข้อมูลส่วนตัว' : 'My Profile'}</button>

              {currentUser.role === 'ADMIN' && (
                <button onClick={() => setActiveTab('admin')} style={{
                  background: activeTab === 'admin' ? '#0A3A2F' : 'transparent',
                  color: activeTab === 'admin' ? '#FFFFFF' : '#475569',
                  border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}>👮 {t.tabAdmin}</button>
              )}

              {(currentUser.role === 'ADMIN' || currentUser.role === 'BOD') && (
                <button onClick={() => setActiveTab('dashboard')} style={{
                  background: activeTab === 'dashboard' ? '#0A3A2F' : 'transparent',
                  color: activeTab === 'dashboard' ? '#FFFFFF' : '#475569',
                  border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                }}>📊 {t.tabDashboard}</button>
              )}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600, color: '#475569' }}>
                    <input type="checkbox" checked={vacantOnly} onChange={e => setVacantOnly(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#0A3A2F' }} />
                    {t.vacantOnly}
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>{t.filterStatus}:</span>
                    <select
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                      style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', background: '#FFFFFF', fontWeight: 600, color: '#1E293B' }}
                    >
                      <option value="ALL">-- {t.allStatuses} --</option>
                      <option value="AVAILABLE">🟡 {t.statusAvailable}</option>
                      <option value="PENDING">🟡 {t.statusPending}</option>
                      <option value="BOOKED">🟢 {t.statusBooked}</option>
                      <option value="MAINTENANCE">⚪ {t.statusMaintenance}</option>
                    </select>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', maxWidth: 260, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', background: '#FAFBFB' }}
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
                <div style={{ overflow: 'auto', minHeight: 600, maxHeight: 800, border: '1px solid #E2E8F0', borderRadius: 8, background: '#EEF2F7', position: 'relative' }}>
                  <div style={{
                    position: 'relative',
                    width: 800,
                    height: 1100,
                    transform: `scale(${zoomScale})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.15s ease-out'
                  }}>
                    {/* SVG Graphic Map – Malin Plaza DWG-style rotated straight layout (Portrait orientation like DWG document) */}
                    <svg viewBox="0 0 800 1100" width="800" height="1100" style={{ background: '#EEF2F7' }}>
                      {/* Grid */}
                      <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(15,56,46,0.05)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Main Group rotated 35deg around center to make the diagonal layout straight vertically */}
                      <g transform="translate(180, 50) rotate(35, 450, 450)">
                        {/* ── SITE BOUNDARY (diagonal building footprint) ── */}
                        <polygon
                          points="60,650 950,650 1060,440 950,30 160,30 50,250"
                          fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" strokeDasharray="8,4" opacity="0.9"
                        />

                        {/* ── MAIN PATHWAYS & ROADS ── */}
                        <rect x="50" y="630" width="960" height="30" fill="#CBD5E1" opacity="0.6" rx="2"/>
                        <text x="400" y="650" fill="#475569" fontSize="11" fontWeight="700">ถ.ห้วยแก้ว (HUAY KAEW RD.)</text>

                        <rect x="960" y="30" width="30" height="600" fill="#CBD5E1" opacity="0.5" rx="2"/>

                        {/* Internal diagonal path between Zone B and C */}
                        <line x1="180" y1="480" x2="900" y2="310" stroke="#E2E8F0" strokeWidth="18" strokeLinecap="round"/>
                        <line x1="180" y1="480" x2="900" y2="310" stroke="#F8FAFC" strokeWidth="14" strokeLinecap="round" opacity="0.9"/>
                        <text x="420" y="424" fill="#64748B" fontSize="11" fontWeight="800" transform="rotate(-8,420,424)">ทางเดินหลัก</text>

                        <line x1="60" y1="560" x2="990" y2="490" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round"/>
                        <line x1="60" y1="560" x2="990" y2="490" stroke="#F8FAFC" strokeWidth="10" strokeLinecap="round" opacity="0.9"/>

                        {/* ── ENTRANCE / EXIT ── */}
                        <polygon points="100,630 125,655 75,655" fill="#EF4444" />
                        <text x="130" y="652" fill="#EF4444" fontSize="11" fontWeight="800">ENTRANCE</text>
                        <rect x="880" y="50" width="60" height="22" rx="4" fill="#0A3A2F" opacity="0.8"/>
                        <text x="887" y="65" fill="#FFFFFF" fontSize="9" fontWeight="700">EXIT (CMU)</text>

                        {/* ── ZONE LABELS ── */}
                        <text x="105" y="520" fill="#1D4ED8" fontSize="12" fontWeight="800" transform="rotate(-30,105,520)">ZONE A</text>
                        <text x="210" y="470" fill="#1D4ED8" fontSize="12" fontWeight="800" transform="rotate(-30,210,470)">ZONE B</text>
                        <text x="400" y="435" fill="#D97706" fontSize="12" fontWeight="800" transform="rotate(-30,400,435)">ZONE C</text>
                        <text x="575" y="360" fill="#BE185D" fontSize="12" fontWeight="800" transform="rotate(-30,575,360)">ZONE D</text>
                        <text x="705" y="270" fill="#D97706" fontSize="12" fontWeight="800" transform="rotate(-30,705,270)">ZONE E</text>
                        <text x="835" y="185" fill="#7C3AED" fontSize="12" fontWeight="800" transform="rotate(-30,835,185)">ZONE F</text>
                        <text x="85" y="575" fill="#059669" fontSize="12" fontWeight="800">ZONE G</text>
                        <text x="320" y="545" fill="#059669" fontSize="12" fontWeight="800">ZONE H</text>
                        <text x="550" y="500" fill="#059669" fontSize="12" fontWeight="800">ZONE I</text>

                        {/* ── FACILITY MARKERS ── */}
                        <rect x="30" y="50" width="55" height="30" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5"/>
                        <text x="34" y="68" fill="#92400E" fontSize="9" fontWeight="700">🅿️ จอดรถ</text>
                        <rect x="30" y="90" width="55" height="25" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                        <text x="36" y="106" fill="#1E40AF" fontSize="9" fontWeight="700">🚻 ห้องน้ำ</text>

                        {/* Render stalls inside rotated group */}
                        {filteredStalls.map(s => {
                          const isSelected = selectedStall && selectedStall.id === s.id;
                          const c = getStallColor(s);
                          
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
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', alignSelf: 'center', marginRight: 4 }}>สถานะ:</div>
                  {[
                    { color: '#BBF7D0', border: '#16A34A', label: t.statusBooked },
                    { color: '#FEF08A', border: '#EAB308', label: t.statusPending },
                    { color: '#E2E8F0', border: '#94A3B8', label: t.statusMaintenance },
                    { color: '#60A5FA', border: '#2563EB', label: `${t.statusAvailable} (Zone A/B)` },
                    { color: '#FCA5A1', border: '#EF4444', label: `${t.statusAvailable} (Zone C)` },
                    { color: '#F9A8D4', border: '#EC4899', label: `${t.statusAvailable} (Zone D)` },
                    { color: '#FDE68A', border: '#F59E0B', label: `${t.statusAvailable} (Zone E)` },
                    { color: '#6EE7B7', border: '#10B981', label: `${t.statusAvailable} (Zone G-I)` },
                  ].map((leg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 12, height: 12, background: leg.color, border: `1.5px solid ${leg.border}`, borderRadius: 2 }} />
                      <span style={{ fontSize: 10, color: '#475569' }}>{leg.label}</span>
                    </div>
                  ))}
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

        {/* ── TAB: MY BOOKINGS ── */}
        {activeTab === 'my-bookings' && (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F382E', margin: 0 }}>📑 {lang === 'TH' ? 'ประวัติการจองล็อกของฉัน' : 'My Booking Records'}</h2>
                <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{lang === 'TH' ? 'ตรวจสอบสถานะคำขอจอง สลิปโอนเงิน และใบเสร็จ' : 'Track your stall booking status and payment slips'}</p>
              </div>
              <button onClick={() => setActiveTab('vendor')} style={{
                background: '#0F382E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}>+ {lang === 'TH' ? 'จองล็อกเพิ่ม' : 'Book New Stall'}</button>
            </div>

            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                <div>{lang === 'TH' ? 'ยังไม่มีรายการจองล็อกในระบบ' : 'No booking history found'}</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#F8FAFC', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', color: '#475569' }}>{t.colStall}</th>
                      <th style={{ padding: '12px 10px', color: '#475569' }}>{t.colDate}</th>
                      <th style={{ padding: '12px 10px', color: '#475569' }}>{t.colAmount}</th>
                      <th style={{ padding: '12px 10px', color: '#475569' }}>{t.colPayment}</th>
                      <th style={{ padding: '12px 10px', color: '#475569' }}>{t.colStatus}</th>
                      <th style={{ padding: '12px 10px', color: '#475569' }}>{t.colSlip}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 800, color: '#0F382E' }}>{b.stall_number}</td>
                        <td style={{ padding: '12px 10px', color: '#475569' }}>{b.booking_date || selectedDate}</td>
                        <td style={{ padding: '12px 10px', fontWeight: 700 }}>฿{b.amount || 300}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{b.payment_type || 'PROMPTPAY'}</span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            background: b.status === 'APPROVED' ? '#DCFCE7' : b.status === 'PENDING' ? '#FEF08A' : '#FEE2E2',
                            color: b.status === 'APPROVED' ? '#166534' : b.status === 'PENDING' ? '#854D0E' : '#991B1B',
                            padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700
                          }}>
                            {b.status === 'APPROVED' ? '✅ ' + t.approvedLabel : b.status === 'PENDING' ? '⏳ ' + t.pendingLabel : '❌ ' + t.rejectedLabel}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <a href={b.slip_url || 'https://placehold.co/400x500/f8fafc/0f172a?text=Payment+Slip'} target="_blank" rel="noreferrer" style={{ color: '#0A3A2F', fontWeight: 600, textDecoration: 'underline', fontSize: 12 }}>
                            🔍 {lang === 'TH' ? 'ดูหลักฐาน' : 'View Slip'}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: USER PROFILE ── */}
        {activeTab === 'profile' && currentUser && (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '28px', maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F382E', marginBottom: 20 }}>👤 {lang === 'TH' ? 'ข้อมูลโปรไฟล์ผู้ค้า' : 'Vendor Profile'}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #F1F5F9' }}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #0A3A2F' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0A3A2F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                  {currentUser.username ? currentUser.username.charAt(0) : 'U'}
                </div>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{currentUser.username}</div>
                <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, marginTop: 2 }}>🟢 {lang === 'TH' ? 'เชื่อมต่อ LINE สำเร็จ' : 'LINE Account Connected'}</div>
                {currentUser.line_user_id && <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, fontFamily: 'monospace' }}>LINE UID: {currentUser.line_user_id}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{lang === 'TH' ? 'ชื่อที่แสดงในระบบ' : 'Display Name'}</label>
                <input type="text" readOnly value={currentUser.username} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{lang === 'TH' ? 'บทบาทผู้ใช้' : 'Role'}</label>
                <input type="text" readOnly value={currentUser.role === 'ADMIN' ? 'เจ้าหน้าที่ดูแลระบบ (Admin)' : currentUser.role === 'BOD' ? 'คณะผู้บริหาร (Executive)' : 'ผู้เช่าแผงค้า (Vendor)'} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>{lang === 'TH' ? 'ความปลอดภัยข้อมูล' : 'Data Privacy'}</label>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: 12, borderRadius: 8, fontSize: 12, color: '#065F46' }}>
                  🔒 ข้อมูลตัวตนได้รับการเข้ารหัสและคุ้มครองความปลอดภัยตามมาตรฐาน PDPA ของเครือ ไฮไลฟ์ โกลบอล ฟู้ด
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                <button onClick={() => setActiveTab('vendor')} style={{ flex: 1, background: '#0F382E', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  🗺️ {lang === 'TH' ? 'ไปยังหน้าผังจองล็อก' : 'Go to Stall Map'}
                </button>
                <button onClick={handleLogout} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '12px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: EXECUTIVE SUMMARY & DASHBOARD ── */}
        {activeTab === 'dashboard' && currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'BOD') && (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F382E', margin: 0 }}>📊 {t.execSummary}</h2>
                <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>ภาพรวมรายได้และสถิติการใช้งานแผงตลาดกาดมาลินหน้า มช.</p>
              </div>
              <button onClick={() => alert('ดาวน์โหลดรายงานสรุป PDF สำเร็จ')} style={{ background: '#0F382E', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                📄 {t.exportPdf}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>{t.totalStalls}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F382E', marginTop: 4 }}>{totalStalls}</div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>รองรับผู้ค้าทั้งหมด</div>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#065F46', fontWeight: 700 }}>{t.statsOccupancy}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 4 }}>{occupancy}%</div>
                <div style={{ fontSize: 10, color: '#047857', marginTop: 2 }}>{bookedCount} จาก {totalStalls} ล็อก</div>
              </div>
              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#92400E', fontWeight: 700 }}>{t.estRevenue}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#D97706', marginTop: 4 }}>฿{revenue.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#B45309', marginTop: 2 }}>{t.basedOnApproved}</div>
              </div>
              <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 700 }}>{t.statsPending}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#334155', marginTop: 4 }}>{pendingCount}</div>
                <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>คำขอรอดำเนินการ</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: STAFF VERIFICATION & VENDOR MANAGEMENT ── */}
        {activeTab === 'admin' && currentUser && currentUser.role === 'ADMIN' && (
          <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: '24px' }}>
            
            {/* Sub-Tabs for Admin */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #E2E8F0', paddingBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setAdminSubTab('bookings')}
                  style={{
                    background: adminSubTab === 'bookings' ? '#0F382E' : '#F1F5F9',
                    color: adminSubTab === 'bookings' ? '#FFFFFF' : '#475569',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📝 {t.adminPanelTitle} ({stalls.filter(s => s.status === 'PENDING').length})
                </button>
                <button
                  type="button"
                  onClick={() => { setAdminSubTab('users'); fetchAdminVendors(); }}
                  style={{
                    background: adminSubTab === 'users' ? '#0F382E' : '#F1F5F9',
                    color: adminSubTab === 'users' ? '#FFFFFF' : '#475569',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  👥 จัดการรายชื่อผู้ค้า (Google Form / LINE Match)
                </button>
              </div>

              {adminSubTab === 'users' && (
                <button
                  type="button"
                  onClick={fetchAdminVendors}
                  style={{
                    background: '#FAFBFB',
                    border: '1px solid #CBD5E1',
                    borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#475569'
                  }}
                >
                  🔄 รีเฟรชข้อมูล
                </button>
              )}
            </div>

            {/* Sub-Tab 1: Booking Approvals */}
            {adminSubTab === 'bookings' && (
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
            )}

            {/* Sub-Tab 2: Vendor Whitelist Management & LINE Matching */}
            {adminSubTab === 'users' && (
              <div>
                {/* Form to Add New Approved Phone */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0F382E', margin: '0 0 10px' }}>➕ เพิ่มรายชื่อผู้ค้าที่ผ่านการอนุมัติ (จาก Google Form)</h4>
                  <form onSubmit={handleAddVendor} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="tel"
                      required
                      placeholder="เบอร์โทรศัพท์ (เช่น 0812345678)"
                      value={newVendorPhone}
                      onChange={e => setNewVendorPhone(e.target.value)}
                      style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none' }}
                    />
                    <input
                      type="text"
                      placeholder="ชื่อ-นามสกุล / ร้านค้า (Optional)"
                      value={newVendorName}
                      onChange={e => setNewVendorName(e.target.value)}
                      style={{ flex: 1, minWidth: 180, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none' }}
                    />
                    <button
                      type="submit"
                      style={{ background: '#0F382E', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      บันทึกสิทธิ์ผู้ค้า
                    </button>
                  </form>
                </div>

                {/* Table of Approved Vendors */}
                {adminUserLoading ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>⏳ กำลังโหลดข้อมูล...</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFBFB', textAlign: 'left' }}>
                          <th style={{ padding: '10px 8px' }}>เบอร์โทรศัพท์</th>
                          <th style={{ padding: '10px 8px' }}>ชื่อผู้ค้า</th>
                          <th style={{ padding: '10px 8px' }}>สถานะสิทธิ์</th>
                          <th style={{ padding: '10px 8px' }}>การผูกบัญชี LINE</th>
                          <th style={{ padding: '10px 8px' }}>LINE User ID</th>
                          <th style={{ padding: '10px 8px', textAlign: 'center' }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminVendors.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                              ยังไม่มีรายชื่อผู้ค้าในฐานข้อมูล กรุณาเพิ่มเบอร์โทรศัพท์ด้านบน
                            </td>
                          </tr>
                        ) : (
                          adminVendors.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '10px 8px', fontWeight: 700, color: '#0F382E' }}>{u.phone_number || '-'}</td>
                              <td style={{ padding: '10px 8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {u.avatar_url && <img src={u.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />}
                                  <span>{u.display_name || '-'}</span>
                                </div>
                              </td>
                              <td style={{ padding: '10px 8px' }}>
                                <span style={{
                                  background: u.status === 'approved' ? '#DCFCE7' : '#FEF08A',
                                  color: u.status === 'approved' ? '#166534' : '#854D0E',
                                  padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700
                                }}>
                                  {u.status === 'approved' ? '✅ อนุมัติแล้ว' : '⏳ รอตรวจสอบ'}
                                </span>
                              </td>
                              <td style={{ padding: '10px 8px' }}>
                                {u.line_user_id ? (
                                  <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    🟢 ผูก LINE แล้ว
                                  </span>
                                ) : (
                                  <span style={{ color: '#94A3B8', fontWeight: 600 }}>
                                    ⚪ ยังไม่ผูก LINE
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '10px 8px', color: '#64748B', fontFamily: 'monospace', fontSize: 10 }}>
                                {u.line_user_id ? `${u.line_user_id.substring(0, 12)}...` : '-'}
                              </td>
                              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVendor(u.id)}
                                  style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}
                                >
                                  ลบ
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ── POPUP: MEMBER LOGIN ── */}
      {showLoginModal && (
        <div onClick={() => setShowLoginModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: 20, padding: '28px 24px', maxWidth: 360, width: '100%', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#0A3A2F', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, marginBottom: 12 }}>
              M
            </div>
            
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F382E', margin: '0 0 6px' }}>{t.loginModalTitle}</h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 20px' }}>เข้าสู่ระบบผู้ค้าเพื่อเลือกและจองแผงตลาด Malin Plaza</p>

            {!isStaffLogin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  type="button"
                  onClick={() => window.location.href = '/api/auth/line-login'}
                  style={{
                    background: '#06C755',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '13px 16px',
                    fontSize: 14,
                    cursor: 'pointer',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    boxShadow: '0 4px 14px rgba(6, 199, 85, 0.3)',
                    transition: 'transform 0.1s'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 5.82 2 10.53c0 4.23 3.65 7.78 8.58 8.41.33.07.78.22.89.5.1.26.07.67.03.94l-.15.93c-.05.29-.23 1.13.99.62 1.22-.51 6.59-3.88 8.99-6.64C23.01 13.3 24 11.96 24 10.53 24 5.82 19.52 2 12 2z"/>
                  </svg>
                  เข้าสู่ระบบด้วย LINE
                </button>

                {/* กล่องติดต่อ / แอดเพื่อน LINE OA */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '14px', marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                    ยังไม่มีบัญชี หรือต้องการติดต่อเจ้าหน้าที่?
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
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
                    💬 แอดไลน์ LINE OA: @769kvfhj
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>ชื่อบัญชีเจ้าหน้าที่</label>
                  <input type="text" required placeholder="Username (admin / bod)" value={staffUser} onChange={e => setStaffUser(e.target.value)} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>รหัสผ่าน</label>
                  <input type="password" required placeholder="Password" value={staffPass} onChange={e => setStaffPass(e.target.value)} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none', boxSizing: 'border-box'
                  }} />
                </div>

                {loginErrorMsg && <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>{loginErrorMsg}</div>}

                <button type="submit" style={{
                  background: '#0F382E', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 4
                }}>เข้าสู่ระบบเจ้าหน้าที่</button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
              <button type="button" onClick={() => { setIsStaffLogin(!isStaffLogin); setLoginErrorMsg(''); }} style={{
                background: 'none', border: 'none', color: '#64748B', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'
              }}>
                {isStaffLogin ? '← กลับหน้าเข้าสู่ระบบสำหรับผู้เช่า (LINE Login)' : 'เข้าสู่ระบบด้วยบัญชีเจ้าหน้าที่ (Staff Login)'}
              </button>
            </div>

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
