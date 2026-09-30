import React, { useState } from 'react';
import { Database, HardDrive, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { reconnectApi } from '../lib/api';

// ป้ายเล็กๆ บอกว่าตอนนี้เว็บคุยกับ SQLite (API) หรือ localStorage (Local)
// — กันสับสนว่าทำไมแก้ข้อมูลแล้ว DB ไม่ขยับ (ลืมรัน server / server ยังไม่ติด)
// กดที่ป้ายเพื่อลองเชื่อมต่อ server ใหม่ (ถ้าติดจะ reload หน้าเพื่อโหลดข้อมูลจาก DB)
export const ApiStatusBadge: React.FC = () => {
  const { useApi } = useAuth();
  const { showToast } = useStore();
  const [reconnecting, setReconnecting] = useState(false);

  const handleClick = async () => {
    if (useApi) return; // ต่อ API อยู่แล้ว ไม่ต้องทำอะไร
    setReconnecting(true);
    try {
      const ok = await reconnectApi();
      if (ok) {
        window.location.reload();
      } else {
        showToast('ยังเชื่อมต่อ server ไม่ได้ — ตรวจว่า `npm run server` รันอยู่', 'error');
      }
    } finally {
      setReconnecting(false);
    }
  };

  return (
    <button
      type="button"
      id="api-status-badge"
      onClick={handleClick}
      title={
        useApi
          ? 'เชื่อมต่อ SQLite สำเร็จ — ข้อมูลบันทึกเข้า database'
          : 'ใช้ localStorage (server ไม่ติด) — กดเพื่อลองเชื่อมต่อใหม่'
      }
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
        useApi
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
      }`}
    >
      <span className="relative flex w-2 h-2">
        <span
          className={`absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping ${
            useApi ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        />
        <span
          className={`relative inline-flex w-2 h-2 rounded-full ${useApi ? 'bg-emerald-600' : 'bg-amber-500'}`}
        />
      </span>
      {useApi ? <Database className="w-3.5 h-3.5" /> : <HardDrive className="w-3.5 h-3.5" />}
      {/* <span>{useApi ? 'DB: SQLite' : 'DB: Local'}</span> */}  
      {!useApi && (
        <RefreshCw className={`w-3 h-3 ${reconnecting ? 'animate-spin' : ''}`} />
      )}
    </button>
  );
};
