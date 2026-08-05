export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#0D9488' }}>🎪 ระบบจองตลาดมาลินหน้า มช. (Malin Market)</h1>
      <p style={{ fontSize: '18px', color: '#475569' }}>
        ระบบอยู่ในโหมด Staging พร้อมเชื่อมต่อ Supabase Database (Singapore Region)
      </p>
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'inline-block' }}>
        <h3>🟢 สถานะระบบ (System Status)</h3>
        <p>✅ Database: Supabase PostgreSQL (ap-southeast-1)</p>
        <p>✅ Security: AES-256 Encryption Ready</p>
      </div>
    </div>
  );
}