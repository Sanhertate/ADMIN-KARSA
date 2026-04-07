import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Camera, MapPin, Clock, CheckCircle, XCircle, Shield, 
  LogOut, LayoutDashboard, FileCheck, ChevronLeft, User, 
  FileText, Briefcase, CreditCard, Coffee, Edit3, 
  Users, Megaphone, MessageSquare, Building2, Bell,
  Home, UserCircle, RefreshCcw, ChevronRight, LogIn, Moon, Sun, 
  Cloud, Mic, Image as ImageIcon, BookOpen, 
  ShieldCheck, Leaf, Activity, ClipboardList, Settings, Globe, Palette, 
  HelpCircle, Info, Bot, Send, Key, ArrowLeft, UploadCloud, BarChart, 
  Calendar, AlertCircle, Download, Filter, Trash2, Search, Printer, 
  Eye, EyeOff, Phone, X, Check, MinusCircle, UserPlus, PhoneCall, PieChart,
  MoreVertical, Menu, AlertTriangle, Mail, Save, Download as DownloadIcon
} from 'lucide-react';

// ==========================================
// KONEKSI DATABASE & KONFIGURASI
// ==========================================
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbwERT8qauFuVIET-kOfyn5LIHqyZd4Dil7uCONPFY9SYPWfi3RowtRrKA3iGmjiS4GZ/exec";

// TANGGAL RILIS APLIKASI - Mencegah hitungan Alpa sebelum aplikasi digunakan
const TANGGAL_RILIS_APLIKASI = new Date('2026-04-01');
TANGGAL_RILIS_APLIKASI.setHours(0,0,0,0);

const DATA_WILAYAH = {
  'Kota Palangka Raya': { 'Pahandut': ['Pahandut', 'Panarung'], 'Jekan Raya': ['Bukit Tunggal', 'Menteng'] },
  'Kotawaringin Barat': { 'Arut Selatan': ['Sidorejo', 'Madurejo'], 'Kumai': ['Kumai Hulu'] },
  'Lamandau': { 'Bulik': ['Nanga Bulik', 'Kujan', 'Bumi Agung'], 'Sematu Jaya': ['Tri Tunggal', 'Purwareja'], 'Delang': ['Kudangan'] }
};

const KABUPATEN_LIST_FULL = Object.keys(DATA_WILAYAH);
const PENDIDIKAN_LIST = ['SD', 'SMP', 'SMA/SMK', 'D3', 'D4', 'S1', 'S2', 'S3'];
const PENEMPATAN_LIST_FULL = [
  'RSUD Gusti Abdul Ghani', 'Dinas Lingkungan Hidup dan Kehutanan (DLH-K)', 
  'Kecamatan Sematu Jaya', 'Badan Kepegawaian (BKPSDM)', 'Dinas Perhubungan (DISHUB)', 
  'Sekretariat Daerah (SETDA)', 'Satuan Polisi Pamong Praja (SATPOLDAM)', 'Lainnya (Hubungi Admin)'
];

const CATEGORY_SETTINGS = { 'Sekuriti': { icon: ShieldCheck }, 'Kesehatan': { icon: Activity }, 'Kebersihan': { icon: Leaf }, 'Umum': { icon: Briefcase } };
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const safeArray = (arr) => Array.isArray(arr) ? arr.filter(Boolean) : [];

const getVal = (obj, possibleKeys, defaultVal = '-') => {
    if (!obj || typeof obj !== 'object') return defaultVal;
    const normalizedObj = {};
    for (let k in obj) normalizedObj[k.trim().toLowerCase()] = String(obj[k]);
    for (let key of possibleKeys) {
        const normKey = key.toLowerCase();
        if (normalizedObj[normKey] !== undefined && normalizedObj[normKey] !== null && String(normalizedObj[normKey]).trim() !== '') return String(normalizedObj[normKey]).trim();
    }
    return defaultVal;
};

const parseRobustDate = (str) => {
    if (!str || str === '-') return null;
    if (str instanceof Date) return isNaN(str.getTime()) ? null : new Date(str.getFullYear(), str.getMonth(), str.getDate());
    const s = String(str).trim();
    let d = new Date(s);
    if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const matchNum = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (matchNum) { const pd = new Date(parseInt(matchNum[3]), parseInt(matchNum[2]) - 1, parseInt(matchNum[1])); if (!isNaN(pd.getTime())) return pd; }
    const matchNumRev = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (matchNumRev) { const pd = new Date(parseInt(matchNumRev[1]), parseInt(matchNumRev[2]) - 1, parseInt(matchNumRev[3])); if (!isNaN(pd.getTime())) return pd; }
    return null;
};

const formatDateUI = (dateStr) => {
    if (!dateStr || dateStr === '-') return '-';
    const d = parseRobustDate(dateStr);
    if (!d) return String(dateStr);
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
};

const formatToInputDate = (dateStr) => {
    const d = parseRobustDate(dateStr);
    if (!d) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const hitungDurasiHari = (dateStr) => {
    if (!dateStr || dateStr === '-') return { startDate: null, days: 0 };
    const str = String(dateStr).toLowerCase();
    let parts = [];
    if (str.includes(' s/d ')) parts = str.split(' s/d '); else if (str.includes(' sd ')) parts = str.split(' sd '); else if (str.includes(' sampai ')) parts = str.split(' sampai '); else if (str.includes(' - ')) parts = str.split(' - ');
    if (parts.length === 2) {
        const d1 = parseRobustDate(parts[0]); const d2 = parseRobustDate(parts[1]);
        if (d1 && d2) {
            d1.setHours(0,0,0,0); d2.setHours(0,0,0,0);
            const diffTime = Math.abs(d2.getTime() - d1.getTime());
            return { startDate: d1, days: Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 };
        }
    }
    const singleDate = parseRobustDate(str);
    return { startDate: singleDate, days: singleDate ? 1 : 0 };
};

const isDateInRange = (dateObj, dateStr) => {
    if (!dateObj || !dateStr || dateStr === '-') return false;
    const str = String(dateStr).toLowerCase();
    let parts = [];
    if (str.includes(' s/d ')) parts = str.split(' s/d '); else if (str.includes(' sd ')) parts = str.split(' sd '); else if (str.includes(' sampai ')) parts = str.split(' sampai '); else if (str.includes(' - ')) parts = str.split(' - ');
    if (parts.length === 2) {
        const d1 = parseRobustDate(parts[0]); const d2 = parseRobustDate(parts[1]);
        if (d1 && d2) { d1.setHours(0,0,0,0); d2.setHours(0,0,0,0); const checkTime = dateObj.getTime(); return checkTime >= d1.getTime() && checkTime <= d2.getTime(); }
    }
    const singleDate = parseRobustDate(str);
    if (singleDate) { singleDate.setHours(0,0,0,0); return singleDate.getTime() === dateObj.getTime(); }
    return false;
};

const getInitialLocalCache = (key) => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; } };

