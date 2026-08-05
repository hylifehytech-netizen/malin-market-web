import React, { useState, useEffect } from 'react';

export default function StallMap({ stalls, onSelectStall }) {
  const [selectedStallId, setSelectedStallId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return { bg: '#10B981', label: '🟢 ว่าง' };
      case 'booked':
        return { bg: '#EF4444', label: '🔴 จองแล้ว' };
      case 'maintenance':
        return { bg: '#F59E0B', label: '🟡 ปิดปรับปรุง' };
      default:
        return { bg: '#6B7280', label: '⚪ ไม่ระบุ' };
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0F172A', borderRadius: '12px', color: '#F8FAFC' }}>
      <h2 style={{ color: '#38BDF8', borderBottom: '2px solid #334155', paddingBottom: '8px' }}>
        🎪 ผังจองล็อก ตลาดมาลินหน้า มช. (Interactive Map)
      </h2>
      
      {/* Legend */}
      <div style={{ display: 'flex', gap: '15px', margin: '15px 0' }}>
        <span>🟢 ว่าง (คลิกเพื่อจอง)</span>
        <span>🔴 จองแล้ว</span>
        <span>🟡 ปิดปรับปรุง</span>
      </div>

      {/* Grid Layout ล็อกขายของ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '20px' }}>
        {stalls.map((stall) => {
          const badge = getStatusBadge(stall.status);
          const isSelected = selectedStallId === stall.stall_id;

          return (
            <button
              key={stall.stall_id}
              disabled={stall.status !== 'available'}
              onClick={() => {
                setSelectedStallId(stall.stall_id);
                onSelectStall(stall);
              }}
              style={{
                backgroundColor: isSelected ? '#0284C7' : '#1E293B',
                border: isSelected ? '2px solid #38BDF8' : '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
                color: '#FFF',
                cursor: stall.status === 'available' ? 'pointer' : 'not-allowed',
                opacity: stall.status !== 'available' ? 0.6 : 1,
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{stall.stall_number}</div>
              <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>฿{stall.price}</div>
              <div style={{ fontSize: '11px', marginTop: '6px', color: badge.bg }}>{badge.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}