const exportDataToExcel = (dataToExport, title, filename, todayStrReal) => {
  try {
    if (!dataToExport || dataToExport.length === 0) return alert("Tidak ada data untuk diekspor pada filter ini.");
    const keys = Object.keys(dataToExport[0]);
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><style>table { border-collapse: collapse; font-family: Arial, sans-serif; } th { background-color: #f8f9fa; border: 1px solid #dadce0; padding: 10px; font-weight: bold; text-align: left; } td { border: 1px solid #dadce0; padding: 8px; vertical-align: middle; }</style></head><body><h2>${title}</h2><table border="1"><thead><tr><th>No</th>`;
    keys.forEach(k => { html += `<th>${String(k)}</th>`; }); html += `</tr></thead><tbody>`;
    dataToExport.forEach((row, index) => {
      html += `<tr><td style="text-align: center;">${index + 1}</td>`;
      keys.forEach(k => { let align = 'left'; if (String(k).includes('Masuk') || String(k).includes('Pulang') || String(k).includes('Total') || String(k).includes('Istirahat') || String(k).includes('Kembali') || String(k).includes('Aksi')) align = 'center'; html += `<td style="text-align: ${align};">${String(row[k] || '-')}</td>`; });
      html += `</tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${filename}_${(todayStrReal || 'Export').replace(/ /g, '_')}.xls`; link.click();
  } catch (e) { alert("Error Excel: " + e.message); }
};

const getKaryawanStats = (personel, allAbsensi, validCuti, appSettings, bulanStr) => {
  let tHadir = 0, tTelat = 0, tIzin = 0, tSakit = 0, tCuti = 0, tLibur = 0, tAlpha = 0;
  const allDates = new Set();
  const karAbsen = safeArray(allAbsensi).filter(a => a && String(a.userId) === String(personel?.id || personel?.userId));
  
  let joinDate = parseRobustDate(personel?.tglGabung);
  let firstDateActive = null;
  if (karAbsen.length > 0) {
      karAbsen.forEach(a => { const d = parseRobustDate(a.date); if (d && (!firstDateActive || d < firstDateActive)) { firstDateActive = d; } });
  }
  
  let startDateForAlpha = joinDate || firstDateActive; 
  if (startDateForAlpha) {
      startDateForAlpha.setHours(0,0,0,0);
      if (startDateForAlpha < TANGGAL_RILIS_APLIKASI) {
          startDateForAlpha = new Date(TANGGAL_RILIS_APLIKASI);
      }
  } else {
      startDateForAlpha = new Date(TANGGAL_RILIS_APLIKASI);
  }

  karAbsen.forEach(a => { 
      const d = parseRobustDate(a.date); 
      if (d && (bulanStr === 'Semua' || MONTH_NAMES[d.getMonth()] === bulanStr)) { 
          allDates.add(`${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`); 
      } 
  });

  if (bulanStr !== 'Semua') {
      const mIdx = MONTH_NAMES.indexOf(bulanStr); const y = new Date().getFullYear(); const daysInMonth = new Date(y, mIdx + 1, 0).getDate();
      for(let i=1; i<=daysInMonth; i++) { allDates.add(`${i} ${bulanStr} ${y}`); }
  }

  const validDates = Array.from(allDates).sort((a, b) => { const dA = parseRobustDate(a); const dB = parseRobustDate(b); return (dA?.getTime() || 0) - (dB?.getTime() || 0); });
  const exportRowsRender = [];
  const today = new Date(); today.setHours(0,0,0,0);

  validDates.forEach(dateStr => {
      const dObj = parseRobustDate(dateStr); if (dObj) dObj.setHours(0,0,0,0);
      const isWeekend = dObj ? (dObj.getDay() === 0 || dObj.getDay() === 6) : false;
      const absenMatch = karAbsen.find(a => { const ad = parseRobustDate(a.date); return ad && dObj && ad.getTime() === dObj.getTime(); });

      let finalStatus = '', bgStyle = '', colorStyle = '', masuk = '-', istirahat = '-', kembali = '-', pulang = '-', patroli = '-';
      let isKembaliLate = false, matchedCuti = null;
      
      safeArray(validCuti).forEach(c => {
         if(String(c.userId) === String(personel?.id || personel?.userId)) { if (isDateInRange(dObj, c.start || c.tanggal || c.date)) { matchedCuti = c; } }
      });

      if (matchedCuti) {
          const type = String(matchedCuti.type).toLowerCase(); const reason = String(matchedCuti.reason).toLowerCase();
          if (type.includes('sakit') || type.includes('medis')) { tSakit++; finalStatus = 'SAKIT'; bgStyle = 'bg-purple-50 border-purple-200 text-purple-700'; colorStyle = '#9333ea'; }
          else if (type.includes('cuti') || type.includes('nikah') || type.includes('duka')) { tCuti++; finalStatus = 'CUTI'; bgStyle = 'bg-blue-50 border-blue-200 text-[#1a73e8]'; colorStyle = '#1a73e8'; }
          else if (type.includes('off') || type.includes('libur') || reason.includes('off') || reason.includes('libur')) { tLibur++; finalStatus = 'LIBUR / OFF'; bgStyle = 'bg-slate-100 border-slate-300 text-slate-600'; colorStyle = '#9aa0a6'; }
          else { tIzin++; finalStatus = 'IZIN'; bgStyle = 'bg-yellow-50 border-yellow-200 text-yellow-700'; colorStyle = '#f29900'; }
          patroli = matchedCuti.reason;
      } else if (absenMatch && String(absenMatch.action).toLowerCase() === 'absen libur') {
          tLibur++; finalStatus = 'LIBUR / OFF'; bgStyle = 'bg-slate-100 border-slate-300 text-slate-600'; colorStyle = '#9aa0a6';
      } else if (absenMatch && String(absenMatch.action).toLowerCase().includes('masuk')) {
          tHadir++; let targetTime = '08:00'; const act = String(absenMatch.action).toLowerCase(); const role = personel?.role || 'Umum';
          if (role === 'Umum') targetTime = appSettings?.Umum_Masuk || '08:00';
          else if (role === 'Kebersihan') targetTime = appSettings?.Kebersihan_Masuk || '06:00';
          else if (role === 'Sekuriti') targetTime = appSettings?.Sekuriti_Pagi || '07:00';
          if (role === 'Sekuriti' && act.includes('malam')) targetTime = appSettings?.Sekuriti_Malam || '19:00';
          else if (role === 'Kesehatan') {
             targetTime = appSettings?.Kesehatan_Pagi || '07:00';
             if (act.includes('siang')) targetTime = appSettings?.Kesehatan_Siang || '14:00';
             if (act.includes('malam')) targetTime = appSettings?.Kesehatan_Malam || '21:00';
          }
          
          const parseTimeWithSeconds = (tStr) => { if(!tStr) return 0; const match = String(tStr).match(/(\d+)[.:](\d+)/); if (!match) return 0; return (parseInt(match[1]) || 0) * 3600 + (parseInt(match[2]) || 0) * 60; };
          const isLate = parseTimeWithSeconds(absenMatch.time) > parseTimeWithSeconds(targetTime);
          if (isLate) tTelat++;
          finalStatus = isLate ? 'TERLAMBAT' : 'TEPAT WAKTU'; bgStyle = isLate ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-700'; colorStyle = '#188038';
          masuk = absenMatch.time; istirahat = absenMatch.istirahat || '-'; kembali = absenMatch.kembali || '-'; pulang = absenMatch.pulang || '-'; patroli = absenMatch.patroli || '-';
          if (kembali !== '-') { let tgt = '13:00'; if (role === 'Umum') tgt = appSettings?.Umum_Kembali || '13:00'; if (parseTimeWithSeconds(kembali) > parseTimeWithSeconds(tgt)) isKembaliLate = true; }
      } else if (isWeekend) {
          tLibur++; finalStatus = 'AKHIR PEKAN'; bgStyle = 'bg-slate-100 border-slate-300 text-slate-600'; colorStyle = '#64748b';
      } else {
          if (dObj && dObj < today) {
              if (dObj < TANGGAL_RILIS_APLIKASI) {
                   finalStatus = 'TIDAK DIHITUNG (SEBELUM RILIS)'; bgStyle = 'bg-gray-100 border-gray-200 text-gray-400'; colorStyle = '#bdc1c6';
              } else if (dObj >= startDateForAlpha) {
                   tAlpha++; finalStatus = 'ALPHA / TANPA KETERANGAN'; bgStyle = 'bg-red-100 border-red-300 text-red-800'; colorStyle = '#991b1b';
              } else {
                   finalStatus = '-'; bgStyle = 'bg-gray-50 border-transparent text-gray-400'; colorStyle = '#e5e7eb';
              }
          } else if (dObj && dObj.getTime() === today.getTime()) {
              finalStatus = 'BELUM ABSEN'; bgStyle = 'bg-gray-50 border-gray-200 text-gray-400'; colorStyle = '#bdc1c6';
          } else {
              finalStatus = '-'; bgStyle = 'bg-gray-50 border-transparent text-gray-400'; colorStyle = '#e5e7eb';
          }
      }
      exportRowsRender.push({ tanggal: formatDateUI(dateStr), masuk, istirahat, kembali, pulang, patroli, statusText: finalStatus, bgStyle, colorStyle, isLate: absenMatch?.isLate || false, isKembaliLate });
  });

  return { 
      stats: [
          { label: 'Tepat Waktu', value: Math.max(0, tHadir - tTelat), color: '#188038' }, { label: 'Terlambat', value: tTelat, color: '#f29900' }, { label: 'Izin', value: tIzin, color: '#f29900' }, 
          { label: 'Sakit', value: tSakit, color: '#9333ea' }, { label: 'Cuti', value: tCuti, color: '#1a73e8' }, { label: 'Libur/Off', value: tLibur, color: '#9aa0a6' }, { label: 'Tanpa Keterangan', value: tAlpha, color: '#c5221f' } 
      ].filter(s => s.value > 0), exportRowsRender, rawStats: { tHadir, tTelat, tIzin, tSakit, tCuti, tLibur, tAlpha } 
  };
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, errorMessage: '' }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorMessage: error.toString() }; }
  componentDidCatch(error, errorInfo) { console.error("Terjadi Kesalahan Sistem:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-8 text-center font-sans">
          <div className="bg-white rounded-xl p-10 max-w-md w-full shadow-lg border border-gray-200">
             <div className="flex justify-center mb-6"><AlertCircle size={48} className="text-red-500" /></div>
             <h1 className="text-xl font-medium text-gray-900 mb-2">Terjadi Kesalahan Visual</h1>
             <p className="text-sm text-gray-600 mb-8">Sistem mendeteksi struktur data yang butuh penyegaran.</p>
             <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium py-2.5 rounded-md transition-colors text-sm">Muat Ulang Aplikasi</button>
             <p className="text-[9px] text-gray-400 mt-6 font-mono break-all">{this.state.errorMessage}</p>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return <ErrorBoundary>{!isAuthenticated ? <AdminLogin onLogin={() => setIsAuthenticated(true)} /> : <AdminDashboard onLogout={() => setIsAuthenticated(false)} />}</ErrorBoundary>;
}

function AdminLogin({ onLogin }) {
  const [id, setId] = useState(''); const [pass, setPass] = useState('');
  const handleLogin = (e) => { e.preventDefault(); if (id === 'admin' && pass === 'admin123') onLogin(); else alert("Username atau Password Admin Salah!"); };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-left">
      <div className="w-full max-w-[450px] bg-white rounded-xl p-10 border border-gray-300">
        <div className="flex justify-center mb-6">
           <img src="https://karsasentana.com/wp-content/uploads/2026/01/LOGO-KARSA-SENTANA-2-1024x896.png" alt="Logo Karsa Sentana" className="h-24 w-auto object-contain drop-shadow-sm" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Admin</h1>
        <p className="text-sm text-gray-500 text-center mb-8">PT. Karsa Sentana Lumbung Sentosa</p>
        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <input type="text" value={id} onChange={(e)=>setId(e.target.value)} required placeholder="Username Admin" className="w-full bg-transparent border border-gray-300 p-3.5 rounded text-base text-gray-900 outline-none focus:ring-2 focus:ring-[#1a73e8]" />
          <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} required placeholder="Kata Sandi" className="w-full bg-transparent border border-gray-300 p-3.5 rounded text-base text-gray-900 outline-none focus:ring-2 focus:ring-[#1a73e8]" />
          <div className="flex justify-between items-center pt-6"><button type="button" className="text-[#1a73e8] text-sm font-medium hover:bg-blue-50 px-2 py-1.5 rounded">Lupa sandi?</button><button type="submit" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium px-6 py-2.5 rounded shadow-sm text-sm">Selanjutnya</button></div>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [notif, setNotif] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const localPesanStatus = useRef(getInitialLocalCache('hrd_admin_pesan_status'));
  const deletedKaryawanIds = useRef(new Set()); 
  
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const [selectedLogPersonel, setSelectedLogPersonel] = useState(null); 
  const [selectedProfilPersonel, setSelectedProfilPersonel] = useState(null); 
  const [selectedStatPersonel, setSelectedStatPersonel] = useState(null); 
  const [isAddKaryawanOpen, setIsAddKaryawanOpen] = useState(false);
  
  const [dashboardModalData, setDashboardModalData] = useState(null); 
  const [isBelumLaporOpen, setIsBelumLaporOpen] = useState(false);
  
  const [filterTanggal, setFilterTanggal] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  const [filterDivisi, setFilterDivisi] = useState('Semua');
  const [filterPenempatan, setFilterPenempatan] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [data, setData] = useState({ karyawan: [], absensi: [], laporan: [], pesan: [], cuti: [], broadcast: [] });
  const [appSettings, setAppSettings] = useState(() => {
    try { const saved = localStorage.getItem('hrd_admin_settings_v1'); if (saved && saved !== 'undefined') return JSON.parse(saved); } catch(e) {}
    return { Umum_Masuk: '08:00', Umum_Istirahat: '12:00', Umum_Kembali: '13:00', Umum_Pulang: '16:00', Kebersihan_Masuk: '06:00', Kebersihan_Pulang: '14:00', Sekuriti_Pagi: '07:00', Sekuriti_Malam: '19:00', Sekuriti_Patroli: '23:00', Kesehatan_Pagi: '07:00', Kesehatan_Siang: '14:00', Kesehatan_Malam: '21:00' };
  });

  useEffect(() => { localStorage.setItem('hrd_admin_settings_v1', JSON.stringify(appSettings)); }, [appSettings]);
  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(''), 3000); };
  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const isFetchingRef = useRef(false);
  const pauseSyncUntil = useRef(0);

  const fetchData = async (isSilent = false) => {
    if (Date.now() < pauseSyncUntil.current || isFetchingRef.current) return;
    isFetchingRef.current = true; if (!isSilent) setIsSyncing(true);
    try {
      const fallbackDateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const response = await fetch(`${GOOGLE_SHEETS_API_URL}?t=${new Date().getTime()}`);
      const result = await response.json();
      
      if(result.status === 'success') {
        const rawKaryawan = safeArray(result.karyawan).map(k => {
            if (!k) return null;
            const empId = getVal(k, ['id karyawan', 'is karyawan', 'nik', 'id', 'no'], Math.random().toString(36).substr(2, 9));
            const empName = getVal(k, ['nama lengkap sesuai ktp', 'nama pegawai', 'nama', 'pegawai', 'name'], 'Unknown');
            return {
                ...k, id: empId, name: empName,
                role: getVal(k, ['organisasi', 'divisi', 'role'], '-'), penempatan: getVal(k, ['jabatan', 'pekerjaan', 'posisi', 'penempatan'], '-'),
                pekerjaan: getVal(k, ['pekerjaan spesifik', 'pekerjaan', 'spesifik'], '-'),
                phone: getVal(k, ['nomor hp', 'nomor ponsel', 'no hp', 'phone'], ''), password: getVal(k, ['kata sandi', 'sandi', 'password'], '123456'), photo: getVal(k, ['foto', 'photo'], ''),
                tempatLahir: getVal(k, ['tempat lahir', 'tempatlahir']), tanggalLahir: getVal(k, ['tanggal lahir', 'dob', 'tanggallahir']), jenisKelamin: getVal(k, ['jenis kelamin', 'gender']),
                statusKawin: getVal(k, ['status perkawinan', 'statuskawin']), golDarah: getVal(k, ['golongan darah', 'goldarah']), agama: getVal(k, ['agama', 'religion']),
                noKtp: getVal(k, ['id ktp', 'id kartu identitas', 'ktp']), noKk: getVal(k, ['id kartu keluarga', 'nomor kartu keluarga', 'kk']), email: getVal(k, ['email']),
                alamat: getVal(k, ['alamat', 'addressdetail']), provinsi: getVal(k, ['provinsi']), kota: getVal(k, ['kota', 'kabupaten']), pendidikan: getVal(k, ['jenjang pendidikan terakhir', 'pendidikan', 'education'], '-'),
                prodi: getVal(k, ['program studi', 'prodi']), tglGabung: getVal(k, ['awal bergabung', 'tanggal bergabung', 'tglgabung', 'tanggal mulai bekerja']), tglBerakhir: getVal(k, ['akhir bergabung', 'tanggal berakhir']),
                hariKerja: getVal(k, ['hari kerja', 'hk'], '-'), gaji: getVal(k, ['gaji', 'gapok'])
            };
        }).filter(Boolean);

        const karyawanMap = new Map();
        rawKaryawan.forEach(k => { 
            if(k && k.id) {
               karyawanMap.set(String(k.id).trim().toUpperCase(), k); 
            }
        });
        
        const normalizedKaryawan = Array.from(karyawanMap.values()).filter(k => !deletedKaryawanIds.current.has(String(k.id).trim()));

        const normalizedCuti = safeArray(result.cuti).map(c => {
            if (!c) return null;
            const empName = getVal(c, ['nama pegawai', 'nama', 'name'], 'Unknown');
            return { ...c, id: c.id || Math.random().toString(36).substr(2, 9), userId: getVal(c, ['id karyawan', 'nik', 'userid', 'id'], empName), name: empName, type: getVal(c, ['jenis pengajuan', 'jenis', 'type'], 'Cuti/Izin'), reason: getVal(c, ['alasan', 'keterangan', 'pesan', 'reason'], '-'), start: getVal(c, ['tanggal mulai', 'tanggal', 'start', 'date'], fallbackDateStr), status: getVal(c, ['status', 'Status', 'Setatus'], 'Pending'), file: getVal(c, ['lampiran', 'foto', 'file'], '') };
        }).filter(Boolean);

        const normalizedLaporan = safeArray(result.laporan).map(l => {
            if (!l) return null;
            const empName = getVal(l, ['nama', 'nama pegawai', 'name'], 'Unknown');
            return { ...l, id: l.id || Math.random().toString(36).substr(2, 9), userId: getVal(l, ['id karyawan', 'nik', 'userid', 'id'], empName), nama: empName, waktu: getVal(l, ['waktu', 'jam', 'time'], '-'), teks: getVal(l, ['isi laporan', 'deskripsi pekerjaan', 'keterangan', 'teks'], '-'), tanggal: getVal(l, ['tanggal', 'date'], fallbackDateStr), photo: getVal(l, ['lampiran', 'foto', 'file'], '') };
        }).filter(Boolean);

        const normalizedAbsensi = safeArray(result.absensi).map(a => {
            if (!a) return null;
            const empName = getVal(a, ['nama', 'nama pegawai', 'username', 'name'], 'Unknown');
            return { ...a, userId: getVal(a, ['id karyawan', 'nik', 'userid', 'id'], empName), userName: empName, date: getVal(a, ['tanggal', 'date'], fallbackDateStr), time: getVal(a, ['waktu', 'jam', 'time'], '-'), action: getVal(a, ['aksi', 'status', 'action'], '-'), photo: getVal(a, ['lampiran', 'foto', 'file'], '') };
        }).filter(Boolean);

        setData({ karyawan: normalizedKaryawan, absensi: normalizedAbsensi, laporan: normalizedLaporan, pesan: safeArray(result.pesan), cuti: normalizedCuti, broadcast: safeArray(result.broadcast) });
      }
    } catch (e) { } finally { if (!isSilent) setIsSyncing(false); isFetchingRef.current = false; }
  };

  useEffect(() => { 
      fetchData(false); 
      const autoSyncInterval = setInterval(() => fetchData(true), 1000); 
      return () => clearInterval(autoSyncInterval); 
  }, []);

  const uniquePlacements = useMemo(() => { try { return [...new Set(safeArray(data.karyawan).map(k => k?.penempatan ? String(k.penempatan) : null).filter(Boolean))]; } catch(e) { return []; } }, [data.karyawan]);
  const validBroadcast = useMemo(() => { try { return safeArray(data.broadcast).filter(b => b?.message && String(b.message).trim() !== ''); } catch(e) { return []; } }, [data.broadcast]);
  const validPesan = useMemo(() => {
    try { 
      return safeArray(data.pesan).filter(p => p && (p.pesan || p.teks || p.text)).map(p => { const local = localPesanStatus.current[p.id]; return local ? { ...p, status: local.status, balasan: local.balasan } : p; }).reverse(); 
    } catch(e) { return []; }
  }, [data.pesan]);
  
  const todayStrReal = useMemo(() => { try { return currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); } catch(e) { return ""; } }, [currentTime]);

  const validCuti = useMemo(() => {
    try { 
      const cutiNyasar = safeArray(data.pesan).filter(p => {
         const txt = String(p.pesan || p.teks || '').toLowerCase(); const t = String(p.type || '').toLowerCase();
         return t.includes('cuti') || t.includes('izin') || t.includes('sakit') || t.includes('off') || txt.includes('mengajukan cuti');
      }).map(p => ({ ...p, type: p.type || 'IZIN', reason: p.pesan || p.teks || '-', start: p.start || p.tanggal || p.date || todayStrReal, userId: getVal(p, ['userId', 'nik', 'id', 'nama', 'Nama'], 'Unknown'), name: p.nama || p.name || 'Unknown' }));

      const combined = [...safeArray(data.cuti), ...cutiNyasar];
      const seen = new Set();
      
      return combined.filter(c => {
         if (!c || !c.userId) return false;
         const id = c.id || `${c.userId}-${c.reason}`;
         if(seen.has(id)) return false; seen.add(id); return true;
      }).map(c => {
         const kInfo = safeArray(data.karyawan).find(emp => String(emp.id) === String(c.userId)) || {};
         return { ...c, role: kInfo.role || '-', penempatan: kInfo.penempatan || '-', name: kInfo.name || c.name };
      }).reverse();
    } catch(e) { return []; }
  }, [data.cuti, data.pesan, data.karyawan, todayStrReal]);
  
  const validLaporan = useMemo(() => {
    try {
        return safeArray(data.laporan).map(l => {
            const kInfo = safeArray(data.karyawan).find(emp => String(emp.id) === String(l.userId)) || {};
            return { ...l, role: kInfo.role || '-', penempatan: kInfo.penempatan || '-', nama: kInfo.name || l.nama };
        });
    } catch(e) { return []; }
  }, [data.laporan, data.karyawan]);

  const targetDateObj = useMemo(() => {
     if(!filterTanggal) return null;
     try { const [y, m, d] = String(filterTanggal).split('-'); const date = new Date(y, m - 1, d); return isNaN(date.getTime()) ? null : date; } catch(e) { return null; }
  }, [filterTanggal]);

  const targetDateStr = useMemo(() => {
     try { return targetDateObj ? targetDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; } catch(e) { return ''; }
  }, [targetDateObj]);

  const groupedAbsensi = useMemo(() => {
    try {
      const groups = {};
      const targetDateObjForGroup = targetDateObj || new Date(); 
      const targetDateStrForGroup = targetDateObj ? targetDateStr : formatDateUI(targetDateObjForGroup);
      
      const parseTimeWithSeconds = (timeStr) => {
        if(!timeStr || String(timeStr).trim() === '-' || String(timeStr).trim() === '') return 0;
        const match = String(timeStr).match(/(\d+)[.:](\d+)(?:[.:](\d+))?/);
        if (!match) return 0; return (parseInt(match[1]) || 0) * 3600 + (parseInt(match[2]) || 0) * 60 + (parseInt(match[3]) || 0);
      };

      const formatLateDuration = (actual, target) => {
         const diff = actual - target; if (diff <= 0) return '';
         const h = Math.floor(diff / 3600); const m = Math.floor((diff % 3600) / 60); let res = []; if (h > 0) res.push(`${h} jam`); if (m > 0) res.push(`${m} mnt`); if (h === 0 && m === 0) res.push(`${diff % 60} dtk`); return res.join(' ');
      };

      safeArray(data.karyawan).forEach(k => {
         if (!k || !k.id) return;
         groups[k.id] = { 
            id: k.id, userId: k.id, userName: k.name, date: targetDateStrForGroup, role: k.role, penempatan: k.penempatan, photo: k.photo, pekerjaan: k.pekerjaan,
            masuk: '-', istirahat: '-', kembali: '-', pulang: '-', patroli: '-', isLate: false, lateText: '', pengajuan: null, hasRecord: false, statusText: '-', bgStyle: 'bg-gray-50 border-transparent text-gray-400', tglGabung: k.tglGabung
         };
      });

      safeArray(data.absensi).forEach(a => {
        if(!a || !a.userId) return; 
        const rowDate = parseRobustDate(a.date);
        let matchDate = false;
        if (targetDateObjForGroup && rowDate) matchDate = rowDate.getTime() === targetDateObjForGroup.getTime();
        else matchDate = String(a.date || '').toLowerCase() === String(targetDateStrForGroup || '').toLowerCase();
        if (!matchDate) return; 

        const uid = a.userId;
        if (!groups[uid]) {
           const kInfo = safeArray(data.karyawan).find(emp => String(emp.id) === String(uid)) || {};
           groups[uid] = { 
             id: a.id, userId: uid, userName: a.userName || kInfo.name || '-', date: a.date, role: a.role || kInfo.role || '-', penempatan: a.penempatan || kInfo.penempatan || '-', 
             photo: kInfo.photo || null, pekerjaan: kInfo.pekerjaan || '-', masuk: '-', istirahat: '-', kembali: '-', pulang: '-', patroli: '-', isLate: false, lateText: '', pengajuan: null, hasRecord: false, statusText: '-', bgStyle: 'bg-gray-50 border-transparent text-gray-400', tglGabung: kInfo.tglGabung
           };
        }
        
        groups[uid].hasRecord = true;
        if (a.photo && String(a.photo).trim() !== '') { groups[uid].photo = a.photo; }
        
        const act = String(a.action || '').toLowerCase();
        if (act === 'absen libur') { groups[uid].pengajuan = 'OFFDAY'; groups[uid].patroli = 'Absen Libur'; groups[uid].statusText = 'LIBUR / OFF SHIFT'; groups[uid].bgStyle = 'bg-slate-100 border-slate-300 text-slate-600'; }
        else if (act.includes('masuk') || act === 'absen') {
          groups[uid].masuk = a.time; let targetTime = '08:00'; const role = groups[uid].role;
          if (role === 'Umum') targetTime = appSettings?.Umum_Masuk || '08:00';
          else if (role === 'Kebersihan') targetTime = appSettings?.Kebersihan_Masuk || '06:00';
          else if (role === 'Sekuriti') targetTime = appSettings?.Sekuriti_Pagi || '07:00';
          if (role === 'Sekuriti' && act.includes('malam')) targetTime = appSettings?.Sekuriti_Malam || '19:00';
          else if (role === 'Kesehatan') {
             targetTime = appSettings?.Kesehatan_Pagi || '07:00';
             if (act.includes('siang')) targetTime = appSettings?.Kesehatan_Siang || '14:00';
             if (act.includes('malam')) targetTime = appSettings?.Kesehatan_Malam || '21:00';
          }
          
          const actualSecs = parseTimeWithSeconds(a.time); const targetSecs = parseTimeWithSeconds(targetTime);
          if (actualSecs > 0 && actualSecs > targetSecs) { groups[uid].isLate = true; groups[uid].lateText = formatLateDuration(actualSecs, targetSecs); }
          groups[uid].statusText = groups[uid].isLate ? 'TERLAMBAT' : 'TEPAT WAKTU'; groups[uid].bgStyle = groups[uid].isLate ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-700';
        }
        else if (act.includes('istirahat (keluar)') || act.includes('mulai istirahat')) groups[uid].istirahat = a.time;
        else if (act.includes('istirahat (masuk)') || act.includes('selesai istirahat')) groups[uid].kembali = a.time;
        else if (act.includes('pulang')) { groups[uid].pulang = a.time; if (groups[uid].masuk === '-' && act.includes('malam')) groups[uid].masuk = 'Shift Kemarin'; }
        else if (act.includes('patroli')) groups[uid].patroli = a.time;
      });

      safeArray(validCuti).forEach(c => {
         let matchDate = true;
         if (targetDateObjForGroup) matchDate = isDateInRange(targetDateObjForGroup, c.start);
         else matchDate = String(c.start || '').toLowerCase().includes(String(targetDateStrForGroup).toLowerCase());
         if (!matchDate) return;
         
         const uid = c.userId;
         if (groups[uid]) {
            const t = String(c.type || '').toLowerCase(); const r = String(c.reason || '').toLowerCase();
            let pType = 'IZIN';
            if (t.includes('sakit') || t.includes('medis')) pType = 'SAKIT';
            else if (t.includes('cuti') || t.includes('melahirkan') || t.includes('nikah') || t.includes('duka')) pType = 'CUTI';
            else if (t.includes('off') || t.includes('libur') || r.includes('off') || r.includes('libur')) pType = 'OFFDAY';
            
            groups[uid].pengajuan = pType; groups[uid].patroli = groups[uid].patroli === '-' ? (c.reason || '-') : `${groups[uid].patroli} | ${c.reason || '-'}`;
            if (pType === 'SAKIT') { groups[uid].statusText = 'SAKIT'; groups[uid].bgStyle = 'bg-purple-50 border-purple-200 text-purple-700'; }
            else if (pType === 'CUTI') { groups[uid].statusText = 'CUTI'; groups[uid].bgStyle = 'bg-blue-50 border-blue-200 text-[#1a73e8]'; }
            else if (pType === 'OFFDAY') { groups[uid].statusText = 'LIBUR / OFF SHIFT'; groups[uid].bgStyle = 'bg-slate-100 border-slate-300 text-slate-600'; }
            else { groups[uid].statusText = 'IZIN'; groups[uid].bgStyle = 'bg-yellow-50 border-yellow-200 text-yellow-700'; }
         }
      });

      const today = new Date(); today.setHours(0,0,0,0);
      
      return Object.values(groups).filter(g => {
        const matchDiv = filterDivisi === 'Semua' || g.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || g.penempatan === filterPenempatan;
        const searchStr = String(searchTerm || "").toLowerCase(); const matchSearch = searchStr === '' || String(g.userName || "").toLowerCase().includes(searchStr) || String(g.userId || "").toLowerCase().includes(searchStr);
        
        if (!g.hasRecord && !g.pengajuan) {
            let firstDateActive = parseRobustDate(g.tglGabung);
            if (!firstDateActive) {
                const karAbsen = safeArray(data.absensi).filter(a => a && String(a.userId) === String(g.userId));
                karAbsen.forEach(a => { const d = parseRobustDate(a.date); if (d && (!firstDateActive || d < firstDateActive)) { firstDateActive = d; } });
            }
            if (firstDateActive) firstDateActive.setHours(0,0,0,0);

            if (targetDateObjForGroup && targetDateObjForGroup < today) {
                if (targetDateObjForGroup < TANGGAL_RILIS_APLIKASI) {
                     g.statusText = 'TIDAK DIHITUNG (SEBELUM RILIS)'; g.bgStyle = 'bg-gray-100 text-gray-400 border-gray-200';
                } else if (!firstDateActive || targetDateObjForGroup >= firstDateActive) {
                    const isWeekend = targetDateObjForGroup.getDay() === 0 || targetDateObjForGroup.getDay() === 6;
                    if (isWeekend) {
                        g.statusText = 'AKHIR PEKAN'; g.bgStyle = 'bg-slate-100 text-slate-600 border-slate-300';
                    } else {
                        g.statusText = 'ALPHA / TANPA KETERANGAN'; g.bgStyle = 'bg-red-100 text-red-800 border-red-300';
                    }
                } else {
                    return false; 
                }
            } else if (targetDateObjForGroup && targetDateObjForGroup.getTime() === today.getTime()) {
                g.statusText = 'BELUM ABSEN'; g.bgStyle = 'bg-gray-50 text-gray-400 border-gray-200';
            } else {
                return false; 
            }
        }
        
        if (g.statusText === 'TIDAK DIHITUNG (SEBELUM RILIS)') return false;
        
        return matchDiv && matchPen && matchSearch;
      }).sort((a, b) => {
         const timeA = a.masuk !== '-' && a.masuk !== 'Shift Kemarin' ? a.masuk : ''; const timeB = b.masuk !== '-' && b.masuk !== 'Shift Kemarin' ? b.masuk : '';
         if (timeA && timeB) return timeB.localeCompare(timeA); if (timeA && !timeB) return -1; if (!timeA && timeB) return 1;
         return String(a.userName || "").localeCompare(String(b.userName || ""));
      });
    } catch(e) { return []; }
  }, [data.absensi, validCuti, data.karyawan, filterTanggal, targetDateObj, targetDateStr, filterDivisi, filterPenempatan, searchTerm, appSettings]);

  const sendAction = async (payload) => {
    pauseSyncUntil.current = Date.now() + 15000; setIsSyncing(true);
    try { await fetch(GOOGLE_SHEETS_API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch (e) { showNotif("Gagal Terhubung ke Server"); } finally { setIsSyncing(false); }
  };

  const handleExportAbsensi = () => {
    const formattedData = groupedAbsensi.map(g => {
      let isKembaliLate = false;
      if (g.kembali && g.kembali !== '-') {
         let tgt = '13:00'; if (g.role === 'Umum') tgt = appSettings?.Umum_Kembali || '13:00';
         const [th, tm] = tgt.split(/[:.]/); const tgtMins = parseInt(th)*60 + parseInt(tm); const [h,m] = g.kembali.split(/[:.]/); if (parseInt(h)*60 + parseInt(m) > tgtMins) isKembaliLate = true;
      }
      
      let bgCol = '#ffffff', textCol = '#000000';
      const st = String(g.statusText || '').toUpperCase();
      if (st.includes('TEPAT WAKTU')) { bgCol = '#e6f4ea'; textCol = '#188038'; }
      else if (st.includes('TERLAMBAT')) { bgCol = '#fce8e6'; textCol = '#d93025'; }
      else if (st.includes('ALPHA')) { bgCol = '#fad2cf'; textCol = '#b31412'; }
      else if (st.includes('SAKIT')) { bgCol = '#f3e8fd'; textCol = '#7b1fa2'; }
      else if (st.includes('CUTI')) { bgCol = '#e8f0fe'; textCol = '#1a73e8'; }
      else if (st.includes('IZIN')) { bgCol = '#fef7e0'; textCol = '#ea8600'; }
      else if (st.includes('LIBUR') || st.includes('AKHIR PEKAN') || st.includes('BELUM ABSEN')) { bgCol = '#f1f3f4'; textCol = '#5f6368'; }

      return { 
        'Tanggal': g.date, 
        'Nama Pegawai': g.userName, 
        'Absen Masuk': g.isLate ? `<span style="color: red; font-weight: bold;">${g.masuk}</span>` : g.masuk, 
        'Istirahat (Keluar)': g.istirahat, 
        'Kembali (Masuk)': isKembaliLate ? `<span style="color: red; font-weight: bold;">${g.kembali}</span>` : g.kembali, 
        'Jam Pulang': g.pulang, 
        'Keterangan': `<div style="background-color: ${bgCol}; color: ${textCol}; padding: 4px 8px; font-weight: bold; text-align: center; border-radius: 4px;">${st}</div>` 
      };
    });
    exportDataToExcel(formattedData, `REKAPITULASI PRESENSI - ${targetDateStr || 'Hari Ini'}`, 'Rekap_Presensi', targetDateStr);
  };

  const handleExportLaporan = () => {
    const formattedData = validLaporan.filter(l => {
       const lDate = parseRobustDate(l.tanggal); const tDate = parseRobustDate(targetDateStr); let matchDate = false;
       if (lDate && tDate) matchDate = lDate.getTime() === tDate.getTime(); else matchDate = String(l.tanggal || '').toLowerCase() === String(targetDateStr || '').toLowerCase();
       const matchDiv = filterDivisi === 'Semua' || l.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || l.penempatan === filterPenempatan; return matchDate && matchDiv && matchPen;
    }).map(l => ({ 'Nama Pegawai': l.nama || '-', 'Nama Laporan': `Laporan Kerja - ${l.waktu || '-'}`, 'Isi Laporan': String(l.teks || '-'), 'Lampiran (Link)': l.photo ? `<a href="${l.photo}" target="_blank" style="color: #1a73e8; text-decoration: underline; font-weight: bold;">Lihat Foto</a>` : 'Tanpa Foto' }));
    exportDataToExcel(formattedData, `REKAPITULASI LAPORAN KERJA - ${targetDateStr || 'Hari Ini'}`, 'Rekap_Laporan', targetDateStr);
  };

  const handleEditKaryawan = (updatedForm) => {
     const originalKaryawan = safeArray(data.karyawan).find(k => String(k.id).trim() === String(updatedForm.id).trim()) || {};
     
     setData(prev => ({
        ...prev, 
        karyawan: safeArray(prev.karyawan).map(k => 
            String(k.id).trim() === String(updatedForm.id).trim() 
            ? { ...k, ...updatedForm } 
            : k
        )
     }));
     
     sendAction({ ...originalKaryawan, ...updatedForm, action: 'update_karyawan' });
     showNotif('Data Pegawai Berhasil Diperbarui');
  };
  
  const handleDeleteKaryawan = (id) => {
     const idStr = String(id).trim();
     deletedKaryawanIds.current.add(idStr); 

     setData(prev => ({
         ...prev, 
         karyawan: safeArray(prev.karyawan).filter(k => String(k?.id).trim() !== idStr)
     })); 
     
     sendAction({action: 'delete_karyawan', id: idStr}); 
     showNotif("Pegawai telah dihapus dari sistem"); 
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-gray-800 overflow-hidden relative text-left">
      {notif && (<div className="fixed bottom-6 left-6 bg-gray-900 text-white px-4 py-3 rounded shadow-lg z-[1000] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-sm font-medium"><CheckCircle size={18} className="text-[#34a853]" /> {notif}</div>)}
      
      {selectedLogPersonel && (<LogAbsensiModal personel={selectedLogPersonel} allAbsensi={data.absensi} cuti={validCuti} appSettings={appSettings} onClose={() => setSelectedLogPersonel(null)} />)}
      {selectedProfilPersonel && (<ProfilPegawaiModal personel={selectedProfilPersonel} onClose={() => setSelectedProfilPersonel(null)} onEdit={handleEditKaryawan} />)}
      {selectedStatPersonel && (<StatistikPegawaiModal personel={selectedStatPersonel} allAbsensi={data.absensi} cuti={validCuti} appSettings={appSettings} onClose={() => setSelectedStatPersonel(null)} />)}
      
      {dashboardModalData && (
          <DashboardDetailModal 
            title={dashboardModalData.title} 
            list={dashboardModalData.list} 
            onClose={() => setDashboardModalData(null)} 
            onPhoto={setSelectedPhoto} 
            displayDateStr={targetDateStr || 'Hari Ini'} 
          />
      )}
      
      {isBelumLaporOpen && (<BelumLaporModal karyawanList={data.karyawan} laporanList={validLaporan} filterTanggal={filterTanggal} targetDateStr={targetDateStr} filterDivisi={filterDivisi} filterPenempatan={filterPenempatan} groupedAbsensi={groupedAbsensi} onClose={() => setIsBelumLaporOpen(false)} />)}
      
      {isAddKaryawanOpen && (
        <KaryawanFormModal 
          onClose={() => setIsAddKaryawanOpen(false)} 
          onSubmit={(form) => { 
             setData(prev => ({...prev, karyawan: [...safeArray(prev.karyawan), form]})); 
             sendAction({ action: 'register', ...form }); 
             setIsAddKaryawanOpen(false); 
             showNotif('Pegawai Baru Berhasil Ditambahkan'); 
          }}
        />
      )}
      
      {selectedPhoto && (
        <div className="fixed inset-0 bg-gray-900/80 z-[2000] flex flex-col items-center justify-center p-10 animate-in fade-in">
           <div className="bg-white p-2 rounded-lg shadow-xl relative"><button onClick={() => setSelectedPhoto(null)} className="absolute -top-3 -right-3 bg-white text-gray-500 hover:text-gray-800 rounded-full p-1 shadow-md"><X size={20} /></button><img src={selectedPhoto} className="max-w-[80vw] max-h-[80vh] rounded object-contain" alt="Bukti"/></div>
        </div>
      )}

      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white flex flex-col shrink-0 border-r border-gray-200 z-20 overflow-hidden`}>
        <div className="p-4 pl-6 h-16 border-b border-gray-200 flex items-center gap-3 shrink-0">
           <img src="https://karsasentana.com/wp-content/uploads/2026/01/LOGO-KARSA-SENTANA-2-1024x896.png" alt="Logo" className="w-10 h-10 object-contain" />
           <div className="flex flex-col"><h1 className="font-bold text-lg text-gray-800 tracking-tight whitespace-nowrap leading-tight">Admin</h1><p className="text-[10px] text-gray-500 whitespace-nowrap">PT. Karsa Sentana Lumbung Sentosa</p></div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1"><MenuBtn icon={LayoutDashboard} label="Dashboard" active={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} /><MenuBtn icon={Clock} label="Log Absensi" active={activeMenu === 'absensi'} onClick={() => setActiveMenu('absensi')} /><MenuBtn icon={Users} label="Database Pegawai" active={activeMenu === 'karyawan'} onClick={() => setActiveMenu('karyawan')} /></div>
          <div className="mt-6 mb-2"><p className="text-xs font-medium text-gray-500 px-6 uppercase">Kepegawaian</p></div>
          <div className="space-y-1"><MenuBtn icon={FileCheck} label="Pengajuan" active={activeMenu === 'cuti'} onClick={() => setActiveMenu('cuti')} /><MenuBtn icon={FileText} label="Laporan Pegawai" active={activeMenu === 'laporan'} onClick={() => setActiveMenu('laporan')} /><MenuBtn icon={BarChart} label="Statistik & Rekap" active={activeMenu === 'statistik'} onClick={() => setActiveMenu('statistik')} /></div>
          <div className="mt-6 mb-2"><p className="text-xs font-medium text-gray-500 px-6 uppercase">Komunikasi</p></div>
          <div className="space-y-1"><MenuBtn icon={MessageSquare} label="Tiket Bantuan" active={activeMenu === 'bantuan'} onClick={() => setActiveMenu('bantuan')} /><MenuBtn icon={Megaphone} label="Pesan Siaran" active={activeMenu === 'broadcast'} onClick={() => setActiveMenu('broadcast')} /></div>
          <div className="mt-6 mb-2"><p className="text-xs font-medium text-gray-500 px-6 uppercase">Sistem</p></div>
          <div className="space-y-1"><MenuBtn icon={Settings} label="Aturan Waktu" active={activeMenu === 'pengaturan'} onClick={() => setActiveMenu('pengaturan')} /></div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] overflow-hidden relative">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-4"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"><Menu size={20} /></button><h2 className="font-normal text-xl text-gray-800 capitalize">{activeMenu.replace('-', ' ')}</h2></div>
          <div className="flex items-center gap-4 flex-1 justify-end px-4">
            <div className="relative max-w-md w-full ml-4"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" placeholder="Telusuri ID-PEGAWAI atau Nama..." className="w-full pl-10 pr-4 py-2 bg-[#f1f3f4] border border-transparent rounded-md text-sm text-gray-700 focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-[#1a73e8] outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
               <div className="text-right hidden sm:block mr-2"><p className="text-xs font-medium text-gray-900">{currentTime.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p><p className="text-[10px] text-gray-500">{todayStrReal}</p></div>
               <button onClick={onLogout} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors tooltip" title="Keluar"><LogOut size={20} /></button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left">
          <div className="max-w-[1400px] mx-auto">
             {activeMenu === 'dashboard' && (<DashboardOverview data={data} groupedAbsensi={groupedAbsensi} filterTanggal={filterTanggal} setFilterTanggal={setFilterTanggal} filterDivisi={filterDivisi} setFilterDivisi={setFilterDivisi} filterPenempatan={filterPenempatan} setFilterPenempatan={setFilterPenempatan} uniquePlacements={uniquePlacements} onOpenCategoryModal={(title, list) => setDashboardModalData({title, list})} />)}
             {activeMenu === 'absensi' && (<AbsensiDetailedTable list={groupedAbsensi} onPhoto={setSelectedPhoto} onDetail={setSelectedLogPersonel} karyawan={data.karyawan} filterTanggal={filterTanggal} setFilterTanggal={setFilterTanggal} filterDivisi={filterDivisi} setFilterDivisi={setFilterDivisi} filterPenempatan={filterPenempatan} setFilterPenempatan={setFilterPenempatan} uniquePlacements={uniquePlacements} onExport={handleExportAbsensi} />)}
             {activeMenu === 'karyawan' && (<KaryawanTable list={data.karyawan} validCuti={validCuti} onDetail={setSelectedProfilPersonel} onAdd={() => setIsAddKaryawanOpen(true)} onDelete={handleDeleteKaryawan} filterDivisi={filterDivisi} setFilterDivisi={setFilterDivisi} filterPenempatan={filterPenempatan} setFilterPenempatan={setFilterPenempatan} searchTerm={searchTerm} uniquePlacements={uniquePlacements} />)}
             {activeMenu === 'cuti' && (<CutiTicketView list={validCuti} karyawan={data.karyawan} onPhoto={setSelectedPhoto} filterTanggal={filterTanggal} setFilterTanggal={setFilterTanggal} filterDivisi={filterDivisi} setFilterDivisi={setFilterDivisi} filterPenempatan={filterPenempatan} setFilterPenempatan={setFilterPenempatan} uniquePlacements={uniquePlacements} targetDateStr={targetDateStr} onExport={() => {
                     const currentYear = new Date().getFullYear(); const exportRows = []; const cutiStats = {};
                     safeArray(data.karyawan).forEach(k => { if(k && k.id) cutiStats[String(k.id)] = { taken: 0, sisa: 12 }; });
                     safeArray(validCuti).forEach(c => { if (!c || !c.userId) return; const type = String(c.type || '').toLowerCase(); const status = String(c.status || '').toLowerCase(); if (type.includes('cuti') && !status.includes('reject') && !status.includes('tolak')) { const { startDate, days } = hitungDurasiHari(c.start); if (startDate && startDate.getFullYear() === currentYear && cutiStats[String(c.userId)]) { cutiStats[String(c.userId)].taken += days; cutiStats[String(c.userId)].sisa = 12 - cutiStats[String(c.userId)].taken; } } });
                     safeArray(validCuti).forEach(c => {
                        let matchDate = true; if (filterTanggal) { const tDate = parseRobustDate(targetDateStr); if (tDate) matchDate = isDateInRange(tDate, c.start); else matchDate = String(c.start || '').toLowerCase().includes(String(filterTanggal).toLowerCase()); }
                        const matchDiv = filterDivisi === 'Semua' || c.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || c.penempatan === filterPenempatan;
                        if (!matchDate || !matchDiv || !matchPen) return;
                        exportRows.push({ 'Nama Pegawai': c.name || '-', 'ID-PEGAWAI': c.userId || '-', 'Tipe Pengajuan': c.type || '-', 'Tanggal Mulai': c.start || '-', 'Keterangan / Alasan': c.reason || '-', 'Status': c.status || 'Terkirim', 'Lampiran': c.file ? `<a href="${c.file}" target="_blank">Lihat Bukti</a>` : 'Tidak Ada', 'Sisa Kuota Cuti (Tahun Ini)': cutiStats[String(c.userId)] ? cutiStats[String(c.userId)].sisa + ' Hari' : '-' });
                     });
                     exportDataToExcel(exportRows, `REKAPITULASI PENGAJUAN CUTI & IZIN - ${targetDateStr || 'Hari Ini'}`, 'Rekap_Cuti_Izin', targetDateStr);
                 }}
               />
             )}
             {activeMenu === 'laporan' && (<LaporanView list={validLaporan} onPhoto={setSelectedPhoto} filterTanggal={filterTanggal} setFilterTanggal={setFilterTanggal} filterDivisi={filterDivisi} setFilterDivisi={setFilterDivisi} filterPenempatan={filterPenempatan} setFilterPenempatan={setFilterPenempatan} uniquePlacements={uniquePlacements} targetDateStr={targetDateStr} onOpenBelumLapor={() => setIsBelumLaporOpen(true)} onExport={handleExportLaporan} />)}
             {activeMenu === 'statistik' && (<StatistikKaryawanView list={data.karyawan} absensi={data.absensi} validCuti={validCuti} appSettings={appSettings} onSelect={setSelectedStatPersonel} filterDivisi={filterDivisi} setFilterDivisi={setFilterDivisi} filterPenempatan={filterPenempatan} setFilterPenempatan={setFilterPenempatan} searchTerm={searchTerm} uniquePlacements={uniquePlacements} onExportAll={(bulanStr) => {
                    const exportRows = [];
                    safeArray(data.karyawan).forEach(kar => { const { rawStats } = getKaryawanStats(kar, data.absensi, validCuti, appSettings, bulanStr); exportRows.push({ 'Nama Pegawai': kar.name, 'Divisi': kar.role, 'Tempat Kerja (Penempatan)': kar.penempatan, 'Total Hadir (Tepat Waktu)': Math.max(0, rawStats.tHadir - rawStats.tTelat), 'Total Terlambat': rawStats.tTelat, 'Total Izin': rawStats.tIzin, 'Total Sakit': rawStats.tCuti, 'Total Cuti': rawStats.tCuti, 'Total Libur / Off': rawStats.tLibur, 'Total Tanpa Keterangan (Alpha)': rawStats.tAlpha }); });
                    exportDataToExcel(exportRows, `REKAPITULASI KESELURUHAN - BULAN ${bulanStr.toUpperCase()}`, 'Rekap_Statistik_Global', '');
                 }}
               />
             )}
             {activeMenu === 'bantuan' && (<BantuanView pesan={validPesan} onUpdate={(targetPesan, status, balasan) => {
                   if (!targetPesan || !targetPesan.id) return;
                   localPesanStatus.current[targetPesan.id] = { status, balasan }; localStorage.setItem('hrd_admin_pesan_status', JSON.stringify(localPesanStatus.current));
                   setData(prev => ({ ...prev, pesan: safeArray(prev.pesan).map(p => { const isMatch = (p?.id && targetPesan.id && String(p.id) === String(targetPesan.id)) || (String(p?.userId) === String(targetPesan.userId) && String(p?.pesan) === String(targetPesan.pesan)); return isMatch ? { ...p, status, balasan } : p; }) }));
                   sendAction({action: 'update_message', id: targetPesan.id || '', userId: targetPesan.userId || '', status, balasan}); showNotif("Balasan terkirim");
                 }} />
             )}
             {activeMenu === 'broadcast' && (<BroadcastView list={validBroadcast} onSend={(msg) => { const newB = { id: Date.now(), message: msg, date: todayStrReal, time: currentTime.toLocaleTimeString('id-ID') }; setData(prev => ({...prev, broadcast: [...safeArray(prev.broadcast), newB]})); sendAction({action: 'send_broadcast', ...newB}); showNotif("Pesan siaran terkirim"); }} />)}
             {activeMenu === 'pengaturan' && (<SettingsView appSettings={appSettings} setAppSettings={setAppSettings} />)}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// VIEWS & COMPONENTS UTUH (VERSI DETAIL)
// ==========================================

function DashboardOverview({ data, groupedAbsensi, filterTanggal, setFilterTanggal, filterDivisi, setFilterDivisi, filterPenempatan, setFilterPenempatan, uniquePlacements = [], onOpenCategoryModal }) {
  const categories = useMemo(() => {
    const cats = {
       'Semua Pegawai': groupedAbsensi,
       'Hadir (Aktif)': groupedAbsensi.filter(g => g.hasRecord && g.masuk !== '-' && !g.pengajuan),
       'Terlambat': groupedAbsensi.filter(g => g.hasRecord && g.isLate),
       'Izin Pribadi': groupedAbsensi.filter(g => g.pengajuan === 'IZIN'),
       'Sakit': groupedAbsensi.filter(g => g.pengajuan === 'SAKIT'),
       'Cuti': groupedAbsensi.filter(g => g.pengajuan === 'CUTI'),
       'Tanpa Keterangan': groupedAbsensi.filter(g => g.statusText === 'ALPHA / TANPA KETERANGAN')
    };
    return cats;
  }, [groupedAbsensi]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-medium text-base text-gray-800 flex items-center gap-2"><LayoutDashboard size={18} className="text-[#1a73e8]"/> Ringkasan Operasional</h3>
          <div className="flex gap-3">
            <input type="date" value={filterTanggal} onChange={e=>setFilterTanggal(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"/>
            <button onClick={()=>setFilterTanggal('')} className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 transition-colors">Hari Ini</button>
            <select value={filterDivisi} onChange={e=>setFilterDivisi(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"><option value="Semua">Semua Divisi</option>{Object.keys(CATEGORY_SETTINGS).map(c => (<option key={String(c)} value={String(c)}>{String(c)}</option>))}</select>
            <select value={filterPenempatan} onChange={e=>setFilterPenempatan(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700 w-48 truncate"><option value="Semua">Semua Penempatan</option>{(uniquePlacements || []).map(p => (<option key={String(p)} value={String(p)}>{String(p)}</option>))}</select>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:auto-rows-[160px]">
        <div onClick={() => onOpenCategoryModal('Hadir (Aktif)', categories['Hadir (Aktif)'])}
             className="md:col-span-2 md:row-span-2 bg-[#1a73e8] rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative">
             <div className="absolute -right-8 -top-8 text-white/10 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle size={220} strokeWidth={1.5} />
             </div>
             <div className="relative z-10">
               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <CheckCircle size={24} className="text-white" />
               </div>
               <h3 className="text-white/90 font-medium text-lg">Kehadiran & Tepat Waktu</h3>
             </div>
             <div className="relative z-10 mt-6">
               <p className="text-7xl font-bold text-white tracking-tight">{categories['Hadir (Aktif)'].length}</p>
               <p className="text-white/80 text-sm mt-3 flex items-center gap-1.5">
                  <Users size={16}/> Total Pegawai Aktif Hari Ini
               </p>
             </div>
        </div>

        <div onClick={() => onOpenCategoryModal('Terlambat', categories['Terlambat'])}
             className="md:col-span-2 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-red-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-[#d93025] group-hover:scale-110 transition-transform">
                   <AlertCircle size={20} />
                 </div>
                 <h3 className="text-gray-600 font-medium">Terlambat Masuk</h3>
               </div>
               <p className="text-4xl font-bold text-gray-900 mt-2">{categories['Terlambat'].length}</p>
             </div>
             <div className="w-20 h-20 bg-red-50/50 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:bg-red-50 transition-colors">
                <Clock size={40} className="text-red-200" />
             </div>
        </div>

        <div onClick={() => onOpenCategoryModal('Izin Pribadi', categories['Izin Pribadi'])}
             className="md:col-span-1 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md hover:border-yellow-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
             <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-[#f29900] group-hover:scale-110 transition-transform">
                 <Briefcase size={20} />
               </div>
             </div>
             <p className="text-3xl font-bold text-gray-900">{categories['Izin Pribadi'].length}</p>
             <p className="text-gray-500 text-sm font-medium mt-1">Izin Pribadi</p>
        </div>

        <div onClick={() => onOpenCategoryModal('Sakit', categories['Sakit'])}
             className="md:col-span-1 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
             <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-[#9333ea] group-hover:scale-110 transition-transform">
                 <Activity size={20} />
               </div>
             </div>
             <p className="text-3xl font-bold text-gray-900">{categories['Sakit'].length}</p>
             <p className="text-gray-500 text-sm font-medium mt-1">Sakit</p>
        </div>

        <div onClick={() => onOpenCategoryModal('Cuti', categories['Cuti'])}
             className="md:col-span-2 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#1a73e8] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#1a73e8] group-hover:scale-110 transition-transform">
                   <FileText size={20} />
                 </div>
                 <h3 className="text-gray-600 font-medium">Sedang Cuti / Off Shift</h3>
               </div>
               <p className="text-4xl font-bold text-gray-900 mt-2">{categories['Cuti'].length}</p>
             </div>
             <div className="w-20 h-20 bg-blue-50/50 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:bg-blue-50 transition-colors">
                <MapPin size={40} className="text-blue-200" />
             </div>
        </div>

        <div onClick={() => onOpenCategoryModal('Tanpa Keterangan', categories['Tanpa Keterangan'])}
             className="md:col-span-2 md:row-span-1 bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-gray-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                   <XCircle size={20} />
                 </div>
                 <h3 className="text-gray-600 font-medium">Tanpa Keterangan (Alpha)</h3>
               </div>
               <p className="text-4xl font-bold text-gray-900 mt-2">{categories['Tanpa Keterangan'].length}</p>
             </div>
             <div className="w-20 h-20 bg-gray-100/50 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                <MinusCircle size={40} className="text-gray-300" />
             </div>
        </div>

      </div>
    </div>
  );
}

function DashboardDetailModal({ title, list, onClose, onPhoto, displayDateStr }) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 z-[1500] flex items-center justify-center p-4 sm:p-6 animate-in fade-in backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
          <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">Daftar Pegawai: {title}</h2>
              <p className="text-sm text-gray-500 mt-1">{displayDateStr} • {list.length} Data Ditemukan</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white hover:bg-gray-100 rounded-full text-gray-500 border border-gray-200 shadow-sm transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <tr><th className="px-6 py-4 font-medium">Bukti / Ikon</th><th className="px-6 py-4 font-medium">Nama Pegawai</th><th className="px-6 py-4 font-medium">Status Absen</th><th className="px-6 py-4 font-medium">Jam Masuk</th><th className="px-6 py-4 font-medium">Pulang</th><th className="px-6 py-4 font-medium">Keterangan</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {list.map((g, i) => {
                const isAlpha = g.statusText === 'ALPHA / TANPA KETERANGAN';
                const isBelumAbsen = g.statusText === 'BELUM ABSEN';
                return (
                <tr key={String(g.id || i)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {isAlpha ? ( <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center border border-red-100" title="Alpha"><XCircle size={18} className="text-red-500" /></div>
                    ) : g.pengajuan === 'OFFDAY' || g.statusText === 'AKHIR PEKAN' ? ( <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200" title="Libur"><MinusCircle size={16} className="text-gray-400" /></div>
                    ) : g.pengajuan === 'CUTI' ? ( <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center border border-blue-200" title="Cuti"><FileText size={18} className="text-[#1a73e8]" /></div>
                    ) : g.pengajuan === 'IZIN' ? ( <div className="w-10 h-10 rounded bg-yellow-50 flex items-center justify-center border border-yellow-200" title="Izin"><Clock size={18} className="text-yellow-600" /></div>
                    ) : g.pengajuan === 'SAKIT' ? ( <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center border border-purple-200" title="Sakit"><Activity size={18} className="text-purple-600" /></div>
                    ) : g.photo && String(g.photo).trim() !== '' ? ( <div className="w-10 h-10 cursor-pointer" onClick={()=>onPhoto(g.photo)}><img src={g.photo} className="w-full h-full rounded object-cover border border-gray-200 hover:opacity-80 transition-opacity" alt="Bukti" /></div>
                    ) : ( <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200" title={isBelumAbsen ? "Belum Absen" : "Tanpa Foto"}><UserCircle size={16} className="text-gray-400" /></div> )}
                  </td>
                  <td className="px-6 py-4"><p className={`font-medium ${isAlpha ? 'text-red-700' : 'text-gray-900'}`}>{String(g.userName || '-')}</p><p className="text-xs text-gray-500 mt-0.5">{String(g.role || '-')} • {String(g.penempatan || '-')}</p></td>
                  <td className="px-6 py-4"><span className={`inline-block px-2 py-1 rounded text-[10px] uppercase font-bold border whitespace-nowrap ${String(g.bgStyle)}`}>{String(g.statusText || '-')}</span></td>
                  <td className="px-6 py-4">
                      {g.masuk !== '-' ? (
                          <div className="flex flex-col gap-1">
                             <span className={`font-bold ${g.isLate ? 'text-[#d93025]' : 'text-[#188038]'}`}>{String(g.masuk || '-')}</span>
                             {g.isLate && <span className="text-[10px] text-red-600 bg-red-50 px-1 py-0.5 rounded w-fit border border-red-100">Telat {String(g.lateText)}</span>}
                          </div>
                      ) : '-'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{String(g.pulang || '-')}</td>
                  <td className="px-6 py-4 text-xs text-gray-600">{g.patroli !== '-' ? String(g.patroli) : '-'}</td>
                </tr>
              )})}
              {list.length === 0 && (<tr><td colSpan="6" className="p-16 text-center text-gray-500 bg-gray-50">Tidak ada pegawai yang masuk dalam kategori ini.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AbsensiDetailedTable({ list, onPhoto, onDetail, karyawan, filterTanggal, setFilterTanggal, filterDivisi, setFilterDivisi, filterPenempatan, setFilterPenempatan, uniquePlacements = [], onExport }) {
  const activeList = safeArray(list);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
        <h3 className="font-medium text-base text-gray-800">Riwayat Terperinci Kehadiran</h3>
        <div className="flex gap-3">
          <input type="date" value={filterTanggal} onChange={e=>setFilterTanggal(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700" />
          <button onClick={()=>setFilterTanggal('')} className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 transition-colors">Hari Ini</button>
          <select value={filterDivisi} onChange={e=>setFilterDivisi(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"><option value="Semua">Semua Divisi</option>{Object.keys(CATEGORY_SETTINGS).map(c => (<option key={String(c)} value={String(c)}>{String(c)}</option>))}</select>
          <select value={filterPenempatan} onChange={e=>setFilterPenempatan(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700 w-48 truncate"><option value="Semua">Semua Penempatan</option>{(uniquePlacements || []).map(p => (<option key={String(p)} value={String(p)}>{String(p)}</option>))}</select>
          <button onClick={onExport} className="bg-white text-[#188038] border border-gray-300 px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"><DownloadIcon size={16}/> Ekspor Excel</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 text-left">
              <tr><th className="px-6 py-3 font-medium">Bukti / Ikon</th><th className="px-6 py-3 font-medium">Nama Pegawai</th><th className="px-6 py-3 font-medium">Tanggal</th><th className="px-6 py-3 font-medium">Status / Masuk</th><th className="px-6 py-3 font-medium">Istirahat</th><th className="px-6 py-3 font-medium">Kembali</th><th className="px-6 py-3 font-medium">Pulang</th><th className="px-6 py-3 font-medium text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {activeList.map((g, i) => {
                const isAlpha = g.statusText === 'ALPHA / TANPA KETERANGAN';
                const isBelumAbsen = g.statusText === 'BELUM ABSEN';
                return (
                <tr key={String(g.id || i)} className={`hover:bg-gray-50 transition-colors`}>
                  <td className="px-6 py-4">
                    {isAlpha ? ( <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center border border-red-100" title="Alpha"><XCircle size={18} className="text-red-500" /></div>
                    ) : g.pengajuan === 'OFFDAY' || g.statusText === 'AKHIR PEKAN' ? ( <div className="w-10 h-10 rounded bg-gray-100 flex flex-col items-center justify-center border border-gray-200" title="Sedang Libur / Off Shift"><MinusCircle size={16} className="text-gray-400" /></div>
                    ) : g.pengajuan === 'CUTI' ? ( <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center border border-blue-200" title="Cuti"><FileText size={18} className="text-[#1a73e8]" /></div>
                    ) : g.pengajuan === 'IZIN' ? ( <div className="w-10 h-10 rounded bg-yellow-50 flex items-center justify-center border border-yellow-200" title="Izin"><Clock size={18} className="text-yellow-600" /></div>
                    ) : g.pengajuan === 'SAKIT' ? ( <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center border border-purple-200" title="Sakit"><Activity size={18} className="text-purple-600" /></div>
                    ) : g.photo && String(g.photo).trim() !== '' ? ( <div className="w-10 h-10 cursor-pointer" onClick={()=>onPhoto(g.photo)}><img src={g.photo} className="w-full h-full rounded object-cover border border-gray-200 hover:opacity-80 transition-opacity" alt="Bukti Foto" /></div>
                    ) : ( <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200" title={isBelumAbsen ? "Belum Absen" : "Tanpa Foto Absen"}><UserCircle size={16} className="text-gray-400" /></div> )}
                  </td>
                  <td className="px-6 py-4"><div><p className={`font-medium ${isAlpha ? 'text-red-700' : 'text-gray-900'}`}>{String(g.userName || '-')}</p><p className="text-xs text-gray-500 mt-0.5">{String(g.role || '-')}</p></div></td>
                  <td className="px-6 py-4 text-xs text-gray-600">{formatDateUI(g.date)}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-block px-2 py-1 rounded text-[10px] uppercase font-bold border whitespace-nowrap ${String(g.bgStyle)}`}>
                        {String(g.statusText || '-')}
                     </span>
                     {g.masuk !== '-' && (
                         <div className="flex flex-col items-start gap-1 mt-2">
                             <span className={`font-medium ${g.isLate ? 'text-[#d93025]' : 'text-[#188038]'}`}>{String(g.masuk || '-')}</span>
                             {g.isLate && <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-medium border border-red-100">Telat {String(g.lateText || '-')}</span>}
                         </div>
                     )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{String(g.istirahat || '-')}</td><td className="px-6 py-4 text-gray-600">{String(g.kembali || '-')}</td><td className="px-6 py-4 font-medium text-gray-900">{String(g.pulang || '-')}</td>
                  <td className="px-6 py-4 text-right"><button onClick={()=>onDetail(safeArray(karyawan).find(k=>k && String(k.id)===String(g.userId)) || {id:g.userId, name:g.userName})} className="text-[#1a73e8] hover:bg-[#e8f0fe] py-1.5 rounded font-medium text-sm px-3 transition-colors border border-[#1a73e8]">Analisis</button></td>
                </tr>
              )})}
              {activeList.length === 0 && (<tr><td colSpan="8" className="p-8 text-center text-gray-500">Belum ada kehadiran aktif pada tanggal ini.</td></tr>)}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function KaryawanTable({ list, validCuti, onDetail, onAdd, onDelete, filterDivisi, setFilterDivisi, filterPenempatan, setFilterPenempatan, searchTerm, uniquePlacements = [] }) {
  const currentYear = new Date().getFullYear();
  
  const cutiStats = useMemo(() => {
    const stats = {};
    safeArray(list).forEach(k => { if(k && k.id) stats[String(k.id)] = { taken: 0, sisa: 12 }; });
    safeArray(validCuti).forEach(c => {
       if (!c || !c.userId) return;
       const type = String(c.type || '').toLowerCase();
       const status = String(c.status || '').toLowerCase();
       if (type.includes('cuti') && !status.includes('reject') && !status.includes('tolak')) {
           const { startDate, days } = hitungDurasiHari(c.start || c.tanggal || c.date);
           const uid = String(c.userId);
           if (startDate && startDate.getFullYear() === currentYear) { 
               if(!stats[uid]) stats[uid] = { taken: 0, sisa: 12 };
               stats[uid].taken += days; 
               stats[uid].sisa = 12 - stats[uid].taken; 
           }
       }
    });
    return stats;
  }, [list, validCuti, currentYear]);

  const filteredList = useMemo(() => {
    try {
      return safeArray(list).filter(k => {
        if(!k || !k.id) return false;
        const matchDiv = filterDivisi === 'Semua' || k.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || k.penempatan === filterPenempatan;
        const matchSearch = searchTerm === '' || String(k.name || "").toLowerCase().includes(String(searchTerm || "").toLowerCase()) || String(k.id || "").toLowerCase().includes(String(searchTerm || "").toLowerCase());
        return matchDiv && matchPen && matchSearch;
      }).sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    } catch(e) { return []; }
  }, [list, filterDivisi, filterPenempatan, searchTerm]);

  const formatWA = (phone) => { if(!phone || phone === '-') return ''; let cleaned = String(phone).replace(/\D/g, ''); if(cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1); return `https://wa.me/${cleaned}`; };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-in fade-in shadow-sm">
      <div className="flex items-center gap-4 p-5 bg-[#e8f0fe] border-b border-[#d2e3fc]">
         <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Users size={28} className="text-[#1a73e8]" />
         </div>
         <div>
             <p className="text-sm font-semibold text-[#1967d2] uppercase tracking-wide">Total Pegawai Saat Ini</p>
             <p className="text-3xl font-bold text-[#1a73e8]">{filteredList.length} <span className="text-base font-medium">Orang</span></p>
         </div>
      </div>

      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <h3 className="font-medium text-base text-gray-800">Manajemen Database Karyawan</h3>
          <div className="flex gap-3">
              <select value={filterDivisi} onChange={e=>setFilterDivisi(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"><option value="Semua">Semua Divisi</option>{Object.keys(CATEGORY_SETTINGS).map(c => (<option key={String(c)} value={String(c)}>{String(c)}</option>))}</select>
              <select value={filterPenempatan} onChange={e=>setFilterPenempatan(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700 w-48 truncate"><option value="Semua">Semua Penempatan</option>{(uniquePlacements || []).map(p => (<option key={String(p)} value={String(p)}>{String(p)}</option>))}</select>
              <button onClick={onAdd} className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"><UserPlus size={16}/> Tambah Pegawai</button>
          </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 text-left">
              <tr><th className="px-6 py-3 font-medium">Pegawai</th><th className="px-6 py-3 font-medium">ID Login</th><th className="px-6 py-3 font-medium">Kontak & Kata Sandi</th><th className="px-6 py-3 font-medium">Penugasan Kerja</th><th className="px-6 py-3 font-medium text-center">Sisa Cuti</th><th className="px-6 py-3 font-medium text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {filteredList.map((k, i) => (
                <tr key={String(k?.id || i)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3 cursor-pointer" onClick={() => onDetail(k)}>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">{k.photo ? <img src={k.photo} className="w-full h-full object-cover" alt="Foto Profil" /> : <UserCircle size={20}/>}</div>
                    <div><p className="text-gray-900 font-medium hover:text-[#1a73e8] transition-colors">{String(k.name || '-')}</p><p className="text-xs text-gray-500 mt-0.5">{String(k.role || '-')}</p></div>
                  </td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{String(k.id || '-')}</p></td>
                  <td className="px-6 py-4">{k.phone && k.phone !== '-' ? <a href={formatWA(k.phone)} target="_blank" rel="noreferrer" className="text-[#1a73e8] hover:underline text-sm flex items-center gap-1 mb-1"><PhoneCall size={14}/> {String(k.phone)}</a> : <span className="text-gray-400 block mb-1">-</span>}<p className="text-xs text-gray-400">Pass: {String(k.password || '-')}</p></td>
                  <td className="px-6 py-4"><p className="text-sm text-gray-900">{String(k.penempatan || '-')}</p><p className="text-xs text-gray-500 mt-0.5">{String(k.pekerjaan && k.pekerjaan !== '-' ? k.pekerjaan : 'Belum Ditentukan')}</p></td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2 py-1 rounded-md text-xs font-bold bg-blue-50 text-[#1a73e8] border border-blue-200">
                       {cutiStats[String(k.id)] ? cutiStats[String(k.id)].sisa + ' Hari' : '12 Hari'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={()=>onDetail(k)} className="p-1.5 text-gray-500 hover:text-[#1a73e8] hover:bg-gray-100 rounded transition-colors" title="Detail Pegawai"><Eye size={18}/></button><button onClick={()=>{ if(window.confirm(`Apakah Anda yakin ingin menghapus data pegawai ${k.name}? (Tindakan ini tidak bisa dibatalkan)`)) onDelete(k.id); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus Pegawai"><Trash2 size={18}/></button></div></td>
                </tr>
              ))}
              {filteredList.length === 0 && (<tr><td colSpan="6" className="p-8 text-center text-gray-500">Tidak ada data pegawai yang sesuai.</td></tr>)}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function KaryawanFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
     id: `KS-${Math.floor(10000 + Math.random() * 90000)}`, 
     name: '', password: '', role: 'Umum', 
     penempatan: PENEMPATAN_LIST_FULL[0] || 'Lainnya', pekerjaan: '', phone: '', 
     tglGabung: new Date().toISOString().split('T')[0] 
  });

  const handleSubmit = (e) => {
     e.preventDefault();
     onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 z-[2000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-gray-200 text-left">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><UserPlus size={20} className="text-[#1a73e8]" /> Tambah Pegawai Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">ID-PEGAWAI <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.id} onChange={e=>setForm({...form, id: e.target.value})} className="w-full bg-blue-50 border border-blue-200 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 font-bold text-[#1a73e8]" placeholder="Masukkan ID-PEGAWAI" title="Dibuat otomatis, tapi bisa Anda ubah jika perlu" />
                  <p className="text-[10px] text-gray-500 mt-1">Dibuat otomatis oleh sistem.</p>
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" placeholder="Nama Sesuai KTP" />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Tanggal Mulai Bekerja <span className="text-red-500">*</span></label>
                  <input type="date" required value={form.tglGabung} onChange={e=>setForm({...form, tglGabung: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Divisi / Peran <span className="text-red-500">*</span></label>
                  <select required value={form.role} onChange={e=>setForm({...form, role: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]">
                     {Object.keys(CATEGORY_SETTINGS).map(c => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
                  </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-medium text-gray-700">Penempatan Tugas <span className="text-red-500">*</span></label>
                  <select required value={form.penempatan} onChange={e=>setForm({...form, penempatan: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]">
                     {PENEMPATAN_LIST_FULL.map(p => <option key={String(p)} value={String(p)}>{String(p)}</option>)}
                  </select>
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Pekerjaan Spesifik (Opsional)</label>
                  <input type="text" value={form.pekerjaan} onChange={e=>setForm({...form, pekerjaan: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" placeholder="Contoh: CS Pagi, Perawat, Danru" />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Nomor Telepon / WA (Opsional)</label>
                  <input type="tel" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" placeholder="08xxxxxxxx" />
              </div>
              <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-medium text-gray-700">Kata Sandi Akun <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" placeholder="Buat sandi awal untuk login aplikasi" />
              </div>
           </div>
           
           <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center gap-2"><Check size={16} /> Simpan & Daftarkan Pegawai</button>
           </div>
        </form>
      </div>
    </div>
  );
}

function ProfilPegawaiModal({ personel, onClose, onEdit }) {
  const [showPass, setShowPass] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
     id: personel?.id || '', name: personel?.name || '', 
     role: personel?.role || 'Umum', penempatan: personel?.penempatan || '',
     pekerjaan: personel?.pekerjaan || '', phone: personel?.phone || '',
     password: personel?.password || '', tglGabung: formatToInputDate(personel?.tglGabung) || new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
     if (personel && !isEditing) {
         setEditForm({
            id: personel.id || '', name: personel.name || '', 
            role: personel.role || 'Umum', penempatan: personel.penempatan || '',
            pekerjaan: personel.pekerjaan || '', phone: personel.phone || '',
            password: personel.password || '', tglGabung: formatToInputDate(personel.tglGabung) || new Date().toISOString().split('T')[0]
         });
     }
  }, [personel, isEditing]);

  if(!personel) return null;

  const handleSaveEdit = () => {
     onEdit(editForm);
     setIsEditing(false);
  };

  const DetailItem = ({ label, value }) => (
    <div className="flex flex-col mb-4">
        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">{String(label)}</span>
        <span className="text-sm font-semibold text-gray-900 leading-snug break-words">{String(value || '-')}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/60 z-[2000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in backdrop-blur-sm">
      <div className="w-full max-w-5xl bg-[#f8f9fa] rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-left border border-gray-200">
        <div className="bg-white p-5 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-[#1a73e8]"/> {isEditing ? 'Edit Data Karyawan' : 'Detail Karyawan'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f0fe] text-[#1a73e8] hover:bg-blue-100 rounded-md font-medium text-sm transition-colors border border-blue-200">
                   <Edit3 size={16} /> Edit Data
                </button>
            )}
            {isEditing && (
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md font-medium text-sm transition-colors">
                   Batal Edit
                </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors ml-2"><X size={20}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
           {isEditing ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Nama Lengkap</label>
                          <input type="text" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">ID Login (Tidak disarankan diubah)</label>
                          <input type="text" value={editForm.id} disabled className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-md text-sm text-gray-500 cursor-not-allowed" title="ID Karyawan menjadi primary key" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Tanggal Mulai Bekerja (Tgl Aktif)</label>
                          <input type="date" value={editForm.tglGabung} onChange={e=>setEditForm({...editForm, tglGabung: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Divisi / Peran</label>
                          <select value={editForm.role} onChange={e=>setEditForm({...editForm, role: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]">
                             {Object.keys(CATEGORY_SETTINGS).map(c => <option key={String(c)} value={String(c)}>{String(c)}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Penempatan Tugas</label>
                          <select value={editForm.penempatan} onChange={e=>setEditForm({...editForm, penempatan: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]">
                             {PENEMPATAN_LIST_FULL.map(p => <option key={String(p)} value={String(p)}>{String(p)}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Pekerjaan Spesifik</label>
                          <input type="text" value={editForm.pekerjaan} onChange={e=>setEditForm({...editForm, pekerjaan: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Nomor Telepon / WA</label>
                          <input type="text" value={editForm.phone} onChange={e=>setEditForm({...editForm, phone: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Ubah Kata Sandi Akun</label>
                          <input type="text" value={editForm.password} onChange={e=>setEditForm({...editForm, password: e.target.value})} className="w-full bg-white border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8]" />
                      </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                     <button onClick={handleSaveEdit} className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium rounded-md transition-colors shadow-sm flex items-center gap-2"><Save size={16}/> Simpan Perubahan</button>
                  </div>
              </div>
           ) : (
             <>
               <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 shadow-sm">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-50 overflow-hidden border border-gray-200 shadow-inner shrink-0 flex items-center justify-center">
                     {personel.photo ? <img src={personel.photo} className="w-full h-full object-cover" alt="Profile" /> : <UserCircle size={64} className="text-gray-300"/>}
                  </div>
                  <div className="text-center sm:text-left flex-1 mt-2 sm:mt-0">
                     <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{String(personel.name || personel.userName || '-')}</h3>
                     <p className="text-sm font-medium text-[#1a73e8] mt-1">{String(personel.pekerjaan || personel.penempatan || '-')}</p>
                     <div className="inline-flex items-center px-3 py-1 mt-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wide">
                        Aktif Bekerja
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                     <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                        <User size={16} className="text-[#1a73e8]"/> Informasi Pribadi
                     </h4>
                     <div className="flex flex-col space-y-4">
                        <DetailItem label="Nama Lengkap Sesuai KTP" value={String(personel.name || '-')} />
                        <DetailItem label="Tempat & Tanggal Lahir" value={`${String(personel.tempatLahir || '-')} , ${formatDateUI(personel.tanggalLahir || personel.dob)}`} />
                        <div className="grid grid-cols-2 gap-4">
                           <DetailItem label="Agama" value={String(personel.agama || personel.religion || '-')} />
                           <DetailItem label="Gol. Darah" value={String(personel.golDarah || '-')} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <DetailItem label="Jenis Kelamin" value={String(personel.jenisKelamin || personel.gender || '-')} />
                           <DetailItem label="Status Nikah" value={String(personel.statusKawin || '-')} />
                        </div>
                        <DetailItem label="ID-PEGAWAI" value={String(personel.id || '-')} />
                        <DetailItem label="No. KTP" value={String(personel.noKtp || '-')} />
                        <div className="col-span-2"><DetailItem label="No. Kartu Keluarga" value={String(personel.noKk || '-')} /></div>
                        <div className="col-span-2"><DetailItem label="Pendidikan Terakhir" value={String(personel.pendidikan || personel.education || '-')} /></div>
                        <div className="col-span-2"><DetailItem label="Program Studi" value={String(personel.prodi || '-')} /></div>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                     <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                        <Phone size={16} className="text-[#1a73e8]"/> Informasi Kontak
                     </h4>
                     <div className="flex flex-col space-y-4">
                        <DetailItem label="Nomor Telepon / WA" value={String(personel.phone || '-')} />
                        <DetailItem label="Email Aktif" value={String(personel.email || '-')} />
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Provinsi" value={String(personel.provinsi || '-')} />
                            <DetailItem label="Kabupaten / Kota" value={String(personel.kota || '-')} />
                        </div>
                        <DetailItem label="Alamat Lengkap" value={String(personel.alamat || personel.addressDetail || '-')} />
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                     <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#1a73e8]"/> Informasi Pekerjaan
                     </h4>
                     <div className="flex flex-col space-y-4">
                        <DetailItem label="Organisasi / Divisi" value={String(personel.role || '-')} />
                        <DetailItem label="Posisi Penempatan" value={String(personel.penempatan || '-')} />
                        <div className="grid grid-cols-2 gap-4">
                           <DetailItem label="Mulai Bergabung" value={formatDateUI(personel.tglGabung)} />
                           <DetailItem label="Akhir Kontrak" value={formatDateUI(personel.tglBerakhir)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <DetailItem label="Target Hari Kerja" value={String(personel.hariKerja || '-')} />
                          <DetailItem label="Gaji / Upah" value={String(personel.gaji || '-')} />
                        </div>
                        <div className="flex flex-col mt-2 p-3 bg-[#e8f0fe] rounded-lg border border-[#d2e3fc]">
                            <span className="text-[10px] text-[#1a73e8] font-bold uppercase tracking-wider mb-1">Sandi Akun Karyawan</span>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900 tracking-widest">{showPass ? String(personel.password || '-') : '••••••••'}</span>
                                <button onClick={()=>setShowPass(!showPass)} className="text-[#1a73e8] hover:text-blue-800 transition-colors p-1">{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
}

function LogAbsensiModal({ personel, allAbsensi, cuti, appSettings, onClose }) {
  const [bulanStr, setBulanStr] = useState(() => MONTH_NAMES[new Date().getMonth()]);
  const { exportRowsRender, rawStats } = useMemo(() => getKaryawanStats(personel, allAbsensi, cuti, appSettings, bulanStr), [personel, allAbsensi, cuti, bulanStr, appSettings]);

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-[1500] flex items-center justify-center p-4 sm:p-10 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl flex flex-col max-h-full overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white shrink-0"><div><h3 className="text-xl font-normal text-gray-900">Analisis Log Kehadiran</h3><p className="text-sm text-gray-500 mt-1">{String(personel?.name || personel?.userName || '-')} • {String(personel?.role || '-')}</p></div><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20}/></button></div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
           <div className="flex justify-end w-full mb-4"><select className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700" value={bulanStr} onChange={e=>setBulanStr(e.target.value)}><option value="Semua">Semua Waktu</option>{MONTH_NAMES.map(m=><option key={String(m)} value={String(m)}>{String(m)}</option>)}</select></div>
           
           <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center"><CheckCircle size={24} className="text-[#188038] mb-2"/><p className="text-xl font-bold text-gray-900">{Math.max(0, rawStats.tHadir - rawStats.tTelat)}</p><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Hadir Tepat</p></div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center"><AlertCircle size={24} className="text-[#f29900] mb-2"/><p className="text-xl font-bold text-gray-900">{rawStats.tTelat}</p><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Terlambat</p></div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center"><XCircle size={24} className="text-[#c5221f] mb-2"/><p className="text-xl font-bold text-gray-900">{rawStats.tAlpha}</p><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Tanpa Keterangan</p></div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center"><Activity size={24} className="text-[#9333ea] mb-2"/><p className="text-xl font-bold text-gray-900">{rawStats.tSakit}</p><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Izin Sakit</p></div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center"><Clock size={24} className="text-[#f29900] mb-2"/><p className="text-xl font-bold text-gray-900">{rawStats.tIzin}</p><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Izin Pribadi</p></div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center"><FileText size={24} className="text-[#1a73e8] mb-2"/><p className="text-xl font-bold text-gray-900">{rawStats.tCuti}</p><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Cuti / Off</p></div>
           </div>

           <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-200 bg-gray-50/50"><h3 className="font-medium text-gray-800 text-sm">Rincian Log Absensi Individual</h3></div>
             <table className="w-full text-left">
                <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 text-left"><tr><th className="px-6 py-3 font-medium">Tanggal</th><th className="px-6 py-3 font-medium">Jam Masuk</th><th className="px-6 py-3 font-medium">Status Kehadiran</th><th className="px-6 py-3 font-medium">Istirahat</th><th className="px-6 py-3 font-medium">Kembali</th><th className="px-6 py-3 font-medium">Pulang</th><th className="px-6 py-3 font-medium">Catatan</th></tr></thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
                  {exportRowsRender.map((row, i) => (<tr key={String(row.tanggal || i)} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-3 text-xs">{String(row.tanggal || '-')}</td><td className="px-6 py-3 font-medium">{String(row.masuk || '-')}</td><td className="px-6 py-3 font-medium"><span className={`inline-block px-2 py-1 rounded text-[10px] uppercase font-bold border whitespace-nowrap ${String(row.bgStyle)}`}>{String(row.statusText || '-')}</span></td><td className="px-6 py-3">{String(row.istirahat || '-')}</td><td className="px-6 py-3">{String(row.kembali || '-')}</td><td className="px-6 py-3 font-medium">{String(row.pulang || '-')}</td><td className="px-6 py-3 text-xs">{String(row.patroli || '-')}</td></tr>))}
                  {exportRowsRender.length === 0 && (<tr><td colSpan="7" className="p-8 text-center text-gray-500">Tidak ada log absensi pada bulan ini.</td></tr>)}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}

function CutiTicketView({ list, karyawan, onPhoto, filterTanggal, setFilterTanggal, filterDivisi, setFilterDivisi, filterPenempatan, setFilterPenempatan, uniquePlacements = [], targetDateStr, onExport }) {
  const currentYear = new Date().getFullYear();
  const cutiStats = useMemo(() => {
    const stats = {};
    safeArray(karyawan).forEach(k => { if(k && k.id) stats[String(k.id)] = { taken: 0, sisa: 12 }; });
    safeArray(list).forEach(c => {
       if (!c || !c.userId) return;
       const type = String(c.type || '').toLowerCase();
       const status = String(c.status || '').toLowerCase();
       if (type.includes('cuti') && !status.includes('reject') && !status.includes('tolak')) {
           const { startDate, days } = hitungDurasiHari(c.start || c.tanggal || c.date);
           const uid = String(c.userId);
           if (startDate && startDate.getFullYear() === currentYear && stats[uid]) { 
               stats[uid].taken += days; 
               stats[uid].sisa = 12 - stats[uid].taken; 
           }
       }
    });
    return stats;
  }, [list, karyawan, currentYear]);

  const filteredList = useMemo(() => {
    try {
      return safeArray(list).filter(c => {
         if(!c) return false;
         let matchDate = true;
         if (filterTanggal) { const tDate = parseRobustDate(targetDateStr); if (tDate) matchDate = isDateInRange(tDate, c.start || c.tanggal || c.date); else matchDate = String(c.start || c.tanggal || c.date || '').toLowerCase().includes(String(filterTanggal).toLowerCase()); }
         const matchDiv = filterDivisi === 'Semua' || c.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || c.penempatan === filterPenempatan;
         return matchDate && matchDiv && matchPen;
      });
    } catch(e) { return []; }
  }, [list, filterTanggal, targetDateStr, filterDivisi, filterPenempatan]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
        <h3 className="font-medium text-base text-gray-800">Log Pengajuan Pegawai</h3>
        <div className="flex gap-3">
          <input type="date" value={filterTanggal} onChange={e=>setFilterTanggal(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700" />
          <button onClick={()=>setFilterTanggal('')} className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 transition-colors">Hari Ini</button>
          <select value={filterDivisi} onChange={e=>setFilterDivisi(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"><option value="Semua">Semua Divisi</option>{Object.keys(CATEGORY_SETTINGS).map(c => (<option key={String(c)} value={String(c)}>{String(c)}</option>))}</select>
          <select value={filterPenempatan} onChange={e=>setFilterPenempatan(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700 w-48 truncate"><option value="Semua">Semua Penempatan</option>{(uniquePlacements || []).map(p => (<option key={String(p)} value={String(p)}>{String(p)}</option>))}</select>
          <button onClick={onExport} className="bg-white text-[#188038] border border-gray-300 px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"><DownloadIcon size={16}/> Ekspor Excel</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 text-left">
              <tr><th className="px-6 py-3 font-medium">Pegawai & ID</th><th className="px-6 py-3 font-medium">Periode Pengajuan</th><th className="px-6 py-3 font-medium">Detail Keterangan</th><th className="px-6 py-3 font-medium text-center">Kuota Cuti Tahunan</th><th className="px-6 py-3 font-medium text-right">Lampiran Bukti</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {filteredList.map((c, i) => {
                const userStat = cutiStats[String(c.userId)] || { taken: 0, sisa: 12 };
                const { days } = hitungDurasiHari(c.start || c.tanggal || c.date);
                
                // Pemisahan Tanggal Mulai dan Selesai
                const rawDate = String(c.start || c.tanggal || c.date || '');
                let startD = formatDateUI(rawDate);
                let endD = formatDateUI(rawDate);
                let rawLower = rawDate.toLowerCase();
                
                if (rawLower.includes(' s/d ')) { const p = rawLower.split(' s/d '); startD = formatDateUI(p[0]); endD = formatDateUI(p[1]); }
                else if (rawLower.includes(' sd ')) { const p = rawLower.split(' sd '); startD = formatDateUI(p[0]); endD = formatDateUI(p[1]); }
                else if (rawLower.includes(' sampai ')) { const p = rawLower.split(' sampai '); startD = formatDateUI(p[0]); endD = formatDateUI(p[1]); }
                else if (rawLower.includes(' - ')) { const p = rawLower.split(' - '); startD = formatDateUI(p[0]); endD = formatDateUI(p[1]); }

                // Peningkatan Badge Warna Berdasarkan Kategori yang Ada di Aplikasi Pegawai
                let badgeStyle = 'bg-gray-50 text-gray-700 border-gray-200';
                const typeLower = String(c.type || '').toLowerCase();
                if (typeLower.includes('sakit')) badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
                else if (typeLower.includes('melahirkan')) badgeStyle = 'bg-pink-50 text-pink-700 border-pink-200';
                else if (typeLower.includes('cuti')) badgeStyle = 'bg-blue-50 text-[#1a73e8] border-blue-200';
                else if (typeLower.includes('izin') || typeLower.includes('telat')) badgeStyle = 'bg-yellow-50 text-yellow-700 border-yellow-200';

                return (
                <tr key={String(c.id || i)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 align-top"><div><p className="font-medium text-gray-900">{String(c.name || '-')}</p><p className="text-xs text-gray-500 mt-0.5">ID-PEGAWAI: {String(c.userId || '-')}</p></div></td>
                  <td className="px-6 py-4 align-top">
                    <div className="inline-flex flex-col gap-1 items-stretch bg-gray-50 p-2.5 rounded border border-gray-200 min-w-[180px]">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold text-center mb-1">Jadwal Cuti / Izin</span>
                      <div className="flex justify-between items-center w-full text-xs text-gray-500 gap-4">
                         <span>Mulai:</span>
                         <strong className="text-gray-900">{startD}</strong>
                      </div>
                      <div className="flex justify-between items-center w-full text-xs text-gray-500 gap-4">
                         <span>Selesai:</span>
                         <strong className="text-gray-900">{endD}</strong>
                      </div>
                      {days > 1 && (
                         <div className="mt-1 pt-1.5 border-t border-gray-200 w-full flex justify-center">
                           <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                             Total {days} Hari
                           </span>
                         </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-sm align-top">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border mb-1 inline-block ${badgeStyle}`}>{String(c.type || 'Izin')}</span>
                    <div className="text-gray-700 text-sm whitespace-pre-wrap mt-1"><span className="text-xs font-semibold text-gray-500 block mb-0.5">Alasan:</span>{String(c.reason || c.pesan || c.teks || '-')}</div>
                  </td>
                  <td className="px-6 py-4 align-top text-center">
                    {typeLower.includes('cuti') ? (
                       <div className="inline-flex flex-col gap-1 items-center bg-gray-50 p-2 rounded border border-gray-200">
                         <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Tiket Cuti</span>
                         <span className="text-xs text-gray-500">Telah Diambil: <strong className="text-gray-900">{String(userStat.taken)} Hari</strong></span>
                         <span className="text-xs text-gray-500">Sisa Kuota: <strong className="text-[#1a73e8]">{String(userStat.sisa)} Hari</strong></span>
                       </div>
                    ) : (
                       <span className="text-gray-400 text-xs italic">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex flex-col items-end gap-2">
                        {c.file || c.photo ? (
                          <button onClick={()=>onPhoto(c.file || c.photo)} className={`${typeLower.includes('sakit') ? 'text-purple-700 hover:bg-purple-50' : 'text-[#1a73e8] hover:bg-blue-50'} p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-medium border border-transparent hover:border-current`}>
                            <ImageIcon size={14}/> {typeLower.includes('sakit') ? 'Surat Sakit' : 'Lihat Lampiran'}
                          </button>
                        ) : <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100">Tanpa Lampiran</span>}
                    </div>
                  </td>
                </tr>
              )})}
              {filteredList.length === 0 && (<tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada pengajuan untuk filter waktu ini.</td></tr>)}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function LaporanView({ list, onPhoto, filterTanggal, setFilterTanggal, filterDivisi, setFilterDivisi, filterPenempatan, setFilterPenempatan, uniquePlacements = [], targetDateStr, onOpenBelumLapor, onExport }) {
  const filteredList = useMemo(() => {
    try {
      return safeArray(list).filter(l => {
         if(!l) return false;
         let matchDate = true;
         if (filterTanggal) { const lDate = parseRobustDate(l.tanggal || l.date); const tDate = parseRobustDate(targetDateStr); if (lDate && tDate) matchDate = lDate.getTime() === tDate.getTime(); else matchDate = String(l.tanggal || l.date || '').toLowerCase().includes(String(filterTanggal).toLowerCase()); }
         const matchDiv = filterDivisi === 'Semua' || l.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || l.penempatan === filterPenempatan;
         return matchDate && matchDiv && matchPen;
      }).sort((a, b) => { const tA = String(a.waktu || a.time || '').replace(/[^0-9]/g, ''); const tB = String(b.waktu || b.time || '').replace(/[^0-9]/g, ''); return Number(tB) - Number(tA); });
    } catch(e) { return []; }
  }, [list, filterDivisi, filterPenempatan, targetDateStr, filterTanggal]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
        <h3 className="font-medium text-base text-gray-800">Laporan Pekerjaan Harian</h3>
        <div className="flex gap-3">
          <input type="date" value={filterTanggal} onChange={e=>setFilterTanggal(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700" />
          <button onClick={()=>setFilterTanggal('')} className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 transition-colors">Hari Ini</button>
          <select value={filterDivisi} onChange={e=>setFilterDivisi(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"><option value="Semua">Semua Divisi</option>{Object.keys(CATEGORY_SETTINGS).map(c => (<option key={String(c)} value={String(c)}>{String(c)}</option>))}</select>
          <select value={filterPenempatan} onChange={e=>setFilterPenempatan(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700 w-48 truncate"><option value="Semua">Semua Penempatan</option>{(uniquePlacements || []).map(p => (<option key={String(p)} value={String(p)}>{String(p)}</option>))}</select>
          <button onClick={onOpenBelumLapor} className="bg-white text-[#d93025] border border-gray-300 px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"><AlertCircle size={16}/> Cek Belum Lapor</button>
          <button onClick={onExport} className="bg-white text-[#188038] border border-gray-300 px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"><DownloadIcon size={16}/> Ekspor Excel</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 text-left">
              <tr><th className="px-6 py-3 font-medium">Pegawai</th><th className="px-6 py-3 font-medium">Waktu Laporan</th><th className="px-6 py-3 font-medium">Deskripsi Pekerjaan</th><th className="px-6 py-3 font-medium text-right">Lampiran Foto</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {filteredList.map((l, i) => (
                <tr key={String(l?.id || i)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 align-top"><div><p className="font-medium text-gray-900">{String(l.nama || l.name || '-')}</p><p className="text-xs text-gray-500 mt-0.5">{String(l.role || '-')} • {String(l.penempatan || '-')}</p></div></td>
                  <td className="px-6 py-4 align-top text-xs text-gray-600">{String(l.waktu || l.time || '-')}</td>
                  <td className="px-6 py-4 max-w-lg align-top"><p className="text-gray-700 text-sm whitespace-pre-wrap">{String(l.teks || l.text || '-')}</p></td>
                  <td className="px-6 py-4 align-top text-right">{l.photo ? (<button onClick={()=>onPhoto(l.photo)} className="text-[#1a73e8] hover:text-[#1557b0] p-2 hover:bg-blue-50 rounded-full transition-colors inline-block"><ImageIcon size={20}/></button>) : <span className="text-gray-400 text-xs">Tanpa Foto</span>}</td>
                </tr>
              ))}
              {filteredList.length === 0 && (<tr><td colSpan="4" className="p-8 text-center text-gray-500">Belum ada laporan kerja untuk filter waktu ini.</td></tr>)}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function StatistikKaryawanView({ list, absensi, validCuti, appSettings, filterDivisi, setFilterDivisi, filterPenempatan, setFilterPenempatan, searchTerm, uniquePlacements = [], onSelect, onExportAll }) {
  const [bulanStr, setBulanStr] = useState(() => MONTH_NAMES[new Date().getMonth()]);

  const filteredList = useMemo(() => {
    try {
      return safeArray(list).filter(k => {
        if(!k || !k.id) return false;
        const matchDiv = filterDivisi === 'Semua' || k.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || k.penempatan === filterPenempatan;
        const matchSearch = searchTerm === '' || String(k.name || "").toLowerCase().includes(String(searchTerm || "").toLowerCase()) || String(k.id || "").toLowerCase().includes(String(searchTerm || "").toLowerCase());
        return matchDiv && matchPen && matchSearch;
      });
    } catch(e) { return []; }
  }, [list, filterDivisi, filterPenempatan, searchTerm]);

  const topOffenders = useMemo(() => {
     const calculated = filteredList.map(k => { const { rawStats } = getKaryawanStats(k, absensi, validCuti, appSettings, bulanStr); return { k, stats: rawStats }; });
     return {
        telat: [...calculated].filter(x => x?.stats?.tTelat > 0).sort((a,b) => (b?.stats?.tTelat || 0) - (a?.stats?.tTelat || 0)).slice(0, 3),
        alpha: [...calculated].filter(x => x?.stats?.tAlpha > 0).sort((a,b) => (b?.stats?.tAlpha || 0) - (a?.stats?.tAlpha || 0)).slice(0, 3),
        izinSakit: [...calculated].filter(x => ((x?.stats?.tIzin || 0) + (x?.stats?.tSakit || 0)) > 0).sort((a,b) => ((b?.stats?.tIzin || 0) + (b?.stats?.tSakit || 0)) - ((a?.stats?.tIzin || 0) + (a?.stats?.tSakit || 0))).slice(0, 3),
     };
  }, [filteredList, absensi, validCuti, appSettings, bulanStr]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-in fade-in shadow-sm">
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
          <div><h3 className="font-medium text-base text-gray-800">Statistik Kinerja Pegawai</h3></div>
          <div className="flex gap-3">
              <select value={bulanStr} onChange={e=>setBulanStr(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-800"><option value="Semua">Semua Bulan</option>{MONTH_NAMES.map(m=><option key={String(m)} value={String(m)}>{String(m)}</option>)}</select>
              <select value={filterDivisi} onChange={e=>setFilterDivisi(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700"><option value="Semua">Semua Divisi</option>{Object.keys(CATEGORY_SETTINGS).map(c => (<option key={String(c)} value={String(c)}>{String(c)}</option>))}</select>
              <select value={filterPenempatan} onChange={e=>setFilterPenempatan(e.target.value)} className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700 w-48 truncate"><option value="Semua">Semua Penempatan</option>{(uniquePlacements || []).map(p => (<option key={String(p)} value={String(p)}>{String(p)}</option>))}</select>
              <button onClick={() => onExportAll(bulanStr)} className="bg-white text-[#188038] border border-gray-300 px-4 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"><DownloadIcon size={16}/> Rekap Excel</button>
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 border-b border-gray-200">
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><h4 className="text-xs font-medium text-[#d93025] mb-3 flex items-center gap-2"><AlertCircle size={14}/> Sering Terlambat</h4>{topOffenders.telat.map((k, idx) => <div key={String(k?.k?.id || idx)} className="flex justify-between items-center text-sm mb-2"><span className="text-gray-700 truncate mr-2">{String(k?.k?.name || '-')}</span><span className="font-medium text-gray-900 bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs">{String(k?.stats?.tTelat || 0)}x</span></div>)}{topOffenders.telat.length === 0 && <span className="text-xs text-gray-400">Tidak ada pegawai yang telat.</span>}</div>
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><h4 className="text-xs font-medium text-red-700 mb-3 flex items-center gap-2"><XCircle size={14}/> Sering Alpha</h4>{topOffenders.alpha.map((k, idx) => <div key={String(k?.k?.id || idx)} className="flex justify-between items-center text-sm mb-2"><span className="text-gray-700 truncate mr-2">{String(k?.k?.name || '-')}</span><span className="font-medium text-gray-900 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">{String(k?.stats?.tAlpha || 0)}x</span></div>)}{topOffenders.alpha.length === 0 && <span className="text-xs text-gray-400">Tidak ada pegawai yang alpha.</span>}</div>
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><h4 className="text-xs font-medium text-yellow-600 mb-3 flex items-center gap-2"><Clock size={14}/> Sering Izin/Sakit</h4>{topOffenders.izinSakit.map((k, idx) => <div key={String(k?.k?.id || idx)} className="flex justify-between items-center text-sm mb-2"><span className="text-gray-700 truncate mr-2">{String(k?.k?.name || '-')}</span><span className="font-medium text-gray-900 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs">{String((k?.stats?.tIzin || 0) + (k?.stats?.tSakit || 0))}x</span></div>)}{topOffenders.izinSakit.length === 0 && <span className="text-xs text-gray-400">Tidak ada pegawai yang izin.</span>}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-xs font-medium text-gray-500 border-b border-gray-200 text-left"><tr><th className="px-6 py-3 font-medium">Pegawai</th><th className="px-6 py-3 font-medium">Divisi & Penempatan</th><th className="px-6 py-3 font-medium text-center">Status Akun</th><th className="px-6 py-3 font-medium text-right">Analisis Rekap</th></tr></thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 bg-white">
              {filteredList.map((k, i) => (
                <tr key={String(k?.id || i)} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3 cursor-pointer" onClick={() => onSelect(k)}><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">{k.photo ? <img src={k.photo} className="w-full h-full object-cover" alt="Foto Profil" /> : <UserCircle size={20}/>}</div><div><p className="text-gray-900 font-medium hover:text-[#1a73e8] transition-colors">{String(k.name || '-')}</p><p className="text-xs text-gray-500 mt-0.5">ID-PEGAWAI: {String(k.id || '-')}</p></div></td>
                  <td className="px-6 py-4"><p className="text-sm text-gray-900">{String(k.role || '-')}</p><p className="text-xs text-gray-500 mt-0.5">{String(k.penempatan || '-')}</p></td>
                  <td className="px-6 py-4 text-center"><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-200">Aktif Bekerja</span></td>
                  <td className="px-6 py-4 text-right"><button onClick={()=>onSelect(k)} className="text-[#1a73e8] hover:bg-[#e8f0fe] py-1.5 rounded font-medium text-sm flex items-center gap-1.5 ml-auto px-3 transition-colors border border-[#1a73e8]"><PieChart size={16}/> Lihat Grafik</button></td>
                </tr>
              ))}
              {filteredList.length === 0 && (<tr><td colSpan="4" className="p-8 text-center text-gray-500">Tidak ada data pegawai yang sesuai pencarian/filter.</td></tr>)}
            </tbody>
        </table>
      </div>
    </div>
  );
}

function BelumLaporModal({ karyawanList, laporanList, filterTanggal, targetDateStr, filterDivisi, filterPenempatan, groupedAbsensi, onClose }) {
  const filteredKaryawan = useMemo(() => {
    try {
      return safeArray(karyawanList).filter(k => {
        if(!k || !k.id) return false;
        const matchDiv = filterDivisi === 'Semua' || k.role === filterDivisi; const matchPen = filterPenempatan === 'Semua' || k.penempatan === filterPenempatan;
        return matchDiv && matchPen;
      });
    } catch(e) { return []; }
  }, [karyawanList, filterDivisi, filterPenempatan]);

  const filteredLaporan = useMemo(() => {
    try {
      return safeArray(laporanList).filter(l => {
          if(!l) return false; let matchDate = true;
          if (filterTanggal) { const lDate = parseRobustDate(l.tanggal || l.date); const tDate = parseRobustDate(targetDateStr); if(lDate && tDate) matchDate = lDate.getTime() === tDate.getTime(); else matchDate = String(l.tanggal || l.date || '').toLowerCase().includes(String(filterTanggal).toLowerCase()); }
          return matchDate;
      });
    } catch(e) { return []; }
  }, [laporanList, filterTanggal, targetDateStr]);

  const laporUserIds = new Set(filteredLaporan.map(l => String(l.userId || l.id || l.nama || l.name).toLowerCase()));
  const belumLapor = filteredKaryawan.filter(k => !laporUserIds.has(String(k.id).toLowerCase()) && !laporUserIds.has(String(k.name).toLowerCase()));

  const getStatusBadge = (uid) => {
     const st = safeArray(groupedAbsensi).find(g => String(g.userId) === String(uid));
     if (st) {
        if (st.pengajuan === 'CUTI') return <span className="text-[#1a73e8] bg-blue-50 px-2 py-1 rounded text-[10px] font-bold border border-blue-200 uppercase">Cuti</span>;
        if (st.pengajuan === 'SAKIT') return <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded text-[10px] font-bold border border-purple-200 uppercase">Sakit</span>;
        if (st.pengajuan === 'IZIN') return <span className="text-yellow-700 bg-yellow-50 px-2 py-1 rounded text-[10px] font-bold border border-yellow-200 uppercase">Izin</span>;
        if (st.statusText && st.statusText.includes('LIBUR')) return <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold border border-slate-300 uppercase">Libur</span>;
     }
     return <span className="text-gray-500 text-[10px] bg-gray-100 px-2 py-1 rounded border border-gray-200 font-medium uppercase">Belum Lapor</span>;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-[1500] flex items-center justify-center p-4 sm:p-10 animate-in fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-full overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
          <div><h3 className="text-xl font-normal text-gray-900">Belum Mengumpulkan Laporan</h3><p className="text-sm text-gray-500 mt-1">{String(targetDateStr || 'Hari Ini')} • {String(belumLapor.length)} Pegawai</p></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
          {belumLapor.length === 0 ? (<div className="p-10 text-center text-gray-500">Semua pegawai telah melapor pada tanggal ini.</div>) : (
             <div className="space-y-4">
               {belumLapor.map((k, i) => (
                  <div key={String(k?.id || i)} className="p-4 rounded border border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                     <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden border border-gray-200 flex shrink-0 justify-center items-center">{k.photo ? <img src={k.photo} className="w-full h-full object-cover" alt="Profile" /> : <UserCircle size={20} className="text-gray-400"/>}</div>
                     <div className="flex-1"><h4 className="font-medium text-gray-900 text-sm">{String(k.name || '-')}</h4><p className="text-xs text-gray-500 mt-0.5">{String(k.role || '-')}</p></div>
                     <div className="text-right">{getStatusBadge(k.id)}</div>
                  </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BantuanView({ pesan, onUpdate }) {
  const [reply, setReply] = useState({});
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50"><h3 className="font-medium text-base text-gray-800">Tiket Bantuan & Dukungan</h3></div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {safeArray(pesan).map((p, i) => {
            const keyId = String(p?.id || p?.timestamp || i);
            return (
            <div key={keyId} className="border border-gray-200 rounded-lg p-6 flex flex-col relative hover:shadow-md transition-shadow">
              <div className={`absolute top-4 right-4 px-2.5 py-1 rounded text-[10px] font-medium uppercase ${p.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>{String(p.status || '-')}</div>
              <div className="flex items-center gap-4 mb-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${String(p.type || '').includes('Sandi') ? 'bg-red-50 text-red-600' : 'bg-[#e8f0fe] text-[#1a73e8]'}`}>{String(p.type || '').includes('Sandi') ? <Key size={20}/> : <MessageSquare size={20}/>}</div><div><p className="font-medium text-gray-900">{String(p.nama || p.name || '-')}</p><p className="text-xs text-gray-500 mt-0.5">ID-PEGAWAI: {String(p.userId || '-')}</p></div></div>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 mb-4 flex-1 border border-gray-100">"{String(p.pesan || p.teks || '-')}"</div>
              {p.status === 'Pending' && (
                <div className="space-y-3 mt-auto">
                  <input type="text" placeholder="Tulis balasan..." className="w-full bg-white border border-gray-300 p-2.5 rounded text-sm outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]" value={reply[keyId] || ''} onChange={(e)=>setReply({...reply, [keyId]: e.target.value})} />
                  <button onClick={()=>onUpdate(p, 'Selesai', reply[keyId] || 'Silakan cek kembali, kendala/sandi telah ditangani.')} className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors">Kirim Balasan</button>
                </div>
              )}
              {p.balasan && (<div className="mt-4 p-4 bg-[#e8f0fe] text-[#1967d2] rounded-md text-sm flex gap-2 items-start border border-[#d2e3fc]"><ShieldCheck size={18} className="shrink-0 mt-0.5" /><span>{String(p.balasan)}</span></div>)}
            </div>
          )})}
          {safeArray(pesan).length === 0 && (<div className="col-span-1 md:col-span-2 p-16 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">Tidak ada tiket bantuan yang masuk.</div>)}
        </div>
      </div>
    </div>
  );
}

function BroadcastView({ list, onSend }) {
  const [msg, setMsg] = useState('');
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center mb-6"><div className="w-16 h-16 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-4 text-[#1a73e8]"><Megaphone size={28}/></div><h3 className="text-xl font-normal text-gray-900">Pesan Siaran (Broadcast)</h3><p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Pesan yang Anda kirim di sini akan muncul di bagian atas aplikasi absensi seluruh pegawai.</p></div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-left mb-8"><label className="text-sm font-medium text-gray-700 mb-2 block">Isi Pengumuman</label><textarea placeholder="Tuliskan pengumuman penting..." className="w-full h-32 bg-white border border-gray-300 rounded-md p-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1a73e8] resize-none transition-all" value={msg} onChange={(e)=>setMsg(e.target.value)}></textarea><div className="flex justify-end mt-4"><button onClick={() => { if(msg) { onSend(msg); setMsg(''); } }} className="bg-[#1a73e8] hover:bg-[#1557b0] text-white py-2 px-6 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"><Send size={16}/> Kirim Siaran</button></div></div>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden text-left">
        <div className="p-4 border-b border-gray-200 bg-gray-50"><h3 className="font-medium text-sm text-gray-700">Riwayat Siaran Terakhir</h3></div>
        <div className="p-6">
           {safeArray(list).length === 0 && (<p className="text-center text-gray-500 text-sm py-6">Belum ada siaran yang dikirim.</p>)}
           <div className="space-y-4">
              {safeArray(list).slice().reverse().map((b, i) => (
                  <div key={i} className="border border-gray-200 p-4 rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center shrink-0"><Megaphone size={18}/></div><div><p className="font-medium text-sm text-gray-900">{String(b.message || '-')}</p><p className="text-xs text-gray-500 mt-1">{String(b.date || '-')} • {String(b.time || '-')}</p></div></div><span className="bg-green-50 text-green-700 px-2 py-1 text-xs font-medium rounded border border-green-200">Terkirim</span></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ appSettings, setAppSettings }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-left animate-in fade-in shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6"><div className="w-12 h-12 bg-[#e8f0fe] text-[#1a73e8] rounded-full flex items-center justify-center"><Settings size={24}/></div><div><h3 className="text-xl font-normal text-gray-900">Konfigurasi Waktu Operasional</h3><p className="text-sm text-gray-500 mt-1">Atur batas waktu untuk menentukan status keterlambatan absensi otomatis.</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden"><div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2"><Briefcase size={18} className="text-gray-600"/><h4 className="font-medium text-sm text-gray-800">Administrasi Umum</h4></div><div className="p-6 grid grid-cols-2 gap-4"><TimeInput label="Jam Masuk" value={appSettings?.Umum_Masuk || '08:00'} onChange={(v) => setAppSettings({...appSettings, Umum_Masuk: v})} /><TimeInput label="Jam Istirahat" value={appSettings?.Umum_Istirahat || '12:00'} onChange={(v) => setAppSettings({...appSettings, Umum_Istirahat: v})} /><TimeInput label="Kembali Istirahat" value={appSettings?.Umum_Kembali || '13:00'} onChange={(v) => setAppSettings({...appSettings, Umum_Kembali: v})} /><TimeInput label="Jam Pulang" value={appSettings?.Umum_Pulang || '16:00'} onChange={(v) => setAppSettings({...appSettings, Umum_Pulang: v})} /></div></div>
          <div className="border border-gray-200 rounded-lg overflow-hidden"><div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2"><Leaf size={18} className="text-gray-600"/><h4 className="font-medium text-sm text-gray-800">Kebersihan Lapangan</h4></div><div className="p-6 grid grid-cols-2 gap-4"><TimeInput label="Jam Masuk" value={appSettings?.Kebersihan_Masuk || '06:00'} onChange={(v) => setAppSettings({...appSettings, Kebersihan_Masuk: v})} /><TimeInput label="Jam Pulang" value={appSettings?.Kebersihan_Pulang || '14:00'} onChange={(v) => setAppSettings({...appSettings, Kebersihan_Pulang: v})} /></div></div>
          <div className="border border-gray-200 rounded-lg overflow-hidden"><div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2"><ShieldCheck size={18} className="text-gray-600"/><h4 className="font-medium text-sm text-gray-800">Keamanan & Sekuriti</h4></div><div className="p-6 grid grid-cols-2 gap-4"><TimeInput label="Shift Pagi Masuk" value={appSettings?.Sekuriti_Pagi || '07:00'} onChange={(v) => setAppSettings({...appSettings, Sekuriti_Pagi: v})} /><TimeInput label="Shift Malam Masuk" value={appSettings?.Sekuriti_Malam || '19:00'} onChange={(v) => setAppSettings({...appSettings, Sekuriti_Malam: v})} /><div className="col-span-2"><TimeInput label="Batas Setor Titik Patroli" value={appSettings?.Sekuriti_Patroli || '23:00'} onChange={(v) => setAppSettings({...appSettings, Sekuriti_Patroli: v})} /></div></div></div>
          <div className="border border-gray-200 rounded-lg overflow-hidden"><div className="bg-white p-4 border-b border-gray-200 flex items-center gap-2"><Activity size={18} className="text-gray-600"/><h4 className="font-medium text-sm text-gray-800">Tenaga Medis (RSUD)</h4></div><div className="p-6 grid grid-cols-2 gap-4"><TimeInput label="Shift Pagi Masuk" value={appSettings?.Kesehatan_Pagi || '07:00'} onChange={(v) => setAppSettings({...appSettings, Kesehatan_Pagi: v})} /><TimeInput label="Shift Siang Masuk" value={appSettings?.Kesehatan_Siang || '14:00'} onChange={(v) => setAppSettings({...appSettings, Kesehatan_Siang: v})} /><TimeInput label="Shift Malam Masuk" value={appSettings?.Kesehatan_Malam || '21:00'} onChange={(v) => setAppSettings({...appSettings, Kesehatan_Malam: v})} /></div></div>
      </div>
    </div>
  );
}

function TimeInput({ label, value, onChange }) { 
  return ( 
    <div className="flex flex-col gap-1.5"><label className="text-xs text-gray-600 font-medium">{String(label)}</label><input type="time" value={String(value)} onChange={(e) => onChange(e.target.value)} className="w-full bg-white border border-gray-300 p-2 rounded-md text-sm text-gray-900 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-all" /></div> 
  ); 
}

function MenuBtn({ icon: Icon, label, active, onClick, badge }) { 
  return ( 
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-3 mb-1 transition-all group ${active ? 'bg-[#e8f0fe] text-[#1967d2] rounded-r-full mr-4' : 'text-gray-600 hover:bg-[#f1f3f4] hover:text-gray-900 rounded-r-full mr-4'}`}><div className="flex items-center gap-4"><Icon size={20} className={active ? 'text-[#1967d2]' : 'text-gray-500 group-hover:text-gray-700'} /><span className={`text-sm ${active ? 'font-medium' : 'font-normal'}`}>{String(label)}</span></div>{badge > 0 && (<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${active ? 'bg-[#1967d2] text-white' : 'bg-gray-200 text-gray-700'}`}>{String(badge)}</span>)}</button> 
  ); 
}

// ==========================================
// MODAL STATISTIK PEGAWAI (GRAFIK PERFORMA)
// ==========================================
function StatistikPegawaiModal({ personel, allAbsensi, cuti, appSettings, onClose }) {
  const [bulanStr, setBulanStr] = useState('Semua');
  const { rawStats } = useMemo(() => getKaryawanStats(personel, allAbsensi, cuti, appSettings, bulanStr), [personel, allAbsensi, cuti, bulanStr, appSettings]);

  const totalHadirKerja = rawStats.tHadir + rawStats.tAlpha + rawStats.tIzin + rawStats.tSakit + rawStats.tTelat;
  const totalKehadiran = rawStats.tHadir;
  const persentaseKehadiran = totalHadirKerja > 0 ? Math.round((totalKehadiran / totalHadirKerja) * 100) : 0;

  // Fungsi untuk ekspor data spesifik 1 pegawai
  const handleExportSingle = () => {
    const exportRows = [{
      'Nama Pegawai': personel?.name || personel?.userName || '-',
      'Divisi': personel?.role || '-',
      'Tempat Kerja (Penempatan)': personel?.penempatan || '-',
      'Total Hadir (Tepat Waktu)': Math.max(0, rawStats.tHadir - rawStats.tTelat),
      'Total Terlambat': rawStats.tTelat,
      'Total Izin': rawStats.tIzin,
      'Total Sakit': rawStats.tSakit,
      'Total Cuti': rawStats.tCuti,
      'Total Libur / Off': rawStats.tLibur,
      'Total Tanpa Keterangan (Alpha)': rawStats.tAlpha
    }];
    
    const namaFile = String(personel?.name || 'Pegawai').replace(/\s+/g, '_');
    const judul = `REKAPITULASI KINERJA - ${String(personel?.name || 'PEGAWAI').toUpperCase()} - BULAN ${bulanStr.toUpperCase()}`;
    
    exportDataToExcel(exportRows, judul, `Rekap_${namaFile}`, '');
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 z-[2000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 text-left">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
           <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><PieChart size={24} className="text-[#1a73e8]" /> Statistik Kinerja Pegawai</h2>
              <p className="text-sm text-gray-500 mt-1">{String(personel?.name || personel?.userName || '-')} • {String(personel?.penempatan || '-')}</p>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={handleExportSingle} className="bg-white text-[#188038] border border-gray-300 px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-1.5 hover:bg-gray-100 transition-colors shadow-sm">
                 <DownloadIcon size={16}/> Rekap Excel
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"><X size={20}/></button>
           </div>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
           <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800">Ringkasan Performa</h3>
              <select className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-gray-700" value={bulanStr} onChange={e=>setBulanStr(e.target.value)}>
                <option value="Semua">Semua Waktu</option>
                {MONTH_NAMES.map(m=><option key={String(m)} value={String(m)}>{String(m)}</option>)}
              </select>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Persentase Kehadiran */}
              <div className="md:col-span-1 bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center border border-blue-100 shadow-sm text-center">
                 <div className="w-32 h-32 rounded-full border-8 border-[#1a73e8] flex items-center justify-center bg-white shadow-inner mb-4">
                    <span className="text-3xl font-bold text-[#1a73e8]">{persentaseKehadiran}%</span>
                 </div>
                 <h4 className="font-semibold text-gray-800">Tingkat Kehadiran</h4>
                 <p className="text-xs text-gray-500 mt-1">Berdasarkan total hari kerja aktif</p>
              </div>

              {/* Visualisasi Bar Grafik */}
              <div className="md:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center space-y-5">
                  <StatBar label="Hadir Tepat Waktu" value={Math.max(0, rawStats.tHadir - rawStats.tTelat)} color="bg-[#188038]" total={totalHadirKerja} />
                  <StatBar label="Terlambat Masuk" value={rawStats.tTelat} color="bg-[#f29900]" total={totalHadirKerja} />
                  <StatBar label="Izin Pribadi" value={rawStats.tIzin} color="bg-yellow-400" total={totalHadirKerja} />
                  <StatBar label="Sakit" value={rawStats.tSakit} color="bg-[#9333ea]" total={totalHadirKerja} />
                  <StatBar label="Tanpa Keterangan (Alpha)" value={rawStats.tAlpha} color="bg-[#d93025]" total={totalHadirKerja} />
              </div>
           </div>

           {/* Info Tambahan */}
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center"><p className="text-2xl font-bold text-gray-800">{rawStats.tCuti}</p><p className="text-xs font-medium text-gray-500 uppercase mt-1">Total Cuti</p></div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center"><p className="text-2xl font-bold text-gray-800">{rawStats.tLibur}</p><p className="text-xs font-medium text-gray-500 uppercase mt-1">Libur / Off Shift</p></div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center"><p className="text-2xl font-bold text-gray-800">{rawStats.tHadir}</p><p className="text-xs font-medium text-gray-500 uppercase mt-1">Total Absen Masuk</p></div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center"><p className="text-2xl font-bold text-red-600">{rawStats.tAlpha}</p><p className="text-xs font-medium text-gray-500 uppercase mt-1">Total Hari Alpha</p></div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Helper Grafik Batang
function StatBar({ label, value, color, total }) {
   const pct = total > 0 ? Math.round((value / total) * 100) : 0;
   return (
      <div className="flex flex-col gap-1">
         <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>{label}</span>
            <span>{value} Hari ({pct}%)</span>
         </div>
         <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }}></div>
         </div>
      </div>
   );
}