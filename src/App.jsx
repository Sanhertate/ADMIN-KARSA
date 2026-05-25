import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { initializeApp, getApps } from "firebase/app";
import { get, getDatabase, onValue, push, ref, remove, set, update } from "firebase/database";
import {
  Activity,
  AlertCircle,
  Bell,
  BarChart3,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Home,
  IdCard,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCircle2,
  Users,
  X,
} from "lucide-react";

// Firebase Realtime Database
// Install package di project Vite: npm install firebase
const FIREBASE_CONFIG = {
  databaseURL: "https://database-karsa-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
const realtimeDb = getDatabase(firebaseApp);

const FIREBASE_ROOT = "karsa_absensi";

// Compact Admin UI Density
// Membuat seluruh panel lebih padat seperti dashboard admin operasional:
// card lebih rendah, tombol tidak terlalu besar, form lebih ringkas, dan ruang kosong berkurang.
if (typeof document !== "undefined" && !document.getElementById("karsa-compact-admin-ui")) {
  const compactStyle = document.createElement("style");
  compactStyle.id = "karsa-compact-admin-ui";
  compactStyle.textContent = `
    /* Eye comfort patch: tampilan lebih adem, tidak terlalu tajam */
    :root {
      --karsa-blue: #2f6fed;
      --karsa-blue-soft: #edf5ff;
      --karsa-blue-border: #cfe1ff;
      --karsa-text-soft: #334155;
    }

    #root {
      -webkit-font-smoothing: antialiased;
      text-rendering: geometricPrecision;
    }

    #root [class*="bg-blue-600"],
    #root button[class*="bg-blue"],
    #root [class*="from-blue"] {
      background: linear-gradient(135deg, #2f6fed, #4f8df8) !important;
      box-shadow: 0 8px 18px rgba(47, 111, 237, 0.18) !important;
    }

    #root [class*="text-blue-700"],
    #root [class*="text-blue-600"] {
      color: #245ed8 !important;
    }

    #root [class*="bg-blue-100"],
    #root [class*="bg-blue-50"] {
      background: var(--karsa-blue-soft) !important;
    }

    #root [class*="ring-blue"],
    #root [class*="border-blue"] {
      border-color: var(--karsa-blue-border) !important;
      --tw-ring-color: var(--karsa-blue-border) !important;
    }

    /* Jam Kerja: baris lebih adem dan tidak terlalu mencolok */
    #root h1 + p,
    #root h2 + p,
    #root h3 + p {
      color: #64748b !important;
      font-weight: 650 !important;
    }

    #root [class*="Jam Kerja"] *,
    #root [class*="jam kerja"] * {
      letter-spacing: -0.02em;
    }

    :root {
      --karsa-bg: #eef4fb;
      --karsa-panel: #ffffff;
      --karsa-panel-soft: #f8fbff;
      --karsa-border: #dbe7f5;
      --karsa-text: #0f172a;
      --karsa-muted: #64748b;
      --karsa-blue: #2563eb;
      --karsa-blue-dark: #1d4ed8;
      --karsa-green: #059669;
      --karsa-red: #dc2626;
      --karsa-radius: 18px;
      --karsa-radius-sm: 12px;
      --karsa-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
    }

    html,
    body,
    #root {
      width: 100%;
      min-height: 100%;
      background: var(--karsa-bg) !important;
      color: var(--karsa-text);
    }

    body {
      overflow: hidden;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    #root {
      font-size: 13px;
    }

    #root * {
      box-sizing: border-box;
    }

    #root h1,
    #root h2,
    #root h3 {
      color: var(--karsa-text) !important;
      letter-spacing: -0.045em;
      line-height: 1.05 !important;
    }

    #root h1 { font-size: clamp(24px, 1.9vw, 32px) !important; }
    #root h2 { font-size: clamp(21px, 1.6vw, 28px) !important; }
    #root h3 { font-size: 16px !important; }

    #root p,
    #root span,
    #root label,
    #root td,
    #root th {
      line-height: 1.32 !important;
    }

    #root p,
    #root label,
    #root td {
      color: inherit;
    }

    #root [class*="text-slate-400"],
    #root [class*="text-slate-500"],
    #root [class*="text-slate-600"] {
      color: var(--karsa-muted) !important;
    }

    /* Layout utama dibuat seperti admin dashboard PKW / SiapKerja */
    #root [class*="min-h-screen"] {
      min-height: 100vh !important;
      max-height: 100vh !important;
      background: var(--karsa-bg) !important;
      padding: 14px !important;
    }

    #root [class*="max-w-7xl"],
    #root [class*="max-w-6xl"],
    #root [class*="max-w-5xl"] {
      max-width: min(1540px, calc(100vw - 28px)) !important;
    }

    #root main,
    #root [role="main"] {
      gap: 12px !important;
      overflow: hidden !important;
    }

    /* Panel, card, dan section */
    #root [class*="bg-white"] {
      background: var(--karsa-panel) !important;
    }

    #root [class*="shadow"],
    #root [class*="shadow-xl"],
    #root [class*="shadow-2xl"] {
      box-shadow: var(--karsa-shadow) !important;
    }

    #root [class*="ring-slate"],
    #root [class*="border-slate"] {
      border-color: var(--karsa-border) !important;
      --tw-ring-color: var(--karsa-border) !important;
    }

    #root [class*="rounded-[3rem]"],
    #root [class*="rounded-[2.5rem]"],
    #root [class*="rounded-[2rem]"] {
      border-radius: 24px !important;
    }

    #root [class*="rounded-[1.5rem]"] {
      border-radius: var(--karsa-radius) !important;
    }

    #root [class*="rounded-2xl"] {
      border-radius: var(--karsa-radius-sm) !important;
    }

    /* Density: hilangkan space kosong berlebihan */
    #root [class*="p-8"] { padding: 20px !important; }
    #root [class*="p-7"] { padding: 18px !important; }
    #root [class*="p-6"] { padding: 16px !important; }
    #root [class*="p-5"] { padding: 14px !important; }
    #root [class*="p-4"] { padding: 11px !important; }
    #root [class*="px-8"] { padding-left: 18px !important; padding-right: 18px !important; }
    #root [class*="px-6"] { padding-left: 15px !important; padding-right: 15px !important; }
    #root [class*="py-6"] { padding-top: 15px !important; padding-bottom: 15px !important; }
    #root [class*="py-5"] { padding-top: 12px !important; padding-bottom: 12px !important; }
    #root [class*="py-4"] { padding-top: 9px !important; padding-bottom: 9px !important; }

    #root [class*="gap-8"] { gap: 16px !important; }
    #root [class*="gap-6"] { gap: 13px !important; }
    #root [class*="gap-5"] { gap: 11px !important; }
    #root [class*="gap-4"] { gap: 10px !important; }
    #root [class*="gap-3"] { gap: 8px !important; }

    #root [class*="mt-8"] { margin-top: 16px !important; }
    #root [class*="mt-6"] { margin-top: 13px !important; }
    #root [class*="mt-5"] { margin-top: 10px !important; }
    #root [class*="mt-4"] { margin-top: 9px !important; }
    #root [class*="mb-6"] { margin-bottom: 13px !important; }
    #root [class*="mb-5"] { margin-bottom: 10px !important; }
    #root [class*="mb-4"] { margin-bottom: 9px !important; }

    /* Sidebar seperti panel admin operasional */
    #root aside,
    #root nav[class*="bg-white"] {
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
      border: 1px solid var(--karsa-border) !important;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06) !important;
    }

    #root aside button,
    #root nav button,
    #root aside a,
    #root nav a {
      min-height: 36px !important;
      padding: 7px 11px !important;
      border-radius: 12px !important;
      font-size: 12px !important;
      font-weight: 800 !important;
    }

    #root aside button[class*="bg-blue"],
    #root nav button[class*="bg-blue"],
    #root aside a[class*="bg-blue"],
    #root nav a[class*="bg-blue"] {
      background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
      color: white !important;
      box-shadow: 0 10px 22px rgba(37, 99, 235, 0.25) !important;
    }

    /* Header halaman lebih padat dan premium */
    #root main > div:first-child,
    #root main > section:first-child,
    #root [role="main"] > div:first-child,
    #root [role="main"] > section:first-child {
      min-height: auto !important;
      border: 1px solid var(--karsa-border) !important;
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
    }

    /* Icon kotak biru */
    #root [class*="bg-blue-600"],
    #root [class*="from-blue"],
    #root [class*="to-blue"] {
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22) !important;
    }

    #root [class*="h-20"] { height: 52px !important; }
    #root [class*="h-16"] { height: 46px !important; }
    #root [class*="h-14"] { height: 42px !important; }
    #root [class*="h-12"] { height: 38px !important; }
    #root [class*="h-10"] { height: 34px !important; }
    #root [class*="w-20"] { width: 52px !important; }
    #root [class*="w-16"] { width: 46px !important; }
    #root [class*="w-14"] { width: 42px !important; }
    #root [class*="w-12"] { width: 38px !important; }
    #root [class*="w-10"] { width: 34px !important; }

    /* Button ala SaaS dashboard: kecil, tegas, tidak melebar berlebihan */
    #root button {
      min-height: 33px !important;
      border-radius: 12px !important;
      padding: 7px 13px !important;
      font-size: 12px !important;
      line-height: 1.1 !important;
      font-weight: 900 !important;
      white-space: nowrap !important;
    }

    #root button[class*="bg-blue"] {
      background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
      color: white !important;
    }

    #root button[class*="bg-emerald"],
    #root button[class*="bg-green"] {
      background: linear-gradient(135deg, #059669, #10b981) !important;
      color: white !important;
    }

    #root button[class*="bg-red"] {
      background: linear-gradient(135deg, #dc2626, #ef4444) !important;
      color: white !important;
    }

    /* Form dan filter lebih compact */
    #root input,
    #root select,
    #root textarea {
      min-height: 34px !important;
      border-radius: 12px !important;
      border-color: var(--karsa-border) !important;
      background: #f8fbff !important;
      padding: 8px 11px !important;
      font-size: 12px !important;
      line-height: 1.2 !important;
      font-weight: 700 !important;
      color: var(--karsa-text) !important;
    }

    #root textarea {
      min-height: 82px !important;
      resize: vertical;
    }

    #root input:focus,
    #root select:focus,
    #root textarea:focus {
      outline: none !important;
      border-color: #93c5fd !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.14) !important;
    }

    /* Tabel lebih seperti admin profesional */
    #root table {
      border-collapse: separate !important;
      border-spacing: 0 !important;
      width: 100% !important;
      overflow: hidden !important;
      border-radius: 14px !important;
    }

    #root table thead {
      background: #f1f6fd !important;
    }

    #root table th {
      color: #64748b !important;
      font-size: 10px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.04em !important;
      font-weight: 900 !important;
      padding: 8px 10px !important;
    }

    #root table td {
      font-size: 11.5px !important;
      padding: 8px 10px !important;
      border-top: 1px solid #edf3fb !important;
      font-weight: 700 !important;
    }

    /* Card list karyawan/riwayat dibuat compact */
    #root [class*="grid"] > [class*="bg-white"],
    #root [class*="grid"] > [class*="bg-slate"] {
      min-height: auto !important;
    }

    #root [class*="text-2xl"] { font-size: 20px !important; }
    #root [class*="text-3xl"] { font-size: 24px !important; }
    #root [class*="text-4xl"] { font-size: 28px !important; }
    #root [class*="text-sm"] { font-size: 12px !important; }
    #root [class*="text-xs"] { font-size: 10.5px !important; }

    /* Badge lebih kecil */
    #root [class*="rounded-full"] {
      padding-top: 4px !important;
      padding-bottom: 4px !important;
    }

    /* Empty state jangan terlalu makan ruang */
    #root [class*="min-h-["],
    #root [class*="h-["] {
      min-height: auto;
    }

    /* Bukti absensi di tabel dibuat lebih besar dan jelas */
    #root .karsa-evidence-thumb-sm {
      width: 76px !important;
      height: 58px !important;
      min-width: 76px !important;
      min-height: 58px !important;
      padding: 0 !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      display: grid !important;
      place-items: center !important;
    }

    #root .karsa-evidence-thumb-sm img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block !important;
    }

    #root .karsa-evidence-thumb-sm svg {
      width: 24px !important;
      height: 24px !important;
    }

    #root .karsa-evidence-thumb-lg {
      padding: 0 !important;
      overflow: hidden !important;
    }

    /* Scrollbar rapi */
    #root [class*="overflow-y-auto"]::-webkit-scrollbar,
    #root [class*="overflow-auto"]::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    #root [class*="overflow-y-auto"]::-webkit-scrollbar-track,
    #root [class*="overflow-auto"]::-webkit-scrollbar-track {
      background: transparent;
    }

    #root [class*="overflow-y-auto"]::-webkit-scrollbar-thumb,
    #root [class*="overflow-auto"]::-webkit-scrollbar-thumb {
      border-radius: 99px;
      background: #94a3b8;
      border: 2px solid #f8fafc;
    }

    /* Final UI correction: PKW/SiapKerja style, tidak terlalu rounded, tidak silau */
    #root [class*="rounded-[3rem]"],
    #root [class*="rounded-[2.5rem]"],
    #root [class*="rounded-[2rem]"],
    #root [class*="rounded-[1.5rem]"],
    #root [class*="rounded-3xl"],
    #root [class*="rounded-2xl"],
    #root [class*="rounded-xl"] {
      border-radius: 8px !important;
    }

    #root [class*="rounded-full"] {
      border-radius: 6px !important;
    }

    #root button,
    #root input,
    #root select,
    #root textarea {
      border-radius: 6px !important;
    }

    #root aside button,
    #root nav button,
    #root aside a,
    #root nav a {
      border-radius: 6px !important;
    }

    /* Jangan biarkan row list jadi biru full/silau */
    #root div[class*="bg-blue-600"]:not(button):not([role="button"]),
    #root div[class*="bg-blue-500"]:not(button):not([role="button"]),
    #root section[class*="bg-blue-600"],
    #root article[class*="bg-blue-600"] {
      background: #ffffff !important;
      color: #0f172a !important;
      border: 1px solid #dbe7f5 !important;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.045) !important;
    }

    #root div[class*="bg-blue-600"]:not(button):not([role="button"]) *,
    #root section[class*="bg-blue-600"] *,
    #root article[class*="bg-blue-600"] * {
      color: inherit !important;
    }

    /* Elemen nomor/icon biru tetap boleh, tapi dibuat kalem */
    #root [class*="bg-blue-600"][class*="h-"][class*="w-"],
    #root [class*="bg-blue-500"][class*="h-"][class*="w-"] {
      background: #eaf2ff !important;
      color: #1d4ed8 !important;
      border: 1px solid #cfe1ff !important;
      box-shadow: none !important;
    }

    /* Icon statistik warna terang dibuat lebih soft */
    #root [class*="bg-yellow"],
    #root [class*="bg-orange"],
    #root [class*="bg-purple"],
    #root [class*="bg-red"],
    #root [class*="bg-emerald"] {
      box-shadow: none !important;
    }

    #root div[class*="bg-yellow"],
    #root div[class*="bg-orange"] {
      background: #fff7ed !important;
      color: #c2410c !important;
    }

    #root div[class*="bg-red"]:not(button) {
      background: #fef2f2 !important;
      color: #b91c1c !important;
    }

    #root div[class*="bg-emerald"]:not(button),
    #root div[class*="bg-green"]:not(button) {
      background: #ecfdf5 !important;
      color: #047857 !important;
    }

    /* Cuti disetujui dan badge status jangan terlalu menyala */
    #root span[class*="bg-emerald"],
    #root span[class*="bg-green"] {
      background: #ecfdf5 !important;
      color: #047857 !important;
      border: 1px solid #bbf7d0 !important;
    }

    #root span[class*="bg-red"] {
      background: #fef2f2 !important;
      color: #b91c1c !important;
      border: 1px solid #fecaca !important;
    }

    #root span[class*="bg-blue"] {
      background: #eff6ff !important;
      color: #1d4ed8 !important;
      border: 1px solid #bfdbfe !important;
    }

    /* Absensi layout correction: kurangi space kosong antara header, filter, output, dan tabel */
    #root [data-page="absensi"],
    #root .absensi-page,
    #root [class*="Monitoring Kehadiran"],
    #root [class*="monitoring kehadiran"] {
      gap: 8px !important;
    }

    /* Paksa area filter/output lebih pendek */
    #root [class*="TOP TOOLS ABSENSI"],
    #root [class*="Top Tools Absensi"] {
      min-height: auto !important;
    }

    #root main section,
    #root main article,
    #root main > div {
      margin-top: 0 !important;
    }

    #root main > div + div,
    #root main > section + section,
    #root main > article + article {
      margin-top: 8px !important;
    }

    /* Card output PDF/Excel jangan bikin filter bar terlalu tinggi */
    #root button:has(+ button),
    #root div:has(> button) {
      align-content: start;
    }

    #root button:contains("Preview") {
      min-height: 30px !important;
    }

    /* Bagian output kanan dibuat compact */
    #root [class*="PDF / Excel"],
    #root [class*="PDF/Excel"] {
      font-size: 11px !important;
      line-height: 1.1 !important;
    }

    /* Area tabel absensi naik ke atas, tidak menyisakan blank tinggi */
    #root table {
      margin-top: 0 !important;
    }

    #root thead th,
    #root tbody td {
      height: auto !important;
    }

    /* Hilangkan min-height berlebihan pada card filter dan statistik */
    #root [class*="min-h-"] {
      min-height: auto !important;
    }

    /* Output card pada halaman report dibuat horizontal/rapat bila memungkinkan */
    #root .karsa-output-card,
    #root [class*="output-card"] {
      min-height: auto !important;
      padding: 8px !important;
    }

    /* Jika ada grid tinggi kosong, jadikan alignment ke atas */
    #root [class*="items-stretch"] {
      align-items: start !important;
    }

    /* Responsive: tetap padat di layar laptop */
    @media (min-width: 1024px) {
      #root [class*="lg:grid-cols-2"],
      #root [class*="lg:grid-cols-3"],
      #root [class*="lg:grid-cols-4"] {
        gap: 12px !important;
      }

    /* Login screen dibuat terpisah dari compact dashboard agar tidak ikut mengecil */
    #root .karsa-login-screen {
      min-height: 100dvh !important;
      padding: 42px 18px !important;
      overflow-y: auto !important;
    }

    #root .karsa-login-wrap {
      width: 100% !important;
      max-width: 620px !important;
      min-height: calc(100dvh - 84px) !important;
    }

    #root .karsa-login-logo-box {
      width: 122px !important;
      height: 122px !important;
      border-radius: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      border: 0 !important;
      overflow: visible !important;
    }

    #root .karsa-login-logo-box img {
      width: 122px !important;
      height: 122px !important;
      object-fit: contain !important;
      filter: drop-shadow(0 14px 24px rgba(15, 23, 42, 0.12));
    }

    #root .karsa-login-input-icon {
      position: absolute !important;
      left: 16px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #2563eb !important;
      pointer-events: none !important;
    }

    #root .karsa-login-card input.karsa-login-input-with-icon {
      padding-left: 46px !important;
    }

    #root .karsa-login-screen h1 {
      font-size: clamp(32px, 2.4vw, 44px) !important;
      line-height: 1.08 !important;
      letter-spacing: -0.055em !important;
    }

    #root .karsa-login-screen p {
      font-size: 14px !important;
      line-height: 1.6 !important;
    }

    #root .karsa-login-card {
      padding: 30px !important;
      border-radius: 26px !important;
    }

    #root .karsa-login-card label span {
      font-size: 12px !important;
      letter-spacing: 0.055em !important;
    }

    #root .karsa-login-card input {
      min-height: 54px !important;
      height: 54px !important;
      border-radius: 16px !important;
      padding: 0 16px !important;
      font-size: 14px !important;
      font-weight: 800 !important;
      background: #f8fbff !important;
    }

    #root .karsa-login-card button {
      min-height: 54px !important;
      height: 54px !important;
      border-radius: 16px !important;
      padding: 0 20px !important;
      font-size: 13px !important;
      letter-spacing: 0.035em !important;
    }

    @media (max-width: 640px) {
      #root .karsa-login-wrap {
        max-width: 100% !important;
      }

      #root .karsa-login-card {
        padding: 22px !important;
      }

      #root .karsa-login-logo-box {
        width: 104px !important;
        height: 104px !important;
      }

      #root .karsa-login-logo-box img {
        width: 104px !important;
        height: 104px !important;
      }
    }
    }
  `;
  document.head.appendChild(compactStyle);
}

const FIREBASE_PATHS = {
  // Struktur Firebase terbaru dari Aplikasi Absen Karyawan.
  // Semua menu operasional Admin membaca root utama yang sama: karsa_absensi.
  karyawan: "karyawan",
  absensi: "absensi",
  cuti: "cuti",
  laporan: "laporan",
  pesan: "pesan",
  broadcast: "broadcast",
  kalender_nasional: "kalender_nasional",
  hari_libur: "hari_libur",
  jam_kerja: "jam_kerja",
  app_update: "app_update",

  // Node internal Admin, bukan sumber data lama aplikasi karyawan.
  admin_users: "admin_users",
  admin_logs: "admin_logs",
  settings: "settings",
};

const COMPANY_NAME = "PT. Karsa Sentana Lumbung Sentosa";
const COMPANY_LOGO_URL =
  "https://karsasentana.com/wp-content/uploads/2026/01/LOGO-KARSA-SENTANA-2-1024x896.png";
const COMPANY_LETTER_LOGO_URL = "/logo-karsa-gold.png";
const COMPANY_LETTER_HEADER_IMAGE_URL = "/letter-header-karsa.png";
const COMPANY_LETTER_FOOTER_IMAGE_URL = "/letter-footer-karsa.png";
const COMPANY_STAMP_SIGNATURE_IMAGE_URL = "/stamp-signature.png";
const COMPANY_STAMP_IMAGE_URL = "/stempel-karsa.png";
const LEAVE_APPROVAL_SIGNATURE_IMAGE_URL = COMPANY_STAMP_SIGNATURE_IMAGE_URL;

// FORCE FAVICON ADMIN KARSA
// Catatan penting:
// File favicon tetap harus berada di folder: public/favicon-karsa-full.png
// Kode ini memaksa browser mengganti favicon walaupun index.html/cache masih menyimpan icon lama.
const ADMIN_FAVICON_URL = "/favicon-karsa-full.png";
const ADMIN_FAVICON_VERSION = "20260525-02";

function forceAdminFavicon() {
  if (typeof document === "undefined") return;

  const faviconHref = `${ADMIN_FAVICON_URL}?v=${ADMIN_FAVICON_VERSION}`;

  document
    .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
    .forEach((item) => item.remove());

  [
    { rel: "icon", type: "image/png", sizes: "16x16", href: faviconHref },
    { rel: "icon", type: "image/png", sizes: "32x32", href: faviconHref },
    { rel: "icon", type: "image/png", sizes: "48x48", href: faviconHref },
    { rel: "icon", type: "image/png", sizes: "96x96", href: faviconHref },
    { rel: "icon", type: "image/png", sizes: "192x192", href: faviconHref },
    { rel: "icon", type: "image/png", sizes: "512x512", href: faviconHref },
    { rel: "shortcut icon", type: "image/png", href: faviconHref },
    { rel: "apple-touch-icon", sizes: "180x180", href: faviconHref },
  ].forEach((attrs) => {
    const link = document.createElement("link");
    Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
    document.head.appendChild(link);
  });

  document.title = "ADMIN KARSA";

  let themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) {
    themeMeta = document.createElement("meta");
    themeMeta.setAttribute("name", "theme-color");
    document.head.appendChild(themeMeta);
  }
  themeMeta.setAttribute("content", "#0f172a");
}

forceAdminFavicon();

const ADMIN_STORAGE_KEY = "karsa_admin_session_v1";
const DB_STORAGE_KEY = "karsa_admin_db_cache_v1";
const LEAVE_HISTORY_STORAGE_KEY = "karsa_leave_history_cache_v1";
const WORK_SCHEDULE_STORAGE_KEY = "karsa_work_schedule_settings_v1";
const LEAVE_APPROVAL_SIGNER_STORAGE_KEY = "karsa_leave_approval_signer_v1";

const ADMIN_AUTO_SYNC_MS = 7000;

const ADMIN_UI_FONT_STYLE_ID = "admin-ui-font-style";
if (typeof document !== "undefined" && !document.getElementById(ADMIN_UI_FONT_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = ADMIN_UI_FONT_STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

    html, body, #root {
      font-family: 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    button, input, textarea, select {
      font-family: inherit !important;
    }

    h1, h2, h3, h4, .font-black {
      letter-spacing: -0.035em;
    }

    .tracking-\[0\.22em\], .tracking-\[0\.25em\], .tracking-wide, .tracking-wider {
      letter-spacing: 0.08em !important;
    }

    p, span, button, input, textarea, select, td, th, label {
      line-height: 1.45;
    }

    aside nav button,
    aside a,
    aside .menu-item {
      font-weight: 700 !important;
    }
  `;
  document.head.appendChild(style);
}

const ADMIN_NAV_FEEL_STYLE_ID = "admin-nav-feel-style";
if (typeof document !== "undefined" && !document.getElementById(ADMIN_NAV_FEEL_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = ADMIN_NAV_FEEL_STYLE_ID;
  style.textContent = `
    :root {
      --admin-fast: 20ms;
      --admin-smooth: cubic-bezier(.2,.8,.2,1);
    }

    button, a, [role="button"] {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    aside button,
    aside a,
    nav button,
    nav a {
      cursor: pointer;
      transform: translateZ(0);
      backface-visibility: hidden;
      will-change: transform, background-color, color, box-shadow;
      transition-property: transform, background-color, color, border-color, box-shadow !important;
      transition-duration: var(--admin-fast) !important;
      transition-timing-function: var(--admin-smooth) !important;
    }

    aside button:hover,
    aside a:hover,
    nav button:hover,
    nav a:hover {
      transform: translateX(3px) translateZ(0);
    }

    aside button:active,
    aside a:active,
    nav button:active,
    nav a:active {
      transform: translateX(3px) scale(.975) translateZ(0);
    }

    main,
    main > *,
    [data-admin-content],
    .admin-content,
    .page-content {
      transform: translateZ(0);
      backface-visibility: hidden;
    }

    .rounded-\[2rem\],
    .rounded-3xl,
    .rounded-2xl,
    .shadow-sm,
    .shadow-lg {
      transition-duration: 20ms !important;
      transition-timing-function: var(--admin-smooth) !important;
    }

    body.admin-is-navigating main {
      animation: adminPageSnap 20ms var(--admin-smooth) both;
    }

    @keyframes adminPageSnap {
      from { opacity: .82; transform: translateY(4px) translateZ(0); }
      to { opacity: 1; transform: translateY(0) translateZ(0); }
    }
  `;
  document.head.appendChild(style);

  const setNavPulse = () => {
    document.body.classList.remove("admin-is-navigating");
    void document.body.offsetWidth;
    document.body.classList.add("admin-is-navigating");
    window.clearTimeout(window.__adminNavPulseTimer);
    window.__adminNavPulseTimer = window.setTimeout(() => {
      document.body.classList.remove("admin-is-navigating");
    }, 35);
  };

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (target && target.closest && target.closest("aside button, aside a, nav button, nav a")) {
      setNavPulse();
    }
  }, { passive: true });
}

const ADMIN_CONTROL_FIX_STYLE_ID = "admin-control-fix-style";
if (typeof document !== "undefined" && !document.getElementById(ADMIN_CONTROL_FIX_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = ADMIN_CONTROL_FIX_STYLE_ID;
  style.textContent = `
    main button,
    main input,
    main select,
    main textarea,
    main [role="button"],
    main [data-filter],
    main [data-search] {
      pointer-events: auto !important;
      position: relative;
      z-index: 20;
    }

    main .absolute,
    main .fixed {
      pointer-events: auto;
    }

    main input,
    main select,
    main textarea {
      user-select: text;
      -webkit-user-select: text;
    }

    main button:not(:disabled),
    main [role="button"]:not([aria-disabled="true"]) {
      cursor: pointer !important;
    }
  `;
  document.head.appendChild(style);

  const normalizeControlButtons = () => {
    document.querySelectorAll("main button:not([type])").forEach((button) => {
      button.setAttribute("type", "button");
    });
  };

  normalizeControlButtons();
  const observer = new MutationObserver(normalizeControlButtons);
  observer.observe(document.body, { childList: true, subtree: true });
}

const ADMIN_LOGO_CLEANUP_STYLE_ID = "admin-logo-cleanup-style";
if (typeof document !== "undefined" && !document.getElementById(ADMIN_LOGO_CLEANUP_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = ADMIN_LOGO_CLEANUP_STYLE_ID;
  style.textContent = `
    aside div:has(> img[alt*="Logo"]),
    aside div:has(> img[alt*="logo"]),
    aside div:has(> img[src*="logo"]),
    aside div:has(> img[src*="Logo"]) {
      width: 64px !important;
      height: 64px !important;
      min-width: 64px !important;
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      outline: 0 !important;
    }

    aside div:has(> img[alt*="Logo"]) > img,
    aside div:has(> img[alt*="logo"]) > img,
    aside div:has(> img[src*="logo"]) > img,
    aside div:has(> img[src*="Logo"]) > img {
      width: 64px !important;
      height: 64px !important;
      max-width: 64px !important;
      max-height: 64px !important;
      object-fit: contain !important;
      display: block !important;
      background: transparent !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
}

const KARYAWAN_PANEL_FIX_STYLE_ID = "karyawan-panel-fix-style";
if (typeof document !== "undefined" && !document.getElementById(KARYAWAN_PANEL_FIX_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = KARYAWAN_PANEL_FIX_STYLE_ID;
  style.textContent = `
    /* Perapihan khusus menu Karyawan: hilangkan ruang kosong, tombol arsip kecil, dan logout lebih kalem */
    #root .karsa-karyawan-stat {
      min-height: 70px !important;
      padding: 13px 15px !important;
      border-radius: 14px !important;
      background: #ffffff !important;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.045) !important;
    }

    #root .karsa-karyawan-stat-icon {
      width: 40px !important;
      height: 40px !important;
      min-width: 40px !important;
      padding: 0 !important;
      border-radius: 14px !important;
      display: grid !important;
      place-items: center !important;
      box-shadow: none !important;
    }

    #root .karsa-employee-card {
      border-radius: 16px !important;
      box-shadow: 0 12px 26px rgba(15, 23, 42, 0.045) !important;
    }

    #root .karsa-employee-archive-btn {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      padding: 0 !important;
      border-radius: 10px !important;
      display: grid !important;
      place-items: center !important;
      background: #fff1f2 !important;
      color: #e11d48 !important;
      border: 1px solid #ffe4e6 !important;
      box-shadow: none !important;
      transform: none !important;
    }

    #root .karsa-employee-archive-btn:hover {
      background: #ffe4e6 !important;
      color: #be123c !important;
    }

    #root .karsa-logout-btn {
      min-height: 44px !important;
      height: 44px !important;
      width: 100% !important;
      padding: 0 14px !important;
      border-radius: 12px !important;
      background: #fff1f2 !important;
      color: #e11d48 !important;
      border: 1px solid #ffe4e6 !important;
      box-shadow: none !important;
      justify-content: center !important;
      gap: 8px !important;
    }

    #root .karsa-logout-btn:hover {
      background: #ffe4e6 !important;
      color: #be123c !important;
    }

    #root .karsa-logout-icon {
      width: 24px !important;
      height: 24px !important;
      min-width: 24px !important;
      min-height: 24px !important;
      padding: 0 !important;
      border-radius: 8px !important;
      display: grid !important;
      place-items: center !important;
      background: #ffffff !important;
      color: #e11d48 !important;
      box-shadow: none !important;
    }

    #root .karsa-employee-avatar {
      width: 62px !important;
      height: 62px !important;
      min-width: 62px !important;
      min-height: 62px !important;
      max-width: 62px !important;
      max-height: 62px !important;
      padding: 0 !important;
      border-radius: 14px !important;
      display: block !important;
      position: relative !important;
      overflow: hidden !important;
      box-shadow: none !important;
      line-height: 0 !important;
      aspect-ratio: 1 / 1 !important;
    }

    #root .karsa-employee-avatar img {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      min-width: 100% !important;
      min-height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: cover !important;
      object-position: center center !important;
      display: block !important;
      border: 0 !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      transform: none !important;
    }

    #root .karsa-employee-avatar svg {
      position: absolute !important;
      inset: 7px !important;
      width: calc(100% - 14px) !important;
      height: calc(100% - 14px) !important;
    }
  `;
  document.head.appendChild(style);
}
const ADMIN_MIN_SILENT_SYNC_GAP_MS = 2200;
const ADMIN_API_TIMEOUT_MS = 15000;

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "karyawan", label: "Karyawan", icon: Users },
  { id: "jam_kerja", label: "Jam Kerja", icon: Clock3 },
  { id: "absensi", label: "Absensi", icon: Clock3 },
  { id: "log_kehadiran", label: "Log Kehadiran", icon: Activity },
  { id: "statistik", label: "Statistik", icon: BarChart3 },
  { id: "rekap", label: "Rekap", icon: FileCheck2 },
  { id: "laporan", label: "Laporan", icon: FileText },
  { id: "cuti", label: "Cuti & Izin", icon: CalendarDays },
  { id: "pesan", label: "Pesan", icon: MessageSquare },
  { id: "broadcast", label: "Broadcast", icon: Megaphone },
  { id: "app_update", label: "Update Aplikasi", icon: RefreshCcw },
];

const PAGE_META = {
  dashboard: {
    eyebrow: "Overview Admin",
    title: "Dashboard",
    subtitle: "Pantau ringkasan absensi, laporan baru, dan pengajuan harian dalam satu layar.",
    helper: "Live database",
  },
  karyawan: {
    eyebrow: "Database Pegawai",
    title: "Karyawan",
    subtitle: "Kelola data pegawai, status aktif, role, penempatan, dan akses pengguna.",
    helper: "Data karyawan",
  },
  jam_kerja: {
    eyebrow: "Pengaturan Jadwal",
    title: "Jam Kerja",
    subtitle: "Atur jam kerja per bagian dan pola Sekuriti: Shift Pagi, Pulang Shift Pagi, Patroli, Shift Malam, serta Pulang Shift Malam.",
    helper: "Setting absensi",
  },
  absensi: {
    eyebrow: "Monitoring Kehadiran",
    title: "Absensi",
    subtitle: "Periksa bukti hadir, jam masuk/pulang, status GPS, dan keterlambatan karyawan.",
    helper: "Audit absensi",
  },
  log_kehadiran: {
    eyebrow: "Timeline Absensi",
    title: "Log Kehadiran",
    subtitle: "Lihat urutan karyawan yang melakukan absensi dari pagi sampai malam penutup.",
    helper: "Log harian",
  },
  statistik: {
    eyebrow: "Analitik Karyawan",
    title: "Statistik",
    subtitle: "Baca performa kehadiran setiap karyawan lewat grafik, skor, rasio terlambat, dan rekap aktivitas.",
    helper: "Grafik performa",
  },
  rekap: {
    eyebrow: "Pusat Laporan",
    title: "Rekap",
    subtitle: "Buat rekap individu, instansi, role, keterlambatan, lalu unduh laporan rapi.",
    helper: "Export laporan",
  },
  laporan: {
    eyebrow: "Laporan Lapangan",
    title: "Laporan",
    subtitle: "Tinjau laporan baru dari user, cek detail, dan pantau status penyelesaiannya.",
    helper: "Laporan user",
  },
  cuti: {
    eyebrow: "Approval HR/Admin",
    title: "Cuti & Izin",
    subtitle: "Kelola pengajuan cuti, izin, sakit, approval, penolakan, dan pencabutan.",
    helper: "Approval cuti",
  },
  pesan: {
    eyebrow: "Komunikasi Internal",
    title: "Pesan",
    subtitle: "Kirim pesan langsung ke user, lampiran, dan informasi administratif penting.",
    helper: "Pesan user",
  },
  broadcast: {
    eyebrow: "Pengumuman Massal",
    title: "Broadcast",
    subtitle: "Kirim pengumuman ke semua karyawan atau target tertentu berdasarkan role/penempatan.",
    helper: "Broadcast admin",
  },
  app_update: {
    eyebrow: "Kontrol Versi Aplikasi",
    title: "Update Aplikasi",
    subtitle: "Atur versi terbaru, minimal versi wajib, force update, link APK, judul update, pesan update, dan release notes.",
    helper: "App update",
  },
};

const EMPTY_DB = {
  karyawan: [],
  jam_kerja: [],
  absensi: [],
  laporan: [],
  cuti: [],
  pesan: [],
  broadcast: [],
  kalender_nasional: [],
  hari_libur: [],
  app_update: {},
  admin_users: [],
  admin_logs: [],
  settings: {},
};

const DEFAULT_WORK_SCHEDULES = [
  { id: "umum", bagian: "Umum", targetRole: "Umum", jenisJadwal: "Reguler", aksiTarget: "Absen Masuk", jamMasuk: "07:00", toleransiMenit: "15", jamIstirahatKeluar: "12:00", jamIstirahatMasuk: "13:00", jamPulang: "16:00", jamPenutup: "22:00", status: "Aktif", catatan: "Standar karyawan umum." },
  { id: "admin_office", bagian: "Admin / Office", targetRole: "Admin", jenisJadwal: "Reguler", aksiTarget: "Absen Masuk", jamMasuk: "08:00", toleransiMenit: "15", jamIstirahatKeluar: "12:00", jamIstirahatMasuk: "13:00", jamPulang: "17:00", jamPenutup: "22:00", status: "Aktif", catatan: "Untuk staf administrasi dan office." },
  { id: "sekuriti_shift_pagi", bagian: "Sekuriti - Shift Pagi", targetRole: "Sekuriti", jenisJadwal: "Shift", aksiTarget: "Shift Pagi", jamMasuk: "07:00", toleransiMenit: "15", jamIstirahatKeluar: "12:00", jamIstirahatMasuk: "13:00", jamPulang: "19:00", jamPenutup: "19:30", status: "Aktif", catatan: "Mulai tugas keamanan shift pagi." },
  { id: "sekuriti_pulang_pagi", bagian: "Sekuriti - Pulang Shift Pagi", targetRole: "Sekuriti", jenisJadwal: "Pulang Shift", aksiTarget: "Pulang Shift Pagi", jamMasuk: "19:00", toleransiMenit: "15", jamIstirahatKeluar: "", jamIstirahatMasuk: "", jamPulang: "19:00", jamPenutup: "19:30", status: "Aktif", catatan: "Penutup tugas keamanan shift pagi." },
  { id: "sekuriti_patroli_pagi", bagian: "Sekuriti - Patroli Pagi", targetRole: "Sekuriti", jenisJadwal: "Patroli", aksiTarget: "Patroli Pagi", jamMasuk: "10:00", toleransiMenit: "30", jamIstirahatKeluar: "", jamIstirahatMasuk: "", jamPulang: "10:00", jamPenutup: "12:00", status: "Aktif", catatan: "Checkpoint patroli area pada shift pagi." },
  { id: "sekuriti_shift_malam", bagian: "Sekuriti - Shift Malam", targetRole: "Sekuriti", jenisJadwal: "Shift", aksiTarget: "Shift Malam", jamMasuk: "19:00", toleransiMenit: "15", jamIstirahatKeluar: "00:00", jamIstirahatMasuk: "01:00", jamPulang: "07:00", jamPenutup: "07:30", status: "Aktif", catatan: "Mulai tugas keamanan shift malam." },
  { id: "sekuriti_patroli_malam", bagian: "Sekuriti - Patroli Malam", targetRole: "Sekuriti", jenisJadwal: "Patroli", aksiTarget: "Patroli Malam", jamMasuk: "23:00", toleransiMenit: "30", jamIstirahatKeluar: "", jamIstirahatMasuk: "", jamPulang: "23:00", jamPenutup: "03:00", status: "Aktif", catatan: "Checkpoint patroli area pada shift malam." },
  { id: "sekuriti_pulang_malam", bagian: "Sekuriti - Pulang Shift Malam", targetRole: "Sekuriti", jenisJadwal: "Pulang Shift", aksiTarget: "Pulang Shift Malam", jamMasuk: "07:00", toleransiMenit: "15", jamIstirahatKeluar: "", jamIstirahatMasuk: "", jamPulang: "07:00", jamPenutup: "07:30", status: "Aktif", catatan: "Penutup tugas keamanan shift malam." },
  { id: "lapangan", bagian: "Lapangan / Operasional", targetRole: "Lapangan", jenisJadwal: "Reguler", aksiTarget: "Absen Masuk", jamMasuk: "07:00", toleransiMenit: "10", jamIstirahatKeluar: "12:00", jamIstirahatMasuk: "13:00", jamPulang: "16:00", jamPenutup: "22:00", status: "Aktif", catatan: "Untuk personel operasional lapangan." },
  { id: "driver", bagian: "Driver / Supir", targetRole: "Driver", jenisJadwal: "Reguler", aksiTarget: "Absen Masuk", jamMasuk: "06:30", toleransiMenit: "15", jamIstirahatKeluar: "12:00", jamIstirahatMasuk: "13:00", jamPulang: "16:30", jamPenutup: "22:00", status: "Aktif", catatan: "Untuk supir atau mobilitas operasional." },
  { id: "penutup", bagian: "Penutup / Malam", targetRole: "Penutup", jenisJadwal: "Reguler", aksiTarget: "Absen Masuk", jamMasuk: "14:00", toleransiMenit: "15", jamIstirahatKeluar: "18:00", jamIstirahatMasuk: "19:00", jamPulang: "22:00", jamPenutup: "23:59", status: "Aktif", catatan: "Untuk bagian penutup atau shift malam." },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function safeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function getVal(obj, key) {
  if (!obj) return undefined;
  const found = Object.keys(obj).find((k) => String(k).toLowerCase() === String(key).toLowerCase());
  return found ? obj[found] : undefined;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeCode(value) {
  return String(value ?? "").trim().toUpperCase().split(/ +/).join(" ");
}

function normalizeWilayah(value) {
  const raw = normalize(value);
  if (raw.includes("lamandau")) return "LAMANDAU";
  if (raw.includes("kobar") || raw.includes("kotawaringin barat")) return "KOBAR";
  return normalizeCode(value);
}

const SMART_PLACEMENT_NAMES = {
  "DAMKAR|KOBAR": "Dinas Pemadam Kebakaran dan Penyelamatan Kabupaten Kotawaringin Barat",
  "DAMKAR|LAMANDAU": "Pemadam Kebakaran Kabupaten Lamandau",
  "PUPR|KOBAR": "Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Kotawaringin Barat",
  "PUPR|LAMANDAU": "Dinas Pekerjaan Umum dan Penataan Ruang, Perumahan dan Kawasan Permukiman dan Pertanahan Kabupaten Lamandau",
  "RSUD|LAMANDAU": "Rumah Sakit Umum Daerah Gusti Abdul Gani",
  "RSUD|KOBAR": "Rumah Sakit Umum Daerah Sultan Imanuddin Pangkalan Bun",
  "DINKES|KOBAR": "Dinas Kesehatan Kabupaten Kotawaringin Barat",
  "DINKES|LAMANDAU": "Dinas Kesehatan Kabupaten Lamandau",
  "DISHUB|KOBAR": "Dinas Perhubungan Kabupaten Kotawaringin Barat",
  "DISHUB|LAMANDAU": "Dinas Perhubungan Kabupaten Lamandau",
  "DISDIK|KOBAR": "Dinas Pendidikan dan Kebudayaan Kabupaten Kotawaringin Barat",
  "DISDIK|LAMANDAU": "Dinas Pendidikan dan Kebudayaan Kabupaten Lamandau",
};

function getPlacementCode(row) {
  return normalizeCode(getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || getVal(row, "kodeSingkatan") || "");
}

function getPlacementArea(row) {
  return normalizeWilayah(getVal(row, "wilayah") || getVal(row, "daerah") || getVal(row, "sumberData") || getVal(row, "importSource") || "");
}

function isPlaceholderPlacement(value, code, area) {
  const raw = normalize(value);
  const c = normalize(code);
  const a = normalize(area);
  if (!raw) return true;
  if (raw === c) return true;
  if (raw === `${c} - ${a}` || raw === `${c}-${a}` || raw === `${c} ${a}`) return true;
  if (raw.includes("belum terdaftar")) return true;
  return false;
}

function getSmartPlacementName(row, fallback = "-") {
  const code = getPlacementCode(row);
  const area = getPlacementArea(row);
  const full = getVal(row, "namaPenempatanLengkap") || getVal(row, "namaLengkapPenempatan") || getVal(row, "penempatanLengkap") || getVal(row, "namaLengkap") || "";
  if (full && !isPlaceholderPlacement(full, code, area)) return full;
  const mapped = SMART_PLACEMENT_NAMES[`${code}|${area}`];
  if (mapped) return mapped;
  if (code && area) return `${code} - ${area}`;
  return getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || fallback;
}

function getSmartPlacementShort(row, fallback = "-") {
  const code = getPlacementCode(row);
  const area = getPlacementArea(row);
  if (code && area) return `${code} ${area}`;
  return getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || fallback;
}

function getEmployeeLoginPin(row) {
  return getVal(row, "pin") || getVal(row, "PIN") || getVal(row, "password") || getVal(row, "Password") || getVal(row, "sandi") || getVal(row, "Sandi") || "";
}

function readCache(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota
  }
}

function parseMillis(value) {
  if (!value) return 0;
  const raw = String(value).replace(/^'/, "").trim();
  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).getTime();
  const indo = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (indo) {
    const idx = MONTH_NAMES.findIndex((m) => m.toLowerCase() === indo[2].toLowerCase());
    if (idx >= 0) return new Date(Number(indo[3]), idx, Number(indo[1])).getTime();
  }
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value) {
  if (!value) return "-";
  const raw = String(value).replace(/^'/, "").trim();
  const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${Number(iso[3])} ${MONTH_NAMES[Number(iso[2]) - 1]} ${Number(iso[1])}`;
  return raw || "-";
}

function todayIndo() {
  const date = new Date();
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function toInputDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(parseMillis(value));
  if (!Number.isFinite(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getRowDateInput(row) {
  const date = getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "start") || getVal(row, "dateStart") || getVal(row, "createdAt");
  return toInputDate(date);
}

function normalizeAttendanceActionLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const text = raw.toLowerCase().replace(/[_-]+/g, " ").trim().split(" ").filter(Boolean).join(" ");
  if (text.includes("masuk") && text.includes("istirahat")) return "Istirahat Masuk";
  if ((text.includes("keluar") || text.includes("mulai")) && text.includes("istirahat")) return "Istirahat Keluar";
  if (text.includes("shift pagi") && text.includes("pulang")) return "Pulang Shift Pagi";
  if (text.includes("shift malam") && text.includes("pulang")) return "Pulang Shift Malam";
  if (text.includes("shift pagi")) return "Shift Pagi";
  if (text.includes("shift malam")) return "Shift Malam";
  if (text.includes("patroli pagi")) return "Patroli Pagi";
  if (text.includes("patroli malam")) return "Patroli Malam";
  if (text.includes("pulang")) return "Absen Pulang";
  if (text.includes("masuk")) return "Absen Masuk";
  if (text.includes("libur")) return "Absen Libur";
  return raw;
}

function getAttendanceStableKey(row) {
  const directId = String(getVal(row, "id") || getVal(row, "recordId") || "").trim();
  const userId = String(getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || "").trim();
  const rawDate = String(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "displayDate") || getVal(row, "createdAt") || "").trim();
  const date = toInputDate(rawDate) || rawDate.slice(0, 10);
  const action = normalizeAttendanceActionLabel(getAttendanceActionFromRow(row));
  const clientKey = String(getVal(row, "clientRequestId") || getVal(row, "requestId") || getVal(row, "idempotencyKey") || "").trim();

  // Struktur terbaru: satu karyawan + satu tanggal + satu jenis absensi = satu record.
  // Jangan pakai jam sebagai kunci dedupe, karena double tap biasanya beda beberapa detik.
  if (userId && date && action) return `${userId}|${date}|${action}`.toLowerCase();
  if (directId) return `id:${directId.toLowerCase()}`;
  if (clientKey) return `client:${clientKey.toLowerCase()}`;
  return "";
}

function dedupeAttendanceRows(rows) {
  const map = new Map();
  safeArray(rows).forEach((row) => {
    const key = getAttendanceStableKey(row);
    if (!key || key === "|||") return;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, row);
      return;
    }
    const prevScore = Object.values(prev || {}).filter((value) => String(value ?? "").trim()).length;
    const rowScore = Object.values(row || {}).filter((value) => String(value ?? "").trim()).length;
    if (rowScore >= prevScore) map.set(key, { ...prev, ...row });
  });
  return Array.from(map.values());
}

function statusTone(status) {
  const raw = normalize(status);
  if (["aktif", "tepat waktu", "disetujui", "approved", "acc", "terkirim", "selesai", "valid", "passed"].some((s) => raw.includes(s))) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (["menunggu", "pending", "review", "diproses"].some((s) => raw.includes(s))) return "bg-amber-50 text-amber-700 ring-amber-100";
  if (["ditolak", "rejected", "terlambat", "nonaktif", "resign", "blocked", "dicabut"].some((s) => raw.includes(s))) return "bg-red-50 text-red-700 ring-red-100";
  return "bg-slate-50 text-slate-600 ring-slate-100";
}

function truthySyncFlag(value) {
  const raw = normalize(value);
  return value === true || raw === "true" || raw === "1" || raw === "ya" || raw === "yes" || raw === "offline" || raw === "offline sync";
}

function normalizeSyncLabel(value) {
  const raw = normalize(value);
  if (!raw) return "";
  if (raw.includes("pending") || raw.includes("menunggu") || raw.includes("queued") || raw.includes("queue")) return "Menunggu Sinkron";
  if (raw.includes("sync") || raw.includes("sinkron") || raw.includes("success") || raw.includes("saved") || raw.includes("terkirim")) return "Tersinkron";
  if (raw.includes("fail") || raw.includes("gagal") || raw.includes("error")) return "Gagal Sinkron";
  return value;
}

function normalizeVerificationLabel(value) {
  const raw = normalize(value);
  if (!raw) return "";
  if (raw.includes("pending") || raw.includes("menunggu") || raw.includes("review")) return "Menunggu Verifikasi Server";
  if (raw.includes("fail") || raw.includes("gagal") || raw.includes("reject")) return "Gagal Sinkron";
  if (raw.includes("valid") || raw.includes("verified") || raw.includes("terverifikasi") || raw.includes("success")) return "Terverifikasi Server";
  return value;
}

function syncBadgeTone(label) {
  const raw = normalize(label);
  if (raw.includes("online") || raw.includes("tersinkron") || raw.includes("terverifikasi")) return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  if (raw.includes("offline")) return "bg-blue-50 text-blue-700 ring-blue-100";
  if (raw.includes("menunggu")) return "bg-amber-50 text-amber-700 ring-amber-100";
  if (raw.includes("gagal")) return "bg-red-50 text-red-700 ring-red-100";
  return "bg-slate-50 text-slate-600 ring-slate-100";
}

function getOfflineSyncBadges(row) {
  const offline = truthySyncFlag(getVal(row, "offlineMode")) || truthySyncFlag(getVal(row, "sourceOfflineQueue"));
  const syncStatus = normalizeSyncLabel(getVal(row, "syncStatus"));
  const verificationStatus = normalizeVerificationLabel(getVal(row, "verificationStatus"));
  const badges = [];
  badges.push(offline ? "Offline Sync" : "Online");
  if (syncStatus) badges.push(syncStatus);
  else if (offline) badges.push("Tersinkron");
  if (verificationStatus && !badges.some((item) => normalize(item) === normalize(verificationStatus))) badges.push(verificationStatus);
  return badges.filter(Boolean).filter((item, index, arr) => arr.findIndex((x) => normalize(x) === normalize(item)) === index);
}

function OfflineSyncBadges({ row, compact = false }) {
  const badges = getOfflineSyncBadges(row);
  if (!badges.length) return null;
  return (
    <span className={cx("inline-flex flex-wrap gap-1", compact ? "mt-1" : "")}>{badges.map((label) => (
      <Badge key={label} tone={syncBadgeTone(label)}>{label}</Badge>
    ))}</span>
  );
}

function OfflineSyncPanel({ row }) {
  const details = [
    ["Client Request", getVal(row, "clientRequestId") || getVal(row, "idempotencyKey")],
    ["Mode", truthySyncFlag(getVal(row, "offlineMode")) || truthySyncFlag(getVal(row, "sourceOfflineQueue")) ? "Offline Queue" : "Online"],
    ["Captured", getVal(row, "offlineCapturedAt")],
    ["Queued", getVal(row, "queuedAt")],
    ["Synced", getVal(row, "syncedAt")],
    ["Diterima Server", getVal(row, "serverReceivedAt")],
    ["Device", getVal(row, "sourceDevice")],
    ["App Version", getVal(row, "appVersion")],
  ].filter(([, value]) => String(value || "").trim());

  return (
    <div className="rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Status Sinkron</p>
      <div className="mt-2"><OfflineSyncBadges row={row} /></div>
      {details.length ? (
        <div className="mt-3 grid gap-2">
          {details.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
              <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
              <p className="mt-0.5 break-words text-xs font-black text-slate-700">{formatDetailValue(label, value)}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function normalizeImageUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw === "-" || raw.toLowerCase() === "null" || raw.toLowerCase() === "undefined") return "";

  if (raw.toLowerCase().startsWith("data:image/")) return raw;

  const compact = raw.split("").filter((ch) => ch.charCodeAt(0) > 32).join("");
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const looksLikePlainBase64Image = compact.length > 180 && !compact.toLowerCase().startsWith("http") && [...compact].every((ch) => base64Chars.includes(ch));
  if (looksLikePlainBase64Image) return `data:image/jpeg;base64,${compact}`;

  let driveId = "";
  if (raw.includes("drive.google.com/file/d/")) {
    driveId = raw.split("drive.google.com/file/d/")[1]?.split("/")[0] || "";
  }
  if (!driveId && raw.includes("id=")) {
    try {
      driveId = new URL(raw).searchParams.get("id") || "";
    } catch {
      driveId = raw.split("id=")[1]?.split("&")[0] || "";
    }
  }
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;

  return raw;
}

function addImageCacheVersion(url, row) {
  if (!url || url.toLowerCase().startsWith("data:") || url.toLowerCase().startsWith("blob:")) return url;
  const stamp = getVal(row, "photoUpdatedAt") || getVal(row, "profileUpdatedAt") || getVal(row, "updatedAt") || "";
  if (!stamp) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(String(stamp).slice(0, 60))}`;
}

function getProfilePhoto(row) {
  const profileKeys = [
    "photo",
    "photoUrl",
    "fotoUrl",
    "fotoProfil",
    "profilePhoto",
    "profileImageUrl",
    "photoBase64",
    "fotoBase64",
    "imageBase64",
    "photo_url",
    "foto_url",
    "foto_profil",
    "fotoProfile",
    "foto_profile",
    "profile_photo",
    "profilePicture",
    "profile_picture",
    "profileImage",
    "profile_image",
    "profile_image_url",
    "avatar",
    "avatarUrl",
    "avatar_url",
    "image",
    "imageUrl",
    "image_url",
    "picture",
    "pictureUrl",
    "picture_url",
    "fotoKaryawan",
    "foto_karyawan",
    "photoProfile",
    "photo_profile",
    "foto",
    "base64Photo",
    "base64Foto",
  ];

  for (const key of profileKeys) {
    const value = normalizeImageUrl(getVal(row, key));
    if (value) return value;
  }
  return "";
}

function getRecordPhoto(row, type) {
  if (!row) return "";

  const attendanceKeys = [
    "photoUrl",
    "fotoUrl",
    "fotoAbsensi",
    "stampedPhoto",
    "proofPhotoUrl",
    "attendancePhotoUrl",
    "finalPhotoUrl",
    "photo",
    "stampedPhotoUrl",
    "timestampPhotoUrl",
    "verifiedPhotoUrl",
    "photoResultUrl",
    "fotoFinalUrl",
    "fotoBuktiUrl",
    "imageUrl",
    "pictureUrl",
    "timestampPhoto",
    "verifiedPhoto",
    "proofPhoto",
    "attendancePhoto",
    "finalPhoto",
    "photoResult",
    "fotoFinal",
    "fotoBukti",
    "foto",
    "image",
    "picture",
  ];

  const reportKeys = [
    "photo",
    "photoUrl",
    "fotoUrl",
    "lampiran",
    "attachmentUrl",
    "lampiranUrl",
    "fileUrl",
    "reportPhotoUrl",
    "imageUrl",
    "pictureUrl",
    "attachment",
    "reportPhoto",
    "foto",
    "image",
    "picture",
  ];

  const employeeKeys = [
    "photo",
    "photoUrl",
    "fotoUrl",
    "fotoProfil",
    "profilePhoto",
    "profileImageUrl",
    "photoBase64",
    "fotoBase64",
    "imageBase64",
    "profilePicture",
    "avatar",
    "image",
    "picture",
    "photo_profile",
    "profile_photo",
    "foto",
  ];

  const keys = type === "absensi" ? attendanceKeys : type === "laporan" ? reportKeys : employeeKeys;
  for (const key of keys) {
    const value = normalizeImageUrl(getVal(row, key));
    if (value) return value;
  }
  return "";
}

function EmployeeAvatar({ row, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const photo = addImageCacheVersion(getProfilePhoto(row), row);
  const sizeClass = size === "lg" ? "h-24 w-24 rounded-[1.5rem] text-3xl shadow-lg ring-2 ring-white/20" : "h-16 w-16 rounded-2xl text-xl";
  const fallbackIconSize = size === "lg" ? 78 : 50;
  if (!photo || failed) {
    return <div className={cx("grid shrink-0 place-items-center overflow-hidden bg-blue-50 font-black text-blue-700 ring-1 ring-blue-100", sizeClass)}><UserCircle2 size={fallbackIconSize} strokeWidth={1.8} /></div>;
  }
  return (
    <div className={cx("grid shrink-0 place-items-center overflow-hidden bg-blue-50 ring-1 ring-blue-100", sizeClass)}>
      <img src={photo} alt="Foto profil" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setFailed(true)} />
    </div>
  );
}

function isActiveEmployee(row) {
  const status = normalize(getVal(row, "status") || "Aktif");
  return !["nonaktif", "tidak aktif", "resign", "keluar"].includes(status);
}

function isLate(row) {
  const text = `${getVal(row, "latenessStatus") || ""} ${getVal(row, "status") || ""}`.toLowerCase();
  return text.includes("terlambat") || getVal(row, "isLate") === true || String(getVal(row, "isLate")).toLowerCase() === "true";
}

function isApprovedLeave(row) {
  const raw = normalize(getVal(row, "status"));
  return ["disetujui", "approved", "acc", "diterima", "aktif", "cuti aktif"].includes(raw);
}

function isPendingLeave(row) {
  const raw = normalize(getVal(row, "status") || "Menunggu");
  return ["menunggu", "pending", "review", "menunggu approval", "menunggu persetujuan"].includes(raw);
}

function isRejectedLeave(row) {
  const raw = normalize(getVal(row, "status"));
  return ["ditolak", "rejected", "dibatalkan", "dicabut", "revoked", "batal"].includes(raw);
}

function getLeaveRequestTypeUi(row) {
  const raw = String(getLeaveTypeText(row) || getVal(row, "type") || getVal(row, "jenis") || "Pengajuan").trim();
  const text = normalize(raw);

  if (text.includes("sakit")) {
    return {
      key: "sakit",
      label: "Sakit",
      shortLabel: "Sakit",
      description: "Izin sakit, lampirkan bukti bila ada",
      icon: FileCheck2,
      shell: "border-rose-200 bg-gradient-to-br from-white via-rose-50/75 to-white ring-rose-100",
      panel: "bg-rose-50 text-rose-800 ring-rose-100",
      badge: "bg-rose-50 text-rose-700 ring-rose-100",
      marker: "bg-rose-500",
      button: "text-rose-700 ring-rose-100 hover:bg-rose-50",
    };
  }

  if (text.includes("telat") || text.includes("pulang cepat")) {
    return {
      key: "telat",
      label: "Izin Telat / Pulang Cepat",
      shortLabel: "Telat / Pulang Cepat",
      description: "Datang telat atau pulang cepat",
      icon: Clock3,
      shell: "border-orange-200 bg-gradient-to-br from-white via-orange-50/75 to-white ring-orange-100",
      panel: "bg-orange-50 text-orange-800 ring-orange-100",
      badge: "bg-orange-50 text-orange-700 ring-orange-100",
      marker: "bg-orange-500",
      button: "text-orange-700 ring-orange-100 hover:bg-orange-50",
    };
  }

  if (text.includes("melahir") || text.includes("lahiran")) {
    return {
      key: "melahirkan",
      label: "Cuti Melahirkan / Lahiran",
      shortLabel: "Cuti Melahirkan",
      description: "Khusus cuti melahirkan",
      icon: UserCircle2,
      shell: "border-pink-200 bg-gradient-to-br from-white via-pink-50/75 to-white ring-pink-100",
      panel: "bg-pink-50 text-pink-800 ring-pink-100",
      badge: "bg-pink-50 text-pink-700 ring-pink-100",
      marker: "bg-pink-500",
      button: "text-pink-700 ring-pink-100 hover:bg-pink-50",
    };
  }

  if (text.includes("cuti")) {
    return {
      key: "cuti",
      label: raw || "Cuti Tahunan",
      shortLabel: "Cuti",
      description: "Mengurangi kuota cuti",
      icon: CalendarDays,
      shell: "border-blue-200 bg-gradient-to-br from-white via-blue-50/75 to-white ring-blue-100",
      panel: "bg-blue-50 text-blue-800 ring-blue-100",
      badge: "bg-blue-50 text-blue-700 ring-blue-100",
      marker: "bg-blue-500",
      button: "text-blue-700 ring-blue-100 hover:bg-blue-50",
    };
  }

  if (text.includes("izin")) {
    return {
      key: "izin",
      label: raw || "Izin",
      shortLabel: "Izin",
      description: "Keperluan pribadi / izin kerja",
      icon: Mail,
      shell: "border-emerald-200 bg-gradient-to-br from-white via-emerald-50/75 to-white ring-emerald-100",
      panel: "bg-emerald-50 text-emerald-800 ring-emerald-100",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      marker: "bg-emerald-500",
      button: "text-emerald-700 ring-emerald-100 hover:bg-emerald-50",
    };
  }

  return {
    key: "lainnya",
    label: raw || "Lainnya",
    shortLabel: "Lainnya",
    description: "Keperluan khusus lainnya",
    icon: FileText,
    shell: "border-violet-200 bg-gradient-to-br from-white via-violet-50/75 to-white ring-violet-100",
    panel: "bg-violet-50 text-violet-800 ring-violet-100",
    badge: "bg-violet-50 text-violet-700 ring-violet-100",
    marker: "bg-violet-500",
    button: "text-violet-700 ring-violet-100 hover:bg-violet-50",
  };
}

function displayReportStatus(row) {
  const raw = normalize(getVal(row, "reportStatus") || getVal(row, "status") || "");
  if (!raw || raw.includes("menunggu") || raw.includes("pending") || raw.includes("review") || raw.includes("terkirim")) return "Baru";
  if (raw.includes("proses")) return "Diproses";
  if (raw.includes("selesai") || raw.includes("done")) return "Selesai";
  if (raw.includes("tolak") || raw.includes("reject")) return "Ditolak";
  return getVal(row, "reportStatus") || getVal(row, "status") || "Baru";
}

function countUnique(rows, field) {
  return new Set(safeArray(rows).map((r) => String(getVal(r, field) || "").trim()).filter(Boolean)).size;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function exportCsv(filename, rows) {
  const data = safeArray(rows);
  if (!data.length) return;
  const headers = Array.from(data.reduce((set, row) => {
    Object.keys(row || {}).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  const lines = [headers.join(","), ...data.map((row) => headers.map((h) => csvEscape(getVal(row, h))).join(","))];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makeReportHtml({ title, subtitle, infoRows = [], sections = [], format = "excel" }) {
  const isPdf = format === "pdf";

  const infoHtml = safeArray(infoRows).length
    ? `<table class="info-table"><tbody>${safeArray(infoRows).map((row) => `
      <tr>
        <td class="info-label">${escapeHtml(getVal(row, "Keterangan") || getVal(row, "label") || "Keterangan")}</td>
        <td class="info-value">${escapeHtml(getVal(row, "Nilai") || getVal(row, "value") || "-")}</td>
      </tr>`).join("")}</tbody></table>`
    : "";

  const sectionHtml = safeArray(sections).map((section) => {
    const columns = safeArray(section.columns);
    const rows = safeArray(section.rows);
    const headerHtml = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
    const bodyHtml = rows.length
      ? rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(getVal(row, column) ?? row?.[column] ?? "-")}</td>`).join("")}</tr>`).join("")
      : `<tr><td class="empty-cell" colspan="${Math.max(columns.length, 1)}">Belum ada data.</td></tr>`;

    return `
      <section class="report-section">
        <h2>${escapeHtml(section.title || "Detail Data")}</h2>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        </div>
      </section>`;
  }).join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title || "Laporan")}</title>
<style>
  @page { size: A4 landscape; margin: ${isPdf ? "12mm" : "12mm"}; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #0f172a;
    background: ${isPdf ? "#e5e7eb" : "#ffffff"};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    width: ${isPdf ? "273mm" : "100%"};
    min-height: ${isPdf ? "186mm" : "auto"};
    margin: ${isPdf ? "0 auto" : "0"};
    background: #ffffff;
    padding: ${isPdf ? "0" : "8px"};
  }
  .report-content { position: relative; z-index: 2; }
  .report-kop { border: 1px solid #cbd5e1; background: #f8fafc; margin-bottom: 7px; table-layout: fixed; }
  .report-kop td { border: 1px solid #cbd5e1; padding: 6px 8px; vertical-align: middle; }
  .logo-cell { width: 58px; text-align: center; background: #ffffff; }
  .report-logo { width: 42px; height: 42px; max-width: 42px; max-height: 42px; object-fit: contain; display: block; margin: 0 auto; }
  .brand-cell { width: 360px; font-size: 13px; font-weight: 800; color: #0f172a; }
  .brand-cell span { font-size: 10px; font-weight: 700; color: #475569; }
  .meta-cell { font-size: 10px; color: #475569; font-weight: 700; }
  .title-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 7px 10px; margin: 7px 0; }
  h1 { margin: 0; color: #1e3a8a; font-size: ${isPdf ? "17px" : "15px"}; text-transform: uppercase; letter-spacing: .03em; }
  .subtitle { margin: 3px 0 0; color: #475569; font-size: 10px; font-weight: 700; }
  h2 { margin: 10px 0 5px; font-size: 11px; color: #0f172a; text-transform: uppercase; letter-spacing: .03em; }
  table { border-collapse: collapse; width: 100%; table-layout: fixed; }
  .report-section { width: 100%; margin-top: 8px; break-inside: auto; page-break-inside: auto; }
  .table-wrap { width: 100%; overflow: visible; border: 1px solid #cbd5e1; border-radius: 6px; }
  .info-table { margin: 8px 0 12px; border: 1px solid #cbd5e1; width: 100%; }
  .info-table td { border: 1px solid #cbd5e1; padding: 5px 7px; font-size: 9px; vertical-align: top; }
  .info-label { width: 170px; background: #f1f5f9; font-weight: 800; color: #334155; }
  .info-value { font-weight: 700; color: #0f172a; }
  .data-table { width: 100%; min-width: ${isPdf ? "0" : "1120px"}; table-layout: fixed; }
  .data-table thead { display: table-header-group; }
  .data-table th { background: #1e3a8a; color: #ffffff; border: 1px solid #1e40af; padding: 5px 4px; font-size: 7.2px; text-align: center; vertical-align: middle; white-space: normal; font-weight: 800; word-break: break-word; }
  .data-table td { border: 1px solid #cbd5e1; padding: 4px 4px; font-size: 7.2px; vertical-align: top; line-height: 1.26; word-break: break-word; overflow-wrap: anywhere; }
  .data-table tr:nth-child(even) td { background: #f8fafc; }
  .data-table tr:nth-child(odd) td { background: #ffffff; }
  .data-table td:nth-child(n+2) { text-align: center; }
  .data-table td:first-child { text-align: left; font-weight: 700; }
  .empty-cell { text-align: center !important; color: #94a3b8; font-weight: 700; padding: 16px !important; }
  .footer { margin-top: 10px; color: #64748b; font-size: 8px; font-weight: 700; border-top: 1px solid #cbd5e1; padding-top: 7px; }
  @media print {
    body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { width: auto; min-height: auto; margin: 0; box-shadow: none; padding: 0; }
    .report-section { page-break-inside: auto; break-inside: auto; }
    .data-table thead { display: table-header-group; }
    .data-table tr { page-break-inside: avoid; break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="report-content">
      <table class="report-kop">
        <tr>
          <td class="logo-cell"><img class="report-logo" src="${COMPANY_LOGO_URL}" width="42" height="42" /></td>
          <td class="brand-cell">${escapeHtml(COMPANY_NAME)}<br/><span>Panel Admin Absensi Karyawan Karsa</span></td>
          <td class="meta-cell">Dicetak: ${escapeHtml(new Date().toLocaleString("id-ID"))}</td>
        </tr>
      </table>
      <div class="title-box">
        <h1>${escapeHtml(title || "Laporan")}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ""}
      </div>
      ${infoHtml}
      ${sectionHtml}
      <div class="footer">Generated by Panel Admin Absensi Karsa • ${escapeHtml(COMPANY_NAME)}</div>
    </div>
  </div>
</body>
</html>`;
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportStyledExcel(filename, config) {
  const safeName = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  const html = makeReportHtml({ ...config, format: "excel" });
  downloadBlob(safeName, html, "application/vnd.ms-excel;charset=utf-8");
}

function openPrintablePreview(html, title = "Preview Dokumen") {
  const sourceHtml = String(html || "").trim();

  if (!sourceHtml) {
    alert("Dokumen print kosong. Data HTML belum terbentuk.");
    return false;
  }

  const win = window.open("", "_blank", "width=900,height=1000");

  if (!win) {
    alert("Jendela print gagal dibuka. Izinkan pop-up untuk localhost lalu coba lagi.");
    return false;
  }

  const hasFullHtml = sourceHtml.toLowerCase().includes("<html");
  const finalHtml = hasFullHtml
    ? sourceHtml
    : `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title || "Preview Dokumen")}</title>
</head>
<body>${sourceHtml}</body>
</html>`;

  win.document.open("text/html", "replace");
  win.document.write(finalHtml);
  win.document.close();

  try {
    win.document.title = title || "Preview Dokumen";
  } catch {
    // abaikan jika browser menolak set title
  }

  const waitForImages = () => {
    try {
      const images = Array.from(win.document.images || []);
      if (!images.length) return Promise.resolve();

      return Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            const done = () => resolve();
            img.onload = done;
            img.onerror = done;
            setTimeout(done, 1200);
          });
        })
      );
    } catch {
      return Promise.resolve();
    }
  };

  let printed = false;
  const runPrint = () => {
    if (printed) return;
    printed = true;
    waitForImages().then(() => {
      setTimeout(() => {
        try {
          win.focus();
          win.print();
        } catch {
          // Kalau print gagal, tab preview tetap menampilkan dokumen.
        }
      }, 700);
    });
  };

  if (win.document.readyState === "complete") {
    runPrint();
  } else {
    win.onload = runPrint;
    setTimeout(runPrint, 1200);
  }

  return true;
}

function exportStyledPdf(filename, config) {
  const html = makeReportHtml({ ...config, format: "pdf" });
  openPrintablePreview(html, filename.replace(/\.pdf$/i, "") || "Preview PDF");
}

function printEmployeeProfilePdf(row) {
  const name = getVal(row, "name") || getVal(row, "nama") || "Karyawan";
  const id = getVal(row, "id") || getVal(row, "userId") || "-";
  const fields = [
    ["ID Karyawan", id],
    ["Nama", name],
    ["Status", getVal(row, "status") || "Aktif"],
    ["PIN Login", getEmployeeLoginPin(row) || "-"],
    ["Wilayah", getVal(row, "wilayah") || getVal(row, "daerah") || "-"],
    ["Penempatan", getSmartPlacementName(row)],
    ["Divisi", getVal(row, "divisi") || getVal(row, "devisi") || "-"],
    ["Role", getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || "Umum"],
    ["Pekerjaan", getVal(row, "pekerjaan") || "-"],
    ["Jabatan", getVal(row, "jabatan") || "-"],
    ["Tanggal Lahir", formatDate(getVal(row, "tanggalLahir") || getVal(row, "tanggal_lahir") || getVal(row, "birthdate") || getVal(row, "dob"))],
    ["Jenis Kelamin", getVal(row, "jenisKelamin") || getVal(row, "jenis_kelamin") || "-"],
    ["NIK", getVal(row, "nik") || "-"],
    ["Email", getVal(row, "email") || "-"],
    ["No. HP", getVal(row, "phone") || getVal(row, "noHp") || getVal(row, "whatsapp") || "-"],
    ["WhatsApp", getVal(row, "whatsapp") || "-"],
    ["Kontak Darurat", getVal(row, "emergencyContact") || getVal(row, "kontakDarurat") || "-"],
    ["Alamat Domisili", getVal(row, "addressDetail") || getVal(row, "alamatDomisili") || getVal(row, "alamat") || "-"],
    ["Alamat KTP", getVal(row, "addressKtp") || getVal(row, "alamatKtp") || "-"],
    ["Kuota Cuti", getVal(row, "kuotaCutiTahunan") || "-"],
    ["Cuti Terpakai", getVal(row, "cutiTahunanUsed") || "-"],
    ["Update Terakhir", formatDate(getVal(row, "profileUpdatedAt") || getVal(row, "updatedAt") || getVal(row, "createdAt"))],
    ["Catatan", getVal(row, "notes") || getVal(row, "note") || "-"],
  ];
  const photo = addImageCacheVersion(getProfilePhoto(row), row);
  const rowsHtml = fields.map(([label, value], index) => `
    <tr>
      <td class="number">${index + 1}</td>
      <td class="label">${escapeHtml(label)}</td>
      <td class="value">${escapeHtml(value)}</td>
    </tr>
  `).join("");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Data Karyawan - ${escapeHtml(name)}</title>
<style>
  @page { size: A4 portrait; margin: 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #0f172a;
    background: #e5e7eb;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    width: 182mm;
    min-height: 269mm;
    margin: 0 auto;
    background: #ffffff;
    padding: 0;
  }
  .kop { width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; margin-bottom: 10px; table-layout: fixed; }
  .kop td { border: 1px solid #cbd5e1; padding: 8px 10px; vertical-align: middle; }
  .logo-cell { width: 76px; text-align: center; background: #ffffff; }
  .logo { width: 54px; height: 54px; object-fit: contain; display: block; margin: 0 auto; }
  .brand { font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase; }
  .brand span { display: block; margin-top: 3px; font-size: 10px; font-weight: 700; color: #64748b; text-transform: none; }
  .meta { width: 170px; font-size: 9px; font-weight: 700; color: #475569; line-height: 1.45; }
  .title-box { border: 1px solid #bfdbfe; background: #eff6ff; padding: 10px 12px; margin-bottom: 10px; }
  h1 { margin: 0; font-size: 18px; color: #1e3a8a; text-transform: uppercase; letter-spacing: .03em; }
  .subtitle { margin: 4px 0 0; font-size: 10px; font-weight: 700; color: #475569; }
  .profile { display: grid; grid-template-columns: 92px 1fr; gap: 10px; margin-bottom: 10px; page-break-inside: avoid; break-inside: avoid; }
  .photo { height: 92px; border: 1px solid #cbd5e1; background: #f8fafc; display: grid; place-items: center; overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: cover; }
  .initial { font-size: 32px; font-weight: 900; color: #2563eb; }
  .summary { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px; }
  .summary h2 { margin: 0; font-size: 16px; color: #0f172a; }
  .summary p { margin: 4px 0 0; font-size: 10px; font-weight: 700; color: #475569; }
  .badge { display: inline-block; margin-top: 8px; padding: 4px 8px; border-radius: 999px; background: #dcfce7; color: #047857; font-size: 9px; font-weight: 900; border: 1px solid #bbf7d0; }
  table.data { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .data thead { display: table-header-group; }
  .data th { background: #1e3a8a; color: #ffffff; border: 1px solid #1e40af; padding: 7px; font-size: 10px; text-align: center; }
  .data td { border: 1px solid #cbd5e1; padding: 7px 8px; font-size: 10px; line-height: 1.35; vertical-align: top; word-break: break-word; }
  .data tr { page-break-inside: avoid; break-inside: avoid; }
  .data tr:nth-child(even) td { background: #f8fafc; }
  .number { width: 34px; text-align: center; font-weight: 900; color: #334155; }
  .label { width: 170px; background: #f1f5f9 !important; font-weight: 900; color: #334155; }
  .value { font-weight: 700; color: #0f172a; }
  .footer { margin-top: 12px; border-top: 1px solid #cbd5e1; padding-top: 7px; font-size: 9px; font-weight: 700; color: #64748b; }
  @media print {
    body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { width: auto; min-height: auto; margin: 0; box-shadow: none; }
    .profile, .kop, .title-box { page-break-inside: avoid; break-inside: avoid; }
    .data thead { display: table-header-group; }
    .data tr { page-break-inside: avoid; break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <table class="kop">
      <tr>
        <td class="logo-cell"><img class="logo" src="${COMPANY_LOGO_URL}" /></td>
        <td class="brand">${escapeHtml(COMPANY_NAME)}<span>Panel Admin Absensi Karyawan Karsa</span></td>
        <td class="meta">Ukuran: A4 Portrait<br/>Dicetak: ${escapeHtml(new Date().toLocaleString("id-ID"))}</td>
      </tr>
    </table>
    <div class="title-box">
      <h1>Data Peserta / Karyawan</h1>
      <p class="subtitle">Dokumen detail profil karyawan.</p>
    </div>
    <div class="profile">
      <div class="photo">${photo ? `<img src="${photo}" />` : `<div class="initial">${escapeHtml(String(name).charAt(0).toUpperCase())}</div>`}</div>
      <div class="summary">
        <h2>${escapeHtml(name)}</h2>
        <p>ID Karyawan: ${escapeHtml(id)}</p>
        <p>Penempatan: ${escapeHtml(getSmartPlacementName(row))}</p>
        <span class="badge">${escapeHtml(getVal(row, "status") || "Aktif")}</span>
      </div>
    </div>
    <table class="data">
      <thead><tr><th style="width:34px;">No</th><th style="width:170px;">Kolom</th><th>Detail Data</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="footer">Generated by Panel Admin Absensi Karsa • ${escapeHtml(COMPANY_NAME)}</div>
  </div>
</body>
</html>`;
  openPrintablePreview(html, `Data Karyawan - ${name}`);
}

function firebasePath(pathKey) {
  return `${FIREBASE_ROOT}/${FIREBASE_PATHS[pathKey] || pathKey}`;
}

const PENEMPATAN_FULL_NAME_MAP = {
  PUPR: "Dinas Pekerjaan Umum dan Perumahan Rakyat",
  PU: "Dinas Pekerjaan Umum dan Perumahan Rakyat",
  BAPPEDA: "Badan Perencanaan Pembangunan Daerah",
  BAPP: "Badan Perencanaan Pembangunan Daerah",
  BAPPELITBANGDA: "Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah",
  DINKES: "Dinas Kesehatan",
  RSUD: "Rumah Sakit Umum Daerah",
  PUSKESMAS: "Pusat Kesehatan Masyarakat",
  DLH: "Dinas Lingkungan Hidup",
  DISDIK: "Dinas Pendidikan",
  DIKBUD: "Dinas Pendidikan dan Kebudayaan",
  DISDIKBUD: "Dinas Pendidikan dan Kebudayaan",
  DISHUB: "Dinas Perhubungan",
  DISKOMINFO: "Dinas Komunikasi dan Informatika",
  KOMINFO: "Dinas Komunikasi dan Informatika",
  DISDUKCAPIL: "Dinas Kependudukan dan Pencatatan Sipil",
  DUKCAPIL: "Dinas Kependudukan dan Pencatatan Sipil",
  DINSOS: "Dinas Sosial",
  DISNAKER: "Dinas Tenaga Kerja dan Transmigrasi",
  DISNAKERTRANS: "Dinas Tenaga Kerja dan Transmigrasi",
  DISPERINDAG: "Dinas Perindustrian dan Perdagangan",
  DISKOPUKM: "Dinas Koperasi, Usaha Kecil dan Menengah",
  DKUKMPP: "Dinas Koperasi, Usaha Kecil Menengah, Perindustrian dan Perdagangan",
  DISPORAPAR: "Dinas Pemuda, Olahraga dan Pariwisata",
  DISPAR: "Dinas Pariwisata",
  DISPORA: "Dinas Pemuda dan Olahraga",
  DISTAN: "Dinas Pertanian",
  DISBUN: "Dinas Perkebunan",
  DKPP: "Dinas Ketahanan Pangan dan Pertanian",
  DPKP: "Dinas Perumahan, Kawasan Permukiman dan Pertanahan",
  PERKIM: "Dinas Perumahan, Kawasan Permukiman dan Pertanahan",
  BPBD: "Badan Penanggulangan Bencana Daerah",
  BPKAD: "Badan Pengelolaan Keuangan dan Aset Daerah",
  BKAD: "Badan Keuangan dan Aset Daerah",
  BKPSDM: "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia",
  BKPP: "Badan Kepegawaian, Pendidikan dan Pelatihan",
  INSPEKTORAT: "Inspektorat Daerah",
  SETDA: "Sekretariat Daerah",
  SETWAN: "Sekretariat Dewan Perwakilan Rakyat Daerah",
  DPRD: "Dewan Perwakilan Rakyat Daerah",
  SATPOLPP: "Satuan Polisi Pamong Praja",
  SATPOL_PP: "Satuan Polisi Pamong Praja",
  DAMKAR: "Dinas Pemadam Kebakaran dan Penyelamatan",
  KESBANGPOL: "Badan Kesatuan Bangsa dan Politik",
  BAKESBANGPOL: "Badan Kesatuan Bangsa dan Politik",
  DPMD: "Dinas Pemberdayaan Masyarakat dan Desa",
  DPMPD: "Dinas Pemberdayaan Masyarakat dan Desa",
  DP3AP2KB: "Dinas Pemberdayaan Perempuan, Perlindungan Anak, Pengendalian Penduduk dan Keluarga Berencana",
  DP3AKB: "Dinas Pemberdayaan Perempuan, Perlindungan Anak dan Keluarga Berencana",
  BAPENDA: "Badan Pendapatan Daerah",
  DISPENDAP: "Badan Pendapatan Daerah",
  KECAMATAN: "Kecamatan",
  KELURAHAN: "Kelurahan",
};

const WILAYAH_FULL_NAME_MAP = {
  KOBAR: "Kabupaten Kotawaringin Barat",
  "KOTAWARINGIN BARAT": "Kabupaten Kotawaringin Barat",
  LAMANDAU: "Kabupaten Lamandau",
};

function firstFilled(...values) {
  return values.map((value) => String(value || "").trim()).find(Boolean) || "";
}

function normalizeKeyText(value) {
  return String(value || "").trim().toUpperCase().replaceAll(".", " ").replaceAll("_", " ").replaceAll("-", " ").replaceAll("  ", " ");
}

function getPenempatanCode(row = {}) {
  return firstFilled(row.penempatanKode, row.penempatanSingkatan, row.kodePenempatan, row.kode_instansi, row.kodeInstansi);
}

function getWilayahLengkap(row = {}) {
  const direct = firstFilled(row.wilayahLengkap, row.namaWilayahLengkap, row.wilayahNama, row.namaWilayah);
  if (direct) return direct;
  const wilayah = firstFilled(row.wilayah, row.kabupaten, row.daerah);
  return WILAYAH_FULL_NAME_MAP[normalizeKeyText(wilayah)] || wilayah;
}

function isSingkatanPenempatan(value = "") {
  const text = String(value || "").trim();
  if (!text) return false;
  const normalized = normalizeKeyText(text);
  const compact = normalized.replaceAll(" ", "");
  if (PENEMPATAN_FULL_NAME_MAP[normalized] || PENEMPATAN_FULL_NAME_MAP[compact]) return true;
  return text.length <= 12 && text === text.toUpperCase() && !text.includes(" ");
}

function expandPenempatanName(value = "") {
  const text = String(value || "").trim();
  const normalized = normalizeKeyText(text);
  const compact = normalized.replaceAll(" ", "");
  return PENEMPATAN_FULL_NAME_MAP[compact] || PENEMPATAN_FULL_NAME_MAP[normalized] || text;
}

function getPenempatanBaseName(row = {}) {
  const preferred = firstFilled(row.penempatanDisplay, row.namaPenempatanLengkap, row.penempatanNama, row.namaPenempatan, row.nama_instansi);
  if (preferred && !isSingkatanPenempatan(preferred)) return preferred;

  const code = getPenempatanCode(row) || preferred || row.penempatan;
  const expandedFromCode = expandPenempatanName(code);
  if (expandedFromCode && !isSingkatanPenempatan(expandedFromCode)) return expandedFromCode;

  const rawPenempatan = firstFilled(row.penempatan);
  const expandedRaw = expandPenempatanName(rawPenempatan);
  if (expandedRaw && !isSingkatanPenempatan(expandedRaw)) return expandedRaw;

  return preferred || rawPenempatan || code || "-";
}

function getPenempatanDisplayName(row = {}) {
  const baseName = getPenempatanBaseName(row);
  const wilayahLengkap = getWilayahLengkap(row);
  if (!baseName) return wilayahLengkap || "-";
  if (!wilayahLengkap) return baseName;
  if (String(baseName).toLowerCase().includes(String(wilayahLengkap).toLowerCase())) return baseName;
  return baseName + " - " + wilayahLengkap;
}

function normalizePlacementFields(row = {}) {
  if (!row || typeof row !== "object") return row;
  const display = getPenempatanDisplayName(row);
  const code = getPenempatanCode(row) || row.penempatanKode || row.penempatanSingkatan || "";
  const wilayahLengkap = getWilayahLengkap(row);

  return {
    ...row,
    penempatanAsli: row.penempatanAsli || row.penempatan || "",
    penempatanKode: row.penempatanKode || code,
    penempatanSingkatan: row.penempatanSingkatan || code,
    wilayahLengkap: wilayahLengkap || row.wilayahLengkap || "",
    penempatanDisplay: display,
    namaPenempatanLengkap: display,
    penempatanNama: display,
    penempatan: display,
  };
}

function getRowDedupeKey(row = {}, type = "data") {
  if (type === "absensi") return getAttendanceStableKey(row);

  const directId = firstFilled(row.id, row.key, row.recordId, row.cutiId, row.leaveId, row.requestId, row.clientRequestId, row.idempotencyKey);
  if (directId) return `${type}:${directId}`.toLowerCase();

  const userId = firstFilled(row.userId, row.idKaryawan, row.id_karyawan, row.employeeId, row.idPegawai, row.nip, row.nama);
  const tanggal = firstFilled(row.tanggal, row.date, row.tgl, row.createdDate, row.createdAt, row.dateStart, row.start);
  const jenis = firstFilled(row.jenis, row.jenisCuti, row.tipe, row.type, row.requestCategory, row.leaveGroup, row.statusAbsensi, row.keterangan);
  return [type, userId, tanggal, jenis].join("|").toLowerCase();
}

function dedupeRows(rows = [], type = "data") {
  const seen = new Set();
  return safeArray(rows).filter((row) => {
    const key = getRowDedupeKey(row, type);
    if (!key || key.replaceAll("|", "").trim() === "") return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeRealtimeObject(value, parent = {}) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item, index) => (item && typeof item === "object" ? { id: item.id || item.key || String(index), ...item, ...parent } : item));
  }

  if (typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, item]) => {
    if (!item || typeof item !== "object") return [{ id: key, key, value: item, ...parent }];

    const childKeys = Object.keys(item);
    const looksNested = childKeys.some((childKey) => item[childKey] && typeof item[childKey] === "object" && !Array.isArray(item[childKey]));
    const hasRecordFields = ["nama", "name", "tanggal", "date", "jamMasuk", "jam_masuk", "status", "userId", "idKaryawan", "id_karyawan", "employeeId", "pin", "password"].some((field) => Object.prototype.hasOwnProperty.call(item, field));

    if (looksNested && !hasRecordFields) {
      return Object.entries(item).flatMap(([childKey, childItem]) => {
        if (!childItem || typeof childItem !== "object") return [{ id: childKey, key: childKey, parentId: key, value: childItem, ...parent }];
        return {
          id: childItem.id || childItem.recordId || childKey,
          key: childKey,
          parentId: key,
          userId: childItem.userId || childItem.idKaryawan || childItem.id_karyawan || childItem.employeeId || key,
          idKaryawan: childItem.idKaryawan || childItem.id_karyawan || childItem.employeeId || childItem.userId || key,
          id_karyawan: childItem.id_karyawan || childItem.idKaryawan || childItem.employeeId || childItem.userId || key,
          employeeId: childItem.employeeId || childItem.idKaryawan || childItem.id_karyawan || childItem.userId || key,
          ...childItem,
          ...parent,
        };
      });
    }

    return {
      id: item.id || item.userId || item.idKaryawan || item.id_karyawan || item.employeeId || key,
      key,
      userId: item.userId || item.id || item.idKaryawan || item.id_karyawan || item.employeeId || key,
      idKaryawan: item.idKaryawan || item.id || item.userId || item.id_karyawan || item.employeeId || key,
      id_karyawan: item.id_karyawan || item.idKaryawan || item.id || item.userId || item.employeeId || key,
      employeeId: item.employeeId || item.idKaryawan || item.id_karyawan || item.id || item.userId || key,
      ...item,
      ...parent,
    };
  });
}

function readRealtimePath(pathKey) {
  return new Promise((resolve, reject) => {
    onValue(
      ref(realtimeDb, firebasePath(pathKey)),
      (snapshot) => resolve(snapshot.val()),
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}

async function apiGet() {
  const [karyawanRaw, absensiRaw, cutiRaw, laporanRaw, pesanRaw, broadcastRaw, kalenderRaw, hariLiburRaw, jamKerjaRaw, appUpdateRaw, adminUsersRaw, adminLogsRaw, settingsRaw] = await Promise.all([
    readRealtimePath("karyawan"),
    readRealtimePath("absensi"),
    readRealtimePath("cuti"),
    readRealtimePath("laporan"),
    readRealtimePath("pesan"),
    readRealtimePath("broadcast"),
    readRealtimePath("kalender_nasional"),
    readRealtimePath("hari_libur"),
    readRealtimePath("jam_kerja"),
    readRealtimePath("app_update"),
    readRealtimePath("admin_users"),
    readRealtimePath("admin_logs"),
    readRealtimePath("settings"),
  ]);

  return {
    raw: { source: "firebase-realtime-database", root: FIREBASE_ROOT },
    karyawan: dedupeRows(normalizeRealtimeObject(karyawanRaw).map(normalizePlacementFields), "karyawan"),
    absensi: dedupeRows(normalizeRealtimeObject(absensiRaw).map(normalizePlacementFields), "absensi"),
    cuti: dedupeRows(normalizeRealtimeObject(cutiRaw).map(normalizePlacementFields), "cuti"),
    laporan: dedupeRows(normalizeRealtimeObject(laporanRaw).map(normalizePlacementFields), "laporan"),
    pesan: dedupeRows(normalizeRealtimeObject(pesanRaw).map(normalizePlacementFields), "pesan"),
    broadcast: dedupeRows(normalizeRealtimeObject(broadcastRaw).map(normalizePlacementFields), "broadcast"),
    kalender_nasional: normalizeRealtimeObject(kalenderRaw),
    hari_libur: normalizeRealtimeObject(hariLiburRaw),
    jam_kerja: normalizeRealtimeObject(jamKerjaRaw).map(normalizePlacementFields),
    app_update: appUpdateRaw || {},
    admin_users: normalizeRealtimeObject(adminUsersRaw),
    admin_logs: normalizeRealtimeObject(adminLogsRaw),
    settings: settingsRaw || {},
  };
}

function subscribeFirebaseDatabase(onData, onError) {
  const pathKeys = Object.keys(FIREBASE_PATHS);
  const bucket = {};
  const loaded = new Set();

  const normalizeByKey = (key, rawValue) => {
    if (key === "app_update" || key === "settings") return rawValue || {};
    return dedupeRows(normalizeRealtimeObject(rawValue).map(normalizePlacementFields), key);
  };

  const emitWhenReady = () => {
    if (loaded.size < pathKeys.length) return;
    onData({ ...EMPTY_DB, ...bucket, raw: { source: "firebase-realtime-database-realtime", root: FIREBASE_ROOT } });
  };

  const unsubscribers = pathKeys.map((key) => {
    return onValue(
      ref(realtimeDb, firebasePath(key)),
      (snapshot) => {
        bucket[key] = normalizeByKey(key, snapshot.val());
        loaded.add(key);
        emitWhenReady();
      },
      (error) => {
        if (typeof onError === "function") onError(error);
      }
    );
  });

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe && unsubscribe());
}

function firebaseDocId(value, prefix = "DOC") {
  const clean = String(value || "").trim();
  if (clean) return clean.replace(/[.#$\/\[\]]/g, "-");
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function cleanFirebaseData(value) {
  if (Array.isArray(value)) return value.map(cleanFirebaseData).filter((item) => item !== undefined);
  if (!value || typeof value !== "object") return value === undefined ? null : value;
  if (value instanceof Date) return value.toISOString();
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item !== "undefined" && typeof item !== "function")
      .map(([key, item]) => [key, cleanFirebaseData(item)])
  );
}

function isDeveloperRole(role) {
  return ["super_admin", "developer"].includes(String(role || "").toLowerCase());
}

function getAdminRoleLabel(role) {
  const value = String(role || "admin").toLowerCase();
  if (value === "super_admin") return "Super Admin";
  if (value === "developer") return "Developer";
  return "Admin";
}

function maskSensitiveAdminData(row = {}) {
  if (!row || typeof row !== "object") return row;
  return {
    ...row,
    pin: row.pin ? "******" : "",
    password: row.password ? "******" : "",
  };
}

async function readRootDatabaseOnce() {
  const snapshot = await get(ref(realtimeDb, FIREBASE_ROOT));
  return snapshot.val() || {};
}

async function readRealtimeOnce(pathKeyOrPath) {
  const fullPath = pathKeyOrPath.startsWith(FIREBASE_ROOT) ? pathKeyOrPath : firebasePath(pathKeyOrPath);
  const snapshot = await get(ref(realtimeDb, fullPath));
  return snapshot.val();
}

async function writeAdminLog(admin = {}, action, detail = {}, targetPath = "") {
  const logRef = push(ref(realtimeDb, `${FIREBASE_ROOT}/admin_logs`));
  await set(logRef, cleanFirebaseData({
    action,
    username: admin.username || admin.user || "unknown",
    role: admin.role || "admin",
    detail,
    targetPath,
    createdAt: new Date().toISOString(),
  }));
}

function countFirebaseNode(node) {
  if (!node) return 0;
  if (Array.isArray(node)) return node.filter(Boolean).length;
  if (typeof node === "object") return Object.keys(node).length;
  return 1;
}

function getEmployeeIdFromRow(row = {}) {
  return firstFilled(row.userId, row.idKaryawan, row.id_karyawan, row.employeeId, row.id, row.nip);
}

function getDateFromRow(row = {}) {
  return firstFilled(row.tanggal, row.date, row.tgl, row.createdDate, row.createdAt).slice(0, 10);
}

function getAttendanceActionFromRow(row = {}) {
  return normalizeAttendanceActionLabel(firstFilled(
    row.action,
    row.actionType,
    row.attendanceAction,
    row.aksi,
    row.jenisAbsensi,
    row.displayAction,
    row.actionLabel,
    row.tipe_absensi,
    row.type,
    row.jenis,
    row.clockStatus,
    row.statusAbsensi
  ));
}

function flattenFirebaseRecordsForPath(rawData, parentPath) {
  if (!rawData || typeof rawData !== "object") return [];
  return Object.entries(rawData).flatMap(([key, value]) => {
    const currentPath = `${parentPath}/${key}`;
    if (!value || typeof value !== "object") return [{ key, path: currentPath, value }];
    const hasRecordFields = ["id", "userId", "idKaryawan", "id_karyawan", "employeeId", "tanggal", "date", "createdAt", "updatedAt", "timestamp"].some((field) => Object.prototype.hasOwnProperty.call(value, field));
    const childObjects = Object.entries(value).filter(([, child]) => child && typeof child === "object");
    if (!hasRecordFields && childObjects.length) return flattenFirebaseRecordsForPath(value, currentPath);
    return [{ key, path: currentPath, ...value }];
  });
}

function getComparableTime(row = {}) {
  const value = firstFilled(row.updatedAt, row.timestamp, row.createdAt, row.waktu, row.jamMasuk, row.jam_masuk);
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function detectDuplicateAttendanceRecords(rawAbsensi) {
  const records = flattenFirebaseRecordsForPath(rawAbsensi, `${FIREBASE_ROOT}/absensi`);
  const groups = new Map();

  records.forEach((record) => {
    const userId = getEmployeeIdFromRow(record);
    const tanggal = getDateFromRow(record);
    const action = getAttendanceActionFromRow(record);
    const dedupeKey = [userId, tanggal, action].join("|").toLowerCase();
    if (!userId || !tanggal || !action) return;
    if (!groups.has(dedupeKey)) groups.set(dedupeKey, []);
    groups.get(dedupeKey).push(record);
  });

  return Array.from(groups.entries())
    .map(([dedupeKey, rows]) => {
      const sorted = [...rows].sort((a, b) => getComparableTime(b) - getComparableTime(a));
      return {
        dedupeKey,
        keep: sorted[0],
        duplicates: sorted.slice(1),
        total: rows.length,
      };
    })
    .filter((group) => group.total > 1);
}

function downloadJsonFile(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildBackupFileName() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `backup-karsa-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}.json`;
}

function matchesTestingFilter(row = {}, filter = {}) {
  const rowUser = getEmployeeIdFromRow(row);
  const rowDate = getDateFromRow(row);
  const hasAnyFilter = Boolean(filter.employeeId || filter.date || filter.startDate || filter.endDate);

  if (!hasAnyFilter) return true;
  if (filter.employeeId && rowUser !== filter.employeeId) return false;
  if (filter.date && rowDate !== filter.date) return false;
  if (filter.startDate && rowDate < filter.startDate) return false;
  if (filter.endDate && rowDate > filter.endDate) return false;

  return true;
}

function getTestingRecordsToDelete(rawRoot = {}, filter = {}) {
  const deletableNodes = ["absensi", "laporan", "cuti", "izin", "pesan"];
  return deletableNodes.flatMap((nodeName) => {
    const records = flattenFirebaseRecordsForPath(rawRoot[nodeName], `${FIREBASE_ROOT}/${nodeName}`);
    return records
      .filter((record) => matchesTestingFilter(record, filter))
      .map((record) => ({ ...record, nodeName }));
  });
}

async function removeFirebasePaths(paths = []) {
  const updates = {};
  paths.forEach((path) => {
    const cleanPath = String(path || "").replace(`${FIREBASE_ROOT}/`, "");
    if (cleanPath && !cleanPath.startsWith("karyawan") && !cleanPath.startsWith("admin_users")) {
      updates[cleanPath] = null;
    }
  });
  if (Object.keys(updates).length) await update(ref(realtimeDb, FIREBASE_ROOT), updates);
}

function employeeCompatPayload(data, id) {
  return {
    ...data,
    id: data?.id || id,
    userId: data?.userId || data?.id || data?.idKaryawan || data?.id_karyawan || data?.employeeId || id,
    idKaryawan: data?.idKaryawan || data?.id || data?.userId || data?.id_karyawan || data?.employeeId || id,
    id_karyawan: data?.id_karyawan || data?.idKaryawan || data?.id || data?.userId || data?.employeeId || id,
    employeeId: data?.employeeId || data?.idKaryawan || data?.id_karyawan || data?.id || data?.userId || id,
  };
}

async function saveRealtimeDoc(pathKey, id, data, prefix = "DOC") {
  const docId = firebaseDocId(id, prefix);
  const clean = cleanFirebaseData({
    ...data,
    id: data?.id || docId,
    updatedAt: data?.updatedAt || new Date().toISOString(),
  });
  await update(ref(realtimeDb, `${firebasePath(pathKey)}/${docId}`), clean);
  return { id: docId, ...clean };
}

async function createRealtimeDoc(pathKey, data, prefix = "DOC") {
  const nodeRef = push(ref(realtimeDb, firebasePath(pathKey)));
  const id = nodeRef.key || firebaseDocId(data?.id, prefix);
  const clean = cleanFirebaseData({ ...data, id: data?.id || id, createdAt: data?.createdAt || new Date().toISOString(), updatedAt: data?.updatedAt || new Date().toISOString() });
  await set(nodeRef, clean);
  return { id, ...clean };
}

async function apiPost(payload) {
  const action = String(payload?.action || "").trim();
  const actor = payload?.actor || payload?.adminName || payload?.createdBy || "Admin";
  const now = new Date().toISOString();
  const { action: _action, ...dataWithoutAction } = payload || {};

  if (!action) throw new Error("Action Firebase belum ditentukan.");

  if (action === "add_employee") {
    const id = firebaseDocId(payload.id || payload.userId || payload.idKaryawan || payload.id_karyawan || payload.employeeId, "EMP");
    const employeePayload = employeeCompatPayload(normalizePlacementFields({ ...dataWithoutAction, status: payload.status || "Aktif", createdAt: payload.createdAt || now, createdBy: actor }), id);
    await set(ref(realtimeDb, `${firebasePath("karyawan")}/${id}`), cleanFirebaseData(employeePayload));
    return { status: "success", id };
  }

  if (action === "update_employee") {
    const id = firebaseDocId(payload.id || payload.userId || payload.idKaryawan || payload.id_karyawan || payload.employeeId, "EMP");
    const employeePayload = employeeCompatPayload(normalizePlacementFields({ ...dataWithoutAction, updatedBy: actor, updatedAt: now }), id);
    await update(ref(realtimeDb, `${firebasePath("karyawan")}/${id}`), cleanFirebaseData(employeePayload));
    return { status: "success", id };
  }

  if (action === "delete_employee") {
    const id = firebaseDocId(payload.id || payload.userId || payload.idKaryawan || payload.id_karyawan || payload.employeeId, "EMP");
    await remove(ref(realtimeDb, `${firebasePath("karyawan")}/${id}`));
    return { status: "success", id };
  }

  if (action === "archive_employee") {
    const id = firebaseDocId(payload.id || payload.userId || payload.idKaryawan || payload.id_karyawan || payload.employeeId, "EMP");
    await update(ref(realtimeDb, `${firebasePath("karyawan")}/${id}`), cleanFirebaseData({ status: "Nonaktif", archived: true, archivedAt: now, archivedBy: actor, updatedAt: now }));
    return { status: "success", id };
  }

  if (action === "reset_pin") {
    const id = firebaseDocId(payload.id || payload.userId || payload.idKaryawan || payload.id_karyawan || payload.employeeId, "EMP");
    await update(ref(realtimeDb, `${firebasePath("karyawan")}/${id}`), cleanFirebaseData({ pin: "123456", password: "123456", pinResetAt: now, pinResetBy: actor, updatedAt: now }));
    return { status: "success", id };
  }

  if (action === "save_jam_kerja") {
    const schedules = safeArray(payload.jam_kerja || payload.schedules).map((row, index) => normalizeScheduleRow({ ...row, urutan: index + 1 }, index));
    await set(ref(realtimeDb, firebasePath("jam_kerja")), cleanFirebaseData(Object.fromEntries(schedules.map((row, index) => [firebaseDocId(row.id || `JAM-${index + 1}`, "JAM"), { ...row, updatedBy: actor, updatedAt: now }]))));
    return { status: "success", total: schedules.length };
  }

  if (action === "save_hari_libur") {
    const id = firebaseDocId(payload.id || payload.tanggal || payload.date, "LIBUR");
    await saveRealtimeDoc("hari_libur", id, { ...dataWithoutAction, id, updatedBy: actor, updatedAt: now }, "LIBUR");
    return { status: "success", id };
  }

  if (action === "delete_hari_libur") {
    const id = firebaseDocId(payload.id || payload.tanggal || payload.date, "LIBUR");
    await remove(ref(realtimeDb, `${firebasePath("hari_libur")}/${id}`));
    return { status: "success", id };
  }

  if (action === "save_app_update") {
    const payloadUpdate = cleanFirebaseData({
      latestVersion: payload.latestVersion || "",
      minRequiredVersion: payload.minRequiredVersion || "",
      forceUpdate: Boolean(payload.forceUpdate),
      apkUrl: payload.apkUrl || payload.updateUrl || "",
      updateTitle: payload.updateTitle || "Update Aplikasi Tersedia",
      updateMessage: payload.updateMessage || "Silakan perbarui aplikasi untuk mendapatkan fitur terbaru.",
      releaseNotes: payload.releaseNotes || payload.changelog || "",
      updatedBy: actor,
      updatedAt: now,
    });
    await update(ref(realtimeDb, firebasePath("app_update")), payloadUpdate);
    await writeAdminLog({ username: actor, role: "admin" }, "SAVE_APP_UPDATE", payloadUpdate, firebasePath("app_update"));
    return { status: "success" };
  }

  if (action === "update_laporan_status") {
    const id = firebaseDocId(payload.id || payload.laporanId || payload.reportId || payload.recordId, "LAPORAN");
    const laporanRef = ref(realtimeDb, `${firebasePath("laporan")}/${id}`);
    const laporanSnapshot = await get(laporanRef);
    if (!laporanSnapshot.exists()) {
      throw new Error(`Data laporan ${id} tidak ditemukan di Firebase.`);
    }
    const payloadUpdate = cleanFirebaseData({
      status: payload.status || payload.reportStatus || "Diproses",
      reportStatus: payload.reportStatus || payload.status || "Diproses",
      reviewNote: payload.reviewNote || payload.adminNote || "",
      reviewedBy: actor,
      reviewedAt: now,
      updatedBy: actor,
      updatedAt: now,
    });
    await update(laporanRef, payloadUpdate);
    await writeAdminLog({ username: actor, role: "admin" }, "UPDATE_LAPORAN_STATUS", { id, ...payloadUpdate }, `${firebasePath("laporan")}/${id}`);
    return { status: "success", id };
  }

  if (action === "admin_message") {
    const saved = await createRealtimeDoc("pesan", { ...dataWithoutAction, createdAt: payload.createdAt || now, createdBy: actor }, "MSG");
    return { status: "success", id: saved.id };
  }

  if (action === "broadcast") {
    const saved = await createRealtimeDoc("broadcast", { ...dataWithoutAction, createdAt: payload.createdAt || now, createdBy: actor }, "BROADCAST");
    return { status: "success", id: saved.id };
  }

  if (["approve_cuti", "reject_cuti", "revoke_cuti"].includes(action)) {
    const id = firebaseDocId(payload.id || payload.cutiId || payload.leaveId || payload.recordId, "CUTI");
    const nextStatus = action === "approve_cuti" ? "Disetujui" : action === "reject_cuti" ? "Ditolak" : "Dicabut";
    const decisionField = action === "approve_cuti" ? "approved" : action === "reject_cuti" ? "rejected" : "revoked";

    const cutiTargetRef = ref(realtimeDb, `${firebasePath("cuti")}/${id}`);
    const cutiSnapshot = await get(cutiTargetRef);
    if (!cutiSnapshot.exists()) {
      throw new Error(`Data cuti ${id} tidak ditemukan di Firebase. Keputusan dibatalkan supaya tidak membuat data cuti palsu.`);
    }

    await update(cutiTargetRef, cleanFirebaseData({
      ...dataWithoutAction,
      id,
      cutiId: id,
      leaveId: id,
      status: nextStatus,
      [`${decisionField}By`]: actor,
      [`${decisionField}At`]: now,
      updatedBy: actor,
      updatedAt: now,
    }));

    await writeAdminLog({ username: actor, role: "admin" }, "CUTI_DECISION", {
      id,
      cutiId: id,
      leaveId: id,
      userId: payload.userId || payload.idKaryawan || payload.id_karyawan || payload.employeeId || "",
      oldStatus: payload.oldStatus || "Menunggu",
      newStatus: nextStatus,
      action,
      adminName: actor,
      actor,
      adminNote: payload.adminNote || "",
      createdAt: now,
    }, `${firebasePath("cuti")}/${id}`);

    return { status: "success", id };
  }

  const fallbackPath = payload.collection || payload.table || "audit_log";
  const saved = await createRealtimeDoc(fallbackPath, { ...dataWithoutAction, action, createdAt: payload.createdAt || now, createdBy: actor }, "DOC");
  return { status: "success", id: saved.id };
}

function extractDetailRecord(input) {
  if (!input || typeof input !== "object") return {};
  const nestedKeys = ["data", "row", "record", "item", "employee", "karyawan", "absensi", "attendance", "cuti", "laporan", "pesan", "detail", "value"];
  for (const key of nestedKeys) {
    if (input[key] && typeof input[key] === "object") return { ...input[key], _detailType: input.type || input.menu || key };
  }
  return input;
}

function getDetailValue(record, ...keys) {
  if (!record || typeof record !== "object") return "-";
  const entries = Object.entries(record);
  for (const key of keys) {
    const direct = record[key];
    if (direct !== undefined && direct !== null && String(direct).trim() !== "") return String(direct).trim();
    const found = entries.find(([entryKey]) => String(entryKey).toLowerCase() === String(key).toLowerCase());
    if (found && found[1] !== undefined && found[1] !== null && String(found[1]).trim() !== "") return String(found[1]).trim();
  }
  return "-";
}

function hasAnyDetailField(record, fields = []) {
  if (!record || typeof record !== "object") return false;
  const lowerKeys = Object.keys(record).map((key) => String(key).toLowerCase());
  return fields.some((field) => lowerKeys.includes(String(field).toLowerCase()));
}

function getDetailType(selected) {
  const record = extractDetailRecord(selected);
  const explicitType = String(selected?.type || selected?.menu || selected?.section || record?._detailType || "").toLowerCase();
  if (explicitType.includes("absen") || explicitType.includes("attendance") || explicitType.includes("kehadiran")) return "absensi";
  if (explicitType.includes("cuti") || explicitType.includes("izin")) return "cuti";
  if (explicitType.includes("laporan")) return "laporan";
  if (explicitType.includes("pesan")) return "pesan";

  if (hasAnyDetailField(record, ["jamMasuk", "jam_masuk", "jamPulang", "jam_pulang", "actionType", "attendanceAction", "jenisAbsensi", "latitude", "longitude", "lokasi", "gpsStatus"])) return "absensi";
  if (hasAnyDetailField(record, ["tanggalMulai", "tanggalSelesai", "jenisCuti", "jenisIzin", "alasan", "approvalStatus", "approvedAt", "rejectedAt"])) return "cuti";
  if (hasAnyDetailField(record, ["judulLaporan", "isiLaporan", "laporan", "deskripsiLaporan", "fotoLaporan"])) return "laporan";
  if (hasAnyDetailField(record, ["judulPesan", "isiPesan", "message", "body", "lampiranUrl"])) return "pesan";
  return "karyawan";
}

function getWhatsAppLink(phone) {
  const raw = String(phone || "").trim();
  if (!raw || raw === "-") return "";

  let digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";

  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  if (!digits.startsWith("62")) digits = `62${digits}`;

  return `https://wa.me/${digits}`;
}

function CompactFieldCard({ label, value }) {
  const labelText = String(label || "").toUpperCase().split(" ").filter(Boolean).join(" ").trim();
  const isWhatsappField = ["NO. HP", "NO HP", "NOMOR HP", "WHATSAPP", "WA", "TELEPON", "PHONE"].includes(labelText);
  const whatsappLink = isWhatsappField ? getWhatsAppLink(value) : "";

  return (
    <div className="karsa-detail-card rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      {whatsappLink ? (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="mt-1 inline-flex items-center gap-1 break-words rounded-sm bg-emerald-50 px-2 py-1 text-xs font-black leading-relaxed text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
          title="Klik untuk buka WhatsApp"
        >
          {value || "-"}
        </a>
      ) : (
        <p className="mt-1 break-words text-xs font-black leading-relaxed text-slate-950">{value || "-"}</p>
      )}
    </div>
  );
}

function getRecordFileUrl(row, type) {
  const keys = type === "absensi"
    ? ["stampedPhotoUrl", "timestampPhotoUrl", "proofPhotoUrl", "attendancePhotoUrl", "photoUrl", "fotoUrl", "imageUrl", "fileUrl", "lampiranUrl", "attachmentUrl", "url", "link"]
    : ["attachmentUrl", "lampiranUrl", "fileUrl", "reportPhotoUrl", "photoUrl", "fotoUrl", "imageUrl", "pictureUrl", "url", "link"];

  for (const key of keys) {
    const raw = String(getVal(row, key) || "").trim();
    if (!raw || raw === "-" || raw.toLowerCase() === "null" || raw.toLowerCase() === "undefined") continue;
    const normalized = normalizeImageUrl(raw);
    if (isOpenableEvidenceUrl(normalized)) return normalized;
  }
  return "";
}

function isOpenableEvidenceUrl(url) {
  const value = String(url || "").trim();
  if (!value) return false;
  if (value.startsWith("data:image/")) return true;
  if (value.startsWith("blob:")) return true;
  return /^https?:\/\//i.test(value);
}

function openEvidenceSafely(url) {
  const safeUrl = String(url || "").trim();

  if (!isOpenableEvidenceUrl(safeUrl)) {
    alert("Link bukti belum valid. Pastikan database menyimpan URL foto/lampiran yang bisa diakses, bukan nama file lokal.");
    return;
  }

  // FIX UTAMA:
  // Jangan pakai window.open lagi. Di Chrome, window.open sering dianggap pop-up
  // kalau fungsi ini terpanggil dari proses async / render table, akhirnya muncul alert terus.
  // Sekarang bukti dibuka sebagai preview overlay langsung di dalam aplikasi.
  const existing = document.getElementById("karsa-evidence-preview-root");
  if (existing) existing.remove();

  const isImage = safeUrl.startsWith("data:image/") || /\.(png|jpe?g|webp|gif|bmp|svg)(\?|#|$)/i.test(safeUrl);
  const isPdf = safeUrl.startsWith("data:application/pdf") || /\.pdf(\?|#|$)/i.test(safeUrl);
  const title = isImage ? "Preview Bukti Foto" : isPdf ? "Preview Bukti PDF" : "Preview Bukti";

  const root = document.createElement("div");
  root.id = "karsa-evidence-preview-root";
  root.style.position = "fixed";
  root.style.inset = "0";
  root.style.zIndex = "999999";
  root.style.background = "rgba(15, 23, 42, .88)";
  root.style.backdropFilter = "blur(10px)";
  root.style.display = "flex";
  root.style.flexDirection = "column";

  const toolbar = document.createElement("div");
  toolbar.style.display = "flex";
  toolbar.style.alignItems = "center";
  toolbar.style.justifyContent = "space-between";
  toolbar.style.gap = "12px";
  toolbar.style.padding = "14px 18px";
  toolbar.style.background = "rgba(15, 23, 42, .96)";
  toolbar.style.color = "#fff";
  toolbar.style.borderBottom = "1px solid rgba(255,255,255,.12)";

  const heading = document.createElement("div");
  heading.textContent = title;
  heading.style.fontSize = "14px";
  heading.style.fontWeight = "900";

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";
  actions.style.flexWrap = "wrap";
  actions.style.justifyContent = "flex-end";

  const downloadBtn = document.createElement("a");
  downloadBtn.href = safeUrl;
  downloadBtn.download = isPdf ? "bukti-karsa.pdf" : "bukti-karsa.jpg";
  downloadBtn.textContent = "Download";
  downloadBtn.style.display = "inline-flex";
  downloadBtn.style.alignItems = "center";
  downloadBtn.style.justifyContent = "center";
  downloadBtn.style.minHeight = "36px";
  downloadBtn.style.borderRadius = "10px";
  downloadBtn.style.padding = "8px 12px";
  downloadBtn.style.background = "#2563eb";
  downloadBtn.style.color = "#fff";
  downloadBtn.style.textDecoration = "none";
  downloadBtn.style.fontSize = "12px";
  downloadBtn.style.fontWeight = "900";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "Tutup";
  closeBtn.style.minHeight = "36px";
  closeBtn.style.border = "0";
  closeBtn.style.borderRadius = "10px";
  closeBtn.style.padding = "8px 12px";
  closeBtn.style.background = "rgba(255,255,255,.14)";
  closeBtn.style.color = "#fff";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "12px";
  closeBtn.style.fontWeight = "900";
  closeBtn.onclick = () => root.remove();

  actions.appendChild(downloadBtn);
  actions.appendChild(closeBtn);
  toolbar.appendChild(heading);
  toolbar.appendChild(actions);

  const stage = document.createElement("div");
  stage.style.flex = "1";
  stage.style.minHeight = "0";
  stage.style.display = "grid";
  stage.style.placeItems = "center";
  stage.style.padding = "18px";
  stage.onclick = (event) => {
    if (event.target === stage) root.remove();
  };

  let viewer;
  if (isImage) {
    viewer = document.createElement("img");
    viewer.src = safeUrl;
    viewer.alt = "Bukti absensi";
    viewer.style.maxWidth = "100%";
    viewer.style.maxHeight = "calc(100vh - 96px)";
    viewer.style.objectFit = "contain";
    viewer.style.background = "#fff";
    viewer.style.borderRadius = "14px";
    viewer.style.boxShadow = "0 24px 80px rgba(0,0,0,.42)";
  } else {
    viewer = document.createElement("iframe");
    viewer.src = safeUrl;
    viewer.title = "Bukti absensi";
    viewer.style.width = "min(1120px, 100%)";
    viewer.style.height = "calc(100vh - 96px)";
    viewer.style.border = "0";
    viewer.style.borderRadius = "14px";
    viewer.style.background = "#fff";
    viewer.style.boxShadow = "0 24px 80px rgba(0,0,0,.42)";
  }

  stage.appendChild(viewer);
  root.appendChild(toolbar);
  root.appendChild(stage);
  document.body.appendChild(root);

  const closeOnEsc = (event) => {
    if (event.key === "Escape") {
      root.remove();
      document.removeEventListener("keydown", closeOnEsc);
    }
  };
  document.addEventListener("keydown", closeOnEsc);
}

function EvidenceThumbnail({ row, type, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const photo = addImageCacheVersion(getRecordPhoto(row, type), row);
  const fileUrl = getRecordFileUrl(row, type) || (isOpenableEvidenceUrl(photo) ? photo : "");
  const isSmall = size === "sm";
  const sizeClass = isSmall ? "karsa-evidence-thumb-sm" : "karsa-evidence-thumb-lg h-56 w-full rounded-xl";

  if (photo && !failed) {
    return (
      <button type="button" onClick={(event) => { event.stopPropagation(); openEvidenceSafely(fileUrl || photo); }} className={cx("block overflow-hidden bg-slate-100 ring-1 ring-slate-200", sizeClass)} title="Buka bukti/lampiran">
        <img src={photo} alt={type === "absensi" ? "Bukti absensi" : "Bukti laporan"} referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      </button>
    );
  }

  return (
    <button type="button" onClick={(event) => { event.stopPropagation(); openEvidenceSafely(fileUrl); }} className={cx("grid place-items-center bg-slate-50 text-slate-400 ring-1 ring-slate-200", sizeClass, !fileUrl && "pointer-events-none")} title={fileUrl ? "Buka lampiran" : "Belum ada bukti"}>
      <FileText size={isSmall ? 24 : 34} />
    </button>
  );
}

function RecordEvidencePreview({ row, type }) {
  const photo = addImageCacheVersion(getRecordPhoto(row, type), row);
  const fileUrl = getRecordFileUrl(row, type) || (isOpenableEvidenceUrl(photo) ? photo : "");
  const lat = getVal(row, "latitude") || getVal(row, "lat");
  const lng = getVal(row, "longitude") || getVal(row, "lng");
  const title = type === "absensi" ? "Bukti Absensi" : "Bukti / Lampiran Laporan";
  const description = type === "absensi"
    ? "Foto bukti hadir/pulang yang dikirim user. Klik gambar untuk membuka ukuran penuh."
    : "Foto atau file lampiran laporan user. Klik preview untuk membuka bukti.";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Bukti Data</p>
          <h3 className="text-sm font-black text-slate-950">{title}</h3>
        </div>
        <Badge tone={fileUrl ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-red-50 text-red-700 ring-red-100"}>{fileUrl ? "Ada Bukti" : "Kosong"}</Badge>
      </div>

      <EvidenceThumbnail row={row} type={type} />
      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold leading-relaxed text-slate-600 ring-1 ring-slate-100">{fileUrl ? description : "Belum ada kolom bukti/foto/lampiran yang terbaca dari database untuk data ini."}</p>

      <div className="mt-3 grid gap-2">
        {fileUrl && (
          <button type="button" onClick={(event) => { event.stopPropagation(); openEvidenceSafely(fileUrl); }} className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-black text-white shadow-sm hover:bg-blue-700">
            <Eye size={14} /> Buka Bukti
          </button>
        )}
        {lat && lng && (
          <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-black text-blue-700 ring-1 ring-blue-100 hover:bg-blue-50">
            <MapPin size={14} /> Buka Lokasi GPS
          </a>
        )}
      </div>
    </aside>
  );
}

function getFirstPrintValue(record = {}, keys = []) {
  for (const key of keys) {
    const value = getDetailValue(record, key);
    if (value && value !== "-") return value;
  }
  return "-";
}

function normalizePrintValue(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function isPrintValueEmpty(value) {
  const text = String(value ?? "").trim();
  return !text || text === "-" || text.toLowerCase() === "undefined" || text.toLowerCase() === "null";
}

const PRINT_FIELD_GROUPS = [
  {
    title: "Identitas Karyawan",
    fields: [
      ["ID Karyawan", ["idKaryawan", "id_karyawan", "employeeId", "userId", "id", "firebaseKey", "key"]],
      ["Nama Lengkap", ["nama", "name", "namaLengkap"]],
      ["Status", ["status"]],
      ["PIN Login", ["pin", "password"]],
      ["NIK", ["nik", "NIK", "noNik"]],
      ["Tanggal Lahir", ["tanggalLahir", "tglLahir", "dob", "dateOfBirth"]],
      ["Jenis Kelamin", ["jenisKelamin", "gender"]],
    ],
  },
  {
    title: "Kontak & Alamat",
    fields: [
      ["Email", ["email"]],
      ["No. HP", ["noHp", "no_hp", "hp", "telepon", "phone"]],
      ["WhatsApp", ["whatsapp", "wa"]],
      ["Kontak Darurat", ["kontakDarurat", "emergencyContact"]],
      ["Alamat Domisili", ["alamatDomisili", "domisili", "alamat"]],
      ["Alamat KTP", ["alamatKtp", "alamatKTP", "ktpAddress"]],
    ],
  },
  {
    title: "Penempatan & Wilayah",
    fields: [
      ["Wilayah", ["wilayahLengkap", "wilayah"]],
      ["Penempatan", ["penempatanDisplay", "namaPenempatanLengkap", "penempatanNama", "penempatan"]],
      ["Kode Penempatan", ["penempatanKode", "penempatanSingkatan"]],
      ["Jenis Instansi", ["jenisInstansi"]],
      ["Kategori Instansi", ["kategoriInstansi"]],
      ["Nama Instansi", ["namaInstansi", "namaInstansiLengkap"]],
      ["Label Instansi", ["labelJenisInstansi"]],
      ["Dinas", ["isDinas"]],
    ],
  },
  {
    title: "Kepegawaian",
    fields: [
      ["Divisi", ["divisi", "devisi"]],
      ["Role", ["role"]],
      ["Pekerjaan", ["pekerjaan", "jenisPekerjaan"]],
      ["Jabatan", ["jabatan"]],
      ["Sumber Data", ["sumberData", "source"]],
      ["Aksi Terakhir", ["originalAction", "lastAction"]],
      ["Diupdate Oleh", ["diupdateOleh", "updatedBy"]],
      ["Update Terakhir", ["updatedAt", "lastUpdate", "createdAt"]],
    ],
  },
  {
    title: "Cuti & Hak Akses",
    fields: [
      ["Kuota Cuti Tahunan", ["kuotaCutiTahunan", "kuotaCuti", "jatahCuti"]],
      ["Cuti Terpakai", ["cutiTerpakai", "usedLeave"]],
      ["Sisa Cuti", ["sisaCuti", "remainingLeave"]],
      ["Status Sinkron", ["syncStatus"]],
    ],
  },
  {
    title: "Catatan",
    fields: [["Catatan", ["catatan", "notes", "keterangan"]]],
  },
];

function buildCompleteEmployeePrintRows(record = {}) {
  const normalized = extractDetailRecord(record);
  const usedKeys = new Set();
  const usedLabels = new Set();

  const groups = PRINT_FIELD_GROUPS.map((group) => {
    const rows = group.fields
      .map(([label, keys]) => {
        if (usedLabels.has(label)) return null;
        const value = getFirstPrintValue(normalized, keys);
        keys.forEach((key) => usedKeys.add(String(key).toLowerCase()));
        usedLabels.add(label);
        return { label, value: normalizePrintValue(value) };
      })
      .filter(Boolean)
      .filter((row) => !isPrintValueEmpty(row.value));

    return { ...group, rows };
  }).filter((group) => group.rows.length);

  const aliasKeys = new Set([
    "id", "key", "firebasekey", "idkaryawan", "id_karyawan", "employeeid", "userid",
    "nama", "name", "namalengkap", "pin", "password", "penempatan", "penempatandisplay",
    "namapenempatanlengkap", "penempatannama", "wilayah", "wilayahlengkap", "nohp", "no_hp",
    "hp", "telepon", "phone", "whatsapp", "wa", "divisi", "devisi", "role", "pekerjaan",
    "jenispekerjaan", "jabatan", "email", "status", "updatedat", "createdat", "lastupdate",
    "nik", "tanggallahir", "tgllahir", "dob", "jeniskelamin", "gender", "alamatdomisili", "alamatktp"
  ]);

  const additionalRows = Object.entries(normalized)
    .filter(([key, value]) => {
      const lower = String(key).toLowerCase();
      if (lower.startsWith("_") || usedKeys.has(lower) || aliasKeys.has(lower)) return false;
      if (["photo", "foto", "photourl", "profilephoto", "avatar", "image", "profileimage"].includes(lower)) return false;
      return !isPrintValueEmpty(normalizePrintValue(value));
    })
    .map(([key, value]) => ({ label: key, value: normalizePrintValue(value) }));

  if (additionalRows.length) groups.push({ title: "Informasi Tambahan", rows: additionalRows });

  return groups;
}

function printCompleteEmployeeDetail(row) {
  const record = extractDetailRecord(row);
  const nama = getFirstPrintValue(record, ["nama", "name", "namaLengkap"]);
  const idKaryawan = getFirstPrintValue(record, ["idKaryawan", "id_karyawan", "employeeId", "userId", "id", "firebaseKey", "key"]);
  const penempatan = getFirstPrintValue(record, ["penempatanDisplay", "namaPenempatanLengkap", "penempatanNama", "penempatan"]);
  const status = getFirstPrintValue(record, ["status"]);
  const groups = buildCompleteEmployeePrintRows(record);
  const printedAt = new Date().toLocaleString("id-ID");

  const escapeHtml = (value) => String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const groupHtml = groups.map((group) => `
    <section class="group">
      <h3>${escapeHtml(group.title)}</h3>
      <table>
        <tbody>
          ${group.rows.map((item, index) => `
            <tr>
              <td class="no">${index + 1}</td>
              <td class="label">${escapeHtml(item.label)}</td>
              <td class="value">${escapeHtml(item.value)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `).join("");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Data Karyawan - ${escapeHtml(nama)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; color: #111827; font-size: 10px; }
    .header { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; border: 1px solid #b8c7dc; padding: 10px 12px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .logo { width: 34px; height: 34px; border-radius: 4px; border: 1px solid #d5dfec; display: grid; place-items: center; font-weight: 900; }
    h1 { margin: 0; font-size: 15px; letter-spacing: .02em; }
    .subtitle { margin-top: 3px; font-size: 9px; color: #475569; font-weight: 700; }
    .meta { text-align: right; color: #334155; line-height: 1.4; font-size: 9px; }
    .title { margin: 8px 0; border: 1px solid #b8c7dc; background: #eef5ff; padding: 7px 10px; }
    .title h2 { margin: 0; font-size: 13px; color: #0f3f91; }
    .profile { display: grid; grid-template-columns: 72px 1fr auto; gap: 10px; align-items: center; border: 1px solid #d7e2f0; padding: 10px; margin-bottom: 8px; }
    .avatar { width: 62px; height: 62px; background: #eef2f7; display: grid; place-items: center; font-size: 28px; font-weight: 900; color: #2563eb; border: 1px solid #d7e2f0; }
    .name { font-size: 14px; font-weight: 900; margin-bottom: 3px; }
    .id { font-size: 10px; color: #475569; font-weight: 700; }
    .badge { border: 1px solid #86efac; color: #047857; background: #ecfdf5; padding: 4px 8px; font-weight: 900; font-size: 9px; }
    .group { margin-top: 8px; break-inside: avoid; }
    .group h3 { margin: 0; padding: 6px 8px; background: #0f3f91; color: white; font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    td { border: 1px solid #cbd8ea; padding: 5px 7px; vertical-align: top; word-wrap: break-word; }
    .no { width: 26px; text-align: center; background: #f8fbff; font-weight: 800; }
    .label { width: 32%; background: #f3f7fd; font-weight: 900; color: #334155; }
    .value { font-weight: 700; }
    .footer { margin-top: 10px; display: flex; justify-content: space-between; color: #64748b; font-size: 8px; border-top: 1px solid #d7e2f0; padding-top: 6px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo">K</div>
      <div><h1>PT. KARSA SENTANA LUMBUNG SENTOSA</h1><div class="subtitle">Panel Admin Absensi Karyawan Karsa</div></div>
    </div>
    <div class="meta"><div>Dicetak: ${escapeHtml(printedAt)}</div><div>Dokumen Data Karyawan Lengkap</div></div>
  </div>
  <div class="title"><h2>DATA PESERTA / KARYAWAN LENGKAP</h2><div class="subtitle">Detail informasi lengkap tanpa pengulangan field duplikat.</div></div>
  <div class="profile">
    <div class="avatar">${escapeHtml(String(nama || "K").slice(0, 1).toUpperCase())}</div>
    <div><div class="name">${escapeHtml(nama)}</div><div class="id">ID Karyawan: ${escapeHtml(idKaryawan)}</div><div class="id">Penempatan: ${escapeHtml(penempatan)}</div></div>
    <div class="badge">${escapeHtml(status)}</div>
  </div>
  ${groupHtml}
  <div class="footer"><span>Generated by Panel Admin Absensi Karsa</span><span>PT. Karsa Sentana Lumbung Sentosa</span></div>
</body>
</html>`;

  openPrintablePreview(html, `Data Karyawan - ${nama}`);
}

function CompactGenericDetailModal({ selected, onClose }) {
  const record = extractDetailRecord(selected);
  const detailType = getDetailType(selected);
  const titleMap = {
    absensi: "Detail Absensi",
    cuti: "Detail Cuti / Izin",
    laporan: "Detail Laporan",
    pesan: "Detail Pesan",
    karyawan: "Detail Data",
  };

  const commonName = getDetailValue(record, "nama", "name", "namaKaryawan", "employeeName", "userName");
  const commonId = getDetailValue(record, "idKaryawan", "id_karyawan", "employeeId", "userId", "id", "firebaseKey", "key");

  const fieldSets = {
    absensi: [
      ["Nama", commonName],
      ["ID Karyawan", commonId],
      ["Tanggal", getDetailValue(record, "tanggal", "date", "tgl")],
      ["Jam", getDetailValue(record, "jam", "time", "waktu", "jamMasuk", "jam_masuk", "jamPulang", "jam_pulang")],
      ["Aksi", getDetailValue(record, "actionType", "attendanceAction", "jenisAbsensi", "jenis", "type")],
      ["Status", getDetailValue(record, "status", "statusAbsensi", "keterangan")],
      ["Penempatan", getDetailValue(record, "penempatanDisplay", "namaPenempatanLengkap", "penempatanNama", "penempatan")],
      ["Lokasi", getDetailValue(record, "lokasi", "location", "alamatLokasi")],
      ["Latitude", getDetailValue(record, "latitude", "lat")],
      ["Longitude", getDetailValue(record, "longitude", "lng", "long")],
      ["Update Terakhir", getDetailValue(record, "updatedAt", "timestamp", "createdAt")],
    ],
    cuti: [
      ["Nama", commonName],
      ["ID Karyawan", commonId],
      ["Jenis", getDetailValue(record, "jenisCuti", "jenisIzin", "jenis", "type")],
      ["Tanggal Mulai", getDetailValue(record, "tanggalMulai", "startDate", "mulai", "tanggal")],
      ["Tanggal Selesai", getDetailValue(record, "tanggalSelesai", "endDate", "selesai")],
      ["Status", getDetailValue(record, "status", "approvalStatus")],
      ["Alasan", getDetailValue(record, "alasan", "reason", "keterangan")],
      ["Catatan Admin", getDetailValue(record, "adminNote", "catatanAdmin", "catatan")],
      ["Update Terakhir", getDetailValue(record, "updatedAt", "createdAt")],
    ],
    laporan: [
      ["Nama", commonName],
      ["ID Karyawan", commonId],
      ["Judul", getDetailValue(record, "judul", "judulLaporan", "title")],
      ["Tanggal", getDetailValue(record, "tanggal", "date", "createdAt")],
      ["Status", getDetailValue(record, "status")],
      ["Isi Laporan", getDetailValue(record, "isi", "isiLaporan", "laporan", "deskripsi", "description")],
      ["Lokasi", getDetailValue(record, "lokasi", "location")],
      ["Update Terakhir", getDetailValue(record, "updatedAt", "createdAt")],
    ],
    pesan: [
      ["Pengirim", getDetailValue(record, "from", "pengirim", "sender", "createdBy")],
      ["Tujuan", getDetailValue(record, "to", "penerima", "receiver", "target")],
      ["Judul", getDetailValue(record, "judul", "judulPesan", "subject", "title")],
      ["Isi Pesan", getDetailValue(record, "isi", "isiPesan", "message", "body")],
      ["Status", getDetailValue(record, "status")],
      ["Tanggal", getDetailValue(record, "createdAt", "tanggal", "date")],
    ],
  };

  const rows = fieldSets[detailType] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">{titleMap[detailType]}</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">Detail sesuai menu. Data teknis Firebase yang tidak perlu disembunyikan.</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md bg-red-500 text-lg font-black text-white hover:bg-red-600">×</button>
        </div>
        <div className="max-h-[74vh] overflow-y-auto bg-slate-50 p-4">
          {['absensi', 'laporan'].includes(detailType) ? (
            <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
              <RecordEvidencePreview row={record} type={detailType} />
              <div className="grid content-start gap-2 md:grid-cols-2">
                {rows.map(([label, value]) => <CompactFieldCard key={label} label={label} value={value} />)}
              </div>
            </div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {rows.map(([label, value]) => <CompactFieldCard key={label} label={label} value={value} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactEmployeeDetailModal({ selected, onClose }) {
  const record = extractDetailRecord(selected);
  if (!record || !Object.keys(record).length) return null;

  const detailType = getDetailType(selected);
  if (detailType !== "karyawan") return <CompactGenericDetailModal selected={selected} onClose={onClose} />;

  const safeValue = (...keys) => getDetailValue(record, ...keys);

  const safePhoto = () => {
    const result = safeValue("photoUrl", "photo", "foto", "profilePhoto", "avatar", "image", "profileImage");
    return result !== "-" ? result : "";
  };

  const safePenempatan = () => {
    const display = safeValue("penempatanDisplay", "namaPenempatanLengkap", "penempatanNama", "penempatan");
    const wilayah = safeValue("wilayahLengkap", "wilayah");
    if (display === "-") return wilayah;
    if (wilayah !== "-" && !display.toLowerCase().includes(wilayah.toLowerCase())) return display + " - " + wilayah;
    return display;
  };

  const nama = safeValue("nama", "name", "namaLengkap");
  const idKaryawan = safeValue("idKaryawan", "id_karyawan", "employeeId", "userId", "id", "firebaseKey", "key");
  const status = safeValue("status");
  const pin = safeValue("pin", "password");
  const wilayah = safeValue("wilayahLengkap", "wilayah");
  const penempatan = safePenempatan();
  const divisi = safeValue("divisi", "devisi");
  const jabatan = safeValue("jabatan", "role");
  const pekerjaan = safeValue("pekerjaan", "jenisPekerjaan");
  const hp = safeValue("noHp", "no_hp", "hp", "telepon", "phone");
  const whatsappRaw = safeValue("whatsapp", "wa");
  const whatsapp = whatsappRaw !== "-" ? whatsappRaw : hp;
  const email = safeValue("email");
  const updatedAt = safeValue("updatedAt", "lastUpdate", "createdAt");
  const photo = safePhoto();

  const crucialRows = [
    ["PIN Login", pin],
    ["ID Karyawan", idKaryawan],
    ["Nama", nama],
    ["Status", status],
    ["Wilayah", wilayah],
    ["Penempatan", penempatan],
    ["Divisi", divisi],
    ["Jabatan", jabatan],
    ["Pekerjaan", pekerjaan],
    ["No. HP", hp],
    ["WhatsApp", whatsapp],
    ["Email", email],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">Detail Karyawan</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">Data informasi saja. Field teknis dan data pribadi sensitif disembunyikan.</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md bg-red-500 text-lg font-black text-white hover:bg-red-600">×</button>
        </div>

        <div className="grid max-h-[75vh] gap-4 overflow-y-auto bg-slate-50 p-4 lg:grid-cols-[250px_1fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="overflow-hidden rounded-md bg-slate-100">
              {photo ? (
                <img src={photo} alt={nama} className="h-40 w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="grid h-40 place-items-center text-5xl font-black text-slate-300">{String(nama || "K").slice(0, 1).toUpperCase()}</div>
              )}
            </div>

            <div className="mt-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Ringkasan Profil</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">{nama}</h3>
              <p className="mt-1 text-xs font-black text-slate-400">{idKaryawan}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`rounded-sm px-2.5 py-1 text-[10px] font-black uppercase ${String(status).toLowerCase() === "aktif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{status}</span>
                <span className="rounded-sm bg-blue-100 px-2.5 py-1 text-[10px] font-black uppercase text-blue-700">Informasi</span>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-blue-50 p-3 ring-1 ring-blue-100">
              <p className="text-[10px] font-black uppercase text-blue-500">Penempatan</p>
              <p className="mt-1 text-xs font-black leading-relaxed text-slate-950">{penempatan}</p>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-950">Data Informasi</h3>
                
              </div>
              
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              {crucialRows.map(([label, value]) => <CompactFieldCard key={label} label={label} value={value} />)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DeveloperModePanel({ admin }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [connection, setConnection] = useState({ status: "Belum dicek", checkedAt: "-" });
  const [rootPreview, setRootPreview] = useState({});
  const [testingFilter, setTestingFilter] = useState({ mode: "all", employeeId: "", date: "", startDate: "", endDate: "" });
  const [testingPreview, setTestingPreview] = useState([]);
  const [testingConfirm, setTestingConfirm] = useState("");
  const [photoEmployeeId, setPhotoEmployeeId] = useState("");
  const [duplicates, setDuplicates] = useState([]);
  const [duplicateConfirm, setDuplicateConfirm] = useState("");
  const [versionForm, setVersionForm] = useState({ latestVersion: "", minRequiredVersion: "", forceUpdate: false, updateUrl: "", changelog: "" });
  const [maintenanceForm, setMaintenanceForm] = useState({ enabled: false, title: "Maintenance", message: "Aplikasi sedang dalam pemeliharaan." });

  const canAccess = isDeveloperRole(admin?.role);

  useEffect(() => {
    if (!canAccess) return;

    const openSecretDeveloperMode = (event) => {
      const key = String(event.key || "").toLowerCase();
      if (event.ctrlKey && event.shiftKey && key === "d") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", openSecretDeveloperMode);
    return () => window.removeEventListener("keydown", openSecretDeveloperMode);
  }, [canAccess]);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshPreview = async () => {
    setLoading(true);
    try {
      const root = await readRootDatabaseOnce();
      setRootPreview(root);
      setConnection({ status: "Online", checkedAt: new Date().toLocaleString("id-ID") });
      const appUpdate = root.app_update || {};
      const maintenance = root.settings?.maintenance || {};
      setVersionForm({
        latestVersion: appUpdate.latestVersion || "",
        minRequiredVersion: appUpdate.minRequiredVersion || "",
        forceUpdate: Boolean(appUpdate.forceUpdate),
        updateUrl: appUpdate.updateUrl || "",
        changelog: appUpdate.changelog || "",
      });
      setMaintenanceForm({
        enabled: Boolean(maintenance.enabled),
        title: maintenance.title || "Maintenance",
        message: maintenance.message || "Aplikasi sedang dalam pemeliharaan.",
      });
      notify("Koneksi Firebase online.");
    } catch (error) {
      setConnection({ status: "Gagal", checkedAt: new Date().toLocaleString("id-ID") });
      notify(`Gagal cek koneksi: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const previewTestingReset = async () => {
    setLoading(true);
    try {
      const root = await readRootDatabaseOnce();
      setRootPreview(root);
      const rows = getTestingRecordsToDelete(root, testingFilter);
      setTestingPreview(rows);
      notify(`${rows.length} data testing terdeteksi.`);
    } catch (error) {
      notify(`Gagal preview data testing: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const executeTestingReset = async () => {
    if (testingConfirm !== "HAPUS DATA TESTING") {
      notify("Ketik HAPUS DATA TESTING untuk melanjutkan.", "error");
      return;
    }
    setLoading(true);
    try {
      const root = await readRootDatabaseOnce();
      const rows = getTestingRecordsToDelete(root, testingFilter);
      await removeFirebasePaths(rows.map((row) => row.path));
      await writeAdminLog(admin, "RESET_RIWAYAT_TESTING", { filter: testingFilter, totalDeleted: rows.length, nodes: ["absensi", "laporan", "cuti", "izin", "pesan"] }, `${FIREBASE_ROOT}/absensi|laporan|cuti|izin|pesan`);
      setTestingPreview([]);
      setTestingConfirm("");
      notify(`${rows.length} data testing berhasil dihapus.`);
    } catch (error) {
      notify(`Gagal hapus data testing: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const resetEmployeePhoto = async () => {
    const employeeId = firebaseDocId(photoEmployeeId, "EMP");
    if (!employeeId) {
      notify("Masukkan ID karyawan dulu.", "error");
      return;
    }
    if (!window.confirm(`Reset foto profil karyawan ${employeeId}? Data utama karyawan tidak akan dihapus.`)) return;
    setLoading(true);
    try {
      const targetPath = `${FIREBASE_ROOT}/karyawan/${employeeId}`;
      await update(ref(realtimeDb, targetPath), {
        photo: null,
        foto: null,
        photoUrl: null,
        profilePhoto: null,
        avatar: null,
        image: null,
        profileImage: null,
        updatedAt: new Date().toISOString(),
      });
      await writeAdminLog(admin, "RESET_FOTO_PROFIL", { employeeId }, targetPath);
      setPhotoEmployeeId("");
      notify("Foto profil berhasil direset.");
    } catch (error) {
      notify(`Gagal reset foto profil: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicates = async () => {
    setLoading(true);
    try {
      const rawAbsensi = await readRealtimeOnce("absensi");
      const groups = detectDuplicateAttendanceRecords(rawAbsensi);
      setDuplicates(groups);
      notify(`${groups.length} grup data double ditemukan.`);
    } catch (error) {
      notify(`Gagal cek duplikat: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const cleanDuplicates = async () => {
    if (duplicateConfirm !== "BERSIHKAN DUPLIKAT") {
      notify("Ketik BERSIHKAN DUPLIKAT untuk melanjutkan.", "error");
      return;
    }
    setLoading(true);
    try {
      const rawAbsensi = await readRealtimeOnce("absensi");
      const groups = detectDuplicateAttendanceRecords(rawAbsensi);
      const duplicatePaths = groups.flatMap((group) => group.duplicates.map((row) => row.path));
      await removeFirebasePaths(duplicatePaths);
      await writeAdminLog(admin, "CLEAN_DUPLICATE_ATTENDANCE", { groups: groups.length, totalDeleted: duplicatePaths.length }, `${FIREBASE_ROOT}/absensi`);
      setDuplicates([]);
      setDuplicateConfirm("");
      notify(`${duplicatePaths.length} data duplikat berhasil dibersihkan.`);
    } catch (error) {
      notify(`Gagal bersihkan duplikat: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const exportBackupJson = async () => {
    setLoading(true);
    try {
      const root = await readRootDatabaseOnce();
      const filename = buildBackupFileName();
      downloadJsonFile(filename, { app: "Panel Admin Absensi Karsa", exportedAt: new Date().toISOString(), root: FIREBASE_ROOT, data: root });
      await writeAdminLog(admin, "EXPORT_BACKUP", { filename }, FIREBASE_ROOT);
      notify("Backup JSON berhasil diunduh.");
    } catch (error) {
      notify(`Gagal export backup: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const saveAppVersion = async () => {
    setLoading(true);
    try {
      const payload = cleanFirebaseData({ ...versionForm, forceUpdate: Boolean(versionForm.forceUpdate), updatedAt: new Date().toISOString() });
      await update(ref(realtimeDb, `${FIREBASE_ROOT}/app_update`), payload);
      await writeAdminLog(admin, "UPDATE_APP_VERSION", payload, `${FIREBASE_ROOT}/app_update`);
      notify("Versi aplikasi berhasil diperbarui.");
    } catch (error) {
      notify(`Gagal update versi: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const saveMaintenance = async () => {
    if (!window.confirm(`${maintenanceForm.enabled ? "Aktifkan" : "Nonaktifkan"} mode maintenance?`)) return;
    setLoading(true);
    try {
      const payload = cleanFirebaseData({ ...maintenanceForm, enabled: Boolean(maintenanceForm.enabled), updatedAt: new Date().toISOString() });
      await update(ref(realtimeDb, `${FIREBASE_ROOT}/settings/maintenance`), payload);
      await writeAdminLog(admin, payload.enabled ? "ENABLE_MAINTENANCE" : "DISABLE_MAINTENANCE", payload, `${FIREBASE_ROOT}/settings/maintenance`);
      notify("Status maintenance berhasil disimpan.");
    } catch (error) {
      notify(`Gagal simpan maintenance: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && canAccess) refreshPreview();
  }, [open, canAccess]);

  if (!canAccess) return null;

  const summaryItems = [
    ["Karyawan", countFirebaseNode(rootPreview.karyawan)],
    ["Absensi", normalizeRealtimeObject(rootPreview.absensi).length],
    ["Cuti", normalizeRealtimeObject(rootPreview.cuti).length],
    ["Izin", normalizeRealtimeObject(rootPreview.izin).length],
    ["Laporan", normalizeRealtimeObject(rootPreview.laporan).length],
    ["Pesan", normalizeRealtimeObject(rootPreview.pesan).length],
    ["Broadcast", normalizeRealtimeObject(rootPreview.broadcast).length],
    ["Admin Users", countFirebaseNode(rootPreview.admin_users)],
  ];

  const adminRows = normalizeRealtimeObject(rootPreview.admin_users).map(maskSensitiveAdminData);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-50 p-5 shadow-2xl">
            <div className="mb-5 flex flex-col gap-3 rounded-[1.5rem] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Pengaturan / Developer Mode</p>
                <h2 className="text-2xl font-black text-slate-900">Developer Mode</h2>
                <p className="text-sm font-semibold text-slate-500">Mode ini hanya tampil untuk role super_admin atau developer.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase text-blue-700">{getAdminRoleLabel(admin?.role)}</span>
                <button onClick={refreshPreview} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow hover:bg-blue-700 disabled:opacity-60">{loading ? "Memproses..." : "Cek Koneksi"}</button>
                <button onClick={() => setOpen(false)} className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-300">Tutup</button>
              </div>
            </div>

            {toast && (
              <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-bold ${toast.type === "error" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{toast.message}</div>
            )}

            <div className="grid gap-4 lg:grid-cols-3">
              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">Cek Koneksi Firebase</h3>
                <div className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
                  <p>Status: <span className={connection.status === "Online" ? "text-emerald-600" : connection.status === "Gagal" ? "text-red-600" : "text-slate-500"}>{connection.status}</span></p>
                  <p>Database URL:</p>
                  <p className="break-all rounded-xl bg-slate-100 p-3 text-xs text-slate-700">{FIREBASE_CONFIG.databaseURL}</p>
                  <p>Terakhir dicek: {connection.checkedAt}</p>
                </div>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-black text-slate-900">Preview Struktur Database</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {summaryItems.map(([label, total]) => (
                    <div key={label} className="rounded-2xl bg-slate-100 p-4">
                      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
                      <p className="mt-1 text-2xl font-black text-slate-900">{total}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr><th className="p-3">Username</th><th className="p-3">Nama</th><th className="p-3">Role</th><th className="p-3">PIN</th><th className="p-3">Status</th></tr>
                    </thead>
                    <tbody>
                      {adminRows.length ? adminRows.map((row) => (
                        <tr key={row.id || row.username} className="border-t border-slate-100">
                          <td className="p-3 font-bold">{row.username || row.id}</td>
                          <td className="p-3">{row.nama || "-"}</td>
                          <td className="p-3">{getAdminRoleLabel(row.role)}</td>
                          <td className="p-3">{row.pin || "******"}</td>
                          <td className="p-3">{row.status || "-"}</td>
                        </tr>
                      )) : <tr><td colSpan="5" className="p-4 text-center text-slate-500">Belum ada data admin_users.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-black text-slate-900">Reset Data Testing</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">Hanya menghapus riwayat absensi, laporan, cuti, izin, dan pesan untuk testing. Node karyawan/admin/settings tidak disentuh.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <input value={testingFilter.employeeId} onChange={(e) => setTestingFilter({ ...testingFilter, employeeId: e.target.value })} placeholder="ID karyawan" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input type="date" value={testingFilter.date} onChange={(e) => setTestingFilter({ ...testingFilter, date: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input type="date" value={testingFilter.startDate} onChange={(e) => setTestingFilter({ ...testingFilter, startDate: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input type="date" value={testingFilter.endDate} onChange={(e) => setTestingFilter({ ...testingFilter, endDate: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={previewTestingReset} disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white">Preview Data Terdampak</button>
                  <span className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">Terdampak: {testingPreview.length}</span>
                </div>
                <input value={testingConfirm} onChange={(e) => setTestingConfirm(e.target.value)} placeholder="Ketik: HAPUS DATA TESTING" className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold" />
                <button onClick={executeTestingReset} disabled={loading || testingConfirm !== "HAPUS DATA TESTING"} className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50">Hapus Data Testing</button>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">Reset Foto Profil</h3>
                <input value={photoEmployeeId} onChange={(e) => setPhotoEmployeeId(e.target.value)} placeholder="ID Karyawan" className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <button onClick={resetEmployeePhoto} disabled={loading || !photoEmployeeId} className="mt-3 rounded-xl bg-orange-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50">Reset Foto</button>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-black text-slate-900">Cek Data Double Absensi</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={checkDuplicates} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white">Cek Duplikat</button>
                  <span className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">Grup double: {duplicates.length}</span>
                </div>
                <div className="mt-4 max-h-48 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs">
                  {duplicates.length ? duplicates.slice(0, 20).map((group) => <p key={group.dedupeKey} className="mb-1 font-semibold">{group.dedupeKey} — total {group.total}, hapus {group.duplicates.length}</p>) : <p className="text-slate-500">Belum ada hasil cek duplikat.</p>}
                </div>
                <input value={duplicateConfirm} onChange={(e) => setDuplicateConfirm(e.target.value)} placeholder="Ketik: BERSIHKAN DUPLIKAT" className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold" />
                <button onClick={cleanDuplicates} disabled={loading || duplicateConfirm !== "BERSIHKAN DUPLIKAT"} className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50">Bersihkan Duplikat</button>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">Export Backup JSON</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">Mengunduh seluruh node karsa_absensi dalam file JSON.</p>
                <button onClick={exportBackupJson} disabled={loading} className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white">Export Backup</button>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-black text-slate-900">Update Versi Aplikasi</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input value={versionForm.latestVersion} onChange={(e) => setVersionForm({ ...versionForm, latestVersion: e.target.value })} placeholder="latestVersion" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input value={versionForm.minRequiredVersion} onChange={(e) => setVersionForm({ ...versionForm, minRequiredVersion: e.target.value })} placeholder="minRequiredVersion" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input value={versionForm.updateUrl} onChange={(e) => setVersionForm({ ...versionForm, updateUrl: e.target.value })} placeholder="updateUrl" className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
                  <textarea value={versionForm.changelog} onChange={(e) => setVersionForm({ ...versionForm, changelog: e.target.value })} placeholder="changelog" className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
                  <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={versionForm.forceUpdate} onChange={(e) => setVersionForm({ ...versionForm, forceUpdate: e.target.checked })} /> Force Update</label>
                </div>
                <button onClick={saveAppVersion} disabled={loading} className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white">Simpan Versi</button>
              </section>

              <section className="rounded-[1.5rem] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">Mode Maintenance</h3>
                <label className="mt-4 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={maintenanceForm.enabled} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, enabled: e.target.checked })} /> Aktifkan maintenance</label>
                <input value={maintenanceForm.title} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e.target.value })} placeholder="Judul" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <textarea value={maintenanceForm.message} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, message: e.target.value })} placeholder="Pesan" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <button onClick={saveMaintenance} disabled={loading} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white">Simpan Maintenance</button>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getLeaveHistoryKey(row) {
  const key =
    getVal(row, "id") ||
    getVal(row, "cutiId") ||
    getVal(row, "leaveId") ||
    getVal(row, "recordId") ||
    `${getVal(row, "userId") || getVal(row, "id_karyawan") || "USER"}-${getVal(row, "start") || getVal(row, "dateStart") || getVal(row, "date") || "DATE"}-${getVal(row, "type") || getVal(row, "jenis") || "CUTI"}`;
  return String(key || "").trim();
}

function mergeLeaveHistoryRows(rows) {
  const map = new Map();
  safeArray(rows).forEach((row) => {
    const key = getLeaveHistoryKey(row);
    if (!key) return;
    const prev = map.get(key) || {};
    map.set(key, { ...prev, ...row, id: getVal(row, "id") || getVal(row, "cutiId") || getVal(row, "leaveId") || prev.id || key });
  });
  return Array.from(map.values());
}

function makeDb(data) {
  // Firebase adalah sumber utama. Cache lokal hanya dipakai untuk jadwal kerja default,
  // bukan untuk mempertahankan data yang sudah dihapus dari Firebase.
  const remoteLeaves = safeArray(data.cuti);
  const remoteSchedules = safeArray(data.jam_kerja || data.jamKerja || data.work_schedules || data.workSchedules);
  const cachedSchedules = readCache(WORK_SCHEDULE_STORAGE_KEY, []);
  const workSchedules = remoteSchedules.length ? remoteSchedules : (safeArray(cachedSchedules).length ? cachedSchedules : DEFAULT_WORK_SCHEDULES);

  return {
    ...EMPTY_DB,
    karyawan: safeArray(data.karyawan),
    jam_kerja: workSchedules,
    absensi: dedupeAttendanceRows(data.absensi),
    laporan: safeArray(data.laporan),
    cuti: remoteLeaves,
    pesan: safeArray(data.pesan),
    broadcast: safeArray(data.broadcast),
    kalender_nasional: safeArray(data.kalender_nasional),
    hari_libur: safeArray(data.hari_libur),
    app_update: data.app_update && typeof data.app_update === "object" ? data.app_update : {},
    admin_users: safeArray(data.admin_users),
    admin_logs: safeArray(data.admin_logs),
    settings: data.settings && typeof data.settings === "object" ? data.settings : {},
  };
}

function buildSummary(db) {
  const today = todayIndo();
  const activeEmployees = safeArray(db.karyawan).filter(isActiveEmployee);
  const todayAttendance = safeArray(db.absensi).filter((row) => formatDate(getVal(row, "date")) === today);
  const pendingLeaves = safeArray(db.cuti).filter(isPendingLeave);
  const approvedLeaves = safeArray(db.cuti).filter(isApprovedLeave);
  const pendingReports = safeArray(db.laporan).filter((row) => normalize(getVal(row, "reportStatus") || getVal(row, "status")).includes("menunggu"));
  return {
    totalEmployees: safeArray(db.karyawan).length,
    activeEmployees: activeEmployees.length,
    placements: countUnique(db.karyawan, "penempatan"),
    attendanceTotal: safeArray(db.absensi).length,
    attendanceToday: todayAttendance.length,
    lateTotal: safeArray(db.absensi).filter(isLate).length,
    pendingLeaves: pendingLeaves.length,
    approvedLeaves: approvedLeaves.length,
    pendingReports: pendingReports.length,
    reports: safeArray(db.laporan).length,
    messages: safeArray(db.pesan).length,
    broadcasts: safeArray(db.broadcast).length,
  };
}

function Toast({ toast, onClose }) {
  if (!toast?.message) return null;
  const Icon = toast.type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-md">
      <div className={cx("flex items-start gap-3 rounded-3xl bg-white p-4 shadow-2xl ring-1", toast.type === "error" ? "ring-red-100" : "ring-emerald-100")}>
        <Icon className={toast.type === "error" ? "text-red-600" : "text-emerald-600"} size={22} />
        <p className="flex-1 text-sm font-bold leading-relaxed text-slate-700">{toast.message}</p>
        <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full bg-slate-50 text-slate-400">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

function LoadingOverlay({ label = "Memuat data..." }) {
  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-white/75 backdrop-blur-md">
      <div className="rounded-[2rem] bg-white px-6 py-5 text-center shadow-2xl ring-1 ring-slate-100">
        <Loader2 className="mx-auto mb-3 animate-spin text-blue-600" size={30} />
        <p className="text-sm font-black text-slate-700">{label}</p>
      </div>
    </div>
  );
}

function Badge({ children, tone }) {
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase ring-1", tone)}>{children}</span>;
}

function AppIcon({ icon: Icon, size = "md", tone = "blue", active = false, className = "" }) {
  const sizes = {
    xs: "h-7 w-7 rounded-xl",
    sm: "h-8 w-8 rounded-xl",
    md: "h-10 w-10 rounded-2xl",
    lg: "h-12 w-12 rounded-2xl",
    xl: "h-14 w-14 rounded-2xl",
  };
  const iconSizes = { xs: 15, sm: 17, md: 19, lg: 22, xl: 25 };
  const tones = {
    blue: "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-blue-700 shadow-sm shadow-blue-100 ring-blue-100",
    emerald: "bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-emerald-700 shadow-sm shadow-emerald-100 ring-emerald-100",
    amber: "bg-gradient-to-br from-amber-50 via-white to-amber-100 text-amber-700 shadow-sm shadow-amber-100 ring-amber-100",
    red: "bg-gradient-to-br from-red-50 via-white to-red-100 text-red-700 shadow-sm shadow-red-100 ring-red-100",
    violet: "bg-gradient-to-br from-violet-50 via-white to-violet-100 text-violet-700 shadow-sm shadow-violet-100 ring-violet-100",
    slate: "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-500 shadow-sm shadow-slate-100 ring-slate-100",
  };
  const activeTones = {
    blue: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white shadow-lg shadow-blue-200 ring-blue-200",
    emerald: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white shadow-lg shadow-emerald-200 ring-emerald-200",
    amber: "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200 ring-amber-200",
    red: "bg-gradient-to-br from-red-500 via-red-600 to-red-800 text-white shadow-lg shadow-red-200 ring-red-200",
    violet: "bg-gradient-to-br from-violet-500 via-violet-600 to-violet-800 text-white shadow-lg shadow-violet-200 ring-violet-200",
    slate: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-950 text-white shadow-lg shadow-slate-200 ring-slate-200",
  };
  const pickedTone = tones[tone] ? tone : "blue";
  return (
    <span className={cx("relative grid shrink-0 place-items-center overflow-hidden ring-1 transition", sizes[size] || sizes.md, active ? activeTones[pickedTone] : tones[pickedTone], className)}>
      <span className="pointer-events-none absolute inset-[1px] rounded-[inherit] bg-gradient-to-br from-white/65 via-white/10 to-transparent" />
      <Icon className="relative z-10 drop-shadow-[0_1px_1px_rgba(15,23,42,0.12)]" size={iconSizes[size] || iconSizes.md} strokeWidth={2.45} />
    </span>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/35 p-3 backdrop-blur-sm sm:items-center sm:p-5">
      <div className={cx("max-h-[88dvh] w-full overflow-y-auto rounded-[2rem] bg-slate-50 p-4 shadow-2xl", wide ? "max-w-6xl" : "max-w-2xl")}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-black text-slate-950">{title}</h3>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, loading }) {
  const [form, setForm] = useState({ username: "", pin: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const ok = await onLogin(form.username, form.pin);
      if (!ok) setError("Username atau PIN admin tidak cocok.");
    } catch (err) {
      setError(err?.message || "Username atau PIN admin tidak cocok.");
    }
  };

  return (
    <div className="karsa-login-screen min-h-[100dvh] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_36%,#fff_100%)] px-4 py-8 text-slate-900">
      <div className="karsa-login-wrap mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="karsa-login-logo-box mx-auto grid h-28 w-28 place-items-center">
            <img src={COMPANY_LOGO_URL} alt="Logo" className="h-full w-full object-contain" />
          </div>
        </div>

        <form onSubmit={submit} className="karsa-login-card rounded-[2rem] bg-white p-7 shadow-2xl shadow-slate-200 ring-1 ring-slate-100">
          {error && <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700 ring-1 ring-red-100">{error}</p>}
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Login</span>
            <span className="relative block">
              <LogIn className="karsa-login-input-icon" size={18} />
              <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} className="karsa-login-input-with-icon min-h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Login" />
            </span>
          </label>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Password</span>
            <span className="relative block">
              <LockKeyhole className="karsa-login-input-icon" size={18} />
              <input type="password" value={form.pin} onChange={(e) => setForm((p) => ({ ...p, pin: e.target.value }))} className="karsa-login-input-with-icon min-h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Password" />
            </span>
          </label>
          <button disabled={loading} className="mt-5 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside className="hidden w-[300px] shrink-0 bg-white/95 p-5 lg:flex lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative overflow-hidden rounded-[1.85rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-slate-100 blur-2xl" />

          <div className="relative flex items-center gap-3.5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[1.25rem] bg-slate-50 p-2.5 shadow-sm ring-1 ring-slate-200">
              <img src={COMPANY_LOGO_URL} alt="Logo PT. Karsa Sentana Lumbung Sentosa" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[2rem] font-black uppercase leading-none tracking-[-0.055em] text-slate-950">ADMIN</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-blue-700">Panel Absensi</p>
            </div>
          </div>

          <div className="relative mt-4 border-t border-slate-100 pt-3">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Admin Operasional</p>
            <p className="mt-1 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.03em] text-slate-800">PT. Karsa Sentana Lumbung Sentosa</p>
          </div>
        </div>

        <nav className="mt-5 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cx(
                  "group flex min-h-[46px] w-full items-center gap-3 rounded-2xl px-3.5 text-left text-[13px] font-black transition active:scale-[0.99]",
                  isActive
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <AppIcon icon={Icon} size="sm" tone={isActive ? "blue" : "slate"} active={isActive} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <button onClick={onLogout} className="karsa-logout-btn flex w-full items-center text-sm font-black transition active:scale-[0.98]">
          <span className="karsa-logout-icon"><LogOut size={14} /></span> Keluar
        </button>
      </div>
    </aside>
  );
}

function MobileNav({ active, setActive }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-16px_30px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1 rounded-[1.4rem] bg-slate-50 p-1.5 ring-1 ring-slate-100">
        {NAV_ITEMS.slice(0, 8).map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} className={cx("flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl text-[9px] font-black", isActive ? "bg-white text-blue-700 shadow-sm" : "text-slate-400")}>
              <AppIcon icon={Icon} size="xs" tone={isActive ? "blue" : "slate"} active={isActive} />
              <span className="line-clamp-1">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Header({ title, subtitle, eyebrow = "Admin Dashboard", helper = "Live database", icon: Icon = Home, onRefresh, loading, lastSync, syncError }) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-100 bg-[#f8fbff]/95 px-4 py-3 backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
      <div className="mx-auto max-w-7xl lg:mb-5">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <AppIcon icon={Icon} size="xl" tone="blue" active />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">{eyebrow}</p>
                  <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500 ring-1 ring-slate-100">{helper}</span>
                </div>
                <h1 className="mt-1 truncate text-2xl font-black leading-tight text-slate-950 lg:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 max-w-3xl text-sm font-semibold leading-relaxed text-slate-500">{subtitle}</p>}
              </div>
            </div>

            <div className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone = "blue", subtitle }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
  };
  return (
    <div className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          {subtitle && <p className="mt-1 text-xs font-bold text-slate-400">{subtitle}</p>}
        </div>
        <AppIcon icon={Icon} size="lg" tone={tone} active />
      </div>
    </div>
  );
}

function SearchBar({ search, setSearch, placeholder = "Cari data...", right }) {
  return (
    <div className="rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} className="min-h-[48px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
        </label>
        {right}
      </div>
    </div>
  );
}

function Select({ value, onChange, options, className = "" }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={cx("min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100", className)}>
      {options.map((item) => (
        <option key={item.value} value={item.value}>{item.label}</option>
      ))}
    </select>
  );
}

function EmptyState({ title = "Belum ada data", text = "Data akan tampil setelah tersinkron." }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-8 text-center">
      <Sparkles className="mx-auto mb-3 text-slate-300" size={34} />
      <h3 className="text-base font-black text-slate-800">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function getDashboardPanelTone(type) {
  const tones = {
    absensi: {
      shell: "border-blue-100 bg-blue-50/45 ring-blue-100",
      header: "border-blue-100 bg-white/80",
      iconTone: "blue",
      title: "text-slate-950",
      action: "text-blue-700 hover:text-blue-900 hover:bg-blue-50 ring-blue-100",
      accent: "bg-blue-500",
    },
    cuti: {
      shell: "border-amber-100 bg-amber-50/45 ring-amber-100",
      header: "border-amber-100 bg-white/80",
      iconTone: "amber",
      title: "text-slate-950",
      action: "text-amber-700 hover:text-amber-900 hover:bg-amber-50 ring-amber-100",
      accent: "bg-amber-500",
    },
    laporan: {
      shell: "border-violet-100 bg-violet-50/45 ring-violet-100",
      header: "border-violet-100 bg-white/80",
      iconTone: "violet",
      title: "text-slate-950",
      action: "text-violet-700 hover:text-violet-900 hover:bg-violet-50 ring-violet-100",
      accent: "bg-violet-500",
    },
    default: {
      shell: "border-slate-100 bg-white ring-slate-100",
      header: "border-slate-100 bg-white",
      iconTone: "blue",
      title: "text-slate-950",
      action: "text-blue-700 hover:text-blue-900 hover:bg-blue-50 ring-blue-100",
      accent: "bg-blue-500",
    },
  };
  return tones[type] || tones.default;
}

function QuickList({ title, icon: Icon, action, onAction, children, tone = "default" }) {
  const panelTone = getDashboardPanelTone(tone);
  return (
    <section className={cx("relative overflow-hidden rounded-[2rem] border p-3 shadow-sm ring-1", panelTone.shell)}>
      <div className={cx("absolute inset-x-0 top-0 h-1", panelTone.accent)} />
      <div className={cx("mb-3 flex items-center justify-between gap-3 rounded-2xl border px-3 py-2", panelTone.header)}>
        <div className="flex min-w-0 items-center gap-3">
          <AppIcon icon={Icon} size="md" tone={panelTone.iconTone} active />
          <h3 className={cx("truncate text-base font-black", panelTone.title)}>{title}</h3>
        </div>
        {action && (
          <button onClick={onAction} className={cx("rounded-xl px-3 py-2 text-xs font-black ring-1 transition", panelTone.action)}>
            {action}
          </button>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function MiniRecord({ title, subtitle, status, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-left ring-1 ring-slate-100 transition hover:bg-white hover:shadow-sm">
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-950">{title}</p>
        <p className="mt-0.5 truncate text-xs font-bold text-slate-400">{subtitle}</p>
      </div>
      <Badge tone={statusTone(status)}>{status}</Badge>
    </button>
  );
}

function EmptyMini({ text }) {
  return <div className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-bold text-slate-400 ring-1 ring-slate-100">{text}</div>;
}

function DashboardScreen({ db, summary, setActive, setSelected }) {
  const recentAttendance = safeArray(db.absensi)
    .slice()
    .sort((a, b) => Number(getVal(b, "timestamp") || parseMillis(getVal(b, "date"))) - Number(getVal(a, "timestamp") || parseMillis(getVal(a, "date"))))
    .slice(0, 6);
  const pendingLeaves = safeArray(db.cuti).filter(isPendingLeave).slice(0, 6);
  const pendingReports = safeArray(db.laporan).filter((r) => displayReportStatus(r) === "Baru").slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Karyawan" value={summary.totalEmployees} icon={Users} tone="blue" subtitle={`${summary.activeEmployees} aktif`} />
        <StatCard label="Absensi Hari Ini" value={summary.attendanceToday} icon={Clock3} tone="emerald" subtitle={`${summary.lateTotal} terlambat total`} />
        <StatCard label="Pengajuan Menunggu" value={summary.pendingLeaves} icon={CalendarDays} tone="amber" subtitle="Cuti / izin / sakit" />
        <StatCard label="Laporan Baru" value={summary.pendingReports} icon={FileText} tone="violet" subtitle={`${summary.reports} laporan masuk`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <QuickList title="Absensi Terbaru" icon={Clock3} action="Lihat Semua" onAction={() => setActive("absensi")} tone="absensi">
          {recentAttendance.length ? recentAttendance.map((row, idx) => <MiniRecord key={getVal(row, "id") || idx} title={getVal(row, "name") || getVal(row, "userId") || "-"} subtitle={`${getVal(row, "action") || "Absensi"} • ${getVal(row, "time") || "-"}`} status={isLate(row) ? "Terlambat" : "Tercatat"} onClick={() => setSelected({ type: "absensi", row })} />) : <EmptyMini text="Belum ada absensi terbaru." />}
        </QuickList>
        <QuickList title="Cuti Perlu Approval" icon={CalendarDays} action="Kelola" onAction={() => setActive("cuti")} tone="cuti">
          {pendingLeaves.length ? pendingLeaves.map((row, idx) => <MiniRecord key={getVal(row, "id") || idx} title={getVal(row, "name") || getVal(row, "userId") || "-"} subtitle={`${getVal(row, "type") || "Pengajuan"} • ${getVal(row, "start") || getVal(row, "dateStart") || "-"}`} status={getVal(row, "status") || "Menunggu"} onClick={() => setSelected({ type: "cuti", row })} />) : <EmptyMini text="Tidak ada cuti menunggu." />}
        </QuickList>
        <QuickList title="Laporan Baru" icon={FileText} action="Buka" onAction={() => setActive("laporan")} tone="laporan">
          {pendingReports.length ? pendingReports.map((row, idx) => <MiniRecord key={getVal(row, "id") || idx} title={getVal(row, "judul") || getVal(row, "title") || "Laporan"} subtitle={`${getVal(row, "name") || "-"} • ${formatDate(getVal(row, "date"))}`} status={displayReportStatus(row)} onClick={() => setSelected({ type: "laporan", row })} />) : <EmptyMini text="Tidak ada laporan baru." />}
        </QuickList>
      </div>
    </div>
  );
}

function KaryawanScreen({ db, setSelected, notify, refresh, admin }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("semua");
  const [wilayah, setWilayah] = useState("semua");
  const [status, setStatus] = useState("semua");
  const [editing, setEditing] = useState(null);

  const rows = useMemo(() => safeArray(db.karyawan).filter((row) => {
    const hay = `${getVal(row, "id")} ${getVal(row, "name")} ${getVal(row, "nama")} ${getVal(row, "penempatan")} ${getVal(row, "role")} ${getVal(row, "divisi")} ${getVal(row, "wilayah")} ${getVal(row, "pekerjaan")} ${getVal(row, "jabatan")}`.toLowerCase();
    const rowRole = getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || "Umum";
    const rowWilayah = getVal(row, "wilayah") || getVal(row, "daerah") || "-";
    const rowStatus = getVal(row, "status") || "Aktif";
    return (!search || hay.includes(search.toLowerCase())) && (role === "semua" || rowRole === role) && (wilayah === "semua" || rowWilayah === wilayah) && (status === "semua" || normalize(rowStatus) === normalize(status));
  }), [db.karyawan, search, role, wilayah, status]);

  const roleOptions = useMemo(() => [{ value: "semua", label: "Semua Role" }, ...Array.from(new Set(safeArray(db.karyawan).map((r) => getVal(r, "role") || getVal(r, "divisi") || getVal(r, "devisi") || "Umum"))).sort().map((v) => ({ value: v, label: v }))], [db.karyawan]);
  const wilayahOptions = useMemo(() => [{ value: "semua", label: "Semua Wilayah" }, ...Array.from(new Set(safeArray(db.karyawan).map((r) => getVal(r, "wilayah") || getVal(r, "daerah") || "-"))).sort().map((v) => ({ value: v, label: v }))], [db.karyawan]);
  const statusOptions = [{ value: "semua", label: "Semua Status" }, { value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }];

  const exportRows = useMemo(() => rows.map((row, index) => ({
    "No": index + 1,
    "ID Karyawan": getVal(row, "id") || getVal(row, "userId") || "-",
    "Nama": getVal(row, "name") || getVal(row, "nama") || "-",
    "Status": getVal(row, "status") || "Aktif",
    "Wilayah": getVal(row, "wilayah") || getVal(row, "daerah") || "-",
    "Penempatan": getSmartPlacementName(row),
    "Divisi": getVal(row, "divisi") || getVal(row, "devisi") || "-",
    "Role": getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || "Umum",
    "Pekerjaan": getVal(row, "pekerjaan") || "-",
    "Jabatan": getVal(row, "jabatan") || "-",
    "Tanggal Lahir": formatDate(getVal(row, "tanggalLahir") || getVal(row, "tanggal_lahir") || getVal(row, "birthdate") || getVal(row, "dob")),
    "Jenis Kelamin": getVal(row, "jenisKelamin") || getVal(row, "jenis_kelamin") || "-",
    "NIK": getVal(row, "nik") || "-",
    "Email": getVal(row, "email") || "-",
    "No. HP": getVal(row, "phone") || getVal(row, "noHp") || getVal(row, "whatsapp") || "-",
    "WhatsApp": getVal(row, "whatsapp") || "-",
    "Kontak Darurat": getVal(row, "emergencyContact") || getVal(row, "kontakDarurat") || "-",
    "Alamat Domisili": getVal(row, "addressDetail") || getVal(row, "alamatDomisili") || getVal(row, "alamat") || "-",
    "Alamat KTP": getVal(row, "addressKtp") || getVal(row, "alamatKtp") || "-",
    "Kuota Cuti": getVal(row, "kuotaCutiTahunan") || "-",
    "Cuti Terpakai": getVal(row, "cutiTahunanUsed") || "-",
    "Update Terakhir": formatDate(getVal(row, "profileUpdatedAt") || getVal(row, "updatedAt") || getVal(row, "createdAt")),
    "Catatan": getVal(row, "notes") || getVal(row, "note") || "-",
  })), [rows]);

  const activeFilterRows = useMemo(() => [
    { Keterangan: "Perusahaan", Nilai: COMPANY_NAME },
    { Keterangan: "Logo", Nilai: "Logo resmi PT. Karsa Sentana Lumbung Sentosa" },
    { Keterangan: "Judul Laporan", Nilai: "Output Data Karyawan" },
    { Keterangan: "Pencarian", Nilai: search || "Semua" },
    { Keterangan: "Role", Nilai: role === "semua" ? "Semua Role" : role },
    { Keterangan: "Wilayah", Nilai: wilayah === "semua" ? "Semua Wilayah" : wilayah },
    { Keterangan: "Status", Nilai: status === "semua" ? "Semua Status" : status },
    { Keterangan: "Total Data", Nilai: rows.length },
    { Keterangan: "Tanggal Cetak", Nilai: new Date().toLocaleString("id-ID") },
  ], [search, role, wilayah, status, rows.length]);

  const karyawanReportConfig = useMemo(() => ({
    title: "Hasil Output Data Karyawan",
    subtitle: "Output berdasarkan filter aktif di menu Karyawan. Header memakai logo PT. Karsa Sentana Lumbung Sentosa.",
    infoRows: activeFilterRows,
    sections: [
      {
        title: "Detail Data Karyawan",
        columns: ["No", "ID Karyawan", "Nama", "Status", "Wilayah", "Penempatan", "Divisi", "Role", "Pekerjaan", "Jabatan", "Tanggal Lahir", "Jenis Kelamin", "NIK", "Email", "No. HP", "WhatsApp", "Kontak Darurat", "Alamat Domisili", "Alamat KTP", "Kuota Cuti", "Cuti Terpakai", "Update Terakhir", "Catatan"],
        rows: exportRows,
      },
    ],
  }), [activeFilterRows, exportRows]);

  const fileSuffix = `${search || "semua"}-${role}-${wilayah}-${status}`.replace(/[^a-zA-Z0-9_-]+/g, "-");
  const previewKaryawanPdf = () => exportStyledPdf(`hasil-output-karyawan-${fileSuffix}.pdf`, karyawanReportConfig);
  const downloadKaryawanExcel = () => exportStyledExcel(`hasil-output-karyawan-${fileSuffix}.xls`, karyawanReportConfig);

  const resetFilters = () => {
    setSearch("");
    setRole("semua");
    setWilayah("semua");
    setStatus("semua");
  };

  const submitAction = async (payload, success) => {
    try {
      await apiPost(payload);
      notify(success);
      refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal memproses data.", "error");
    }
  };

  const openAdd = () => setEditing({ mode: "add", row: {} });
  const openEdit = (row) => setEditing({ mode: "edit", row });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="karsa-karyawan-stat flex items-center justify-between gap-3 border border-blue-100 ring-1 ring-blue-50">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-500">Total tampil</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{rows.length}</p>
            <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">Data sesuai filter</p>
          </div>
          <div className="karsa-karyawan-stat-icon bg-blue-50 text-blue-700 ring-1 ring-blue-100"><Users size={19} /></div>
        </div>
        <div className="karsa-karyawan-stat flex items-center justify-between gap-3 border border-emerald-100 ring-1 ring-emerald-50">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-600">Aktif</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{rows.filter(isActiveEmployee).length}</p>
            <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">Karyawan aktif</p>
          </div>
          <div className="karsa-karyawan-stat-icon bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><CheckCircle2 size={19} /></div>
        </div>
        <div className="karsa-karyawan-stat flex items-center justify-between gap-3 border border-violet-100 ring-1 ring-violet-50">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-600">Filter</p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{role === "semua" ? "Semua Role" : role}</p>
            <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">{wilayah === "semua" ? "Semua Wilayah" : wilayah}</p>
          </div>
          <div className="karsa-karyawan-stat-icon bg-violet-50 text-violet-700 ring-1 ring-violet-100"><Search size={18} /></div>
        </div>
      </div>

      <section className="rounded-[1.35rem] border border-slate-100 bg-white/92 p-3 shadow-sm ring-1 ring-white/70">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <label className="relative sm:col-span-2 xl:col-span-2">
              <span className="mb-1 block text-[10px] font-black uppercase tracking-wide text-slate-500">Cari Karyawan</span>
              <Search className="absolute left-3 top-[34px] text-slate-400" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nama, ID, penempatan, role..." className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Role</span>
              <Select value={role} onChange={setRole} options={roleOptions} className="h-11 min-h-[44px] w-full text-xs" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Wilayah</span>
              <Select value={wilayah} onChange={setWilayah} options={wilayahOptions} className="h-11 min-h-[44px] w-full text-xs" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Status</span>
              <Select value={status} onChange={setStatus} options={statusOptions} className="h-11 min-h-[44px] w-full text-xs" />
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 xl:w-[430px]">
            <button onClick={openAdd} className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-blue-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-blue-700">Tambah</button>
            <button onClick={previewKaryawanPdf} disabled={!rows.length} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"><FileText size={16} /> Preview PDF</button>
            <button onClick={downloadKaryawanExcel} disabled={!rows.length} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"><Download size={16} /> Excel Rapi</button>
            <button onClick={resetFilters} className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-white px-4 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">Reset</button>
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs font-bold leading-relaxed text-blue-800">
          Tampilan karyawan dibuat soft, rapi, dan mudah dibaca. Total data tampil: <span className="font-black">{rows.length}</span>.
        </div>
      </section>

      <div className="grid gap-3 xl:grid-cols-2">
        {rows.map((row, idx) => (
          <EmployeeCard
            key={getVal(row, "id") || idx}
            row={row}
            onClick={() => setSelected({ type: "karyawan", row })}
            onEdit={() => openEdit(row)}
            onReset={() => submitAction({ action: "reset_pin", id: getVal(row, "id"), actor: admin?.name || "Admin" }, "PIN berhasil direset.")}
            onToggle={() => submitAction({ action: "update_employee", id: getVal(row, "id"), status: isActiveEmployee(row) ? "Nonaktif" : "Aktif", actor: admin?.name || "Admin" }, "Status karyawan diperbarui.")}
            onArchive={() => submitAction({ action: "archive_employee", id: getVal(row, "id"), actor: admin?.name || "Admin" }, "Karyawan diarsipkan.")}
            onPrint={() => printEmployeeProfilePdf(row)}
          />
        ))}
      </div>
      {!rows.length && <EmptyState title="Data karyawan kosong" text="Tidak ada karyawan sesuai filter." />}
      {editing && <EmployeeFormModal mode={editing.mode} row={editing.row} onClose={() => setEditing(null)} onSubmit={(data) => submitAction({ action: editing.mode === "add" ? "add_employee" : "update_employee", ...data, id: data.id || getVal(editing.row, "id"), actor: admin?.name || "Admin" }, editing.mode === "add" ? "Karyawan berhasil ditambahkan." : "Profil karyawan berhasil diperbarui.").then(() => setEditing(null))} />}
    </div>
  );
}

function getEmployeeCardTone(row) {
  const roleText = normalize(getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || getVal(row, "pekerjaan") || "");
  if (roleText.includes("sekuriti") || roleText.includes("security")) {
    return {
      shell: "border-sky-100 bg-gradient-to-br from-white via-sky-50/55 to-white",
      avatar: "bg-sky-50 text-sky-700 ring-sky-100",
      chip: "bg-sky-50 text-sky-700 ring-sky-100",
      accent: "from-sky-400 to-blue-500",
      button: "text-sky-700 ring-sky-100 hover:bg-sky-50",
    };
  }
  if (roleText.includes("operasional") || roleText.includes("lapangan") || roleText.includes("driver") || roleText.includes("supir")) {
    return {
      shell: "border-emerald-100 bg-gradient-to-br from-white via-emerald-50/55 to-white",
      avatar: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      chip: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      accent: "from-emerald-400 to-teal-500",
      button: "text-emerald-700 ring-emerald-100 hover:bg-emerald-50",
    };
  }
  if (roleText.includes("kebersihan") || roleText.includes("cleaning")) {
    return {
      shell: "border-teal-100 bg-gradient-to-br from-white via-teal-50/55 to-white",
      avatar: "bg-teal-50 text-teal-700 ring-teal-100",
      chip: "bg-teal-50 text-teal-700 ring-teal-100",
      accent: "from-teal-400 to-cyan-500",
      button: "text-teal-700 ring-teal-100 hover:bg-teal-50",
    };
  }
  return {
    shell: "border-blue-100 bg-gradient-to-br from-white via-blue-50/45 to-white",
    avatar: "bg-blue-50 text-blue-700 ring-blue-100",
    chip: "bg-blue-50 text-blue-700 ring-blue-100",
    accent: "from-blue-400 to-indigo-500",
    button: "text-blue-700 ring-blue-100 hover:bg-blue-50",
  };
}

function EmployeeCard({ row, onClick, onEdit, onReset, onToggle, onArchive, onPrint }) {
  const [avatarError, setAvatarError] = useState(false);
  const name = getVal(row, "name") || getVal(row, "nama") || "Karyawan";
  const employeeId = getVal(row, "id") || getVal(row, "userId") || "-";
  const placement = getSmartPlacementName(row);
  const role = getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || "Umum";
  const job = getVal(row, "pekerjaan") || getVal(row, "jabatan") || "-";
  const phone = getVal(row, "phone") || getVal(row, "noHp") || getVal(row, "whatsapp") || "-";
  const active = isActiveEmployee(row);
  const tone = getEmployeeCardTone(row);
  const profilePhoto = addImageCacheVersion(getProfilePhoto(row), row);

  return (
    <article className={cx("karsa-employee-card group relative overflow-hidden border p-0 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70", tone.shell)}>
      <div className={cx("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", tone.accent)} />

      <div className="flex items-start gap-3 p-4 pb-3">
        <button type="button" onClick={onClick} className={cx("karsa-employee-avatar shrink-0 ring-1", tone.avatar)}>
          {profilePhoto && !avatarError ? (
            <img src={profilePhoto} alt={`Foto profil ${name}`} referrerPolicy="no-referrer" decoding="async" loading="lazy" onError={() => setAvatarError(true)} />
          ) : (
            <UserCircle2 className="text-current" strokeWidth={1.75} />
          )}
        </button>

        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-black tracking-tight text-slate-950">{name}</p>
              <p className="mt-0.5 truncate text-[11px] font-extrabold text-slate-500">{employeeId}</p>
            </div>
            <ChevronRight className="mt-0.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" size={17} />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={tone.chip}>{role}</Badge>
            <Badge tone={statusTone(getVal(row, "status") || "Aktif")}>{getVal(row, "status") || "Aktif"}</Badge>
          </div>
        </button>

        <button
          type="button"
          onClick={onArchive}
          title="Arsipkan"
          className="karsa-employee-archive-btn shrink-0 transition active:scale-95"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <button type="button" onClick={onClick} className="w-full px-4 pb-3 text-left">
        <div className="rounded-2xl bg-white/82 p-3 ring-1 ring-slate-100/90">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">Penempatan</p>
          <p className="mt-1 line-clamp-2 text-[12px] font-extrabold leading-relaxed text-slate-700">{placement}</p>
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/72 px-3 py-2 ring-1 ring-slate-100/80">
            <span className="block text-[9px] font-black uppercase tracking-wide text-slate-400">Pekerjaan</span>
            <span className="mt-0.5 block truncate text-[12px] font-black text-slate-700">{job}</span>
          </div>
          <div className="rounded-2xl bg-white/72 px-3 py-2 ring-1 ring-slate-100/80">
            <span className="block text-[9px] font-black uppercase tracking-wide text-slate-400">Kontak</span>
            <span className="mt-0.5 block truncate text-[12px] font-black text-slate-700">{phone}</span>
          </div>
        </div>
      </button>

      <div className="border-t border-white/80 bg-white/62 px-4 py-3 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button type="button" onClick={onEdit} className={cx("rounded-xl bg-white px-3 py-2 text-xs font-black ring-1 transition", tone.button)}>Edit</button>
          <button type="button" onClick={onReset} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50">Reset PIN</button>
          <button type="button" onClick={onToggle} className={cx("rounded-xl bg-white px-3 py-2 text-xs font-black ring-1 transition", active ? "text-red-600 ring-red-100 hover:bg-red-50" : "text-emerald-700 ring-emerald-100 hover:bg-emerald-50")}>{active ? "Nonaktif" : "Aktifkan"}</button>
          <button type="button" onClick={onPrint} className={cx("rounded-xl bg-white px-3 py-2 text-xs font-black ring-1 transition", tone.button)}>Print</button>
        </div>
      </div>
    </article>
  );
}

function EmployeeFormModal({ mode, row, onClose, onSubmit }) {
  const [form, setForm] = useState(() => ({
    id: getVal(row, "id") || "",
    name: getVal(row, "name") || getVal(row, "nama") || "",
    status: getVal(row, "status") || "Aktif",
    wilayah: getVal(row, "wilayah") || "",
    penempatan: getVal(row, "penempatan") || "",
    divisi: getVal(row, "divisi") || getVal(row, "devisi") || "",
    role: getVal(row, "role") || "Umum",
    pekerjaan: getVal(row, "pekerjaan") || "",
    jabatan: getVal(row, "jabatan") || "",
    phone: getVal(row, "phone") || getVal(row, "noHp") || "",
    email: getVal(row, "email") || "",
  }));
  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  return (
    <Modal title={mode === "add" ? "Tambah Karyawan" : "Edit Karyawan"} onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="ID" value={form.id} onChange={(v) => set("id", v)} />
        <Input label="Nama" value={form.name} onChange={(v) => set("name", v)} />
        <Input label="Status" value={form.status} onChange={(v) => set("status", v)} />
        <Input label="Wilayah" value={form.wilayah} onChange={(v) => set("wilayah", v)} />
        <Input label="Penempatan" value={form.penempatan} onChange={(v) => set("penempatan", v)} />
        <Input label="Divisi" value={form.divisi} onChange={(v) => set("divisi", v)} />
        <Input label="Role" value={form.role} onChange={(v) => set("role", v)} />
        <Input label="Pekerjaan" value={form.pekerjaan} onChange={(v) => set("pekerjaan", v)} />
        <Input label="Jabatan" value={form.jabatan} onChange={(v) => set("jabatan", v)} />
        <Input label="No. HP" value={form.phone} onChange={(v) => set("phone", v)} />
        <Input label="Email" value={form.email} onChange={(v) => set("email", v)} />
      </div>
      <button onClick={() => onSubmit(form)} className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white">Simpan</button>
    </Modal>
  );
}

function AbsensiScreen({ db, setSelected }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("semua");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("semua");
  const [placementFilter, setPlacementFilter] = useState("semua");

  const employeeMap = useMemo(() => {
    const map = new Map();
    safeArray(db.karyawan).forEach((row) => {
      const id = String(getVal(row, "id") || getVal(row, "userId") || "").trim();
      if (id) map.set(id, row);
    });
    return map;
  }, [db.karyawan]);

  const getEmployee = (row) => employeeMap.get(String(getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "").trim()) || {};
  const getEmployeeId = (row) => getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "-";
  const getEmployeeName = (row) => getVal(row, "name") || getVal(row, "nama") || getVal(getEmployee(row), "name") || getVal(getEmployee(row), "nama") || getEmployeeId(row);
  const getEmployeePlacement = (row) => getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || getVal(getEmployee(row), "penempatan") || getVal(getEmployee(row), "site") || getVal(getEmployee(row), "instansi") || "-";
  const getEmployeeArea = (row) => getVal(row, "wilayah") || getVal(row, "daerah") || getVal(getEmployee(row), "wilayah") || getVal(getEmployee(row), "daerah") || "-";
  const getEmployeeDivision = (row) => getVal(row, "divisi") || getVal(row, "devisi") || getVal(getEmployee(row), "divisi") || getVal(getEmployee(row), "devisi") || getVal(row, "role") || getVal(getEmployee(row), "role") || "-";
  const getEmployeeRole = (row) => getVal(row, "role") || getVal(getEmployee(row), "role") || getEmployeeDivision(row) || "-";
  const getAbsensiDate = (row) => getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt") || getVal(row, "timestamp") || "";
  const getAbsensiTime = (row) => getVal(row, "time") || getVal(row, "jam") || getVal(row, "jam_absen") || "-";
  const getAbsensiAction = (row) => getAttendanceActionFromRow(row) || "Absensi";
  const getAbsensiStatus = (row) => getVal(row, "latenessStatus") || getVal(row, "statusAbsensi") || getVal(row, "clockStatus") || getVal(row, "status") || (isLate(row) ? "Terlambat" : "Tercatat");
  const getAbsensiLocation = (row) => getVal(row, "location") || getVal(row, "lokasi") || getVal(row, "locationNote") || getVal(row, "keteranganLokasi") || getVal(row, "alamat") || "-";
  const getAbsensiCoordinate = (row) => {
    const lat = getVal(row, "latitude") || getVal(row, "lat");
    const lng = getVal(row, "longitude") || getVal(row, "lng");
    if (lat && lng) return `${lat}, ${lng}`;
    return getVal(row, "coordinate") || getVal(row, "coordinates") || getVal(row, "koordinat") || "-";
  };

  const getAttendanceMillis = (row) => {
    const directTimestamp = Number(getVal(row, "timestamp") || getVal(row, "serverTimestamp") || 0);
    if (Number.isFinite(directTimestamp) && directTimestamp > 1000000000) return directTimestamp;
    const rawDate = getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt") || getVal(row, "updatedAt");
    return parseMillis(rawDate);
  };

  const actionOptions = useMemo(() => {
    const values = safeArray(db.absensi).map(getAbsensiAction).filter(Boolean);
    return [{ value: "semua", label: "Semua Aksi" }, ...Array.from(new Set(values)).sort().map((value) => ({ value, label: value }))];
  }, [db.absensi]);

  const placementOptions = useMemo(() => {
    const values = [
      ...safeArray(db.absensi).map(getEmployeePlacement),
      ...safeArray(db.karyawan).map((row) => getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi")),
    ].filter((value) => value && value !== "-");
    return [{ value: "semua", label: "Semua Penempatan" }, ...Array.from(new Set(values)).sort().map((value) => ({ value, label: value }))];
  }, [db.absensi, db.karyawan]);

  const rows = useMemo(() => {
    const fromMs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : 0;
    const toMs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;

    return safeArray(db.absensi)
      .filter((row) => {
        const rowDateMs = getAttendanceMillis(row);
        const hay = `${getEmployeeName(row)} ${getEmployeeId(row)} ${getAbsensiAction(row)} ${getAbsensiStatus(row)} ${getAbsensiLocation(row)} ${getEmployeePlacement(row)} ${getEmployeeArea(row)} ${getEmployeeDivision(row)}`.toLowerCase();
        const late = isLate(row);
        const dateOk = (!fromMs || rowDateMs >= fromMs) && (toMs === Infinity || rowDateMs <= toMs);
        const searchOk = !search || hay.includes(search.toLowerCase());
        const statusOk = status === "semua" || (status === "terlambat" ? late : !late);
        const actionOk = actionFilter === "semua" || getAbsensiAction(row) === actionFilter;
        const placementOk = placementFilter === "semua" || getEmployeePlacement(row) === placementFilter;
        return dateOk && searchOk && statusOk && actionOk && placementOk;
      })
      .sort((a, b) => getAttendanceMillis(b) - getAttendanceMillis(a));
  }, [db.absensi, db.karyawan, employeeMap, search, status, dateFrom, dateTo, actionFilter, placementFilter]);

  const exportRows = useMemo(() => rows.map((row, index) => ({
    "No": index + 1,
    "ID Karyawan": getEmployeeId(row),
    "Nama": getEmployeeName(row),
    "Tanggal": formatDate(getAbsensiDate(row)),
    "Jam": getAbsensiTime(row),
    "Aksi": getAbsensiAction(row),
    "Status": getAbsensiStatus(row),
    "Penempatan": getEmployeePlacement(row),
    "Daerah": getEmployeeArea(row),
    "Divisi": getEmployeeDivision(row),
    "Role": getEmployeeRole(row),
    "Lokasi": getAbsensiLocation(row),
    "Koordinat": getAbsensiCoordinate(row),
    "Catatan": getVal(row, "notes") || getVal(row, "note") || getVal(row, "catatan") || "-",
  })), [rows, db.karyawan]);

  const activeFilterRows = useMemo(() => [
    { Keterangan: "Perusahaan", Nilai: COMPANY_NAME },
    { Keterangan: "Logo", Nilai: "Logo resmi PT. Karsa Sentana Lumbung Sentosa" },
    { Keterangan: "Judul Laporan", Nilai: "Output Data Absensi" },
    { Keterangan: "Periode", Nilai: `${dateFrom || "Awal data"} s/d ${dateTo || "Akhir data"}` },
    { Keterangan: "Pencarian", Nilai: search || "Semua" },
    { Keterangan: "Status", Nilai: status === "semua" ? "Semua Status" : status === "terlambat" ? "Terlambat" : "Tercatat" },
    { Keterangan: "Aksi", Nilai: actionFilter === "semua" ? "Semua Aksi" : actionFilter },
    { Keterangan: "Penempatan", Nilai: placementFilter === "semua" ? "Semua Penempatan" : placementFilter },
    { Keterangan: "Total Data", Nilai: rows.length },
    { Keterangan: "Tanggal Cetak", Nilai: new Date().toLocaleString("id-ID") },
  ], [dateFrom, dateTo, search, status, actionFilter, placementFilter, rows.length]);

  const absensiReportConfig = useMemo(() => ({
    title: "Hasil Output Data Absensi",
    subtitle: "Output berdasarkan filter aktif di menu Absensi. Header memakai logo PT. Karsa Sentana Lumbung Sentosa.",
    infoRows: activeFilterRows,
    sections: [
      {
        title: "Detail Data Absensi",
        columns: ["No", "ID Karyawan", "Nama", "Tanggal", "Jam", "Aksi", "Status", "Penempatan", "Daerah", "Divisi", "Role", "Lokasi", "Koordinat", "Catatan"],
        rows: exportRows,
      },
    ],
  }), [activeFilterRows, exportRows]);

  const fileSuffix = `${dateFrom || "awal"}-${dateTo || "akhir"}-${status}-${actionFilter}-${placementFilter}`.replace(/[^a-zA-Z0-9_-]+/g, "-");
  const previewAbsensiPdf = () => exportStyledPdf(`hasil-output-absensi-${fileSuffix}.pdf`, absensiReportConfig);
  const downloadAbsensiExcel = () => exportStyledExcel(`hasil-output-absensi-${fileSuffix}.xls`, absensiReportConfig);

  const resetFilters = () => {
    setSearch("");
    setStatus("semua");
    setDateFrom("");
    setDateTo("");
    setActionFilter("semua");
    setPlacementFilter("semua");
  };

  const statusTabs = [
    { id: "semua", label: "Semua" },
    { id: "normal", label: "Tercatat" },
    { id: "terlambat", label: "Terlambat" },
  ];

  const metrics = [
    { label: "Total", value: rows.length, icon: FileCheck2, tone: "text-blue-700 bg-blue-50 ring-blue-100" },
    { label: "Masuk", value: rows.filter((r) => normalize(getAbsensiAction(r)).includes("masuk")).length, icon: Clock3, tone: "text-emerald-700 bg-emerald-50 ring-emerald-100" },
    { label: "Pulang", value: rows.filter((r) => normalize(getAbsensiAction(r)).includes("pulang")).length, icon: CheckCircle2, tone: "text-blue-700 bg-blue-50 ring-blue-100" },
    { label: "Terlambat", value: rows.filter(isLate).length, icon: AlertCircle, tone: "text-red-700 bg-red-50 ring-red-100" },
    { label: "Libur", value: rows.filter((r) => normalize(getAbsensiAction(r)).includes("libur")).length, icon: CalendarDays, tone: "text-amber-700 bg-amber-50 ring-amber-100" },
  ];

  const inputClass = "h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[10px] font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-0.5 block text-[7px] font-black uppercase tracking-[0.12em] text-slate-400";

  return (
    <div className="space-y-2">
      <section className="overflow-hidden rounded-[0.9rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-2 p-2 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-stretch">
          <div className="flex h-full flex-col justify-center rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-blue-600">Top Tools Absensi</p>
                <h3 className="text-[13px] font-black leading-tight text-slate-950">Pusat Data Absensi</h3>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black text-slate-500 ring-1 ring-slate-100">{rows.length} data</span>
            </div>
            <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-6">
              <label className="block">
                <span className={labelClass}>Tanggal Awal</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
              </label>
              <label className="block">
                <span className={labelClass}>Tanggal Akhir</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
              </label>
              <label className="relative md:col-span-2 xl:col-span-2">
                <span className={labelClass}>Cari</span>
                <Search className="absolute left-2 top-[21px] text-slate-400" size={11} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nama, ID, aksi, lokasi..." className={`${inputClass} pl-7`} />
              </label>
              <label className="block">
                <span className={labelClass}>Aksi</span>
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className={inputClass}>
                  {actionOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Penempatan</span>
                <select value={placementFilter} onChange={(e) => setPlacementFilter(e.target.value)} className={inputClass}>
                  {placementOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <aside className="flex h-full flex-col justify-center rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-blue-600">Output</p>
                <p className="text-[11px] font-black text-slate-950">PDF / Excel</p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[8px] font-black text-slate-500 ring-1 ring-slate-100">{rows.length} baris</span>
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1">
              <button onClick={previewAbsensiPdf} disabled={!rows.length} className="inline-flex min-h-[30px] items-center justify-center gap-1 rounded-md bg-blue-600 px-2 text-[9px] font-black text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"><Eye size={10} /> Preview</button>
              <button onClick={downloadAbsensiExcel} disabled={!rows.length} className="inline-flex min-h-[30px] items-center justify-center gap-1 rounded-md bg-emerald-600 px-2 text-[9px] font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400"><Download size={10} /> Excel</button>
              <button onClick={resetFilters} className="inline-flex min-h-[30px] items-center justify-center rounded-md bg-white px-2 text-[9px] font-black text-slate-700 ring-1 ring-slate-200">Reset</button>
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-white p-1 ring-1 ring-slate-100">
              {statusTabs.map((item) => {
                const active = status === item.id;
                return (
                  <button key={item.id} onClick={() => setStatus(item.id)} className={cx("inline-flex min-h-[28px] items-center justify-center rounded-md px-1.5 text-[8px] font-black transition", active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-blue-50 hover:text-blue-700")}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[1rem] bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-0.5 text-xl font-black tracking-tight text-slate-950">{item.value}</p>
                </div>
                <div className={cx("grid h-9 w-9 place-items-center rounded-xl ring-1", item.tone)}><Icon size={17} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-[1rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-blue-600">Hasil Absensi</p>
            <h3 className="text-sm font-black text-slate-950">Data Berdasarkan Filter Aktif</h3>
          </div>
          <Badge tone="bg-slate-50 text-slate-600 ring-slate-100">{rows.length} baris</Badge>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-[980px] w-full table-fixed text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <tr>
                <th className="w-[180px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Nama</th>
                <th className="w-[115px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Tanggal</th>
                <th className="w-[78px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Jam</th>
                <th className="w-[135px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Aksi</th>
                <th className="w-[108px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Status</th>
                <th className="w-[120px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Penempatan</th>
                <th className="w-[200px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Lokasi</th>
                <th className="w-[118px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Bukti</th>
                <th className="w-[75px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length ? rows.map((row, idx) => {
                const late = isLate(row);
                return (
                  <tr key={getVal(row, "id") || `${getEmployeeId(row)}-${idx}`} className="transition hover:bg-blue-50/40">
                    <td className="px-3 py-2"><CellTitle title={getEmployeeName(row)} subtitle={getEmployeeId(row)} /></td>
                    <td className="px-3 py-2 text-xs font-bold text-slate-600">{formatDate(getAbsensiDate(row))}</td>
                    <td className="px-3 py-2 text-xs font-black tabular-nums text-slate-800">{getAbsensiTime(row)}</td>
                    <td className="px-3 py-2 text-xs font-bold text-slate-600">{getAbsensiAction(row)}</td>
                    <td className="px-3 py-2"><div className="flex flex-col items-start"><Badge tone={statusTone(late ? "Terlambat" : "Tercatat")}>{late ? "Terlambat" : "Tercatat"}</Badge><OfflineSyncBadges row={row} compact /></div></td>
                    <td className="px-3 py-2 text-xs font-bold text-slate-600">{getEmployeePlacement(row)}</td>
                    <td className="px-3 py-2 text-[11px] font-semibold leading-relaxed text-slate-500"><span className="line-clamp-1">{getAbsensiLocation(row)}</span></td>
                    <td className="px-3 py-2 text-center">
                      <div className="mx-auto w-fit"><EvidenceThumbnail row={row} type="absensi" size="sm" /></div>
                    </td>
                    <td className="px-3 py-2 text-center"><button onClick={() => setSelected({ type: "absensi", row })} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100">Detail</button></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm font-bold text-slate-400">Tidak ada data absensi sesuai filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LogKehadiranScreen({ db, setSelected }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");

  const employeeMap = useMemo(() => {
    const map = new Map();
    safeArray(db.karyawan).forEach((row) => {
      const id = String(getVal(row, "id") || getVal(row, "userId") || "").trim();
      if (id) map.set(id, row);
    });
    return map;
  }, [db.karyawan]);

  const getEmployee = (row) => employeeMap.get(String(getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "").trim()) || {};
  const getEmployeeId = (row) => getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "-";
  const getEmployeeName = (row) => getVal(row, "name") || getVal(row, "nama") || getVal(getEmployee(row), "name") || getVal(getEmployee(row), "nama") || getEmployeeId(row);
  const getEmployeeInstansi = (row) => getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || getVal(getEmployee(row), "penempatan") || getVal(getEmployee(row), "site") || getVal(getEmployee(row), "instansi") || "-";
  const getEmployeeDaerah = (row) => getVal(row, "wilayah") || getVal(row, "daerah") || getVal(getEmployee(row), "wilayah") || getVal(getEmployee(row), "daerah") || "-";
  const getTime = (row) => String(getVal(row, "time") || getVal(row, "jam") || getVal(row, "jam_absen") || "-").trim();
  const getAction = (row) => getAttendanceActionFromRow(row) || "Absensi";
  const timeToMinutes = (value) => {
    const clean = String(value || "").replaceAll(".", ":");
    const parts = clean.split(":");
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return 99999;
    return hh * 60 + mm;
  };
  const periodOf = (row) => {
    const mins = timeToMinutes(getTime(row));
    if (mins < 600) return "pagi";
    if (mins < 900) return "siang";
    if (mins < 1080) return "sore";
    return "malam";
  };

  const rows = useMemo(() => {
    const fromMs = dateFrom ? new Date(dateFrom).getTime() : 0;
    const toMs = dateTo ? new Date(dateTo).getTime() + 86400000 - 1 : Infinity;
    return safeArray(db.absensi)
      .filter((row) => {
        const ms = parseMillis(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt"));
        const hay = `${getEmployeeName(row)} ${getEmployeeId(row)} ${getEmployeeInstansi(row)} ${getEmployeeDaerah(row)} ${getAction(row)} ${getTime(row)}`.toLowerCase();
        const dateOk = (!fromMs || ms >= fromMs) && (toMs === Infinity || ms <= toMs);
        const searchOk = !search || hay.includes(search.toLowerCase());
        const periodOk = period === "semua" || periodOf(row) === period;
        const statusOk = statusFilter === "semua" || (statusFilter === "terlambat" ? isLate(row) : !isLate(row));
        return dateOk && searchOk && periodOk && statusOk;
      })
      .sort((a, b) => {
        const dateA = parseMillis(getVal(a, "date") || getVal(a, "tanggal") || getVal(a, "createdAt"));
        const dateB = parseMillis(getVal(b, "date") || getVal(b, "tanggal") || getVal(b, "createdAt"));
        if (dateA !== dateB) return dateA - dateB;
        return timeToMinutes(getTime(a)) - timeToMinutes(getTime(b));
      });
  }, [db.absensi, db.karyawan, dateFrom, dateTo, search, period, statusFilter]);

  const periodOptions = [
    { value: "semua", label: "Semua Jam" },
    { value: "pagi", label: "Pagi" },
    { value: "siang", label: "Siang" },
    { value: "sore", label: "Sore" },
    { value: "malam", label: "Malam / Penutup" },
  ];

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "tercatat", label: "Tercatat" },
    { value: "terlambat", label: "Terlambat" },
  ];

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPeriod("semua");
    setStatusFilter("semua");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-4 xl:grid-cols-[minmax(230px,0.8fr)_minmax(0,1.8fr)] xl:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Log Absensi Harian</p>
            <h3 className="mt-1 text-xl font-black leading-tight text-slate-950">Timeline Kehadiran</h3>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">Pantau absensi karyawan berdasarkan urutan jam, dari pagi sampai penutup.</p>
          </div>

          <div className="grid gap-2 md:grid-cols-5">
            <Input label="Tanggal Awal" type="date" value={dateFrom} onChange={setDateFrom} />
            <Input label="Tanggal Akhir" type="date" value={dateTo} onChange={setDateTo} />
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-slate-500">Rentang Jam</span>
              <Select value={period} onChange={setPeriod} options={periodOptions} className="min-h-[44px] w-full text-xs" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-slate-500">Status</span>
              <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} className="min-h-[44px] w-full text-xs" />
            </label>
            <Input label="Cari Nama / ID" value={search} onChange={setSearch} placeholder="Nama / ID" />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold text-slate-500">
            <span className="text-slate-900">Filter aktif:</span> {dateFrom || "Awal"} s/d {dateTo || "Akhir"} • {periodOptions.find((x) => x.value === period)?.label} • {statusOptions.find((x) => x.value === statusFilter)?.label}
          </p>
          <button onClick={resetFilters} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100">Reset Filter</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Timeline Kehadiran</p>
            <h3 className="text-base font-black text-slate-950">Log Jam Absensi</h3>
          </div>
          <Badge tone="bg-slate-50 text-slate-600 ring-slate-100">{rows.length} log</Badge>
        </div>

        <div className="max-h-[66vh] overflow-auto">
          <table className="min-w-[980px] w-full table-fixed text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <tr>
                <th className="w-[90px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Jam</th>
                <th className="w-[230px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Nama</th>
                <th className="w-[130px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Tanggal</th>
                <th className="w-[150px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Aksi</th>
                <th className="w-[120px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Status</th>
                <th className="w-[150px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Penempatan</th>
                <th className="w-[120px] px-3 py-2.5 text-[10px] font-black uppercase tracking-wide text-slate-400">Daerah</th>
                <th className="w-[90px] px-3 py-2.5 text-center text-[10px] font-black uppercase tracking-wide text-slate-400">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length ? rows.map((row, idx) => {
                const late = isLate(row);
                return (
                  <tr key={getVal(row, "id") || `${getEmployeeId(row)}-${idx}`} className="transition hover:bg-blue-50/40">
                    <td className="px-3 py-2.5 text-sm font-black tabular-nums text-slate-950">{getTime(row)}</td>
                    <td className="px-3 py-2.5">
                      <p className="truncate text-sm font-black text-slate-950">{getEmployeeName(row)}</p>
                      <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">{getEmployeeId(row)}</p>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-bold text-slate-600">{formatDate(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt"))}</td>
                    <td className="px-3 py-2.5 text-xs font-bold text-slate-700">{getAction(row)}</td>
                    <td className="px-3 py-2.5"><div className="flex flex-col items-start"><Badge tone={statusTone(late ? "Terlambat" : "Tercatat")}>{late ? "Terlambat" : "Tercatat"}</Badge><OfflineSyncBadges row={row} compact /></div></td>
                    <td className="px-3 py-2.5 text-xs font-bold text-slate-600">{getEmployeeInstansi(row)}</td>
                    <td className="px-3 py-2.5 text-xs font-bold text-slate-600">{getEmployeeDaerah(row)}</td>
                    <td className="px-3 py-2.5 text-center"><button onClick={() => setSelected({ type: "absensi", row })} className="rounded-xl bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100">Detail</button></td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm font-bold text-slate-400">Tidak ada log absensi sesuai filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReportExportModal({
  open,
  onClose,
  config,
  onPdf,
  onExcel,
  filters,
}) {
  const previewHtml = useMemo(() => makeReportHtml({ ...(config || {}), format: "pdf" }), [config]);
  const [employeeSearch, setEmployeeSearch] = useState("");

  const filterRows = safeArray(config?.infoRows).filter((row) => {
    const label = String(getVal(row, "Keterangan") || "").toLowerCase();
    return ["judul laporan", "periode", "filter utama", "tempat/penempatan", "daerah", "divisi", "total catatan"].some((key) => label.includes(key));
  });

  const modalInputClass = "min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const modalLabelClass = "mb-1 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400";

  const selectedEmployeeOption = safeArray(filters?.employeeOptions).find((item) => item.value === filters?.selectedEmployee);
  const employeeChoices = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();
    return safeArray(filters?.employeeOptions)
      .filter((item) => item.value !== "semua")
      .filter((item) => !query || String(item.label || "").toLowerCase().includes(query))
      .slice(0, 8);
  }, [filters?.employeeOptions, employeeSearch]);

  if (!open) return null;

  const isIndividualLocked = filters?.mode === "individu" && filters?.selectedEmployee && filters.selectedEmployee !== "semua";
  const autoPlacement = filters?.autoPlacement || "-";
  const autoArea = filters?.autoArea || "-";
  const autoDivision = filters?.autoDivision || "-";
  const autoRole = filters?.autoRole || "-";

  const setModeSafe = (value) => {
    filters?.setMode?.(value);
  };

  return (
    <Modal title="Preview & Download Laporan" onClose={onClose} wide>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-col gap-2 border-b border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Preview Dokumen Live</p>
              <h4 className="text-base font-black text-slate-950">{config?.title || "Hasil Laporan"}</h4>
            </div>
            <Badge tone="bg-emerald-50 text-emerald-700 ring-emerald-100">Live Preview</Badge>
          </div>
          <div className="h-[66vh] bg-slate-100 p-3">
            <iframe title="Preview laporan" srcDoc={previewHtml} className="h-full w-full rounded-xl bg-white shadow-sm ring-1 ring-slate-200" />
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-[1.35rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Filter Manual</p>
            <h4 className="mt-1 text-xl font-black tracking-tight text-slate-950">Atur Preview</h4>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">Setiap perubahan filter langsung mengubah preview laporan di kiri.</p>
          </div>

          <div className="rounded-[1.35rem] bg-slate-50 p-3 ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">Mode Rekap</p>
              <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">Manual</span>
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 ring-1 ring-blue-100">
              {[{ id: "individu", label: "Individu", icon: Users }, { id: "instansi", label: "Instansi", icon: Briefcase }, { id: "role", label: "Role", icon: IdCard }].map((item) => {
                const Icon = item.icon;
                const active = filters?.mode === item.id;
                return <button key={item.id} onClick={() => setModeSafe(item.id)} className={cx("inline-flex min-h-[34px] items-center justify-center gap-1 rounded-lg px-2 text-[10px] font-black transition", active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-blue-50 hover:text-blue-700")}><Icon size={13} /> {item.label}</button>;
              })}
            </div>

            <div className="mt-3 grid gap-2">
              <label className="block">
                <span className={modalLabelClass}>Tanggal Awal</span>
                <input type="date" value={filters?.dateFrom || ""} onChange={(e) => filters?.setDateFrom?.(e.target.value)} className={modalInputClass} />
              </label>
              <label className="block">
                <span className={modalLabelClass}>Tanggal Akhir</span>
                <input type="date" value={filters?.dateTo || ""} onChange={(e) => filters?.setDateTo?.(e.target.value)} className={modalInputClass} />
              </label>
              {filters?.mode === "individu" && (
                <>
                  <div className="block">
                    <span className={modalLabelClass}>Ketik Nama</span>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        value={employeeSearch}
                        onChange={(e) => {
                          setEmployeeSearch(e.target.value);
                          filters?.setSelectedEmployee?.("semua");
                        }}
                        placeholder="Ketik nama karyawan..."
                        className="min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 pl-9 text-xs font-black text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="mt-2 max-h-44 overflow-y-auto rounded-xl bg-white p-1 ring-1 ring-slate-200">
                      {employeeChoices.length ? employeeChoices.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            filters?.setSelectedEmployee?.(item.value);
                            setEmployeeSearch(item.label);
                          }}
                          className={cx("flex min-h-[34px] w-full items-center rounded-lg px-3 text-left text-xs font-black transition", filters?.selectedEmployee === item.value ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900")}
                        >
                          {item.label}
                        </button>
                      )) : (
                        <p className="px-3 py-3 text-xs font-bold text-slate-400">Nama tidak ditemukan.</p>
                      )}
                    </div>
                  </div>
                  {isIndividualLocked && (
                    <div className="rounded-2xl bg-white p-3 ring-1 ring-blue-100">
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-blue-600">Data otomatis terkunci</p>
                      <div className="mt-2 grid gap-2">
                        <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><p className="text-[9px] font-black uppercase text-slate-400">Penempatan</p><p className="truncate text-xs font-black text-slate-800">{autoPlacement}</p></div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><p className="text-[9px] font-black uppercase text-slate-400">Daerah</p><p className="truncate text-xs font-black text-slate-800">{autoArea}</p></div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><p className="text-[9px] font-black uppercase text-slate-400">Divisi</p><p className="truncate text-xs font-black text-slate-800">{autoDivision}</p></div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><p className="text-[9px] font-black uppercase text-slate-400">Role</p><p className="truncate text-xs font-black text-slate-800">{autoRole}</p></div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {filters?.mode === "instansi" && (
                <label className="block">
                  <span className={modalLabelClass}>Pilih Instansi</span>
                  <select value={filters?.selectedInstansi || "semua"} onChange={(e) => filters?.setSelectedInstansi?.(e.target.value)} className={modalInputClass}>
                    {safeArray(filters?.instansiOptions).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
              )}
              {filters?.mode === "role" && (
                <label className="block">
                  <span className={modalLabelClass}>Pilih Role</span>
                  <select value={filters?.selectedRole || "semua"} onChange={(e) => filters?.setSelectedRole?.(e.target.value)} className={modalInputClass}>
                    {safeArray(filters?.roleOptions).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
              )}
              {filters?.mode !== "individu" && (
                <>
                  <label className="block">
                    <span className={modalLabelClass}>Penempatan</span>
                    <select value={filters?.selectedTempat || "semua"} onChange={(e) => filters?.setSelectedTempat?.(e.target.value)} className={modalInputClass}>
                      {safeArray(filters?.tempatOptions).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className={modalLabelClass}>Daerah</span>
                    <select value={filters?.selectedDaerah || "semua"} onChange={(e) => filters?.setSelectedDaerah?.(e.target.value)} className={modalInputClass}>
                      {safeArray(filters?.daerahOptions).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className={modalLabelClass}>Divisi</span>
                    <select value={filters?.selectedDivisi || "semua"} onChange={(e) => filters?.setSelectedDivisi?.(e.target.value)} className={modalInputClass}>
                      {safeArray(filters?.divisiOptions).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </label>
                </>
              )}
              <button onClick={() => { setEmployeeSearch(""); filters?.resetFilters?.(); }} className="mt-1 inline-flex min-h-[38px] w-full items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">Reset Filter</button>
            </div>
          </div>

          <div className="rounded-[1.35rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <div className="grid gap-2">
              <button onClick={onPdf} className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-blue-700">
                <FileText size={17} /> Print / Simpan PDF
              </button>
              <button onClick={onExcel} className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700">
                <Download size={17} /> Download Excel
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

function StatistikScreen({ db, setSelected }) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("semua");
  const [selectedDivision, setSelectedDivision] = useState("semua");
  const [selectedArea, setSelectedArea] = useState("semua");
  const [selectedPlacement, setSelectedPlacement] = useState("semua");
  const [viewMode, setViewMode] = useState("karyawan");
  const [performanceDetail, setPerformanceDetail] = useState(null);
  const [tableNameSearch, setTableNameSearch] = useState("");

  const getEmployeeId = (row) => getVal(row, "id") || getVal(row, "userId") || "-";
  const getEmployeeName = (row) => getVal(row, "name") || getVal(row, "nama") || getEmployeeId(row);
  const getEmployeePlacement = (row) => getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || "-";
  const getEmployeeArea = (row) => getVal(row, "wilayah") || getVal(row, "daerah") || getVal(row, "sumberData") || getVal(row, "importSource") || "-";
  const getEmployeeDivision = (row) => getVal(row, "divisi") || getVal(row, "devisi") || getVal(row, "department") || getVal(row, "role") || "-";
  const getEmployeeRole = (row) => getVal(row, "role") || getEmployeeDivision(row) || "Umum";
  const getRowEmployeeId = (row) => getVal(row, "userId") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "-";
  const getAction = (row) => getAttendanceActionFromRow(row) || "Absensi";
  const getTime = (row) => String(getVal(row, "time") || getVal(row, "jam") || getVal(row, "jam_absen") || "-").trim();
  const timeToMinutes = (value) => {
    const clean = String(value || "").replaceAll(".", ":");
    const parts = clean.split(":");
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
    return hh * 60 + mm;
  };
  const getMillis = (row) => {
    const directTimestamp = Number(getVal(row, "timestamp") || getVal(row, "serverTimestamp") || 0);
    if (Number.isFinite(directTimestamp) && directTimestamp > 1000000000) return directTimestamp;
    return parseMillis(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt") || getVal(row, "updatedAt") || getVal(row, "start") || getVal(row, "dateStart"));
  };
  const getDateKey = (row) => {
    const ms = getMillis(row);
    if (ms) return toInputDate(new Date(ms));
    return toInputDate(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt") || getVal(row, "start") || getVal(row, "dateStart"));
  };
  const getDateLabel = (row) => {
    const key = getDateKey(row);
    if (!key) return formatDate(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt") || getVal(row, "timestamp") || getVal(row, "start") || getVal(row, "dateStart"));
    return formatDate(key);
  };

  const employees = useMemo(() => safeArray(db.karyawan).filter(isActiveEmployee), [db.karyawan]);
  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach((row) => {
      const id = String(getEmployeeId(row)).trim();
      if (id && id !== "-") map.set(id, row);
    });
    return map;
  }, [employees]);

  const makeMetaFromRecord = (row) => {
    const id = String(getRowEmployeeId(row)).trim();
    const employee = employeeMap.get(id) || {};
    return {
      id,
      name: getVal(row, "name") || getVal(row, "nama") || getEmployeeName(employee) || id,
      placement: getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || getEmployeePlacement(employee),
      area: getVal(row, "wilayah") || getVal(row, "daerah") || getEmployeeArea(employee),
      division: getVal(row, "divisi") || getVal(row, "devisi") || getVal(row, "department") || getEmployeeDivision(employee),
      role: getVal(row, "role") || getEmployeeRole(employee),
      employee,
    };
  };

  const isMetaVisible = (meta, ms) => {
    const fromMs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : 0;
    const toMs = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;
    const hay = `${meta.id} ${meta.name} ${meta.placement} ${meta.area} ${meta.division} ${meta.role}`.toLowerCase();
    const dateOk = (!fromMs || ms >= fromMs) && (toMs === Infinity || ms <= toMs);
    const searchOk = !search || hay.includes(search.toLowerCase());
    const empOk = selectedEmployee === "semua" || meta.id === selectedEmployee;
    const divOk = selectedDivision === "semua" || meta.division === selectedDivision;
    const areaOk = selectedArea === "semua" || meta.area === selectedArea;
    const placeOk = selectedPlacement === "semua" || meta.placement === selectedPlacement;
    return dateOk && searchOk && empOk && divOk && areaOk && placeOk;
  };

  const filterBase = useMemo(() => {
    return safeArray(db.absensi).map((row) => {
      const meta = makeMetaFromRecord(row);
      const action = getAction(row);
      const ms = getMillis(row);
      const minutes = timeToMinutes(getTime(row));
      return {
        raw: row,
        kind: "absensi",
        category: "Absensi",
        ...meta,
        action,
        actionNorm: normalize(action),
        time: getTime(row),
        minutes,
        ms,
        dateKey: getDateKey(row),
        dateLabel: getDateLabel(row),
        late: isLate(row),
      };
    }).filter((row) => isMetaVisible(row, row.ms));
  }, [db.absensi, employeeMap, search, dateFrom, dateTo, selectedEmployee, selectedDivision, selectedArea, selectedPlacement]);

  const extraBase = useMemo(() => {
    const leaves = safeArray(db.cuti).map((row) => {
      const meta = makeMetaFromRecord(row);
      const typeText = String(getVal(row, "type") || getVal(row, "jenis") || getVal(row, "requestCategory") || getVal(row, "kategori") || "Pengajuan");
      const typeNorm = normalize(typeText);
      const subtype = typeNorm.includes("sakit") ? "Sakit" : typeNorm.includes("izin") ? "Izin" : typeNorm.includes("cuti") ? "Cuti" : "Pengajuan";
      const ms = getMillis(row);
      return {
        raw: row,
        kind: "pengajuan",
        category: subtype,
        subtype,
        ...meta,
        ms,
        dateKey: getDateKey(row),
        dateLabel: getDateLabel(row),
        late: false,
      };
    });
    const reports = safeArray(db.laporan).map((row) => {
      const meta = makeMetaFromRecord(row);
      const ms = getMillis(row);
      return {
        raw: row,
        kind: "laporan",
        category: "Laporan",
        subtype: displayReportStatus(row),
        ...meta,
        ms,
        dateKey: getDateKey(row),
        dateLabel: getDateLabel(row),
        late: false,
      };
    });
    return [...leaves, ...reports].filter((row) => isMetaVisible(row, row.ms));
  }, [db.cuti, db.laporan, employeeMap, search, dateFrom, dateTo, selectedEmployee, selectedDivision, selectedArea, selectedPlacement]);

  const performanceBase = useMemo(() => [...filterBase, ...extraBase], [filterBase, extraBase]);

  const employeeStats = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => {
      const id = String(getEmployeeId(emp)).trim();
      if (!id || id === "-") return;
      map.set(id, {
        id,
        name: getEmployeeName(emp),
        placement: getEmployeePlacement(emp),
        area: getEmployeeArea(emp),
        division: getEmployeeDivision(emp),
        role: getEmployeeRole(emp),
        employee: emp,
        photo: addImageCacheVersion(getProfilePhoto(emp), emp),
        total: 0,
        days: new Set(),
        masuk: 0,
        pulang: 0,
        istirahat: 0,
        libur: 0,
        late: 0,
        normal: 0,
        pengajuan: 0,
        cuti: 0,
        izin: 0,
        sakit: 0,
        laporan: 0,
        performanceTotal: 0,
        firstInMinutes: null,
        lastOutMinutes: null,
        firstIn: "-",
        lastOut: "-",
        daily: new Map(),
        hourBuckets: new Map(),
        categoryRows: new Map(),
      });
    });

    performanceBase.forEach((row) => {
      const base = map.get(row.id) || {
        id: row.id,
        name: row.name,
        placement: row.placement,
        area: row.area,
        division: row.division,
        role: row.role,
        employee: row.employee || {},
        photo: addImageCacheVersion(getProfilePhoto(row.employee || {}), row.employee || {}),
        total: 0,
        days: new Set(),
        masuk: 0,
        pulang: 0,
        istirahat: 0,
        libur: 0,
        late: 0,
        normal: 0,
        pengajuan: 0,
        cuti: 0,
        izin: 0,
        sakit: 0,
        laporan: 0,
        performanceTotal: 0,
        firstInMinutes: null,
        lastOutMinutes: null,
        firstIn: "-",
        lastOut: "-",
        daily: new Map(),
        hourBuckets: new Map(),
        categoryRows: new Map(),
      };

      base.performanceTotal += 1;
      if (row.dateKey) base.days.add(row.dateKey);
      const categoryLabel = row.kind === "absensi" ? "Absensi" : row.kind === "laporan" ? "Laporan" : row.category;
      base.categoryRows.set(categoryLabel, (base.categoryRows.get(categoryLabel) || 0) + 1);

      if (row.kind === "laporan") {
        base.laporan += 1;
        map.set(row.id, base);
        return;
      }

      if (row.kind === "pengajuan") {
        base.pengajuan += 1;
        if (row.category === "Cuti") base.cuti += 1;
        if (row.category === "Izin") base.izin += 1;
        if (row.category === "Sakit") base.sakit += 1;
        map.set(row.id, base);
        return;
      }

      base.total += 1;
      if (row.late) base.late += 1;
      else base.normal += 1;
      if (row.actionNorm.includes("masuk") && !row.actionNorm.includes("istirahat")) {
        base.masuk += 1;
        if (row.minutes !== null && (base.firstInMinutes === null || row.minutes < base.firstInMinutes)) {
          base.firstInMinutes = row.minutes;
          base.firstIn = row.time;
        }
      }
      if (row.actionNorm.includes("pulang")) {
        base.pulang += 1;
        if (row.minutes !== null && (base.lastOutMinutes === null || row.minutes > base.lastOutMinutes)) {
          base.lastOutMinutes = row.minutes;
          base.lastOut = row.time;
        }
      }
      if (row.actionNorm.includes("istirahat")) base.istirahat += 1;
      if (row.actionNorm.includes("libur")) base.libur += 1;
      const day = base.daily.get(row.dateKey) || { key: row.dateKey, label: row.dateLabel, total: 0, masuk: 0, pulang: 0, istirahat: 0, libur: 0, late: 0, normal: 0 };
      day.total += 1;
      if (row.late) day.late += 1;
      else day.normal += 1;
      if (row.actionNorm.includes("masuk")) day.masuk += 1;
      if (row.actionNorm.includes("pulang")) day.pulang += 1;
      if (row.actionNorm.includes("istirahat")) day.istirahat += 1;
      if (row.actionNorm.includes("libur")) day.libur += 1;
      base.daily.set(row.dateKey, day);
      const hour = row.minutes === null ? "-" : String(Math.floor(row.minutes / 60)).padStart(2, "0");
      base.hourBuckets.set(hour, (base.hourBuckets.get(hour) || 0) + 1);
      map.set(row.id, base);
    });

    return Array.from(map.values()).map((item) => {
      const attendanceDays = item.days.size;
      const lateRate = item.total ? Math.round((item.late / item.total) * 100) : 0;
      const completeRate = item.masuk ? Math.round((Math.min(item.pulang, item.masuk) / item.masuk) * 100) : 0;
      const adminLoad = item.pengajuan + item.laporan;
      const avgIn = item.firstInMinutes === null ? "-" : `${String(Math.floor(item.firstInMinutes / 60)).padStart(2, "0")}.${String(item.firstInMinutes % 60).padStart(2, "0")}`;
      const score = Math.max(0, Math.min(100, Math.round(100 - lateRate * 0.65 + completeRate * 0.2 - Math.min(adminLoad * 2, 12) - (attendanceDays ? 0 : 20))));
      return {
        ...item,
        employee: item.employee || {},
        photo: item.photo || addImageCacheVersion(getProfilePhoto(item.employee || {}), item.employee || {}),
        attendanceDays,
        lateRate,
        completeRate,
        adminLoad,
        avgIn,
        score,
        dailyRows: Array.from(item.daily.values()).sort((a, b) => String(a.key).localeCompare(String(b.key))),
        hourRows: Array.from(item.hourBuckets.entries()).filter(([key]) => key !== "-").map(([hour, total]) => ({ label: `${hour}.00`, total })).sort((a, b) => a.label.localeCompare(b.label)),
        categoryRows: Array.from(item.categoryRows.entries()).map(([label, total]) => ({ label, total })).sort((a, b) => b.total - a.total),
      };
    });
  }, [employees, performanceBase]);

  const groupedStats = useMemo(() => {
    const keyGetter = viewMode === "tanggal"
      ? (row) => row.dateLabel || "Tanpa Tanggal"
      : viewMode === "divisi"
        ? (row) => row.division || "Tanpa Divisi"
        : viewMode === "daerah"
          ? (row) => row.area || row.daerah || row.penempatan || "Tanpa Daerah"
          : (row) => row.name || row.nama || row.id || "Tanpa Nama";
    const map = new Map();
    performanceBase.forEach((row) => {
      const key = keyGetter(row) || "-";
      const item = map.get(key) || { key, total: 0, absensi: 0, pengajuan: 0, laporan: 0, masuk: 0, pulang: 0, istirahat: 0, libur: 0, late: 0, normal: 0, people: new Set() };
      item.total += 1;
      item.people.add(row.id);
      if (row.kind === "laporan") item.laporan += 1;
      if (row.kind === "pengajuan") item.pengajuan += 1;
      if (row.kind === "absensi") {
        item.absensi += 1;
        if (row.late) item.late += 1;
        else item.normal += 1;
        if (row.actionNorm.includes("masuk")) item.masuk += 1;
        if (row.actionNorm.includes("pulang")) item.pulang += 1;
        if (row.actionNorm.includes("istirahat")) item.istirahat += 1;
        if (row.actionNorm.includes("libur")) item.libur += 1;
      }
      map.set(key, item);
    });
    return Array.from(map.values()).map((item) => ({ ...item, orang: item.people.size, lateRate: item.absensi ? Math.round((item.late / item.absensi) * 100) : 0 })).sort((a, b) => b.total - a.total || a.key.localeCompare(b.key));
  }, [performanceBase, viewMode]);

  const filteredStats = useMemo(() => {
    const hasActiveFilter = Boolean(
      search ||
      dateFrom ||
      dateTo ||
      selectedEmployee !== "semua" ||
      selectedDivision !== "semua" ||
      selectedArea !== "semua" ||
      selectedPlacement !== "semua"
    );

    return employeeStats
      .filter((item) => {
        const hay = `${item.id} ${item.name} ${item.placement} ${item.area} ${item.division} ${item.role}`.toLowerCase();
        const searchOk = !search || hay.includes(search.toLowerCase());
        const empOk = selectedEmployee === "semua" || item.id === selectedEmployee;
        const divOk = selectedDivision === "semua" || item.division === selectedDivision;
        const areaOk = selectedArea === "semua" || item.area === selectedArea;
        const placeOk = selectedPlacement === "semua" || item.placement === selectedPlacement;

        // Penting: tabel profesional harus ikut filter aktif.
        // Kalau filter aktif, tampilkan hanya karyawan yang match dan punya aktivitas pada filter tersebut.
        // Kalau tanpa filter, tetap tampilkan semua karyawan agar admin bisa melihat skor 0 juga.
        const dataOk = !hasActiveFilter || item.performanceTotal > 0 || selectedEmployee !== "semua";

        return searchOk && empOk && divOk && areaOk && placeOk && dataOk;
      })
      .sort((a, b) => b.performanceTotal - a.performanceTotal || b.score - a.score || a.name.localeCompare(b.name));
  }, [employeeStats, search, dateFrom, dateTo, selectedEmployee, selectedDivision, selectedArea, selectedPlacement]);

  const selectedStat = useMemo(() => {
    if (selectedEmployee !== "semua") return employeeStats.find((item) => item.id === selectedEmployee) || null;
    return filteredStats.find((item) => item.performanceTotal > 0) || filteredStats[0] || null;
  }, [employeeStats, filteredStats, selectedEmployee]);

  const employeeOptions = useMemo(() => [
    { value: "semua", label: "Semua Karyawan" },
    ...employees.map((emp) => ({ value: String(getEmployeeId(emp)), label: getEmployeeName(emp) })).sort((a, b) => a.label.localeCompare(b.label)),
  ], [employees]);
  const optionFrom = (values, label) => [{ value: "semua", label }, ...Array.from(new Set(values.filter(Boolean).filter((x) => x !== "-"))).sort().map((value) => ({ value, label: value }))];
  const divisionOptions = useMemo(() => optionFrom(employees.map(getEmployeeDivision), "Semua Divisi"), [employees]);
  const areaOptions = useMemo(() => optionFrom(employees.map(getEmployeeArea), "Semua Daerah"), [employees]);
  const placementOptions = useMemo(() => optionFrom(employees.map(getEmployeePlacement), "Semua Penempatan"), [employees]);

  const totalAttendance = filterBase.length;
  const totalActivities = performanceBase.length;
  const totalRequests = extraBase.filter((row) => row.kind === "pengajuan").length;
  const totalReports = extraBase.filter((row) => row.kind === "laporan").length;
  const totalLate = filterBase.filter((row) => row.late).length;
  const totalIzin = extraBase.filter((row) => row.category === "Izin").length;
  const totalSakit = extraBase.filter((row) => row.category === "Sakit").length;
  const totalPeople = new Set(performanceBase.map((row) => row.id)).size;
  const averageScore = filteredStats.length ? Math.round(filteredStats.reduce((sum, item) => sum + item.score, 0) / filteredStats.length) : 0;
  const topActive = filteredStats.slice().sort((a, b) => b.performanceTotal - a.performanceTotal).slice(0, 8);
  const topLate = filteredStats.slice().sort((a, b) => b.late - a.late).slice(0, 8);

  const resetFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setSelectedEmployee("semua");
    setSelectedDivision("semua");
    setSelectedArea("semua");
    setSelectedPlacement("semua");
    setTableNameSearch("");
    setViewMode("karyawan");
  };

  const insightText = useMemo(() => {
    const worst = topLate[0];
    const busiest = topActive[0];
    if (!totalActivities) return "Belum ada data pada filter ini. Coba longgarkan tanggal atau pilih semua karyawan.";
    if (worst?.late > 0) return `Perhatian utama: ${worst.name} memiliki ${worst.late} catatan terlambat. Aktivitas terbanyak: ${busiest?.name || "-"} dengan ${busiest?.performanceTotal || 0} data gabungan absensi, pengajuan, dan laporan.`;
    return `Kondisi filter aktif terlihat aman. Tidak ada keterlambatan terbaca. Aktivitas administrasi terbaca: ${totalRequests} pengajuan dan ${totalReports} laporan.`;
  }, [topLate, topActive, totalActivities, totalRequests, totalReports]);

  const tableFilteredStats = useMemo(() => {
    const query = tableNameSearch.trim().toLowerCase();
    if (!query) return filteredStats;
    return filteredStats.filter((item) => `${item.name} ${item.id} ${item.placement} ${item.area} ${item.division} ${item.role}`.toLowerCase().includes(query));
  }, [filteredStats, tableNameSearch]);

  const openPerformanceGraph = (item, event) => {
    if (event) {
      event.preventDefault?.();
      event.stopPropagation?.();
    }
    if (!item) return;
    setPerformanceDetail({ ...item, _openedAt: Date.now() });
  };

  const viewTabs = [
    { id: "karyawan", label: "Per Orang" },
    { id: "tanggal", label: "Per Tanggal" },
    { id: "divisi", label: "Per Divisi" },
    { id: "daerah", label: "Per Daerah" },
  ];

  return (
    <div className="space-y-3">
      <PerformanceDetailModal stat={performanceDetail} onClose={() => setPerformanceDetail(null)} />
      <section className="overflow-hidden rounded-[1rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">Live Analytics</p>
                <h3 className="text-base font-black text-slate-950">Statistik Performa Karyawan</h3>
              </div>
              <Badge tone="bg-emerald-50 text-emerald-700 ring-emerald-100">Absensi • Pengajuan • Laporan</Badge>
            </div>
            <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Tanggal Awal</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Tanggal Akhir</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="relative md:col-span-2">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Cari Cepat</span>
                <Search className="absolute left-2 top-[25px] text-slate-400" size={12} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nama, ID, penempatan, divisi..." className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Perorangan</span>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100">
                  {employeeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Divisi</span>
                <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100">
                  {divisionOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Daerah</span>
                <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100">
                  {areaOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[8px] font-black uppercase tracking-wide text-slate-400">Penempatan</span>
                <select value={selectedPlacement} onChange={(e) => setSelectedPlacement(e.target.value)} className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100">
                  {placementOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100">
              {viewTabs.map((item) => <button key={item.id} onClick={() => setViewMode(item.id)} className={cx("rounded-lg px-2 py-2 text-[9px] font-black transition", viewMode === item.id ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100" : "text-slate-500 hover:bg-white/70")}>{item.label}</button>)}
            </div>
            <button onClick={resetFilters} className="inline-flex min-h-[32px] w-full items-center justify-center rounded-lg bg-white px-3 text-[10px] font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">Reset Semua Filter</button>
          </div>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <MetricTile label="Total Aktivitas" value={totalActivities} note="Gabungan semua data" tone="slate" />
        <MetricTile label="Absensi" value={totalAttendance} note={`${totalPeople} orang terbaca`} tone="blue" />
        <MetricTile label="Pengajuan" value={totalRequests} note={`Izin ${totalIzin} • Sakit ${totalSakit}`} tone="emerald" />
        <MetricTile label="Laporan" value={totalReports} note="Laporan user" tone="blue" />
        <MetricTile label="Terlambat" value={totalLate} note={`${totalAttendance ? Math.round((totalLate / totalAttendance) * 100) : 0}% dari absensi`} tone="red" />
        <MetricTile label="Skor Rata-rata" value={averageScore} note="Estimasi performa" tone="emerald" />
      </div>

      <section className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">Smart Reading</p>
            <h3 className="text-base font-black text-slate-950">Pembacaan Otomatis</h3>
          </div>
          <Badge tone="bg-blue-50 text-blue-700 ring-blue-100">{dateFrom || "Awal"} s/d {dateTo || "Akhir"}</Badge>
        </div>
        <p className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold leading-relaxed text-slate-600 ring-1 ring-slate-100">{insightText}</p>
      </section>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">Live View Grafik</p>
              <h3 className="text-base font-black text-slate-950">{viewTabs.find((x) => x.id === viewMode)?.label}</h3>
            </div>
            <Badge tone="bg-slate-50 text-slate-600 ring-slate-100">{groupedStats.length} grup</Badge>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <ProfessionalGroupedChart rows={groupedStats.slice(0, 12)} />
            <div className="space-y-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Komposisi Data</p>
              <MiniDonut total={totalActivities} danger={totalLate} />
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100"><p className="text-[8px] font-black uppercase text-slate-400">Pengajuan</p><p className="text-lg font-black text-emerald-700">{totalRequests}</p></div>
                <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100"><p className="text-[8px] font-black uppercase text-slate-400">Laporan</p><p className="text-lg font-black text-blue-700">{totalReports}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
          <MiniRankChart title="Ranking Aktivitas" rows={topActive} valueKey="performanceTotal" tone="blue" />
          <MiniRankChart title="Ranking Keterlambatan" rows={topLate} valueKey="late" tone="red" />
        </section>
      </div>

      <section className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">Detail Perorangan</p>
            <h3 className="text-base font-black text-slate-950">{selectedStat?.name || "Pilih karyawan"}</h3>
          </div>
          {selectedStat && <Badge tone={statusTone(selectedStat.late ? "terlambat" : "aktif")}>Skor {selectedStat.score}</Badge>}
        </div>
        <div className="mt-3 grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <p className="text-[9px] font-black uppercase text-slate-400">Profil Performa</p>
            <p className="mt-2 text-lg font-black text-slate-950">{selectedStat?.id || "-"}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{selectedStat?.placement || "-"}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{selectedStat?.area || "-"} • {selectedStat?.division || "-"}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <MiniKpi label="Absensi" value={selectedStat?.total || 0} />
              <MiniKpi label="Telat" value={selectedStat?.late || 0} tone="red" />
              <MiniKpi label="Pengajuan" value={selectedStat?.pengajuan || 0} tone="emerald" />
              <MiniKpi label="Laporan" value={selectedStat?.laporan || 0} tone="blue" />
            </div>
            <div className="mt-3 space-y-2">
              <ProgressBar value={selectedStat?.lateRate || 0} label="Rasio Telat" tone={(selectedStat?.lateRate || 0) > 20 ? "red" : "emerald"} />
              <ProgressBar value={selectedStat?.completeRate || 0} label="Kelengkapan Pulang" tone="blue" />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <PerformanceCategoryChart rows={selectedStat?.categoryRows || []} />
            <DailyComboChart rows={selectedStat?.dailyRows || []} />
            <HourDistributionChart rows={selectedStat?.hourRows || []} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
          <div><p className="text-[8px] font-black uppercase tracking-[0.18em] text-blue-600">Tabel Profesional</p><h3 className="text-sm font-black text-slate-950">Statistik Performa Per Karyawan</h3></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative block w-full sm:w-[260px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input
                value={tableNameSearch}
                onChange={(e) => setTableNameSearch(e.target.value)}
                placeholder="Cari nama / ID..."
                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2.5 text-[11px] font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>
            {tableNameSearch && <button type="button" onClick={() => setTableNameSearch("")} className="relative z-30 inline-flex min-h-[32px] items-center justify-center rounded-lg bg-white px-3 text-[10px] font-black text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Reset Nama</button>}
            <Badge tone="bg-slate-50 text-slate-600 ring-slate-100">{tableFilteredStats.length} karyawan</Badge>
          </div>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-[1260px] w-full table-fixed text-left">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <tr>
                <th className="w-[220px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Karyawan</th>
                <th className="w-[130px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Daerah</th>
                <th className="w-[140px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Divisi</th>
                <th className="w-[82px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Aktivitas</th>
                <th className="w-[82px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Absensi</th>
                <th className="w-[82px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Pengajuan</th>
                <th className="w-[70px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Izin</th>
                <th className="w-[70px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Sakit</th>
                <th className="w-[82px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Laporan</th>
                <th className="w-[90px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Telat</th>
                <th className="w-[150px] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-slate-400">Rasio Telat</th>
                <th className="w-[80px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Skor</th>
                <th className="w-[86px] px-3 py-2 text-center text-[8px] font-black uppercase tracking-wide text-slate-400">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableFilteredStats.length ? tableFilteredStats.map((item) => (
                <tr
                  key={item.id}
                  onClick={(event) => openPerformanceGraph(item, event)}
                  className="cursor-pointer transition hover:bg-blue-50/40"
                  title="Klik baris atau tombol Grafik untuk membuka detail grafik"
                >
                  <td className="px-3 py-2"><CellTitle title={item.name} subtitle={`${item.id} • ${item.placement}`} /></td>
                  <td className="px-3 py-2 text-xs font-bold text-slate-600">{item.area}</td>
                  <td className="px-3 py-2 text-xs font-bold text-slate-600">{item.division}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-slate-800">{item.performanceTotal}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-blue-700">{item.total}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-emerald-700">{item.pengajuan}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-slate-800">{item.izin}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-amber-700">{item.sakit}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-violet-700">{item.laporan}</td>
                  <td className="px-3 py-2 text-center text-xs font-black text-red-700">{item.late}</td>
                  <td className="px-3 py-2"><ProgressBar value={item.lateRate} tone={item.lateRate > 30 ? "red" : item.lateRate > 10 ? "amber" : "emerald"} /></td>
                  <td className="px-3 py-2 text-center text-xs font-black text-slate-900">{item.score}</td>
                  <td className="relative z-20 px-3 py-2 text-center">
                    <button
                      type="button"
                      onPointerDownCapture={(event) => openPerformanceGraph(item, event)}
                      onMouseDown={(event) => openPerformanceGraph(item, event)}
                      onClick={(event) => openPerformanceGraph(item, event)}
                      className="relative z-30 inline-flex min-h-[30px] items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-700 active:scale-95"
                    >
                      Grafik
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan={13} className="px-4 py-10 text-center text-sm font-bold text-slate-400">Tidak ada statistik sesuai filter atau pencarian nama.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function buildAiPerformanceAnalysis(stat) {
  const totalAktivitas = Number(stat?.performanceTotal || 0);
  const totalAbsensi = Number(stat?.total || 0);
  const totalTelat = Number(stat?.late || 0);
  const totalPengajuan = Number(stat?.pengajuan || 0);
  const totalLaporan = Number(stat?.laporan || 0);
  const totalCuti = Number(stat?.cuti || 0);
  const totalIzin = Number(stat?.izin || 0);
  const totalSakit = Number(stat?.sakit || 0);
  const rasioTelat = Number(stat?.lateRate || 0);
  const kelengkapanPulang = Number(stat?.completeRate || 0);
  const skor = Number(stat?.score || 0);
  const hariTercatat = Number(stat?.attendanceDays || 0);
  const bebanAdmin = Number(stat?.adminLoad || 0);
  const nama = stat?.name || "Karyawan";
  const hourRows = safeArray(stat?.hourRows);
  const dailyRows = safeArray(stat?.dailyRows);
  const dominantHour = hourRows.slice().sort((a, b) => Number(b.total || 0) - Number(a.total || 0))[0];
  const worstDay = dailyRows.slice().sort((a, b) => Number(b.late || 0) - Number(a.late || 0))[0];

  let riskLevel = "Rendah";
  let riskTone = "emerald";
  let statusLabel = "Stabil";
  if (rasioTelat >= 70 || skor < 45) {
    riskLevel = "Tinggi";
    riskTone = "red";
    statusLabel = "Prioritas Pembinaan";
  } else if (rasioTelat >= 30 || skor < 65 || totalTelat >= 2) {
    riskLevel = "Sedang";
    riskTone = "amber";
    statusLabel = "Perlu Perhatian";
  }

  const confidence = totalAktivitas >= 15 ? "Tinggi" : totalAktivitas >= 6 ? "Sedang" : "Rendah";
  const confidenceNote = confidence === "Tinggi"
    ? "Data sudah cukup untuk membaca pola performa."
    : confidence === "Sedang"
      ? "Data mulai cukup, tetapi tetap perlu validasi periode berikutnya."
      : "Data masih sedikit. Kesimpulan perlu dianggap sebagai indikasi awal, bukan keputusan final.";

  const strengths = [];
  if (totalAktivitas > 0) strengths.push(`${nama} memiliki ${totalAktivitas} aktivitas tercatat pada filter aktif.`);
  if (totalTelat === 0 && totalAbsensi > 0) strengths.push("Tidak ada keterlambatan pada periode ini.");
  if (kelengkapanPulang >= 80) strengths.push("Kelengkapan absen pulang tergolong baik.");
  if (totalLaporan > 0) strengths.push(`Ada ${totalLaporan} laporan yang menunjukkan aktivitas pelaporan berjalan.`);
  if (!strengths.length) strengths.push("Belum ada kekuatan utama yang bisa dibaca karena data aktivitas masih minim.");

  const concerns = [];
  if (!totalAktivitas) concerns.push("Belum ada aktivitas pada filter aktif sehingga performa belum bisa dinilai secara kuat.");
  if (totalAbsensi > 0 && rasioTelat >= 50) concerns.push(`Rasio keterlambatan sangat tinggi (${rasioTelat}%).`);
  else if (totalTelat > 0) concerns.push(`Ada ${totalTelat} keterlambatan dari ${totalAbsensi} absensi.`);
  if (totalAbsensi > 0 && kelengkapanPulang < 50) concerns.push(`Kelengkapan pulang rendah (${kelengkapanPulang}%), perlu cek apakah user lupa absen pulang atau data belum sinkron.`);
  if (bebanAdmin >= 3) concerns.push(`Beban administrasi cukup tinggi: ${bebanAdmin} pengajuan/laporan.`);
  if (worstDay?.late > 0) concerns.push(`Hari paling berisiko: ${worstDay.label || worstDay.key}, dengan ${worstDay.late} catatan terlambat.`);
  if (!concerns.length) concerns.push("Tidak ada masalah besar yang terbaca dari data pada filter aktif.");

  const recommendations = [];
  if (rasioTelat >= 50) recommendations.push("Lakukan klarifikasi pola jam masuk dan pastikan jadwal kerja yang dipakai sudah sesuai divisi/shift.");
  else if (totalTelat > 0) recommendations.push("Pantau keterlambatan pada 3–7 hari kerja berikutnya sebelum membuat keputusan administratif.");
  if (kelengkapanPulang < 50 && totalAbsensi > 0) recommendations.push("Ingatkan user agar absen pulang, lalu cek apakah tombol pulang atau sinkronisasi data berjalan normal.");
  if (totalCuti || totalIzin || totalSakit) recommendations.push(`Validasi pengajuan: cuti ${totalCuti}, izin ${totalIzin}, sakit ${totalSakit}, supaya statistik tidak salah dibaca sebagai ketidakhadiran bermasalah.`);
  if (confidence === "Rendah") recommendations.push("Tambah rentang tanggal atau tunggu data beberapa hari lagi agar analisa lebih akurat.");
  if (!recommendations.length) recommendations.push("Pertahankan monitoring rutin. Tidak diperlukan tindakan khusus selain pengecekan berkala.");

  const managerSummary = totalAktivitas
    ? `${nama} berada pada risiko ${riskLevel.toLowerCase()} dengan skor ${skor}. Akurasi analisa: ${confidence.toLowerCase()} karena terdapat ${totalAktivitas} aktivitas dan ${hariTercatat} hari absensi tercatat. ${dominantHour ? `Jam aktivitas paling sering muncul di sekitar ${dominantHour.label}.` : "Pola jam belum cukup terbaca."}`
    : `${nama} belum memiliki aktivitas pada filter aktif. Sistem belum bisa memberi penilaian performa yang kuat.`;

  const decision = riskLevel === "Tinggi"
    ? "Butuh tindak lanjut admin/HR"
    : riskLevel === "Sedang"
      ? "Pantau dan validasi"
      : "Aman dipantau rutin";

  return {
    statusLabel,
    riskLevel,
    riskTone,
    confidence,
    confidenceNote,
    managerSummary,
    strengths,
    concerns,
    recommendations,
    decision,
  };
}

function AiInsightCard({ title, items, tone = "blue", icon: Icon = Sparkles }) {
  const toneMap = {
    blue: "border-blue-100 bg-blue-50/55 text-blue-700 ring-blue-100",
    emerald: "border-emerald-100 bg-emerald-50/55 text-emerald-700 ring-emerald-100",
    amber: "border-amber-100 bg-amber-50/60 text-amber-700 ring-amber-100",
    red: "border-rose-100 bg-rose-50/60 text-rose-700 ring-rose-100",
    slate: "border-slate-100 bg-slate-50 text-slate-700 ring-slate-100",
  };
  return (
    <div className="rounded-[1.35rem] border bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-2">
        <div className={cx("grid h-8 w-8 place-items-center rounded-xl ring-1", toneMap[tone] || toneMap.blue)}><Icon size={15} /></div>
        <h4 className="text-sm font-black text-slate-950">{title}</h4>
      </div>
      <div className="mt-3 space-y-2">
        {safeArray(items).map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <span className={cx("mt-0.5 h-2 w-2 shrink-0 rounded-full", tone === "red" ? "bg-rose-500" : tone === "amber" ? "bg-amber-500" : tone === "emerald" ? "bg-emerald-500" : "bg-blue-500")} />
            <p className="text-xs font-bold leading-relaxed text-slate-600">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceDetailModal({ stat, onClose }) {
  if (!stat || typeof document === "undefined") return null;

  const totalAktivitas = Number(stat.performanceTotal || 0);
  const totalAbsensi = Number(stat.total || 0);
  const totalTelat = Number(stat.late || 0);
  const totalPengajuan = Number(stat.pengajuan || 0);
  const totalLaporan = Number(stat.laporan || 0);
  const rasioTelat = Number(stat.lateRate || 0);
  const kelengkapanPulang = Number(stat.completeRate || 0);
  const skor = Number(stat.score || 0);
  const initial = String(stat.name || "K").slice(0, 1).toUpperCase();
  const ai = buildAiPerformanceAnalysis(stat);
  const statusToneClass = ai.riskTone === "red" ? "bg-rose-50 text-rose-700 ring-rose-100" : ai.riskTone === "amber" ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  const summaryItems = [
    { label: "Total Aktivitas", value: totalAktivitas, note: "Absensi + pengajuan + laporan", tone: "slate" },
    { label: "Absensi", value: totalAbsensi, note: `${stat.attendanceDays || 0} hari tercatat`, tone: "blue" },
    { label: "Pengajuan", value: totalPengajuan, note: `Cuti ${stat.cuti || 0} • Izin ${stat.izin || 0} • Sakit ${stat.sakit || 0}`, tone: "emerald" },
    { label: "Laporan", value: totalLaporan, note: "Laporan user", tone: "blue" },
  ];

  return createPortal(
    <Modal title="Laporan Performa Karyawan" onClose={onClose} wide>
      <div className="space-y-4">
        <section className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-xl shadow-slate-200/80">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <EmployeeAvatar
                row={{ ...(stat.employee || {}), name: stat.name, nama: stat.name, photoUrl: stat.photo }}
                size="lg"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">AI Performance Analyst</p>
                <h2 className="mt-1 truncate text-3xl font-black tracking-tight text-white">{stat.name}</h2>
                <p className="mt-1 text-sm font-bold leading-relaxed text-slate-300">{stat.id || "-"} • {stat.placement || "-"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white ring-1 ring-white/15">{stat.division || "Divisi"}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white ring-1 ring-white/15">{stat.area || "Daerah"}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white ring-1 ring-white/15">{stat.role || "Role"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 text-right ring-1 ring-white/15 backdrop-blur">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-200">Skor Performa</p>
              <p className="mt-1 text-5xl font-black leading-none text-white">{skor}</p>
              <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-slate-900">{ai.statusLabel}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => <MetricTile key={item.label} label={item.label} value={item.value} note={item.note} tone={item.tone} />)}
        </div>

        <section className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-white p-4 shadow-sm ring-1 ring-blue-50">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Analisa AI Akurat Berbasis Data</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">Kesimpulan Otomatis</h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">{ai.managerSummary}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${statusToneClass}`}>Risiko {ai.riskLevel}</span>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700 ring-1 ring-blue-100">Akurasi {ai.confidence}</span>
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <MiniKpi label="Keputusan" value={ai.decision} tone={ai.riskTone === "red" ? "red" : ai.riskTone === "amber" ? "slate" : "emerald"} />
            <MiniKpi label="Validasi Data" value={ai.confidence} tone="blue" />
            <MiniKpi label="Beban Admin" value={stat.adminLoad || 0} tone="blue" />
          </div>
          <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-bold leading-relaxed text-slate-500 ring-1 ring-blue-100">{ai.confidenceNote}</p>
        </section>

        <section className="grid gap-3 xl:grid-cols-3">
          <AiInsightCard title="Kekuatan" items={ai.strengths} tone="emerald" icon={CheckCircle2} />
          <AiInsightCard title="Temuan Risiko" items={ai.concerns} tone={ai.riskTone === "red" ? "red" : ai.riskTone === "amber" ? "amber" : "blue"} icon={AlertCircle} />
          <AiInsightCard title="Saran Tindak Lanjut" items={ai.recommendations} tone="blue" icon={Sparkles} />
        </section>

        <section className="grid gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Indikator Cepat</p>
                <h3 className="mt-1 text-lg font-black text-slate-950">Rasio dan Beban</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${statusToneClass}`}>{ai.statusLabel}</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <MiniKpi label="Telat" value={totalTelat} tone="red" />
              <MiniKpi label="Rasio" value={`${rasioTelat}%`} tone={rasioTelat > 20 ? "red" : "emerald"} />
              <MiniKpi label="Aktivitas" value={totalAktivitas} tone="blue" />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Indikator Utama</p>
                <h3 className="mt-1 text-lg font-black text-slate-950">Kualitas Kehadiran</h3>
              </div>
              <Badge tone="bg-blue-50 text-blue-700 ring-blue-100">AI Grafik</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400">Rasio Terlambat</p>
                <div className="mt-3"><ProgressBar value={rasioTelat} tone={rasioTelat > 20 ? "red" : rasioTelat > 10 ? "amber" : "emerald"} /></div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400">Kelengkapan Pulang</p>
                <div className="mt-3"><ProgressBar value={kelengkapanPulang} tone="blue" /></div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400">Skor Performa</p>
                <div className="mt-3"><ProgressBar value={skor} tone={skor < 60 ? "red" : skor < 75 ? "amber" : "emerald"} /></div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-3 xl:grid-cols-3">
          <PerformanceCategoryChart rows={stat.categoryRows || []} />
          <DailyComboChart rows={stat.dailyRows || []} />
          <HourDistributionChart rows={stat.hourRows || []} />
        </div>
      </div>
    </Modal>,
    document.body
  );
}

function PerformanceCategoryChart({ rows }) {
  const data = safeArray(rows);
  const max = Math.max(...data.map((x) => Number(x.total) || 0), 1);
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
      <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Komposisi Aktivitas</p>
      <div className="mt-3 space-y-2 rounded-xl bg-white p-3 ring-1 ring-slate-100">
        {data.length ? data.map((item) => {
          const width = Math.max(5, Math.round((item.total / max) * 100));
          return <div key={item.label} className="grid grid-cols-[72px_1fr_34px] items-center gap-2"><span className="truncate text-[10px] font-black text-slate-600">{item.label}</span><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${width}%` }} /></div><span className="text-right text-[10px] font-black text-slate-700">{item.total}</span></div>;
        }) : <p className="py-10 text-center text-xs font-bold text-slate-400">Belum ada komposisi aktivitas.</p>}
      </div>
    </div>
  );
}

function MetricTile({ label, value, note, tone = "blue" }) {
  const toneMap = {
    blue: "text-blue-700 bg-blue-50 ring-blue-100",
    emerald: "text-emerald-700 bg-emerald-50 ring-emerald-100",
    red: "text-red-700 bg-red-50 ring-red-100",
    slate: "text-slate-700 bg-slate-50 ring-slate-100",
  };
  return <div className="rounded-[1rem] bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100"><p className="text-[8px] font-black uppercase tracking-wide text-slate-400">{label}</p><p className={cx("mt-1 inline-flex rounded-xl px-2 py-1 text-2xl font-black ring-1", toneMap[tone] || toneMap.blue)}>{value}</p>{note && <p className="mt-1 text-[10px] font-bold text-slate-400">{note}</p>}</div>;
}

function MiniKpi({ label, value, tone = "slate" }) {
  const toneMap = { slate: "text-slate-900", emerald: "text-emerald-700", blue: "text-blue-700", red: "text-red-700" };
  return <div className="rounded-xl bg-white p-2 ring-1 ring-slate-100"><p className="text-[8px] font-black uppercase text-slate-400">{label}</p><p className={cx("text-lg font-black", toneMap[tone] || toneMap.slate)}>{value}</p></div>;
}

function ProfessionalGroupedChart({ rows }) {
  const data = safeArray(rows);
  const max = Math.max(...data.map((row) => Number(row.total) || 0), 1);
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-slate-50/70 to-white p-3 shadow-sm">
      {data.length ? (
        <div className="space-y-2">
          {data.map((row, index) => {
            const total = Number(row.total) || 0;
            const normal = Math.max(0, Number(row.normal) || 0);
            const late = Math.max(0, Number(row.late) || 0);
            const width = Math.max(4, Math.round((total / max) * 100));
            const latePct = total ? Math.round((late / total) * 100) : 0;
            return (
              <div key={row.key} className="rounded-xl border border-slate-100 bg-white/90 p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-slate-900">{row.key}</p>
                    <p className="mt-0.5 text-[9px] font-bold text-slate-400">{row.orang} orang • {latePct}% telat</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-2 py-1 text-right ring-1 ring-slate-100">
                    <p className="text-[9px] font-black text-slate-900">{total}</p>
                    <p className="text-[7px] font-black uppercase text-slate-400">data</p>
                  </div>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                  <div
                    className="flex h-full overflow-hidden rounded-full"
                    style={{ width: `${width}%`, background: "linear-gradient(90deg, rgba(226,232,240,.35), rgba(226,232,240,.1))" }}
                  >
                    <div style={{ width: `${total ? Math.round((normal / total) * 100) : 0}%`, background: "linear-gradient(90deg,#34d399,#10b981)" }} />
                    <div style={{ width: `${total ? Math.round((late / total) * 100) : 0}%`, background: "linear-gradient(90deg,#fb7185,#ef4444)" }} />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[8px] font-black uppercase tracking-wide text-slate-400">
                  <span>Normal {normal}</span>
                  <span>Telat {late}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl bg-white p-5 text-center text-xs font-bold text-slate-400 ring-1 ring-slate-100">Belum ada data untuk grafik.</p>
      )}
    </div>
  );
}

function MiniDonut({ total, danger }) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeDanger = Math.max(0, Number(danger) || 0);
  const pct = safeTotal ? Math.round((safeDanger / safeTotal) * 100) : 0;
  const normal = Math.max(0, safeTotal - safeDanger);
  const bg = `conic-gradient(#fb7185 0 ${pct}%, #34d399 ${pct}% 100%)`;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-sm">
      <div className="mx-auto grid h-28 w-28 place-items-center rounded-full p-2 shadow-inner" style={{ background: bg }}>
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950">{pct}%</p>
            <p className="text-[8px] font-black uppercase tracking-wide text-rose-500">Telat</p>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-50 px-2 py-2 ring-1 ring-emerald-100">
          <p className="text-[8px] font-black uppercase text-emerald-600">Normal</p>
          <p className="text-base font-black text-emerald-700">{normal}</p>
        </div>
        <div className="rounded-xl bg-rose-50 px-2 py-2 ring-1 ring-rose-100">
          <p className="text-[8px] font-black uppercase text-rose-600">Telat</p>
          <p className="text-base font-black text-rose-700">{safeDanger}</p>
        </div>
      </div>
    </div>
  );
}

function DailyComboChart({ rows }) {
  const data = safeArray(rows).slice(-12);
  const max = Math.max(...data.map((x) => Number(x.total) || 0), 1);
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-slate-50/70 to-white p-3 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Grafik Kombinasi Harian</p>
      <div className="mt-3 flex h-48 items-end gap-2 rounded-xl bg-white p-3 ring-1 ring-slate-100">
        {data.length ? data.map((item) => {
          const height = Math.max(10, Math.round((item.total / max) * 142));
          const lateHeight = item.total ? Math.round((item.late / item.total) * height) : 0;
          return (
            <div key={item.key} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-black text-slate-600 ring-1 ring-slate-100">{item.total}</span>
              <div className="relative w-full max-w-[32px] overflow-hidden rounded-t-xl bg-gradient-to-t from-blue-500 to-sky-300 shadow-sm" style={{ height }}>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-500 to-rose-300" style={{ height: lateHeight }} />
                <div className="absolute inset-x-1 top-1 h-1 rounded-full bg-white/45" />
              </div>
              <span className="w-full truncate text-center text-[8px] font-bold text-slate-400">{item.label}</span>
            </div>
          );
        }) : <div className="grid h-full w-full place-items-center text-xs font-bold text-slate-400">Belum ada data harian.</div>}
      </div>
      <div className="mt-2 flex items-center gap-3 text-[9px] font-black text-slate-500"><span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-sky-400" /> Total</span><span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-rose-400" /> Terlambat</span></div>
    </div>
  );
}

function HourDistributionChart({ rows }) {
  const data = safeArray(rows);
  const max = Math.max(...data.map((x) => Number(x.total) || 0), 1);
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-violet-50/30 to-white p-3 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">Distribusi Jam Absensi</p>
      <div className="mt-3 space-y-2 rounded-xl bg-white p-3 ring-1 ring-slate-100">
        {data.length ? data.slice(0, 10).map((item) => {
          const width = Math.max(5, Math.round((item.total / max) * 100));
          return <div key={item.label} className="grid grid-cols-[48px_1fr_30px] items-center gap-2"><span className="text-[10px] font-black text-slate-500">{item.label}</span><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full shadow-sm" style={{ width: `${width}%`, background: "linear-gradient(90deg,#a78bfa,#6366f1)" }} /></div><span className="text-right text-[10px] font-black text-slate-700">{item.total}</span></div>;
        }) : <p className="py-10 text-center text-xs font-bold text-slate-400">Belum ada distribusi jam.</p>}
      </div>
    </div>
  );
}

function ProgressBar({ value = 0, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    amber: "bg-amber-500",
    red: "bg-red-600",
  };
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={cx("h-full rounded-full", tones[tone] || tones.blue)} style={{ width: `${safe}%` }} />
      </div>
      <span className="w-8 text-right text-[10px] font-black text-slate-500">{safe}%</span>
    </div>
  );
}

function MiniRankChart({ title, rows, valueKey, tone = "blue" }) {
  const data = safeArray(rows);
  const max = Math.max(...data.map((item) => Number(item[valueKey]) || 0), 1);
  const isDanger = tone === "red";
  const gradient = isDanger ? "linear-gradient(90deg,#fb7185,#ef4444)" : "linear-gradient(90deg,#60a5fa,#2563eb)";
  const soft = isDanger ? "from-rose-50/80 via-white to-white" : "from-blue-50/80 via-white to-white";
  const chip = isDanger ? "bg-rose-50 text-rose-700 ring-rose-100" : "bg-blue-50 text-blue-700 ring-blue-100";
  return (
    <section className={cx("rounded-[1.25rem] border border-slate-100 bg-gradient-to-br p-3 shadow-sm", soft)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Grafik Ranking</p>
          <h3 className="text-base font-black text-slate-950">{title}</h3>
        </div>
        <span className={cx("rounded-xl px-2 py-1 text-[9px] font-black uppercase ring-1", chip)}>{data.length} data</span>
      </div>
      <div className="mt-3 space-y-2.5">
        {data.length ? data.map((item, index) => {
          const value = Number(item[valueKey]) || 0;
          const width = Math.max(value > 0 ? 7 : 2, Math.round((value / max) * 100));
          return (
            <div key={`${title}-${item.id}`} className="rounded-xl bg-white/90 p-2.5 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cx("grid h-5 w-5 shrink-0 place-items-center rounded-md text-[9px] font-black ring-1", chip)}>{index + 1}</span>
                  <span className="truncate text-[11px] font-black text-slate-700">{item.name}</span>
                </div>
                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-black tabular-nums text-slate-700 ring-1 ring-slate-100">{value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                <div className="h-full rounded-full shadow-sm" style={{ width: `${width}%`, background: gradient }} />
              </div>
            </div>
          );
        }) : <p className="rounded-2xl bg-white p-4 text-center text-xs font-bold text-slate-400 ring-1 ring-slate-100">Belum ada data.</p>}
      </div>
    </section>
  );
}

function RekapScreen({ db }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [mode, setMode] = useState("individu");
  const [selectedEmployee, setSelectedEmployee] = useState("semua");
  const [selectedInstansi, setSelectedInstansi] = useState("semua");
  const [selectedRole, setSelectedRole] = useState("semua");
  const [selectedTempat, setSelectedTempat] = useState("semua");
  const [selectedDaerah, setSelectedDaerah] = useState("semua");
  const [selectedDivisi, setSelectedDivisi] = useState("semua");
  const [previewOpen, setPreviewOpen] = useState(false);

  const employeeMap = useMemo(() => {
    const map = new Map();
    safeArray(db.karyawan).forEach((row) => { const id = String(getVal(row, "id") || getVal(row, "userId") || "").trim(); if (id) map.set(id, row); });
    return map;
  }, [db.karyawan]);
  const getEmployee = (row) => employeeMap.get(String(getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "").trim()) || {};
  const getEmployeeName = (row) => getVal(row, "name") || getVal(row, "nama") || getVal(getEmployee(row), "name") || getVal(getEmployee(row), "nama") || getVal(row, "userId") || "-";
  const getEmployeeId = (row) => getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || getVal(row, "id") || "-";
  const getEmployeeRole = (row) => getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || getVal(getEmployee(row), "role") || getVal(getEmployee(row), "divisi") || getVal(getEmployee(row), "devisi") || "Umum";
  const getEmployeeInstansi = (row) => getVal(row, "penempatan") || getVal(row, "site") || getVal(row, "instansi") || getVal(getEmployee(row), "penempatan") || getVal(getEmployee(row), "site") || getVal(getEmployee(row), "instansi") || "Tidak Ada Instansi";
  const getEmployeeDaerah = (row) => getVal(row, "wilayah") || getVal(row, "daerah") || getVal(row, "sumberData") || getVal(row, "importSource") || getVal(getEmployee(row), "wilayah") || getVal(getEmployee(row), "daerah") || getVal(getEmployee(row), "sumberData") || getVal(getEmployee(row), "importSource") || "Tidak Ada Daerah";
  const getEmployeeDivisi = (row) => getVal(row, "divisi") || getVal(row, "devisi") || getVal(row, "department") || getVal(getEmployee(row), "divisi") || getVal(getEmployee(row), "devisi") || getEmployeeRole(row) || "Umum";
  const actionText = (row) => normalize(getAttendanceActionFromRow(row));

  const optionFrom = (values, allLabel) => [{ value: "semua", label: allLabel }, ...Array.from(new Set(values.filter(Boolean))).sort().map((v) => ({ value: v, label: v }))];
  const employeeOptions = useMemo(() => [{ value: "semua", label: "Semua Individu" }, ...safeArray(db.karyawan).map((r) => ({ value: String(getVal(r, "id") || getVal(r, "userId") || ""), label: getVal(r, "name") || getVal(r, "nama") || "Karyawan" })).filter((x) => x.value).sort((a, b) => a.label.localeCompare(b.label))], [db.karyawan]);
  const instansiOptions = useMemo(() => optionFrom([...safeArray(db.absensi).map(getEmployeeInstansi), ...safeArray(db.karyawan).map(getEmployeeInstansi)], "Semua Instansi"), [db.absensi, db.karyawan]);
  const roleOptions = useMemo(() => optionFrom([...safeArray(db.absensi).map(getEmployeeRole), ...safeArray(db.karyawan).map(getEmployeeRole)], "Semua Role"), [db.absensi, db.karyawan]);
  const tempatOptions = useMemo(() => optionFrom([...safeArray(db.absensi).map(getEmployeeInstansi), ...safeArray(db.karyawan).map(getEmployeeInstansi)], "Semua Tempat/Penempatan"), [db.absensi, db.karyawan]);
  const daerahOptions = useMemo(() => optionFrom([...safeArray(db.absensi).map(getEmployeeDaerah), ...safeArray(db.karyawan).map(getEmployeeDaerah)], "Semua Daerah"), [db.absensi, db.karyawan]);
  const divisiOptions = useMemo(() => optionFrom([...safeArray(db.absensi).map(getEmployeeDivisi), ...safeArray(db.karyawan).map(getEmployeeDivisi)], "Semua Divisi"), [db.absensi, db.karyawan]);

  const selectedEmployeeRow = useMemo(() => {
    if (!selectedEmployee || selectedEmployee === "semua") return null;
    return safeArray(db.karyawan).find((row) => String(getVal(row, "id") || getVal(row, "userId") || "").trim() === String(selectedEmployee).trim()) || null;
  }, [db.karyawan, selectedEmployee]);

  const isIndividualLocked = mode === "individu" && selectedEmployee !== "semua" && !!selectedEmployeeRow;
  const autoPlacement = isIndividualLocked ? getEmployeeInstansi(selectedEmployeeRow) : (selectedTempat === "semua" ? "Semua" : selectedTempat);
  const autoArea = isIndividualLocked ? getEmployeeDaerah(selectedEmployeeRow) : (selectedDaerah === "semua" ? "Semua" : selectedDaerah);
  const autoDivision = isIndividualLocked ? getEmployeeDivisi(selectedEmployeeRow) : (selectedDivisi === "semua" ? "Semua" : selectedDivisi);
  const autoRole = isIndividualLocked ? getEmployeeRole(selectedEmployeeRow) : (selectedRole === "semua" ? "Semua" : selectedRole);

  const filteredRows = useMemo(() => {
    const fromMs = dateFrom ? new Date(dateFrom).getTime() : 0;
    const toMs = dateTo ? new Date(dateTo).getTime() + 86400000 - 1 : Infinity;
    return safeArray(db.absensi).filter((row) => {
      const ms = parseMillis(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt"));
      const dateOk = (!fromMs || ms >= fromMs) && (toMs === Infinity || ms <= toMs);
      const mainOk = (mode !== "individu" || selectedEmployee === "semua" || String(getEmployeeId(row)).trim() === selectedEmployee) && (mode !== "instansi" || selectedInstansi === "semua" || getEmployeeInstansi(row) === selectedInstansi) && (mode !== "role" || selectedRole === "semua" || getEmployeeRole(row) === selectedRole);
      const lockedIndividual = mode === "individu" && selectedEmployee !== "semua";
      const extraOk = lockedIndividual || ((selectedTempat === "semua" || getEmployeeInstansi(row) === selectedTempat) && (selectedDaerah === "semua" || getEmployeeDaerah(row) === selectedDaerah) && (selectedDivisi === "semua" || getEmployeeDivisi(row) === selectedDivisi));
      return dateOk && mainOk && extraOk;
    });
  }, [db.absensi, db.karyawan, dateFrom, dateTo, mode, selectedEmployee, selectedInstansi, selectedRole, selectedTempat, selectedDaerah, selectedDivisi]);

  const detailedRows = useMemo(() => filteredRows.slice().sort((a, b) => Number(getVal(b, "timestamp") || parseMillis(getVal(b, "date"))) - Number(getVal(a, "timestamp") || parseMillis(getVal(a, "date")))).map((row) => ({ "ID Karyawan": getEmployeeId(row), "Nama": getEmployeeName(row), "Instansi": getEmployeeInstansi(row), "Daerah": getEmployeeDaerah(row), "Divisi": getEmployeeDivisi(row), "Role": getEmployeeRole(row), "Tanggal": formatDate(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt")), "Jam": getVal(row, "time") || getVal(row, "jam") || "-", "Aksi": getVal(row, "action") || getVal(row, "aksi") || "-", "Status": getVal(row, "latenessStatus") || getVal(row, "status") || (isLate(row) ? "Terlambat" : "Tercatat"), "Lokasi": getVal(row, "location") || getVal(row, "lokasi") || "-" })), [filteredRows, db.karyawan]);
  const dailyRows = useMemo(() => {
    const map = new Map();
    filteredRows.slice().sort((a, b) => Number(getVal(a, "timestamp") || parseMillis(getVal(a, "date"))) - Number(getVal(b, "timestamp") || parseMillis(getVal(b, "date")))).forEach((row) => {
      const dateLabel = formatDate(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt"));
      const key = `${getEmployeeId(row)}|${dateLabel}`;
      const prev = map.get(key) || { "ID Karyawan": getEmployeeId(row), Nama: getEmployeeName(row), Instansi: getEmployeeInstansi(row), Daerah: getEmployeeDaerah(row), Divisi: getEmployeeDivisi(row), Role: getEmployeeRole(row), Tanggal: dateLabel, Masuk: "-", Istirahat: "-", Pulang: "-", Libur: "-", Terlambat: "Tidak", "Total Catatan": 0, "Catatan Waktu": "" };
      const action = actionText(row); const label = getVal(row, "action") || getVal(row, "aksi") || "Absensi"; const time = getVal(row, "time") || getVal(row, "jam") || "-";
      prev["Total Catatan"] += 1; prev["Catatan Waktu"] = [prev["Catatan Waktu"], `${label}: ${time}`].filter(Boolean).join(" | "); if (isLate(row)) prev.Terlambat = "Ya";
      if (action.includes("masuk") && !action.includes("istirahat")) prev.Masuk = prev.Masuk === "-" ? time : `${prev.Masuk}, ${time}`; else if (action.includes("pulang")) prev.Pulang = prev.Pulang === "-" ? time : `${prev.Pulang}, ${time}`; else if (action.includes("istirahat")) prev.Istirahat = prev.Istirahat === "-" ? `${label}: ${time}` : `${prev.Istirahat} | ${label}: ${time}`; else if (action.includes("libur")) prev.Libur = prev.Libur === "-" ? time : `${prev.Libur}, ${time}`;
      map.set(key, prev);
    });
    return Array.from(map.values());
  }, [filteredRows, db.karyawan]);
  const lateRows = useMemo(() => detailedRows.filter((r) => normalize(getVal(r, "Status")).includes("terlambat")), [detailedRows]);
  const grouped = useMemo(() => {
    const map = new Map();
    filteredRows.forEach((row) => {
      const key = mode === "individu" ? `${getEmployeeName(row)} • ${getEmployeeId(row)}` : mode === "instansi" ? getEmployeeInstansi(row) : getEmployeeRole(row);
      const prev = map.get(key) || { key, total: 0, hariSet: new Set(), masuk: 0, pulang: 0, istirahat: 0, libur: 0, terlambat: 0 };
      prev.total += 1; prev.hariSet.add(formatDate(getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt"))); if (isLate(row)) prev.terlambat += 1;
      const action = actionText(row); if (action.includes("masuk")) prev.masuk += 1; if (action.includes("pulang")) prev.pulang += 1; if (action.includes("istirahat")) prev.istirahat += 1; if (action.includes("libur")) prev.libur += 1;
      map.set(key, prev);
    });
    return Array.from(map.values()).map((r) => ({ ...r, hari: r.hariSet.size })).sort((a, b) => b.total - a.total);
  }, [filteredRows, mode]);

  const reportTitle = mode === "individu" ? "Rekap Individu" : mode === "instansi" ? "Rekap Instansi" : "Rekap Role";
  const selectedLabel = mode === "individu" ? employeeOptions.find((o) => o.value === selectedEmployee)?.label : mode === "instansi" ? selectedInstansi : selectedRole;
  const fileSuffix = `${mode}-${dateFrom || "awal"}-${dateTo || "akhir"}`;
  const activeFilters = [`Mode: ${reportTitle}`, `Tanggal: ${dateFrom || "Awal data"} s/d ${dateTo || "Akhir data"}`, `Utama: ${selectedLabel || "Semua"}`, `Penempatan: ${autoPlacement}`, `Daerah: ${autoArea}`, `Divisi: ${autoDivision}`].join(" • ");
  const summaryRows = grouped.map((r) => ({ Kategori: r.key, "Total Catatan": r.total, "Hari Tercatat": r.hari, "Absen Masuk": r.masuk, "Absen Pulang": r.pulang, Istirahat: r.istirahat, "Absen Libur": r.libur, Terlambat: r.terlambat }));
  const infoRows = [{ Keterangan: "Perusahaan", Nilai: COMPANY_NAME }, { Keterangan: "Judul Laporan", Nilai: reportTitle }, { Keterangan: "Periode", Nilai: `${dateFrom || "Awal data"} s/d ${dateTo || "Akhir data"}` }, { Keterangan: "Filter Utama", Nilai: selectedLabel || "Semua" }, { Keterangan: "Tempat/Penempatan", Nilai: autoPlacement }, { Keterangan: "Daerah", Nilai: autoArea }, { Keterangan: "Divisi", Nilai: autoDivision }, { Keterangan: "Role", Nilai: autoRole }, { Keterangan: "Total Catatan", Nilai: filteredRows.length }, { Keterangan: "Tanggal Cetak", Nilai: new Date().toLocaleString("id-ID") }];
  const reportConfig = { title: `Hasil Laporan ${reportTitle}`, subtitle: activeFilters, infoRows, sections: [{ title: "Hasil Rekap", columns: ["Kategori", "Total Catatan", "Hari Tercatat", "Absen Masuk", "Absen Pulang", "Istirahat", "Absen Libur", "Terlambat"], rows: summaryRows }, { title: "Rekap Harian Per Karyawan", columns: ["ID Karyawan", "Nama", "Instansi", "Daerah", "Divisi", "Role", "Tanggal", "Masuk", "Istirahat", "Pulang", "Libur", "Terlambat", "Total Catatan", "Catatan Waktu"], rows: dailyRows }, { title: "Detail Absensi Mentah", columns: ["ID Karyawan", "Nama", "Instansi", "Daerah", "Divisi", "Role", "Tanggal", "Jam", "Aksi", "Status", "Lokasi"], rows: detailedRows }, { title: "Detail Keterlambatan", columns: ["ID Karyawan", "Nama", "Instansi", "Daerah", "Divisi", "Role", "Tanggal", "Jam", "Aksi", "Status", "Lokasi"], rows: lateRows }] };

  const downloadSummary = () => exportStyledExcel(`laporan-rekap-ringkasan-${fileSuffix}.xls`, { title: `Ringkasan ${reportTitle}`, subtitle: activeFilters, infoRows, sections: [{ title: "Ringkasan Rekap", columns: ["Kategori", "Total Catatan", "Hari Tercatat", "Absen Masuk", "Absen Pulang", "Istirahat", "Absen Libur", "Terlambat"], rows: summaryRows }] });
  const downloadDetail = () => exportStyledExcel(`laporan-rekap-detail-${fileSuffix}.xls`, { title: `Detail ${reportTitle}`, subtitle: activeFilters, infoRows, sections: [{ title: "Detail Absensi", columns: ["ID Karyawan", "Nama", "Instansi", "Daerah", "Divisi", "Role", "Tanggal", "Jam", "Aksi", "Status", "Lokasi"], rows: detailedRows }] });
  const downloadLate = () => exportStyledExcel(`laporan-rekap-terlambat-${fileSuffix}.xls`, { title: `Rekap Keterlambatan ${reportTitle}`, subtitle: activeFilters, infoRows: [...infoRows, { Keterangan: "Total Terlambat", Nilai: lateRows.length }], sections: [{ title: "Detail Keterlambatan", columns: ["ID Karyawan", "Nama", "Instansi", "Daerah", "Divisi", "Role", "Tanggal", "Jam", "Aksi", "Status", "Lokasi"], rows: lateRows }] });
  const downloadReportExcel = () => exportStyledExcel(`hasil-laporan-rekap-${fileSuffix}.xls`, reportConfig);
  const downloadReportPdf = () => exportStyledPdf(`hasil-laporan-rekap-${fileSuffix}.pdf`, reportConfig);
  const resetFilters = () => { setDateFrom(""); setDateTo(""); setMode("individu"); setSelectedEmployee("semua"); setSelectedInstansi("semua"); setSelectedRole("semua"); setSelectedTempat("semua"); setSelectedDaerah("semua"); setSelectedDivisi("semua"); };

  const compactInputClass = "h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";
  const compactLabelClass = "mb-1 block text-[8px] font-black uppercase tracking-[0.12em] text-slate-400";

  const rekapFilterPanel = (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
      <label className="block">
        <span className={compactLabelClass}>Tanggal Awal</span>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={compactInputClass} />
      </label>
      <label className="block">
        <span className={compactLabelClass}>Tanggal Akhir</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={compactInputClass} />
      </label>
    </div>
  );

  return (
    <div className="space-y-3">
      <ReportExportModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        config={reportConfig}
        onPdf={downloadReportPdf}
        onExcel={downloadReportExcel}
        filters={{
          dateFrom,
          setDateFrom,
          dateTo,
          setDateTo,
          mode,
          setMode,
          selectedEmployee,
          setSelectedEmployee,
          selectedInstansi,
          setSelectedInstansi,
          selectedRole,
          setSelectedRole,
          selectedTempat,
          setSelectedTempat,
          selectedDaerah,
          setSelectedDaerah,
          selectedDivisi,
          setSelectedDivisi,
          employeeOptions,
          instansiOptions,
          roleOptions,
          tempatOptions,
          daerahOptions,
          divisiOptions,
          selectedEmployeeProfile: selectedEmployeeRow,
          autoPlacement,
          autoArea,
          autoDivision,
          autoRole,
          resetFilters,
        }}
      />
      <section id="rekap-filter-panel" className="overflow-hidden rounded-[1rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-2 p-2 xl:grid-cols-[minmax(0,1fr)_300px_160px] xl:items-end">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">Top Tools Rekap</p>
            <h3 className="text-sm font-black text-slate-950">Pusat Rekap Absensi</h3>
            <div className="mt-2">{rekapFilterPanel}</div>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100">
            {[{ id: "individu", label: "Individu", icon: Users }, { id: "instansi", label: "Instansi", icon: Briefcase }, { id: "role", label: "Role", icon: IdCard }].map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return <button key={item.id} onClick={() => setMode(item.id)} className={cx("inline-flex min-h-[32px] items-center justify-center gap-1 rounded-lg px-2 text-[9px] font-black transition", active ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100" : "text-slate-500 hover:bg-white/70 hover:text-slate-800")}><Icon size={13} /> {item.label}</button>;
            })}
          </div>
          <aside className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-blue-600">Output</p>
            <p className="mt-0.5 text-xs font-black text-slate-950">PDF / Excel</p>
            <div className="mt-2 grid gap-1.5">
              <button onClick={() => setPreviewOpen(true)} disabled={!filteredRows.length} className="inline-flex min-h-[32px] items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-[10px] font-black text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"><Eye size={12} /> Preview</button>
              <button onClick={resetFilters} className="inline-flex min-h-[28px] items-center justify-center rounded-lg bg-white px-2.5 text-[10px] font-black text-slate-700 ring-1 ring-slate-200">Reset</button>
            </div>
          </aside>
        </div>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Total Catatan" value={filteredRows.length} icon={FileCheck2} tone="blue" /><StatCard label="Absen Masuk" value={filteredRows.filter((r) => actionText(r).includes("masuk")).length} icon={Clock3} tone="emerald" /><StatCard label="Absen Pulang" value={filteredRows.filter((r) => actionText(r).includes("pulang")).length} icon={CheckCircle2} tone="blue" /><StatCard label="Terlambat" value={filteredRows.filter(isLate).length} icon={AlertCircle} tone="red" /><StatCard label="Absen Libur" value={filteredRows.filter((r) => actionText(r).includes("libur")).length} icon={CalendarDays} tone="amber" /></div>
    </div>
  );
}

function normalizeScheduleRow(row, index = 0) {
  const fallback = DEFAULT_WORK_SCHEDULES[index] || DEFAULT_WORK_SCHEDULES[0];
  const divisiDb = getVal(row, "divisi") || getVal(row, "Divisi") || getVal(row, "roleTarget") || getVal(row, "targetRole");
  const bagianDb = getVal(row, "bagianSmart") || getVal(row, "bagian") || getVal(row, "Bagian") || getVal(row, "namaBagian");
  const shiftDb = getVal(row, "namaShift") || getVal(row, "shift") || getVal(row, "namaJadwal") || getVal(row, "aksiAbsensi") || getVal(row, "aksiTarget");
  const jenisDb = getVal(row, "jenisJadwal") || getVal(row, "jenis") || getVal(row, "tipe") || (String(shiftDb || "").toLowerCase().includes("shift") ? "Shift" : "Reguler");
  return {
    id: getVal(row, "id") || getVal(row, "ID") || getVal(row, "kode") || getVal(row, "key") || `${normalizeCode(divisiDb || fallback.targetRole || "umum")}-${normalizeCode(shiftDb || fallback.aksiTarget || index + 1)}-${index}`,
    bagian: bagianDb || divisiDb || fallback.bagian || "Umum",
    targetRole: divisiDb || getVal(row, "role") || fallback.targetRole || "Umum",
    jenisJadwal: jenisDb || fallback.jenisJadwal || "Reguler",
    aksiTarget: shiftDb || getVal(row, "action") || getVal(row, "aksi") || fallback.aksiTarget || "Absen Masuk",
    jamMasuk: getVal(row, "jamMasuk") || getVal(row, "jam_masuk") || getVal(row, "masuk") || getVal(row, "mulai") || fallback.jamMasuk || "07:00",
    toleransiMenit: String(getVal(row, "toleransiMenit") || getVal(row, "toleransi") || getVal(row, "toleransi_menit") || fallback.toleransiMenit || "15"),
    jamIstirahatKeluar: getVal(row, "jamIstirahatKeluar") || getVal(row, "istirahatKeluar") || getVal(row, "istirahat_keluar") || fallback.jamIstirahatKeluar || "",
    jamIstirahatMasuk: getVal(row, "jamIstirahatMasuk") || getVal(row, "istirahatMasuk") || getVal(row, "istirahat_masuk") || fallback.jamIstirahatMasuk || "",
    jamPulang: getVal(row, "jamPulang") || getVal(row, "jam_pulang") || getVal(row, "pulang") || fallback.jamPulang || "16:00",
    jamPenutup: getVal(row, "jamPenutup") || getVal(row, "jam_penutup") || getVal(row, "penutup") || fallback.jamPenutup || "22:00",
    melewatiTengahMalam: getVal(row, "melewatiTengahMalam") || getVal(row, "lintasHari") || getVal(row, "overnight") || "",
    hariKerja: getVal(row, "hariKerja") || getVal(row, "hari_kerja") || "",
    status: getVal(row, "status") || fallback.status || "Aktif",
    catatan: getVal(row, "catatan") || getVal(row, "notes") || fallback.catatan || "",
  };
}

function ScheduleFieldLabel({ children }) {
  return (
    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
      {children}
    </p>
  );
}

function scheduleTone(index) {
  const tones = [
    { shell: "border-blue-100 bg-blue-50/35", icon: "bg-blue-600 text-white", chip: "bg-blue-50 text-blue-700 ring-blue-100" },
    { shell: "border-emerald-100 bg-emerald-50/35", icon: "bg-emerald-600 text-white", chip: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    { shell: "border-amber-100 bg-amber-50/35", icon: "bg-amber-500 text-white", chip: "bg-amber-50 text-amber-700 ring-amber-100" },
    { shell: "border-violet-100 bg-violet-50/35", icon: "bg-violet-600 text-white", chip: "bg-violet-50 text-violet-700 ring-violet-100" },
    { shell: "border-slate-200 bg-slate-50/70", icon: "bg-slate-900 text-white", chip: "bg-slate-50 text-slate-700 ring-slate-200" },
  ];
  return tones[index % tones.length];
}

function JamKerjaScreen({ db, notify, refresh, admin }) {
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [rows, setRows] = useState(() => {
    const source = safeArray(db.jam_kerja).length ? db.jam_kerja : readCache(WORK_SCHEDULE_STORAGE_KEY, DEFAULT_WORK_SCHEDULES);
    return safeArray(source).length ? safeArray(source).map(normalizeScheduleRow) : DEFAULT_WORK_SCHEDULES.map(normalizeScheduleRow);
  });
  const [openIds, setOpenIds] = useState([]);

  useEffect(() => {
    if (!safeArray(db.jam_kerja).length) return;
    setRows(safeArray(db.jam_kerja).map(normalizeScheduleRow));
  }, [db.jam_kerja]);

  const activeCount = rows.filter((row) => normalize(row.status) === "aktif").length;
  const shiftCount = rows.filter((row) => normalize(row.jenisJadwal).includes("shift") || normalize(row.aksiTarget).includes("shift")).length;
  const patrolCount = rows.filter((row) => normalize(row.jenisJadwal).includes("patroli") || normalize(row.aksiTarget).includes("patroli")).length;

  const roleOptions = useMemo(() => [
    { value: "semua", label: "Semua Role" },
    ...Array.from(new Set(rows.map((row) => row.targetRole || "Umum"))).sort().map((value) => ({ value, label: value })),
  ], [rows]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const hay = `${row.bagian} ${row.targetRole} ${row.jenisJadwal} ${row.aksiTarget} ${row.catatan}`.toLowerCase();
    const roleOk = roleFilter === "semua" || row.targetRole === roleFilter;
    const statusOk = statusFilter === "semua" || normalize(row.status) === normalize(statusFilter);
    const searchOk = !query || hay.includes(query.toLowerCase());
    return roleOk && statusOk && searchOk;
  }), [rows, query, roleFilter, statusFilter]);

  const setCell = (id, key, value) => setRows((prev) => prev.map((row) => row.id === id ? { ...row, [key]: value } : row));
  const isOpen = (id) => openIds.includes(id);
  const toggleOpen = (id) => setOpenIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

  const resetDefault = () => {
    const nextRows = DEFAULT_WORK_SCHEDULES.map(normalizeScheduleRow);
    setRows(nextRows);
    setOpenIds([]);
  };

  const addRow = () => {
    const next = normalizeScheduleRow({
      id: `custom-${Date.now()}`,
      bagian: "Bagian Baru",
      targetRole: "Khusus",
      jenisJadwal: "Reguler",
      aksiTarget: "Absen Masuk",
      jamMasuk: "07:00",
      toleransiMenit: "15",
      jamIstirahatKeluar: "12:00",
      jamIstirahatMasuk: "13:00",
      jamPulang: "16:00",
      jamPenutup: "22:00",
      status: "Aktif",
      catatan: "",
    }, rows.length);
    setRows((prev) => [...prev, next]);
    setOpenIds((prev) => [...prev, next.id]);
  };

  const removeRow = (id) => {
    setRows((prev) => prev.length <= 1 ? prev : prev.filter((row) => row.id !== id));
    setOpenIds((prev) => prev.filter((item) => item !== id));
  };

  const saveSchedules = async () => {
    const clean = rows.map((row, index) => normalizeScheduleRow({ ...row, urutan: index + 1 }, index));
    setSaving(true);
    try {
      writeCache(WORK_SCHEDULE_STORAGE_KEY, clean);
      await apiPost({
        action: "save_jam_kerja",
        jam_kerja: clean,
        schedules: clean,
        actor: admin?.name || admin?.username || "Admin",
        updatedAt: new Date().toISOString(),
      });
      notify("Pengaturan jam kerja berhasil disimpan.");
      refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal menyimpan jam kerja.", "error");
    } finally {
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setRoleFilter("semua");
    setStatusFilter("semua");
  };

  const inputClass = "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "mb-1 block text-[8px] font-black uppercase tracking-[0.14em] text-slate-400";

  const summaryCards = [
    { label: "Total Jadwal", value: rows.length, icon: FileCheck2, tone: "blue", note: `${filteredRows.length} tampil` },
    { label: "Jadwal Aktif", value: activeCount, icon: CheckCircle2, tone: "emerald", note: "Siap dipakai" },
    { label: "Mode Shift", value: shiftCount, icon: Clock3, tone: "violet", note: "Shift/pulang shift" },
    { label: "Patroli", value: patrolCount, icon: Activity, tone: "amber", note: "Checkpoint" },
  ];

  return (
    <div className="space-y-3">
      <section className="overflow-hidden rounded-[1.4rem] bg-white shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-3 p-4 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-center">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              <Clock3 size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-600">Setting Absensi</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">Jam Kerja</h3>
              <p className="mt-1 max-w-3xl text-xs font-semibold leading-relaxed text-slate-500">
                Tampilan dibuat lebih adem: kartu putih, aksen biru tipis, status jelas, dan detail edit hanya muncul saat kartu dibuka.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <button onClick={addRow} className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-50">
              Tambah
            </button>
            <button onClick={resetDefault} className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
              Default
            </button>
            <button onClick={saveSchedules} disabled={saving} className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          const toneMap = {
            blue: "bg-blue-50 text-blue-700 ring-blue-100",
            emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
            violet: "bg-violet-50 text-violet-700 ring-violet-100",
            amber: "bg-amber-50 text-amber-700 ring-amber-100",
          };
          return (
            <div key={item.label} className="rounded-[1.15rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-400">{item.note}</p>
                </div>
                <div className={cx("grid h-10 w-10 place-items-center rounded-2xl ring-1", toneMap[item.tone])}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-[1.25rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_180px_170px_92px] lg:items-end">
          <label className="relative block">
            <span className={labelClass}>Cari Jadwal</span>
            <Search className="absolute left-3 top-[29px] text-slate-400" size={14} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari bagian, role, aksi, catatan..." className={`${inputClass} pl-9`} />
          </label>
          <label className="block">
            <span className={labelClass}>Role</span>
            <Select value={roleFilter} onChange={setRoleFilter} options={roleOptions} className="h-9 min-h-[36px] w-full rounded-lg text-xs" />
          </label>
          <label className="block">
            <span className={labelClass}>Status</span>
            <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: "semua", label: "Semua Status" }, { value: "Aktif", label: "Aktif" }, { value: "Nonaktif", label: "Nonaktif" }]} className="h-9 min-h-[36px] w-full rounded-lg text-xs" />
          </label>
          <button onClick={resetFilters} className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-white px-3 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">Reset</button>
        </div>
      </section>

      <section className="space-y-2">
        {filteredRows.map((row, index) => {
          const expanded = isOpen(row.id);
          const active = normalize(row.status) === "aktif";
          const tone = scheduleTone(index);
          return (
            <article key={row.id} className="overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
              <button type="button" onClick={() => toggleOpen(row.id)} className="grid w-full gap-3 p-3 text-left transition hover:bg-slate-50/80 lg:grid-cols-[minmax(230px,1.25fr)_minmax(120px,0.7fr)_repeat(3,minmax(86px,0.45fr))_112px_30px] lg:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black ring-1", tone.chip)}>{index + 1}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{row.bagian || "Bagian Baru"}</p>
                    <p className="mt-0.5 truncate text-[11px] font-bold text-slate-400">{row.targetRole || "Role"} • {row.jenisJadwal || "Reguler"}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                  <p className="text-[8px] font-black uppercase text-slate-400">Aksi</p>
                  <p className="mt-0.5 truncate text-xs font-black text-slate-700">{row.aksiTarget || "-"}</p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400">Masuk</p>
                  <p className="mt-0.5 text-sm font-black tabular-nums text-slate-950">{row.jamMasuk || "--:--"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400">Pulang</p>
                  <p className="mt-0.5 text-sm font-black tabular-nums text-slate-950">{row.jamPulang || "--:--"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400">Toleransi</p>
                  <p className="mt-0.5 text-sm font-black text-slate-950">{row.toleransiMenit || 0} menit</p>
                </div>

                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400">Status</p>
                  <Badge tone={active ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-50 text-slate-600 ring-slate-200"}>{row.status || "Aktif"}</Badge>
                </div>

                <ChevronRight className={cx("justify-self-end text-slate-300 transition", expanded && "rotate-90 text-blue-600")} size={18} />
              </button>

              {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-3">
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                    <label><span className={labelClass}>Bagian</span><input value={row.bagian} onChange={(e) => setCell(row.id, "bagian", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Role Target</span><input value={row.targetRole} onChange={(e) => setCell(row.id, "targetRole", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Jenis Jadwal</span><select value={row.jenisJadwal} onChange={(e) => setCell(row.id, "jenisJadwal", e.target.value)} className={inputClass}><option>Reguler</option><option>Shift</option><option>Pulang Shift</option><option>Patroli</option><option>Khusus</option></select></label>
                    <label><span className={labelClass}>Aksi Absensi</span><input value={row.aksiTarget} onChange={(e) => setCell(row.id, "aksiTarget", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Jam Masuk</span><input type="time" value={row.jamMasuk} onChange={(e) => setCell(row.id, "jamMasuk", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Jam Pulang</span><input type="time" value={row.jamPulang} onChange={(e) => setCell(row.id, "jamPulang", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Toleransi</span><input type="number" min="0" value={row.toleransiMenit} onChange={(e) => setCell(row.id, "toleransiMenit", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Jam Penutup</span><input type="time" value={row.jamPenutup} onChange={(e) => setCell(row.id, "jamPenutup", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Istirahat Keluar</span><input type="time" value={row.jamIstirahatKeluar} onChange={(e) => setCell(row.id, "jamIstirahatKeluar", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Istirahat Masuk</span><input type="time" value={row.jamIstirahatMasuk} onChange={(e) => setCell(row.id, "jamIstirahatMasuk", e.target.value)} className={inputClass} /></label>
                    <label><span className={labelClass}>Status</span><select value={row.status} onChange={(e) => setCell(row.id, "status", e.target.value)} className={inputClass}><option>Aktif</option><option>Nonaktif</option></select></label>
                    <label className="md:col-span-2 xl:col-span-4"><span className={labelClass}>Catatan</span><input value={row.catatan} onChange={(e) => setCell(row.id, "catatan", e.target.value)} className={inputClass} /></label>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => removeRow(row.id)} disabled={rows.length <= 1} className="inline-flex min-h-[34px] items-center gap-2 rounded-xl bg-red-50 px-3 text-xs font-black text-red-700 ring-1 ring-red-100 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:ring-slate-200"><Trash2 size={13} /> Hapus</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
        {!filteredRows.length && <EmptyState title="Jadwal tidak ditemukan" text="Coba reset filter atau tambah jadwal baru." />}
      </section>

      <section className="rounded-[1.15rem] bg-blue-50 px-4 py-3 ring-1 ring-blue-100">
        <p className="text-xs font-bold leading-relaxed text-blue-800">Saran: cukup buka kartu yang ingin diedit, ubah jamnya, lalu klik <span className="font-black">Simpan</span>. Kartu lain tetap tertutup agar halaman ringan dan bersih.</p>
      </section>
    </div>
  );
}

function LaporanScreen({ db, setSelected, notify, refresh, admin }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("semua");

  const getReportTitle = (row) => getVal(row, "title") || getVal(row, "judul") || getVal(row, "judulLaporan") || "Laporan Kerja";
  const getReportBody = (row) => getVal(row, "isiLaporan") || getVal(row, "content") || getVal(row, "uraian") || getVal(row, "text") || getVal(row, "isi") || getVal(row, "laporan") || getVal(row, "body") || getVal(row, "message") || "-";
  const getReportName = (row) => getVal(row, "nama") || getVal(row, "name") || getVal(row, "userId") || "-";
  const getReportDate = (row) => getVal(row, "tanggal") || getVal(row, "date") || getVal(row, "createdAt") || "";

  const rows = useMemo(() => safeArray(db.laporan).filter((row) => {
    const hay = `${getReportName(row)} ${getReportTitle(row)} ${getReportBody(row)} ${getVal(row, "penempatan")} ${getVal(row, "area")} ${displayReportStatus(row)}`.toLowerCase();
    const st = normalize(displayReportStatus(row));
    return (!search || hay.includes(search.toLowerCase())) && (status === "semua" || st.includes(status));
  }).sort((a, b) => Number(getVal(b, "timestamp") || parseMillis(getVal(b, "updatedAt") || getVal(b, "createdAt") || getVal(b, "date") || getVal(b, "tanggal"))) - Number(getVal(a, "timestamp") || parseMillis(getVal(a, "updatedAt") || getVal(a, "createdAt") || getVal(a, "date") || getVal(a, "tanggal")))), [db.laporan, search, status]);

  const updateReportStatus = async (row, nextStatus) => {
    const note = window.prompt(`Catatan review laporan untuk status ${nextStatus}?`, getVal(row, "reviewNote") || "");
    if (note === null) return;
    try {
      await apiPost({
        action: "update_laporan_status",
        id: getVal(row, "id") || getVal(row, "laporanId") || getVal(row, "reportId") || getVal(row, "recordId"),
        status: nextStatus,
        reportStatus: nextStatus,
        reviewNote: note,
        adminNote: note,
        actor: admin?.name || admin?.username || "Admin",
      });
      notify(`Status laporan diubah menjadi ${nextStatus}.`);
      refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal update status laporan.", "error");
    }
  };

  return (
    <div className="space-y-4">
      <SearchBar search={search} setSearch={setSearch} placeholder="Cari laporan, nama, area, isi laporan..." right={<div className="grid gap-2 sm:grid-cols-2 lg:flex"><Select value={status} onChange={setStatus} options={[{ value: "semua", label: "Semua Status" }, { value: "baru", label: "Laporan Baru" }, { value: "diproses", label: "Diproses" }, { value: "selesai", label: "Selesai" }, { value: "ditolak", label: "Ditolak" }]} /><button onClick={() => exportCsv("laporan-karsa.csv", rows)} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-black text-white"><Download size={16} /> CSV</button></div>} />
      <div className="grid gap-3 xl:grid-cols-2">
        {rows.map((row, idx) => <ReportCard key={getVal(row, "id") || idx} row={row} onClick={() => setSelected({ type: "laporan", row })} onStatusChange={(nextStatus) => updateReportStatus(row, nextStatus)} />)}
      </div>
      {!rows.length && <EmptyState title="Belum ada laporan" text="Laporan dari karsa_absensi/laporan akan tampil di sini." />}
    </div>
  );
}

function ReportCard({ row, onClick, onStatusChange }) {
  const title = getVal(row, "title") || getVal(row, "judul") || getVal(row, "judulLaporan") || "Laporan Kerja";
  const body = getVal(row, "isiLaporan") || getVal(row, "content") || getVal(row, "uraian") || getVal(row, "text") || getVal(row, "isi") || getVal(row, "laporan") || "-";
  const name = getVal(row, "nama") || getVal(row, "name") || getVal(row, "userId") || "-";
  const date = getVal(row, "tanggal") || getVal(row, "date") || getVal(row, "createdAt");
  const time = getVal(row, "time") || getVal(row, "jam") || "-";
  const hasProof = Boolean(getRecordFileUrl(row, "laporan") || getRecordPhoto(row, "laporan"));
  return (
    <div className="rounded-[2rem] bg-white p-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">
      <button onClick={onClick} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-base font-black text-slate-950">{title}</p>
            <p className="mt-1 text-xs font-bold text-slate-400">{name} • {formatDate(date)} • {time}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end"><Badge tone={statusTone(displayReportStatus(row))}>{displayReportStatus(row)}</Badge><OfflineSyncBadges row={row} compact /></div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[92px_1fr]">
          <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-100">
            <EvidenceThumbnail row={row} type="laporan" size="sm" />
            <p className="mt-1 text-center text-[9px] font-black uppercase tracking-wide text-slate-400">{hasProof ? "Bukti" : "Kosong"}</p>
          </div>
          <p className="line-clamp-3 rounded-2xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-600 ring-1 ring-slate-100">{body}</p>
        </div>
      </button>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={() => onStatusChange?.("Diproses")} className="rounded-2xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100 hover:bg-blue-100">Diproses</button>
        <button type="button" onClick={() => onStatusChange?.("Selesai")} className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100">Selesai</button>
        <button type="button" onClick={() => onStatusChange?.("Ditolak")} className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 ring-1 ring-red-100 hover:bg-red-100">Tolak</button>
      </div>
    </div>
  );
}

function CutiScreen({ db, setSelected, onDecision }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("semua");
  const [letterTarget, setLetterTarget] = useState(null);
  const [approvalSigner, setApprovalSigner] = useState(() => readCache(LEAVE_APPROVAL_SIGNER_STORAGE_KEY, { nama: "", jabatan: "" }));

  const openLeaveLetterSigner = (row) => setLetterTarget(row);
  const closeLeaveLetterSigner = () => setLetterTarget(null);
  const updateApprovalSigner = (key, value) => setApprovalSigner((prev) => ({ ...prev, [key]: value }));
  const confirmLeaveLetterSigner = () => {
    const clean = {
      nama: String(approvalSigner.nama || "").trim(),
      jabatan: String(approvalSigner.jabatan || "").trim(),
    };
    writeCache(LEAVE_APPROVAL_SIGNER_STORAGE_KEY, clean);
    previewLeaveApprovalLetter(letterTarget, {
      approvalDate: new Date(),
      approvalName: clean.nama,
      approvalPosition: clean.jabatan,
    });
    setLetterTarget(null);
  };

  const normalizeLeaveDisplay = (row, source = "cuti", forced = {}) => {
    const id = getVal(row, "id") || getVal(row, "cutiId") || getVal(row, "leaveId") || getVal(row, "recordId") || getLeaveHistoryKey(row);
    const start = getVal(row, "start") || getVal(row, "dateStart") || getVal(row, "tanggalMulai") || getVal(row, "date") || getVal(row, "tanggal") || getVal(row, "createdAt") || "";
    const end = getVal(row, "end") || getVal(row, "dateEnd") || getVal(row, "tanggalSelesai") || start;
    const type = getVal(row, "type") || getVal(row, "jenisCuti") || getVal(row, "jenis") || getVal(row, "requestCategory") || getVal(row, "leaveGroup") || forced.type || "Cuti/Izin";
    return {
      ...row,
      ...forced,
      id,
      cutiId: getVal(row, "cutiId") || id,
      leaveId: getVal(row, "leaveId") || id,
      userId: getVal(row, "userId") || getVal(row, "idKaryawan") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || forced.userId || "-",
      idKaryawan: getVal(row, "idKaryawan") || getVal(row, "userId") || getVal(row, "employeeId") || forced.userId || "-",
      employeeId: getVal(row, "employeeId") || getVal(row, "idKaryawan") || getVal(row, "userId") || forced.userId || "-",
      name: getVal(row, "name") || getVal(row, "nama") || forced.name || "-",
      type,
      jenisCuti: getVal(row, "jenisCuti") || type,
      jenis: getVal(row, "jenis") || type,
      start,
      end,
      dateStart: getVal(row, "dateStart") || start,
      dateEnd: getVal(row, "dateEnd") || end,
      tanggalMulai: getVal(row, "tanggalMulai") || start,
      tanggalSelesai: getVal(row, "tanggalSelesai") || end,
      status: getVal(row, "status") || forced.status || "Menunggu",
      reason: getVal(row, "reason") || getVal(row, "alasan") || getVal(row, "notes") || forced.reason || "-",
      penempatan: getVal(row, "penempatan") || getVal(row, "site") || forced.penempatan || "-",
      requestedDays: getVal(row, "requestedDays") || getVal(row, "requestedWorkdays") || getVal(row, "calendarDays") || "",
      requestedWorkdays: getVal(row, "requestedWorkdays") || "",
      calendarDays: getVal(row, "calendarDays") || "",
      quotaYear: getVal(row, "quotaYear") || "",
      quotaLimit: getVal(row, "quotaLimit") || "",
      annualLeaveUsedBefore: getVal(row, "annualLeaveUsedBefore") || "",
      annualLeaveRemainingBefore: getVal(row, "annualLeaveRemainingBefore") || "",
      annualLeaveRemainingAfter: getVal(row, "annualLeaveRemainingAfter") || "",
      approvedBy: getVal(row, "approvedBy") || forced.approvedBy || "",
      rejectedBy: getVal(row, "rejectedBy") || forced.rejectedBy || "",
      revokedBy: getVal(row, "revokedBy") || forced.revokedBy || "",
      approvedAt: getVal(row, "approvedAt") || forced.approvedAt || "",
      rejectedAt: getVal(row, "rejectedAt") || forced.rejectedAt || "",
      revokedAt: getVal(row, "revokedAt") || forced.revokedAt || "",
      adminName: getVal(row, "adminName") || getVal(row, "updatedBy") || forced.adminName || "",
      adminNote: getVal(row, "adminNote") || forced.adminNote || "",
      _source: source,
    };
  };

  const allRows = useMemo(() => {
    return safeArray(db.cuti)
      .map((row) => normalizeLeaveDisplay(row, "cuti"))
      .sort((a, b) => Number(getVal(b, "timestamp") || parseMillis(getVal(b, "updatedAt") || getVal(b, "createdAt") || getVal(b, "date") || getVal(b, "dateStart") || getVal(b, "start") || getVal(b, "tanggalMulai"))) - Number(getVal(a, "timestamp") || parseMillis(getVal(a, "updatedAt") || getVal(a, "createdAt") || getVal(a, "date") || getVal(a, "dateStart") || getVal(a, "start") || getVal(a, "tanggalMulai"))));
  }, [db.cuti]);

  const rows = useMemo(() => allRows.filter((row) => {
    const hay = `${getVal(row, "name")} ${getVal(row, "userId")} ${getVal(row, "type")} ${getVal(row, "reason")} ${getVal(row, "penempatan")} ${getVal(row, "status")}`.toLowerCase();
    const rawStatus = normalize(getVal(row, "status") || "Menunggu");
    const statusOk =
      status === "semua" ||
      (status === "menunggu" && isPendingLeave(row)) ||
      (status === "disetujui" && isApprovedLeave(row)) ||
      (status === "ditolak" && rawStatus.includes("ditolak")) ||
      (status === "dicabut" && (rawStatus.includes("dicabut") || rawStatus.includes("batal") || rawStatus.includes("revoked")));
    return (!search || hay.includes(search.toLowerCase())) && statusOk;
  }), [allRows, search, status]);

  const stats = useMemo(() => ({
    semua: allRows.length,
    menunggu: allRows.filter(isPendingLeave).length,
    disetujui: allRows.filter(isApprovedLeave).length,
    ditolak: allRows.filter((row) => normalize(getVal(row, "status")).includes("ditolak")).length,
    dicabut: allRows.filter((row) => {
      const raw = normalize(getVal(row, "status"));
      return raw.includes("dicabut") || raw.includes("batal") || raw.includes("revoked");
    }).length,
  }), [allRows]);

  const exportRows = rows.map((row, index) => ({
    No: index + 1,
    "ID Karyawan": getVal(row, "userId") || "-",
    Nama: getVal(row, "name") || "-",
    Jenis: getVal(row, "type") || "Cuti/Izin",
    "Tanggal Mulai": formatDate(getVal(row, "dateStart") || getVal(row, "start")),
    "Tanggal Selesai": formatDate(getVal(row, "dateEnd") || getVal(row, "end")),
    Status: getVal(row, "status") || "Menunggu",
    Admin: getVal(row, "approvedBy") || getVal(row, "rejectedBy") || getVal(row, "revokedBy") || "-",
    "Catatan Admin": getVal(row, "adminNote") || "-",
    Alasan: getVal(row, "reason") || "-",
  }));

  const statusOptions = [
    { value: "semua", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "disetujui", label: "Disetujui / ACC" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dicabut", label: "Dicabut" },
  ];

  const cutiReportConfig = {
    title: "Riwayat Cuti & Izin Karyawan",
    subtitle: "Riwayat tetap tampil setelah disetujui, ditolak, atau dicabut oleh admin.",
    infoRows: [
      { Keterangan: "Perusahaan", Nilai: COMPANY_NAME },
      { Keterangan: "Status Filter", Nilai: statusOptions.find((x) => x.value === status)?.label || "Semua" },
      { Keterangan: "Pencarian", Nilai: search || "Semua" },
      { Keterangan: "Total Tampil", Nilai: rows.length },
      { Keterangan: "Tanggal Cetak", Nilai: new Date().toLocaleString("id-ID") },
    ],
    sections: [{ title: "Detail Riwayat Cuti", columns: ["No", "ID Karyawan", "Nama", "Jenis", "Tanggal Mulai", "Tanggal Selesai", "Status", "Admin", "Catatan Admin", "Alasan"], rows: exportRows }],
  };

  return (
    <div className="space-y-4">
      {letterTarget && (
        <Modal title="Data Pejabat Penyetuju" onClose={closeLeaveLetterSigner}>
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Surat Persetujuan Cuti</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">Isi Nama & Jabatan Pejabat</h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">Data ini otomatis tersimpan di browser Panel Admin, jadi surat berikutnya akan memakai nama dan jabatan yang sama.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Nama Pejabat" value={approvalSigner.nama || ""} onChange={(value) => updateApprovalSigner("nama", value)} placeholder="Contoh: Nama Pejabat" />
              <Input label="Jabatan Pejabat" value={approvalSigner.jabatan || ""} onChange={(value) => updateApprovalSigner("jabatan", value)} placeholder="Contoh: Kepala Dinas" />
            </div>
            <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-xs font-bold leading-relaxed text-blue-800 ring-1 ring-blue-100">
              Tanggal persetujuan akan otomatis memakai tanggal hari ini saat tombol surat dibuka.
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button onClick={closeLeaveLetterSigner} className="min-h-[48px] rounded-2xl bg-white px-4 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">Batal</button>
              <button onClick={confirmLeaveLetterSigner} className="min-h-[48px] rounded-2xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700">Simpan & Buka Surat</button>
            </div>
          </div>
        </Modal>
      )}

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Semua Riwayat" value={stats.semua} icon={CalendarDays} tone="blue" />
        <StatCard label="Menunggu" value={stats.menunggu} icon={Clock3} tone="amber" />
        <StatCard label="Disetujui" value={stats.disetujui} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Ditolak" value={stats.ditolak} icon={AlertCircle} tone="red" />
        <StatCard label="Dicabut" value={stats.dicabut} icon={Trash2} tone="slate" />
      </div>

      <SearchBar search={search} setSearch={setSearch} placeholder="Cari pengajuan cuti, izin, sakit, nama, ID, status..." right={<div className="grid gap-2 sm:grid-cols-3 lg:flex"><Select value={status} onChange={setStatus} options={statusOptions} /><button onClick={() => exportStyledPdf("riwayat-cuti-karsa.pdf", cutiReportConfig)} disabled={!rows.length} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"><Eye size={16} /> Preview</button><button onClick={() => exportStyledExcel("riwayat-cuti-karsa.xls", cutiReportConfig)} disabled={!rows.length} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"><Download size={16} /> Excel</button></div>} />

      <div className="grid gap-3 xl:grid-cols-2">
        {rows.map((row, idx) => <LeaveCard key={getVal(row, "id") || idx} row={row} onClick={() => setSelected({ type: "cuti", row })} onDecision={onDecision} onPrintLetter={() => openLeaveLetterSigner(row)} />)}
      </div>
      {!rows.length && <EmptyState title="Tidak ada riwayat cuti" text="Riwayat akan tetap tampil di sini setelah karyawan mengajukan dan admin memberi keputusan." />}
    </div>
  );
}

function LeaveCard({ row, onClick, onDecision, onPrintLetter }) {
  const statusText = getVal(row, "status") || "Menunggu";
  const rawStatus = normalize(statusText);
  const pending = isPendingLeave(row);
  const approved = isApprovedLeave(row);
  const rejected = rawStatus.includes("ditolak") || rawStatus.includes("rejected");
  const revoked = rawStatus.includes("dicabut") || rawStatus.includes("revoked") || rawStatus.includes("batal") || rawStatus.includes("dibatalkan");
  const typeUi = getLeaveRequestTypeUi(row);
  const TypeIcon = typeUi.icon;

  const decisionBy =
    getVal(row, "approvedBy") ||
    getVal(row, "rejectedBy") ||
    getVal(row, "revokedBy") ||
    getVal(row, "adminName") ||
    getVal(row, "actor") ||
    "Admin";

  const decisionAt =
    getVal(row, "approvedAt") ||
    getVal(row, "rejectedAt") ||
    getVal(row, "revokedAt") ||
    getVal(row, "updatedAt") ||
    getVal(row, "createdAt") ||
    "";

  const statusUi = pending
    ? {
        label: "Menunggu Keputusan",
        note: "Tombol Setujui dan Tolak masih aktif.",
        panel: "bg-amber-50 text-amber-800 ring-amber-100",
        marker: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 ring-amber-100",
        icon: Clock3,
      }
    : approved
      ? {
          label: "Cuti Disetujui",
          note: `Disetujui oleh ${decisionBy}${decisionAt ? ` • ${formatDetailValue("updatedAt", decisionAt)}` : ""}`,
          panel: "bg-emerald-50 text-emerald-800 ring-emerald-100",
          marker: "bg-emerald-600",
          badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
          icon: CheckCircle2,
        }
      : rejected
        ? {
            label: "Cuti Ditolak",
            note: `Ditolak oleh ${decisionBy}${decisionAt ? ` • ${formatDetailValue("updatedAt", decisionAt)}` : ""}`,
            panel: "bg-red-50 text-red-800 ring-red-100",
            marker: "bg-red-600",
            badge: "bg-red-50 text-red-700 ring-red-100",
            icon: AlertCircle,
          }
        : revoked
          ? {
              label: "Cuti Dicabut",
              note: `Dicabut oleh ${decisionBy}${decisionAt ? ` • ${formatDetailValue("updatedAt", decisionAt)}` : ""}`,
              panel: "bg-slate-50 text-slate-800 ring-slate-100",
              marker: "bg-slate-500",
              badge: "bg-slate-50 text-slate-700 ring-slate-200",
              icon: Trash2,
            }
          : {
              label: statusText,
              note: "Status sudah memiliki keputusan.",
              panel: "bg-slate-50 text-slate-800 ring-slate-100",
              marker: "bg-slate-500",
              badge: "bg-slate-50 text-slate-700 ring-slate-200",
              icon: AlertCircle,
            };

  const StatusIcon = statusUi.icon;
  const canApprove = pending;
  const canReject = pending;
  const canRevoke = approved && !revoked;
  const canPrintLetter = approved;

  const disabledButtonClass = "cursor-not-allowed bg-slate-100 text-slate-400 ring-1 ring-slate-200 shadow-none opacity-70";

  return (
    <div className={cx("relative overflow-hidden rounded-[2rem] border bg-white p-4 shadow-sm ring-1", typeUi.shell)}>
      <div className={cx("absolute left-0 top-0 h-full w-1.5", typeUi.marker)} />
      <div className={cx("absolute inset-x-0 top-0 h-1", typeUi.marker)} />

      <button onClick={onClick} className="w-full pl-2 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className={cx("grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-sm", typeUi.marker)}>
              <TypeIcon size={22} strokeWidth={2.6} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={typeUi.badge}>{typeUi.shortLabel}</Badge>
                <Badge tone={statusUi.badge}>{statusText}</Badge>
              </div>
              <p className="mt-2 line-clamp-1 text-base font-black text-slate-950">{typeUi.label}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{getVal(row, "name") || getVal(row, "userId")} • {getVal(row, "start") || getVal(row, "dateStart") || "-"}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <OfflineSyncBadges row={row} compact />
          </div>
        </div>

        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          <div className={cx("flex items-start gap-3 rounded-2xl px-3 py-3 ring-1", typeUi.panel)}>
            <div className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white", typeUi.marker)}>
              <TypeIcon size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-slate-900">Jenis: {typeUi.shortLabel}</p>
              <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-slate-600">{typeUi.description}</p>
            </div>
          </div>

          <div className={cx("flex items-start gap-3 rounded-2xl px-3 py-3 ring-1", statusUi.panel)}>
            <div className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white", statusUi.marker)}>
              <StatusIcon size={17} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-slate-900">{statusUi.label}</p>
              <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-slate-600">{statusUi.note}</p>
              {getVal(row, "adminNote") && <p className="mt-1 text-[11px] font-bold leading-relaxed text-slate-700">Catatan: {getVal(row, "adminNote")}</p>}
            </div>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 rounded-2xl bg-white/82 p-3 text-sm font-semibold leading-relaxed text-slate-600 ring-1 ring-slate-100">{getVal(row, "reason") || "-"}</p>
      </button>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <button
          disabled={!canApprove}
          title={canApprove ? "Setujui pengajuan" : "Pengajuan sudah diputuskan"}
          onClick={() => onDecision(row, "approve_cuti")}
          className={cx(
            "rounded-2xl px-4 py-3 text-xs font-black uppercase transition",
            canApprove ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700" : disabledButtonClass
          )}
        >
          {approved ? "Disetujui" : "Setujui"}
        </button>
        <button
          disabled={!canReject}
          title={canReject ? "Tolak pengajuan" : "Pengajuan sudah diputuskan"}
          onClick={() => onDecision(row, "reject_cuti")}
          className={cx(
            "rounded-2xl px-4 py-3 text-xs font-black uppercase transition",
            canReject ? "bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700" : disabledButtonClass
          )}
        >
          {rejected ? "Ditolak" : "Tolak"}
        </button>
        <button
          disabled={!canRevoke}
          title={canRevoke ? "Cabut cuti yang sudah disetujui" : "Cabut hanya aktif untuk cuti yang sudah disetujui"}
          onClick={() => onDecision(row, "revoke_cuti")}
          className={cx(
            "rounded-2xl px-4 py-3 text-xs font-black uppercase transition",
            canRevoke ? "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800" : disabledButtonClass
          )}
        >
          {revoked ? "Dicabut" : "Cabut"}
        </button>
        <button
          disabled={!canPrintLetter}
          title={canPrintLetter ? "Buka surat persetujuan" : "Surat hanya aktif setelah cuti disetujui"}
          onClick={onPrintLetter}
          className={cx(
            "rounded-2xl px-4 py-3 text-xs font-black uppercase transition",
            canPrintLetter ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700" : disabledButtonClass
          )}
        >
          Surat
        </button>
      </div>
    </div>
  );
}

function makeAdminLetterHtml({ letterType = "Surat Pemberitahuan", nomor = "-", tanggal = "", penerima = "Karyawan", perihal = "", isi = "", lampiranName = "" }) {
  const printDate = tanggal || new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const safeNomor = nomor || `ADM/${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`;
  const safePerihal = perihal || letterType;
  const cleanBody = isi || "Isi surat belum diisi.";

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(letterType)} - ${escapeHtml(penerima)}</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #e5e7eb; font-family: "Times New Roman", Times, serif; color: #111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { position: relative; width: 210mm; height: 297mm; margin: 0 auto; overflow: hidden; background: #fff; padding: 53mm 17mm 38mm 17mm; page-break-after: avoid; break-after: avoid; }
  .letter-header-img { position: absolute; left: 0; top: 0; width: 210mm; height: 52.1mm; object-fit: fill; z-index: 1; display: block; }
  .letter-footer-img { position: absolute; left: 0; bottom: 0; width: 210mm; height: 34mm; object-fit: fill; object-position: bottom center; z-index: 1; display: block; }
  .admin-letter-content { position: relative; z-index: 2; }
  .date-line { text-align: right; font-size: 11.4pt; line-height: 1; margin-bottom: 10mm; }
  .meta { width: 112mm; border-collapse: collapse; margin-bottom: 6mm; font-size: 11.2pt; line-height: 1.14; }
  .meta td { padding: .5mm 0; vertical-align: top; }
  .meta td:nth-child(1) { width: 23mm; }
  .meta td:nth-child(2) { width: 5mm; text-align: center; }
  .to { margin: 0 0 8mm; font-size: 12pt; line-height: 1.22; }
  .body { font-size: 12pt; line-height: 1.35; text-align: justify; white-space: pre-line; }
  .body p { margin: 0 0 7mm; }
  .lampiran { margin-top: 6mm; display: inline-block; border: 1px solid #cbd5e1; padding: 2mm 3mm; font-size: 10pt; font-weight: 700; }
  .approval { display: grid; grid-template-columns: 82mm 62mm; justify-content: space-between; align-items: end; margin-top: 8mm; position: relative; z-index: 5; page-break-inside: avoid; break-inside: avoid; }
  .approval p { margin: 0 0 1.8mm; font-size: 11.2pt; line-height: 1.08; }
  .blank { display: inline-block; width: 38mm; border-bottom: 1px dotted #111; height: 4mm; vertical-align: bottom; }
  .authority-space { height: 16mm; }
  .signature { display: flex; align-items: flex-end; justify-content: center; min-height: 37mm; overflow: visible; }
  .stamp-signature-image { display: block; width: 56mm; max-width: 56mm; height: auto; object-fit: contain; opacity: .98; mix-blend-mode: multiply; filter: contrast(1.06) saturate(1.04); }
  @media print { body { background: #fff; } .page { margin: 0; } }
</style>
</head>
<body>
  <div class="page">
    <img class="letter-header-img" src="${COMPANY_LETTER_HEADER_IMAGE_URL}" alt="" />
    <img class="letter-footer-img" src="${COMPANY_LETTER_FOOTER_IMAGE_URL}" alt="" />
    <div class="admin-letter-content">
    <div class="date-line">Pangkalan Bun, ${escapeHtml(printDate)}</div>
    <table class="meta">
      <tr><td>Nomor</td><td>:</td><td>${escapeHtml(safeNomor)}</td></tr>
      <tr><td>Lampiran</td><td>:</td><td>${lampiranName ? "1 (Satu) Berkas" : "-"}</td></tr>
      <tr><td>Perihal</td><td>:</td><td>${escapeHtml(safePerihal)}</td></tr>
    </table>

    <p class="to">Kepada,<br/>Yth. ${escapeHtml(penerima || "Karyawan")}<br/>Di Tempat</p>
    <div class="body">${escapeHtml(cleanBody)}</div>
    ${lampiranName ? `<div class="lampiran">Lampiran: ${escapeHtml(lampiranName)}</div>` : ""}

    <div class="approval">
      <div>
        <p>Disetujui/ Tidak Disetujui</p>
        <p>Tanggal: <span class="blank"></span></p>
        <p>Pejabat yang berwenang,</p>
        <div class="authority-space"></div>
        <p>Nama: <span class="blank"></span></p>
        <p>Jabatan: <span class="blank"></span></p>
      </div>
      <div class="signature">
        <img class="stamp-signature-image" src="${LEAVE_APPROVAL_SIGNATURE_IMAGE_URL}" alt="Hormat kami, PT. Karsa Sentana Lumbung Sentosa" />
      </div>
    </div>

    </div>
  </div>
</body>
</html>`;
}

function previewAdminLetter(letterData) {
  openPrintablePreview(makeAdminLetterHtml(letterData), letterData?.letterType || "Preview Surat");
}

function parseLeaveDate(value) {
  if (!value) return null;
  let raw = String(value).trim();
  if (raw.startsWith("'")) raw = raw.slice(1);
  const datePart = raw.split("T")[0].split(" ")[0];
  const parts = datePart.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d)) return new Date(y, m - 1, d);
  }
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function formatLongIndoDate(value) {
  const date = parseLeaveDate(value);
  if (!date) return formatDate(value) || "-";
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function addMonthsInclusive(value, months = 3) {
  const date = parseLeaveDate(value) || new Date();
  const end = new Date(date);
  end.setMonth(end.getMonth() + months);
  end.setDate(end.getDate() - 1);
  return toInputDate(end);
}

function getLeaveTypeText(row) {
  return getVal(row, "type") || getVal(row, "jenisCuti") || getVal(row, "jenis") || getVal(row, "requestCategory") || getVal(row, "leaveGroup") || getVal(row, "kategori") || "Cuti/Izin";
}

function isMaternityLeave(row) {
  const type = normalize(getLeaveTypeText(row));
  const reason = normalize(getVal(row, "reason") || getVal(row, "alasan") || getVal(row, "notes"));
  return type.includes("melahir") || type.includes("lahiran") || reason.includes("melahir") || reason.includes("lahiran");
}

function getLeaveStartDate(row) {
  return getVal(row, "start") || getVal(row, "dateStart") || getVal(row, "tanggalMulai") || getVal(row, "tanggal") || getVal(row, "date") || getVal(row, "createdAt") || "";
}

function getLeaveEndDate(row) {
  const start = getLeaveStartDate(row);
  const explicitEnd = getVal(row, "end") || getVal(row, "dateEnd") || getVal(row, "tanggalSelesai");
  if (explicitEnd) return explicitEnd;
  if (isMaternityLeave(row) && start) return addMonthsInclusive(start, 3);
  return start;
}

function countCalendarLeaveDays(startValue, endValue) {
  const start = parseLeaveDate(startValue);
  const end = parseLeaveDate(endValue || startValue);
  if (!start || !end) return "-";
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const b = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

function makeLeaveApprovalLetterHtml(row, options = {}) {
  return makeLeaveApprovalLetterHtmlV2(row, options);
}

function makeLeaveApprovalLetterHtmlV2(row, options = {}) {
  const leaveType = getLeaveTypeText(row);
  const maternity = isMaternityLeave(row);
  const start = getLeaveStartDate(row);
  const end = getLeaveEndDate(row);
  const name = getVal(row, "name") || getVal(row, "nama") || "Nama Karyawan";
  const job = getVal(row, "jabatan") || getVal(row, "pekerjaan") || getVal(row, "role") || "Karyawan";
  const reason = getVal(row, "reason") || getVal(row, "alasan") || getVal(row, "notes") || "-";
  const placementName = getSmartPlacementName(row, getVal(row, "penempatan") || "Instansi Terkait");
  const currentYear = new Date().getFullYear();
  const monthRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][new Date().getMonth()];
  const nomor = options.nomor || getVal(row, "nomorSurat") || getVal(row, "letterNumber") || `${String(Date.now()).slice(-3)}/SPM/PBN-KSLS/${monthRoman}/${currentYear}`;
  const letterDate = options.tanggalSurat || getVal(row, "tanggalSurat") || new Date();
  const perihal = maternity ? "Permohonan Persetujuan Cuti Melahirkan Karyawan" : `Permohonan Persetujuan ${leaveType} Karyawan`;
  const recipient = options.recipient || getVal(row, "penerimaSurat") || `Kepala ${placementName}`;
  const approvalDate = options.approvalDate || new Date();
  const approvalName = String(options.approvalName || "").trim();
  const approvalPosition = String(options.approvalPosition || "").trim();
  const displayDate = (value) => formatLongIndoDate(value).replace(/^0/, "");
  const periodLabel = maternity ? "Tanggal Cuti" : "Tanggal Izin";
  const reasonLabel = maternity ? "Alasan Cuti" : "Alasan Izin";
  const approvalNameHtml = approvalName ? escapeHtml(approvalName) : '<span class="blank"></span>';
  const approvalPositionHtml = approvalPosition ? escapeHtml(approvalPosition) : '<span class="blank"></span>';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(perihal)} - ${escapeHtml(name)}</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { width: 210mm; min-height: 297mm; }
  body {
    margin: 0;
    background: #e5e7eb;
    font-family: "Times New Roman", Times, serif;
    color: #111;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    padding: 53.2mm 18.5mm 56mm 18.5mm;
    page-break-after: avoid;
    break-after: avoid;
  }
  .letter-header-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    height: 52.1mm;
    object-fit: fill;
    z-index: 1;
    display: block;
  }
  .letter-footer-img {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 210mm;
    height: 34mm;
    object-fit: fill;
    object-position: bottom center;
    z-index: 1;
    display: block;
  }
  .date-line {
    position: absolute;
    top: 35.1mm;
    right: 17.4mm;
    width: 116mm;
    text-align: right;
    font-size: 15.4pt;
    line-height: 1;
    z-index: 3;
  }
  .content {
    position: relative;
    z-index: 2;
  }
  .meta {
    width: 145mm;
    border-collapse: collapse;
    margin-bottom: 8.2mm;
    font-size: 12pt;
    line-height: 1.12;
  }
  .meta td { padding: .45mm 0; vertical-align: top; }
  .meta td:nth-child(1) { width: 25mm; }
  .meta td:nth-child(2) { width: 5mm; text-align: center; }
  .to {
    margin: 0 0 8.5mm;
    font-size: 12pt;
    line-height: 1.15;
  }
  .body {
    font-size: 12pt;
    line-height: 1.12;
    text-align: justify;
  }
  .body p { margin: 0 0 8.8mm; }
  .body p.opening { margin-bottom: 12mm; }
  .body p.tight { margin-bottom: 6.7mm; }
  .employee {
    margin: 0 0 8.2mm;
    border-collapse: collapse;
    font-size: 12pt;
    line-height: 1.06;
  }
  .employee td { padding: .25mm 0; vertical-align: top; }
  .employee td:nth-child(1) { width: 39mm; font-weight: bold; }
  .employee td:nth-child(2) { width: 5mm; text-align: center; }
  .employee td:nth-child(3) { font-weight: normal; }
  .approval {
    display: grid;
    grid-template-columns: 76mm 78mm;
    justify-content: space-between;
    align-items: start;
    margin-top: 14mm;
    position: relative;
    z-index: 3;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .approval-left p,
  .signature p {
    margin: 0 0 1.45mm;
    font-size: 12pt;
    line-height: 1.04;
  }
  .blank {
    display: inline-block;
    width: 39mm;
    border-bottom: 1px dotted #111;
    height: 4mm;
    vertical-align: bottom;
  }
  .authority-space { height: 23mm; }
  .signature {
    position: relative;
    text-align: center;
    min-height: 45mm;
    overflow: visible;
    padding-top: 0;
    margin-top: -2mm;
  }
  .stamp-wrap {
    position: relative;
    height: 28mm;
    margin: 0;
    overflow: visible;
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
  }
  .stamp-image {
    position: absolute;
    left: 53%;
    top: -8mm;
    width: 53mm;
    max-width: 53mm;
    height: auto;
    object-fit: contain;
    transform: translateX(-50%) rotate(-1deg);
    opacity: .98;
    mix-blend-mode: multiply;
    filter: contrast(1.08) saturate(1.04);
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
    /* Membersihkan outline kotak samar bawaan file stempel PNG */
    clip-path: inset(3.2mm 3.2mm 3.2mm 3.2mm);
    -webkit-clip-path: inset(3.2mm 3.2mm 3.2mm 3.2mm);
  }
  .sign-greeting,
  .sign-company,
  .director,
  .sign-position {
    position: relative;
    z-index: 5;
  }
  .director {
    margin-top: -2.8mm !important;
    font-weight: bold;
    text-decoration: underline;
    letter-spacing: .15px;
  }
  .sign-position { margin-top: -1.2mm !important; }
  .signature,
  .signature *,
  .signature img,
  .signature div {
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }
  @media print {
    html, body { width: 210mm; height: 297mm; overflow: hidden; background: #fff; }
    .page { margin: 0; box-shadow: none; }
  }
</style>
</head>
<body>
  <div class="page">
    <img class="letter-header-img" src="${COMPANY_LETTER_HEADER_IMAGE_URL}" alt="" />
    <img class="letter-footer-img" src="${COMPANY_LETTER_FOOTER_IMAGE_URL}" alt="" />
    <div class="date-line">Pangkalan Bun, ${escapeHtml(displayDate(letterDate))}</div>

    <div class="content">
      <table class="meta">
        <tr><td>Nomor</td><td>:</td><td>${escapeHtml(nomor)}</td></tr>
        <tr><td>Lampiran</td><td>:</td><td>1 (Satu) Berkas</td></tr>
        <tr><td>Perihal</td><td>:</td><td>${escapeHtml(perihal)}</td></tr>
      </table>

      <p class="to">Kepada,<br/>Yth. ${escapeHtml(recipient)}<br/>Di Tempat</p>

      <div class="body">
        <p>Dengan hormat,</p>
        <p class="tight">Sehubungan dengan kebutuhan operasional dan adanya permohonan ${escapeHtml(leaveType.toLowerCase())} dari salah satu karyawan yang berada di bawah pengelolaan kami, PT. Karsa Sentana Lumbung Sentosa, kami bermaksud untuk mengajukan permohonan izin untuk karyawan kami, sebagai berikut:</p>
        <table class="employee">
          <tr><td>Nama Karyawan</td><td>:</td><td>${escapeHtml(name)}</td></tr>
          <tr><td>Jabatan</td><td>:</td><td>${escapeHtml(job)}</td></tr>
          <tr><td>${escapeHtml(periodLabel)}</td><td>:</td><td>${escapeHtml(displayDate(start))} s.d ${escapeHtml(displayDate(end))}</td></tr>
          <tr><td>${escapeHtml(reasonLabel)}</td><td>:</td><td>${escapeHtml(reason)}</td></tr>
        </table>
        <p>Kami mohon persetujuan dari pihak Dinas terkait atas izin yang diajukan. Kami akan memastikan bahwa selama masa izin, karyawan tersebut tidak akan mengganggu jalannya operasional dan akan segera kembali bekerja setelah masa izin selesai.</p>
        <p>Demikian surat permohonan ini kami sampaikan, atas perhatian dan kerjasamanya, kami ucapkan terima kasih</p>
      </div>

      <div class="approval">
        <div class="approval-left">
          <p>Disetujui/ Tidak Disetujui</p>
          <p>Tanggal: ${approvalName || approvalPosition ? escapeHtml(displayDate(approvalDate)) : '<span class="blank"></span>'}</p>
          <p>Pejabat yang berwenang,</p>
          <div class="authority-space"></div>
          <p>Nama: ${approvalNameHtml}</p>
          <p>Jabatan: ${approvalPositionHtml}</p>
        </div>
        <div class="signature">
          <p class="sign-greeting">Hormat kami,</p>
          <p class="sign-company">PT. Karsa Sentana Lumbung Sentosa</p>
          <div class="stamp-wrap">
            <img class="stamp-image" src="${COMPANY_STAMP_IMAGE_URL}" alt="" onerror="this.style.display='none';" />
          </div>
          <p class="director">SIGIT HARIYANTO</p>
          <p class="sign-position">Direktur Utama</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function previewLeaveApprovalLetter(row, options = {}) {
  openPrintablePreview(makeLeaveApprovalLetterHtmlV2(row, options), "Surat Persetujuan Cuti");
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const LETTER_TEMPLATE_TEXT = {
  cuti: {
    title: "Surat Cuti",
    subject: "Surat Cuti Disetujui",
    body: `Dengan hormat,

Berdasarkan pengajuan cuti yang telah diterima dan diperiksa oleh Admin, bersama ini kami sampaikan bahwa pengajuan cuti karyawan dinyatakan disetujui sesuai periode yang tercantum pada sistem.

Mohon karyawan mengikuti ketentuan perusahaan dan kembali bekerja sesuai jadwal yang telah ditentukan.

Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.`,
  },
  izin: {
    title: "Surat Izin",
    subject: "Surat Izin Disetujui",
    body: `Dengan hormat,

Berdasarkan pengajuan izin yang telah diterima dan diperiksa oleh Admin, bersama ini kami sampaikan bahwa pengajuan izin karyawan dinyatakan disetujui.

Mohon karyawan tetap mengikuti ketentuan administrasi perusahaan dan melakukan konfirmasi apabila terdapat perubahan kondisi.

Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.`,
  },
  sakit: {
    title: "Surat Keterangan Sakit",
    subject: "Surat Keterangan Sakit",
    body: `Dengan hormat,

Berdasarkan informasi dan/atau dokumen pendukung yang diterima oleh Admin, bersama ini kami mencatat status sakit karyawan sesuai periode yang tercantum pada sistem.

Mohon karyawan melampirkan bukti pendukung apabila diperlukan oleh perusahaan.

Demikian surat ini dibuat agar dapat dipergunakan sebagaimana mestinya.`,
  },
  pemberitahuan: {
    title: "Surat Pemberitahuan",
    subject: "Pemberitahuan Admin",
    body: `Dengan hormat,

Melalui surat ini Admin menyampaikan informasi administratif penting kepada karyawan. Mohon informasi ini dibaca dengan teliti dan ditindaklanjuti sesuai kebutuhan.

Demikian pemberitahuan ini disampaikan. Terima kasih.`,
  },
};

function PesanScreen({ db, notify, refresh }) {
  const [form, setForm] = useState({
    targetUserId: "",
    mode: "langsung",
    letterKind: "cuti",
    letterNumber: "",
    subject: "",
    message: "",
    attachmentName: "",
    attachmentUrl: "",
    attachmentMime: "",
    attachmentData: "",
  });
  const [sending, setSending] = useState(false);
  const employees = safeArray(db.karyawan);

  const selectedEmployee = employees.find((r) => String(getVal(r, "id")) === form.targetUserId) || null;
  const currentTemplate = LETTER_TEMPLATE_TEXT[form.letterKind] || LETTER_TEMPLATE_TEXT.pemberitahuan;

  useEffect(() => {
    if (form.mode !== "surat") return;
    setForm((prev) => ({
      ...prev,
      subject: prev.subject || currentTemplate.subject,
      message: prev.message || currentTemplate.body,
    }));
  }, [form.mode, form.letterKind]);

  const handleFile = async (file) => {
    if (!file) return;
    const maxMb = 8;
    if (file.size > maxMb * 1024 * 1024) {
      notify(`Ukuran file maksimal ${maxMb} MB.`, "error");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({
        ...prev,
        attachmentName: file.name,
        attachmentMime: file.type || "application/octet-stream",
        attachmentData: dataUrl,
        attachmentUrl: "",
      }));
      notify("Berkas berhasil dipilih dan siap dikirim.");
    } catch {
      notify("Gagal membaca file lampiran.", "error");
    }
  };

  const resetAttachment = () => setForm((prev) => ({ ...prev, attachmentName: "", attachmentUrl: "", attachmentMime: "", attachmentData: "" }));

  const letterData = {
    letterType: currentTemplate.title,
    nomor: form.letterNumber || `ADM/${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`,
    tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
    penerima: selectedEmployee ? `${getVal(selectedEmployee, "name") || "Karyawan"}` : "Karyawan",
    perihal: form.subject || currentTemplate.subject,
    isi: form.message || currentTemplate.body,
    lampiranName: form.attachmentName,
  };

  const send = async (e) => {
    e.preventDefault();
    if (!form.targetUserId || !form.message.trim()) return notify("Pilih karyawan dan isi pesan dulu.", "error");
    setSending(true);
    try {
      const emp = selectedEmployee;
      const letterHtml = form.mode === "surat" ? makeAdminLetterHtml(letterData) : "";
      await apiPost({
        action: "admin_message",
        id: `MSG-${Date.now()}`,
        userId: form.targetUserId,
        targetUserId: form.targetUserId,
        toUserId: form.targetUserId,
        name: getVal(emp, "name") || "",
        role: getVal(emp, "role") || "",
        penempatan: getVal(emp, "penempatan") || "",
        direction: "in",
        senderRole: "Admin",
        fromRole: "Admin",
        fromName: "Admin",
        type: form.mode === "surat" ? currentTemplate.title : (form.attachmentName ? "Pesan + Lampiran" : "Pesan Admin"),
        messageMode: form.mode,
        letterKind: form.letterKind,
        letterNumber: letterData.nomor,
        subject: form.subject || (form.mode === "surat" ? currentTemplate.subject : "Pesan Admin"),
        title: form.subject || (form.mode === "surat" ? currentTemplate.subject : "Pesan Admin"),
        pesan: form.message,
        message: form.message,
        body: form.message,
        letterHtml,
        attachmentName: form.attachmentName,
        attachmentUrl: form.attachmentUrl,
        attachmentMime: form.attachmentMime,
        attachmentData: form.attachmentData,
        status: "Terkirim",
        readStatus: "Belum Dibaca",
        timestamp: Date.now(),
      });
      notify(form.mode === "surat" ? "Surat berhasil dikirim ke user." : "Pesan berhasil dikirim ke user.");
      setForm({ targetUserId: "", mode: "langsung", letterKind: "cuti", letterNumber: "", subject: "", message: "", attachmentName: "", attachmentUrl: "", attachmentMime: "", attachmentData: "" });
      refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal mengirim pesan.", "error");
    } finally {
      setSending(false);
    }
  };

  return <MessageComposer title="Kirim Pesan / Surat ke User" form={form} setForm={setForm} employees={employees} sending={sending} onSubmit={send} rows={db.pesan} onFile={handleFile} onResetAttachment={resetAttachment} onPreviewLetter={() => previewAdminLetter(letterData)} template={currentTemplate} />;
}

function BroadcastScreen({ db, notify, refresh }) {
  const [form, setForm] = useState({ subject: "", message: "", targetRole: "ALL", targetPenempatan: "ALL", attachmentName: "", attachmentUrl: "" });
  const [sending, setSending] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return notify("Isi pesan broadcast dulu.", "error");
    setSending(true);
    try {
      await apiPost({
        action: "broadcast",
        id: `BROADCAST-${Date.now()}`,
        title: form.subject || "Pengumuman Admin",
        subject: form.subject || "Pengumuman Admin",
        text: form.message,
        message: form.message,
        body: form.message,
        targetRole: form.targetRole,
        targetPenempatan: form.targetPenempatan,
        targetUserId: "ALL",
        toUserId: "ALL",
        target: "ALL",
        attachmentName: form.attachmentName,
        attachmentUrl: form.attachmentUrl,
        status: "Aktif",
        createdBy: "Admin",
        timestamp: Date.now(),
      });
      notify("Broadcast berhasil dikirim.");
      setForm({ subject: "", message: "", targetRole: "ALL", targetPenempatan: "ALL", attachmentName: "", attachmentUrl: "" });
      refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal mengirim broadcast.", "error");
    } finally {
      setSending(false);
    }
  };

  return <BroadcastComposer form={form} setForm={setForm} sending={sending} onSubmit={send} rows={db.broadcast} employees={db.karyawan} />;
}

function MessageComposer({ title, form, setForm, employees, sending, onSubmit, rows, onFile, onResetAttachment, onPreviewLetter, template }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const modeTabs = [
    { id: "langsung", label: "Kirim Langsung" },
    { id: "surat", label: "Format Surat" },
  ];
  const letterOptions = [
    { value: "cuti", label: "Surat Cuti" },
    { value: "izin", label: "Surat Izin" },
    { value: "sakit", label: "Surat Sakit" },
    { value: "pemberitahuan", label: "Surat Pemberitahuan" },
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[460px_1fr]">
      <form onSubmit={onSubmit} className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><MessageSquare size={20} /></div>
          <div><p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Pesan Admin</p><h3 className="text-lg font-black text-slate-950">{title}</h3></div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-1 rounded-2xl bg-slate-50 p-1 ring-1 ring-slate-100">
          {modeTabs.map((item) => (
            <button key={item.id} type="button" onClick={() => set("mode", item.id)} className={cx("min-h-[40px] rounded-xl px-3 text-xs font-black transition", form.mode === item.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-blue-700")}>{item.label}</button>
          ))}
        </div>

        <div className="space-y-3">
          <Select value={form.targetUserId} onChange={(v) => set("targetUserId", v)} className="w-full" options={[{ value: "", label: "Pilih Karyawan" }, ...safeArray(employees).map((e) => ({ value: getVal(e, "id"), label: `${getVal(e, "name") || "Karyawan"}` }))]} />

          {form.mode === "surat" && (
            <div className="rounded-[1.4rem] bg-blue-50 p-3 ring-1 ring-blue-100">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="block">
                  <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-blue-700">Jenis Surat</span>
                  <select
                    value={form.letterKind}
                    onChange={(e) => {
                      const kind = e.target.value;
                      const nextTemplate = LETTER_TEMPLATE_TEXT[kind] || LETTER_TEMPLATE_TEXT.pemberitahuan;
                      setForm((prev) => ({
                        ...prev,
                        letterKind: kind,
                        subject: nextTemplate.subject,
                        message: nextTemplate.body,
                      }));
                    }}
                    className="min-h-[44px] w-full rounded-2xl border border-blue-100 bg-white px-4 text-sm font-black text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    {letterOptions.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <Input label="Nomor Surat" value={form.letterNumber} onChange={(v) => set("letterNumber", v)} placeholder="Opsional: ADM/2026/001" />
              </div>
              <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-white p-3 ring-1 ring-blue-100 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-blue-700">Header Surat Aktif</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">Surat memakai logo dan kop {COMPANY_NAME}.</p>
                </div>
                <button type="button" onClick={onPreviewLetter} className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-50"><Eye size={14} /> Preview Surat</button>
              </div>
            </div>
          )}

          <Input label={form.mode === "surat" ? "Perihal / Judul Surat" : "Judul Pesan"} value={form.subject} onChange={(v) => set("subject", v)} placeholder={form.mode === "surat" ? template?.subject || "Perihal surat" : "Contoh: Informasi Admin"} />
          <Textarea label={form.mode === "surat" ? "Isi Surat" : "Isi Pesan"} value={form.message} onChange={(v) => set("message", v)} placeholder={form.mode === "surat" ? template?.body || "Tulis isi surat..." : "Tulis pesan admin..."} />

          <div className="rounded-[1.4rem] bg-slate-50 p-3 ring-1 ring-slate-100">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Lampiran Berkas</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Bisa pilih PDF, Word, Excel, gambar, atau pakai link lampiran. Maksimal file lokal 8 MB.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={(e) => onFile?.(e.target.files?.[0])} className="block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-600 file:mr-3 file:min-h-[42px] file:border-0 file:bg-blue-600 file:px-4 file:text-xs file:font-black file:text-white" />
              <button type="button" onClick={onResetAttachment} className="min-h-[42px] rounded-2xl bg-white px-4 text-xs font-black text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100">Hapus</button>
            </div>
            {form.attachmentName && <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">File siap: {form.attachmentName}</p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Input label="Nama Lampiran" value={form.attachmentName} onChange={(v) => set("attachmentName", v)} placeholder="Opsional: Surat Cuti PDF" />
              <Input label="URL Lampiran" value={form.attachmentUrl} onChange={(v) => set("attachmentUrl", v)} placeholder="Opsional: Link Google Drive" />
            </div>
          </div>

          <button disabled={sending} className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-blue-100 disabled:opacity-60">
            {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} {form.mode === "surat" ? "Kirim Surat" : "Kirim Pesan"}
          </button>
        </div>
      </form>
      <HistoryPanel title="Riwayat Pesan" rows={rows} type="pesan" />
    </div>
  );
}

function BroadcastComposer({ form, setForm, employees, sending, onSubmit, rows }) {
  const roles = ["ALL", ...Array.from(new Set(safeArray(employees).map((e) => getVal(e, "role") || "Umum")))];
  const placements = ["ALL", ...Array.from(new Set(safeArray(employees).map((e) => getVal(e, "penempatan") || "-").filter(Boolean)))];
  return (
    <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
      <form onSubmit={onSubmit} className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><Megaphone size={20} /></div>
          <div><p className="text-[10px] font-black uppercase tracking-wide text-blue-600">Pengumuman</p><h3 className="text-lg font-black text-slate-950">Broadcast Admin</h3></div>
        </div>
        <div className="space-y-3">
          <Input label="Judul Broadcast" value={form.subject} onChange={(v) => setForm((p) => ({ ...p, subject: v }))} placeholder="Contoh: Pengumuman Jadwal" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select value={form.targetRole} onChange={(v) => setForm((p) => ({ ...p, targetRole: v }))} options={roles.map((v) => ({ value: v, label: v === "ALL" ? "Semua Role" : v }))} />
            <Select value={form.targetPenempatan} onChange={(v) => setForm((p) => ({ ...p, targetPenempatan: v }))} options={placements.map((v) => ({ value: v, label: v === "ALL" ? "Semua Penempatan" : v }))} />
          </div>
          <Textarea label="Isi Broadcast" value={form.message} onChange={(v) => setForm((p) => ({ ...p, message: v }))} placeholder="Tulis pengumuman..." />
          <Input label="Nama Lampiran" value={form.attachmentName} onChange={(v) => setForm((p) => ({ ...p, attachmentName: v }))} placeholder="Opsional" />
          <Input label="URL Lampiran" value={form.attachmentUrl} onChange={(v) => setForm((p) => ({ ...p, attachmentUrl: v }))} placeholder="Opsional" />
          <button disabled={sending} className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl shadow-blue-100 disabled:opacity-60">
            {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Kirim Broadcast
          </button>
        </div>
      </form>
      <HistoryPanel title="Riwayat Broadcast" rows={rows} type="broadcast" />
    </div>
  );
}

function HistoryPanel({ title, rows, type }) {
  const uniqueRows = useMemo(() => {
    const map = new Map();
    safeArray(rows).forEach((row) => {
      const id = getVal(row, "id") || "";
      const subject = getVal(row, "subject") || getVal(row, "title") || getVal(row, "judul") || getVal(row, "type") || "";
      const target = getVal(row, "targetUserId") || getVal(row, "userId") || getVal(row, "targetRole") || "ALL";
      const body = getVal(row, "message") || getVal(row, "pesan") || getVal(row, "body") || getVal(row, "text") || "";
      const stamp = getVal(row, "timestamp") || getVal(row, "createdAt") || getVal(row, "date") || "";
      const key = id || `${subject}|${target}|${body}|${stamp}`;
      if (!map.has(key)) map.set(key, row);
    });
    return Array.from(map.values()).sort((a, b) => Number(getVal(b, "timestamp") || parseMillis(getVal(b, "createdAt") || getVal(b, "date"))) - Number(getVal(a, "timestamp") || parseMillis(getVal(a, "createdAt") || getVal(a, "date"))));
  }, [rows]);

  return (
    <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
        <Badge tone="bg-slate-50 text-slate-600 ring-slate-100">{uniqueRows.length} riwayat</Badge>
      </div>
      <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
        {uniqueRows.slice(0, 30).map((row, idx) => {
          const subject = getVal(row, "subject") || getVal(row, "title") || getVal(row, "judul") || getVal(row, "type") || title;
          const target = type === "pesan" ? (getVal(row, "targetUserId") || getVal(row, "userId") || "-") : (getVal(row, "targetRole") || "ALL");
          const body = getVal(row, "message") || getVal(row, "pesan") || getVal(row, "body") || getVal(row, "text") || "-";
          const attachmentName = getVal(row, "attachmentName");
          const mode = getVal(row, "messageMode") || "";
          return (
            <div key={getVal(row, "id") || `${target}-${idx}`} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-black text-slate-900">{subject}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{target} • {formatDate(getVal(row, "date") || getVal(row, "createdAt"))}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end">{mode === "surat" ? <Badge tone="bg-blue-50 text-blue-700 ring-blue-100">Surat</Badge> : <Badge tone="bg-emerald-50 text-emerald-700 ring-emerald-100">Pesan</Badge>}<OfflineSyncBadges row={row} compact /></div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-600">{body}</p>
              {attachmentName && <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-600 ring-1 ring-slate-200">Lampiran: {attachmentName}</p>}
            </div>
          );
        })}
        {!uniqueRows.length && <EmptyMini text="Belum ada riwayat." />}
      </div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-[48px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function DataTable({ rows, columns, renderRow }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => <th key={col} className="whitespace-nowrap px-4 py-3 text-[10px] font-black uppercase tracking-wide text-slate-400">{col}</th>)}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>{safeArray(rows).map(renderRow)}</tbody>
        </table>
      </div>
      {!safeArray(rows).length && <div className="p-4"><EmptyState /></div>}
    </div>
  );
}

function CellTitle({ title, subtitle }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-black text-slate-950">{title || "-"}</p>
      {subtitle && <p className="mt-0.5 truncate text-xs font-bold text-slate-400">{subtitle}</p>}
    </div>
  );
}

function IconButton({ icon: Icon, onClick, danger = false }) {
  return (
    <button onClick={onClick} className={cx("grid h-9 w-9 place-items-center rounded-full ring-1 active:scale-95", danger ? "bg-red-50 text-red-600 ring-red-100" : "bg-blue-50 text-blue-700 ring-blue-100")}>
      <Icon size={16} />
    </button>
  );
}

const DETAIL_HIDDEN_KEYS = new Set([
  // Foto / file / link internal tidak ditampilkan sebagai teks mentah.
  "photo",
  "photourl",
  "fotourl",
  "foto",
  "fotoprofil",
  "profilephoto",
  "profilepicture",
  "avatar",
  "image",
  "picture",
  "photo_profile",
  "profile_photo",
  "photofileid",
  "photofilename",
  "photomimetype",
  "photoupdatedat",
  "attachmenturl",
  "attachmentname",
  "fileurl",
  "filename",
  "fileid",
  "url",
  "link",

  // Password / PIN / data teknis.
  "password",
  "sandi",
  "pin",
  "passwordupdatedat",
  "resetpasswordat",
  "resetpasswordby",
  "userid",
  "nama",
  "devisi",
  "site",
  "alamat",
  "domisili",
  "alamat_ktp",
  "birthdate",
  "dob",
  "action",
  "timestamp",
  "islate",
  "latitude",
  "longitude",
  "smartdivisi",
  "bagiansmart",
  "shiftdefaultsmart",
  "penempatankey",
  "namapenempatanlengkap",
  "radiusgeofencemeter",
  "statusgeofence",
  "catatansmart",
  "rownumber",
  "__rownumber"
]);

const DETAIL_LABELS = {
  id: "ID Karyawan",
  name: "Nama",
  status: "Status",
  wilayah: "Wilayah",
  importSource: "Sumber Data",
  penempatan: "Penempatan",
  divisi: "Divisi",
  role: "Role",
  pekerjaan: "Pekerjaan",
  jabatan: "Jabatan",
  tanggalLahir: "Tanggal Lahir",
  tanggal_lahir: "Tanggal Lahir",
  jenisKelamin: "Jenis Kelamin",
  jenis_kelamin: "Jenis Kelamin",
  nik: "NIK",
  email: "Email",
  phone: "No. HP",
  noHp: "No. HP",
  whatsapp: "WhatsApp",
  emergencyContact: "Kontak Darurat",
  kontakDarurat: "Kontak Darurat",
  addressDetail: "Alamat Domisili",
  alamatDomisili: "Alamat Domisili",
  addressKtp: "Alamat KTP",
  alamatKtp: "Alamat KTP",
  kuotaCutiTahunan: "Kuota Cuti Tahunan",
  cutiTahunanUsed: "Cuti Terpakai",
  oldId: "ID Lama",
  updatedAt: "Update Terakhir",
  profileUpdatedAt: "Profil Diperbarui",
  createdAt: "Dibuat Pada",
  createdBy: "Dibuat Oleh",
  updatedBy: "Diupdate Oleh",
  notes: "Catatan",
  pinLogin: "PIN Login"
};

function prettyKeyLabel(key) {
  if (DETAIL_LABELS[key]) return DETAIL_LABELS[key];
  return String(key)
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDetailValue(key, value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";
  const k = normalize(key);
  if (k.includes("tanggal") || k.includes("date") || k.includes("updatedat") || k.includes("createdat") || k.includes("loginat")) {
    const parsed = Date.parse(raw);
    if (Number.isFinite(parsed)) {
      return new Date(parsed).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    }
    return formatDate(raw);
  }
  return raw;
}

function isHiddenDetailField(key, value) {
  const keyNorm = normalize(key).replace(/[^a-z0-9]/g, "");
  const raw = String(value ?? "").trim();
  const rawLower = raw.toLowerCase();

  if (!raw) return true;

  // Filter super ketat: semua kolom teknis foto/file/link jangan tampil sebagai teks.
  const keyLooksTechnical =
    DETAIL_HIDDEN_KEYS.has(keyNorm) ||
    keyNorm.includes("photo") ||
    keyNorm.includes("foto") ||
    keyNorm.includes("image") ||
    keyNorm.includes("picture") ||
    keyNorm.includes("avatar") ||
    keyNorm.includes("base64") ||
    keyNorm.includes("file") ||
    keyNorm.includes("lampiran") ||
    keyNorm.includes("attachment") ||
    keyNorm.endsWith("url") ||
    keyNorm.includes("url") ||
    keyNorm.includes("link") ||
    keyNorm.includes("timestamp") ||
    keyNorm === "islate" ||
    keyNorm === "lat" ||
    keyNorm === "lng" ||
    keyNorm === "latitude" ||
    keyNorm === "longitude";

  if (keyLooksTechnical) return true;

  // Sembunyikan semua isi mentah berupa base64, link, atau data teknis panjang.
  if (rawLower.startsWith("data:")) return true;
  if (rawLower.includes(";base64,")) return true;
  if (rawLower.includes("base64,")) return true;
  if (rawLower.startsWith("http://") || rawLower.startsWith("https://")) return true;
  if (rawLower.includes("drive.google.com")) return true;
  if (rawLower.includes("script.google.com")) return true;

  // Base64 kadang kepotong tanpa prefix data:image; tetap sembunyikan kalau terlalu panjang dan pola karakternya teknis.
  if (raw.length > 120) return true;

  return false;
}

const DETAIL_FIELDS_BY_TYPE = {
  absensi: [
    ["Nama", ["name", "nama"]],
    ["ID Karyawan", ["userId", "id_karyawan", "id"]],
    ["Aksi", ["action", "aksi", "tipe_absensi"]],
    ["Tanggal", ["date", "tanggal", "createdAt"]],
    ["Jam", ["time", "jam", "jam_absen"]],
    ["Status", ["latenessStatus", "status", "status_absensi"]],
    ["Penempatan", ["penempatan", "site"]],
    ["Lokasi", ["location", "lokasi", "alamat"]],
    ["Koordinat", ["coordinate", "coordinates", "koordinat"]],
    ["Catatan", ["notes", "note", "keterangan"]]
  ],
  laporan: [
    ["Judul", ["judul", "title", "subject"]],
    ["Nama", ["name", "nama"]],
    ["ID Karyawan", ["userId", "id_karyawan", "id"]],
    ["Tanggal", ["date", "tanggal", "createdAt"]],
    ["Jam", ["time", "jam"]],
    ["Status", ["reportStatus", "status"]],
    ["Area", ["area", "lokasi", "penempatan"]],
    ["Isi Laporan", ["text", "isi", "isiLaporan", "laporan", "body", "message", "deskripsi", "description"]],
    ["Lokasi", ["location", "lokasi", "alamatLokasi"]],
    ["Catatan", ["notes", "note", "keterangan"]]
  ],
  cuti: [
    ["Nama", ["name", "nama"]],
    ["ID Karyawan", ["userId", "id_karyawan", "id"]],
    ["Jenis Pengajuan", ["type", "jenis", "requestCategory"]],
    ["Tanggal Mulai", ["start", "dateStart", "tanggalMulai"]],
    ["Tanggal Selesai", ["end", "dateEnd", "tanggalSelesai"]],
    ["Jumlah Hari", ["requestedWorkdays", "approvedWorkdays", "requestedDays"]],
    ["Status", ["status"]],
    ["Alasan", ["reason", "alasan", "notes"]],
    ["Catatan Admin", ["adminNote", "catatanAdmin"]]
  ]
};

function getFirstVisibleValue(row, keys) {
  for (const key of keys) {
    const value = getVal(row, key);
    if (!isHiddenDetailField(key, value)) return { key, value };
  }
  return null;
}

function getTypedDetailFields(row, type) {
  const config = DETAIL_FIELDS_BY_TYPE[type];
  if (!config) return [];
  return config
    .map(([label, keys]) => {
      const found = getFirstVisibleValue(row, keys);
      return found ? { key: label, value: found.value } : null;
    })
    .filter(Boolean);
}

function getGenericDetailFields(row) {
  return Object.keys(row || {})
    .map((key) => ({ key, value: getVal(row, key) }))
    .filter((field) => !isHiddenDetailField(field.key, field.value));
}

function getEmployeeDetailFields(row) {
  const priority = [
    "id",
    "name",
    "status",
    "wilayah",
    "penempatan",
    "divisi",
    "role",
    "pekerjaan",
    "jabatan",
    "tanggalLahir",
    "jenisKelamin",
    "nik",
    "email",
    "phone",
    "whatsapp",
    "emergencyContact",
    "addressDetail",
    "addressKtp",
    "kuotaCutiTahunan",
    "cutiTahunanUsed",
    "oldId",
    "updatedAt",
    "profileUpdatedAt",
    "importSource",
    "notes"
  ];
  const used = new Set();
  const fields = [];
  const loginPin = getEmployeeLoginPin(row);
  if (loginPin) {
    used.add("pinlogin");
    fields.push({ key: "pinLogin", value: loginPin });
  }
  priority.forEach((key) => {
    const value = getVal(row, key);
    if (!isHiddenDetailField(key, value)) {
      used.add(normalize(key).replace(/[^a-z0-9]/g, ""));
      fields.push({ key, value });
    }
  });
  Object.keys(row || {}).forEach((key) => {
    const keyNorm = normalize(key).replace(/[^a-z0-9]/g, "");
    const value = getVal(row, key);
    if (used.has(keyNorm)) return;
    if (isHiddenDetailField(key, value)) return;
    fields.push({ key, value });
  });
  return fields;
}

function DetailField({ field }) {
  if (!field || isHiddenDetailField(field.key, field.value)) return null;
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{prettyKeyLabel(field.key)}</p>
      <p className="mt-1 break-words text-sm font-bold leading-relaxed text-slate-800">{formatDetailValue(field.key, field.value)}</p>
    </div>
  );
}

function EmployeeProfileSummary({ row }) {
  const name = getVal(row, "name") || getVal(row, "nama") || "Karyawan";
  const id = getVal(row, "id") || getVal(row, "userId") || "-";
  const status = getVal(row, "status") || "Aktif";
  const role = getVal(row, "role") || getVal(row, "divisi") || getVal(row, "devisi") || "Umum";
  const penempatan = getSmartPlacementName(row);
  const pekerjaan = getVal(row, "pekerjaan") || getVal(row, "jabatan") || "-";
  const phone = getVal(row, "phone") || getVal(row, "noHp") || getVal(row, "whatsapp") || "-";
  const email = getVal(row, "email") || "-";
  const updated = getVal(row, "profileUpdatedAt") || getVal(row, "updatedAt") || getVal(row, "photoUpdatedAt");

  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Ringkasan Profil</p>
      <h4 className="mt-2 text-xl font-black text-slate-950">{name}</h4>
      <p className="mt-1 text-sm font-bold text-slate-400">{id}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone={statusTone(status)}>{status}</Badge>
        <Badge tone="bg-blue-50 text-blue-700 ring-blue-100">{role}</Badge>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <p className="text-[10px] font-black uppercase text-slate-400">Penempatan</p>
          <p className="mt-1 font-black text-slate-800">{penempatan}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <p className="text-[10px] font-black uppercase text-slate-400">Pekerjaan</p>
          <p className="mt-1 font-black text-slate-800">{pekerjaan}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <p className="text-[10px] font-black uppercase text-slate-400">Kontak</p>
          <p className="mt-1 font-black text-slate-800">{phone}</p>
          <p className="mt-0.5 break-words text-xs font-bold text-slate-500">{email}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
          <p className="text-[10px] font-black uppercase text-emerald-600">Update Terakhir</p>
          <p className="mt-1 font-black text-emerald-800">{updated ? formatDetailValue("updatedAt", updated) : "-"}</p>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ selected, onClose }) {
  if (!selected) return null;
  const { type, row } = selected;
  const titleMap = { karyawan: "Detail Karyawan", absensi: "Detail Absensi", laporan: "Detail Laporan", cuti: "Detail Pengajuan" };
  const photo = addImageCacheVersion(getRecordPhoto(row, type), row);
  const lat = getVal(row, "latitude");
  const lng = getVal(row, "longitude");
  const isEmployee = type === "karyawan";
  const fields = (isEmployee ? getEmployeeDetailFields(row) : (getTypedDetailFields(row, type).length ? getTypedDetailFields(row, type) : getGenericDetailFields(row))).filter((field) => !isHiddenDetailField(field.key, field.value));

  return (
    <Modal title={titleMap[type] || "Detail Data"} onClose={onClose} wide>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
            {photo ? (
              <div>
                <img src={photo} alt={type === "absensi" ? "Bukti foto absensi" : "Lampiran"} referrerPolicy="no-referrer" className="max-h-[420px] w-full rounded-[1.5rem] object-contain bg-slate-950/5" />
                <p className="mt-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-bold leading-relaxed text-blue-700 ring-1 ring-blue-100">
                  {type === "absensi" ? "Preview bukti foto absensi yang tersimpan di database." : type === "laporan" ? "Preview lampiran/foto laporan jika tersedia." : "Preview foto profil karyawan."}
                </p>
              </div>
            ) : (
              <div className="grid h-64 place-items-center rounded-[1.5rem] bg-slate-50 text-slate-300"><UserCircle2 size={78} /></div>
            )}
          </div>
          {!isEmployee && <OfflineSyncPanel row={row} />}
          {isEmployee && <EmployeeProfileSummary row={row} />}
          {lat && lng && <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer" className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white"><MapPin size={17} /> Buka Lokasi Maps</a>}
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {fields.map((field) => <DetailField key={field.key} field={field} />)}
        </div>
      </div>
    </Modal>
  );
}

function AppUpdateScreen({ db, notify, refresh, admin }) {
  const [form, setForm] = useState(() => ({
    latestVersion: getVal(db.app_update, "latestVersion") || "",
    minRequiredVersion: getVal(db.app_update, "minRequiredVersion") || "",
    forceUpdate: Boolean(getVal(db.app_update, "forceUpdate")),
    apkUrl: getVal(db.app_update, "apkUrl") || getVal(db.app_update, "updateUrl") || "",
    updateTitle: getVal(db.app_update, "updateTitle") || "Update Aplikasi Tersedia",
    updateMessage: getVal(db.app_update, "updateMessage") || "Silakan perbarui aplikasi untuk mendapatkan fitur terbaru.",
    releaseNotes: getVal(db.app_update, "releaseNotes") || getVal(db.app_update, "changelog") || "",
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      latestVersion: getVal(db.app_update, "latestVersion") || "",
      minRequiredVersion: getVal(db.app_update, "minRequiredVersion") || "",
      forceUpdate: Boolean(getVal(db.app_update, "forceUpdate")),
      apkUrl: getVal(db.app_update, "apkUrl") || getVal(db.app_update, "updateUrl") || "",
      updateTitle: getVal(db.app_update, "updateTitle") || "Update Aplikasi Tersedia",
      updateMessage: getVal(db.app_update, "updateMessage") || "Silakan perbarui aplikasi untuk mendapatkan fitur terbaru.",
      releaseNotes: getVal(db.app_update, "releaseNotes") || getVal(db.app_update, "changelog") || "",
    });
  }, [db.app_update]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await apiPost({
        action: "save_app_update",
        ...form,
        actor: admin?.name || admin?.username || "Admin",
      });
      notify("Pengaturan update aplikasi berhasil disimpan ke karsa_absensi/app_update.");
      refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal menyimpan update aplikasi.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[460px_1fr]">
      <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100"><RefreshCcw size={20} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-blue-600">karsa_absensi/app_update</p>
            <h3 className="text-lg font-black text-slate-950">Form Update Aplikasi</h3>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Latest Version" value={form.latestVersion} onChange={(v) => setField("latestVersion", v)} placeholder="Contoh: 1.0.8" />
          <Input label="Min Required Version" value={form.minRequiredVersion} onChange={(v) => setField("minRequiredVersion", v)} placeholder="Contoh: 1.0.5" />
          <label className="flex min-h-[48px] items-center gap-3 rounded-2xl bg-slate-50 px-4 text-sm font-black text-slate-700 ring-1 ring-slate-100 sm:col-span-2">
            <input type="checkbox" checked={form.forceUpdate} onChange={(e) => setField("forceUpdate", e.target.checked)} />
            Force Update
          </label>
          <div className="sm:col-span-2"><Input label="APK URL" value={form.apkUrl} onChange={(v) => setField("apkUrl", v)} placeholder="https://.../app.apk" /></div>
          <div className="sm:col-span-2"><Input label="Update Title" value={form.updateTitle} onChange={(v) => setField("updateTitle", v)} /></div>
          <div className="sm:col-span-2"><Textarea label="Update Message" value={form.updateMessage} onChange={(v) => setField("updateMessage", v)} /></div>
          <div className="sm:col-span-2"><Textarea label="Release Notes" value={form.releaseNotes} onChange={(v) => setField("releaseNotes", v)} placeholder="Catatan perubahan versi terbaru" /></div>
        </div>
        <button onClick={save} disabled={saving} className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-100 disabled:bg-slate-200 disabled:text-slate-400">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Simpan App Update
        </button>
      </section>

      <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">Preview Data Firebase</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">Data Aktif</h3>
        <div className="mt-4 grid gap-2">
          {[
            ["latestVersion", form.latestVersion],
            ["minRequiredVersion", form.minRequiredVersion],
            ["forceUpdate", form.forceUpdate ? "true" : "false"],
            ["apkUrl", form.apkUrl],
            ["updateTitle", form.updateTitle],
            ["updateMessage", form.updateMessage],
            ["releaseNotes", form.releaseNotes],
          ].map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{key}</p>
              <p className="mt-1 break-words text-sm font-bold text-slate-800">{String(value || "-")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AdminPanelAbsensiKarsa() {
  const [admin, setAdmin] = useState(() => readCache(ADMIN_STORAGE_KEY, null));
  const [db, setDb] = useState(() => makeDb(EMPTY_DB));
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [selected, setSelected] = useState(null);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem("karsa_admin_last_sync_label_v1") || "");
  const [syncError, setSyncError] = useState(false);
  const refreshLockRef = useRef(false);
  const lastRefreshAtRef = useRef(0);

  const notify = (message, type = "success") => setToast({ message, type });
  const summary = useMemo(() => buildSummary(db), [db]);

  const refresh = async (silent = false, force = false) => {
    const now = Date.now();
    if (refreshLockRef.current) return null;
    if (silent && !force && now - lastRefreshAtRef.current < ADMIN_MIN_SILENT_SYNC_GAP_MS) return null;

    refreshLockRef.current = true;
    lastRefreshAtRef.current = now;
    if (!silent) setLoading(true);

    try {
      const data = await apiGet();
      const next = makeDb(data);
      setDb(next);
      writeCache(DB_STORAGE_KEY, next);
      const label = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSync(label);
      setSyncError(false);
      localStorage.setItem("karsa_admin_last_sync_label_v1", label);
      if (!silent) notify("Database berhasil disinkronkan.");
      return next;
    } catch (err) {
      setSyncError(true);
      if (!silent) notify(err.message || "Gagal sinkron database.", "error");
      return null;
    } finally {
      refreshLockRef.current = false;
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) return;

    refresh(true, true);

    const unsubscribe = subscribeFirebaseDatabase(
      (data) => {
        const next = makeDb(data);
        setDb(next);
        writeCache(DB_STORAGE_KEY, next);
        const label = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setLastSync(label);
        setSyncError(false);
        localStorage.setItem("karsa_admin_last_sync_label_v1", label);
      },
      (error) => {
        setSyncError(true);
        console.error("Firebase realtime listener error:", error);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [admin]);

  const login = async (username, pin) => {
    const cleanUser = String(username || "").trim().toLowerCase();
    const cleanPin = String(pin || "").trim();
    if (!cleanUser || !cleanPin) throw new Error("Username dan PIN wajib diisi.");

    let adminUsersRaw = null;
    try {
      adminUsersRaw = await readRealtimeOnce("admin_users");
    } catch (err) {
      throw new Error(err?.message || "Gagal membaca admin_users dari Firebase.");
    }

    const adminUsers = adminUsersRaw && typeof adminUsersRaw === "object" ? adminUsersRaw : {};
    const adminRows = Object.entries(adminUsers).map(([key, value]) => ({ key, ...(value || {}) }));

    let found = adminRows.find((row) => {
      const rowUser = String(getVal(row, "username") || getVal(row, "email") || getVal(row, "name") || getVal(row, "nama") || row.key || "").trim().toLowerCase();
      return rowUser === cleanUser;
    });

    if (!found && adminRows.length === 0 && cleanUser === "admin" && cleanPin === "123456") {
      const bootstrapAdmin = {
        username: "admin",
        pin: "123456",
        role: "super_admin",
        nama: "Administrator Utama",
        status: "Aktif",
        createdAt: new Date().toISOString(),
        bootstrap: true,
      };
      await set(ref(realtimeDb, `${FIREBASE_ROOT}/admin_users/admin`), cleanFirebaseData(bootstrapAdmin));
      found = { key: "admin", ...bootstrapAdmin };
    }

    if (!found) throw new Error("Akun admin tidak ditemukan di Firebase admin_users.");

    const rowStatus = normalize(getVal(found, "status") || "Aktif");
    if (rowStatus !== "aktif") throw new Error("Akun admin tidak aktif.");

    const rowPin = String(getVal(found, "pin") || getVal(found, "password") || "").trim();
    if (rowPin !== cleanPin) throw new Error("PIN admin salah.");

    const session = {
      username: getVal(found, "username") || found.key || cleanUser,
      name: getVal(found, "nama") || getVal(found, "name") || cleanUser,
      nama: getVal(found, "nama") || getVal(found, "name") || cleanUser,
      role: getVal(found, "role") || "admin",
      loginAt: new Date().toISOString(),
    };

    setAdmin(session);
    writeCache(ADMIN_STORAGE_KEY, session);
    notify(`Masuk sebagai ${session.name} (${getAdminRoleLabel(session.role)}).`);
    return true;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const handleDecision = async (row, action) => {
    const currentStatus = getVal(row, "status") || "Menunggu";
    const nextStatus = action === "approve_cuti" ? "Disetujui" : action === "reject_cuti" ? "Ditolak" : "Dicabut";
    const label = action === "approve_cuti" ? "menyetujui" : action === "reject_cuti" ? "menolak" : "mencabut";
    const note = window.prompt(`Catatan admin untuk ${label} pengajuan ini?`, "");
    if (note === null) return;

    const id = getVal(row, "id") || getVal(row, "cutiId") || getVal(row, "leaveId") || getLeaveHistoryKey(row);
    const userId = getVal(row, "userId") || getVal(row, "id_karyawan") || getVal(row, "employeeId") || "";
    const actor = admin?.name || admin?.username || "Admin";
    const now = new Date().toISOString();

    setLoading(true);
    try {
      await apiPost({
        action,
        id,
        cutiId: id,
        leaveId: id,
        recordId: id,
        userId,
        actor,
        adminName: actor,
        adminNote: note,
        oldStatus: currentStatus,
        newStatus: nextStatus,
        status: nextStatus,
        approvedBy: action === "approve_cuti" ? actor : "",
        approvedAt: action === "approve_cuti" ? now : "",
        rejectedBy: action === "reject_cuti" ? actor : "",
        rejectedAt: action === "reject_cuti" ? now : "",
        revokedBy: action === "revoke_cuti" ? actor : "",
        revokedAt: action === "revoke_cuti" ? now : "",
        createLeaveLetter: action === "approve_cuti",
      });

      const updatedRow = {
        ...row,
        id,
        cutiId: id,
        leaveId: id,
        userId,
        status: nextStatus,
        adminNote: note,
        adminName: actor,
        updatedBy: actor,
        updatedAt: now,
        approvedBy: action === "approve_cuti" ? actor : getVal(row, "approvedBy"),
        approvedAt: action === "approve_cuti" ? now : getVal(row, "approvedAt"),
        rejectedBy: action === "reject_cuti" ? actor : getVal(row, "rejectedBy"),
        rejectedAt: action === "reject_cuti" ? now : getVal(row, "rejectedAt"),
        revokedBy: action === "revoke_cuti" ? actor : getVal(row, "revokedBy"),
        revokedAt: action === "revoke_cuti" ? now : getVal(row, "revokedAt"),
      };

      setDb((prev) => {
        const next = makeDb({
          ...prev,
          cuti: mergeLeaveHistoryRows([...safeArray(prev.cuti), updatedRow]),
        });
        writeCache(DB_STORAGE_KEY, next);
        return next;
      });

      notify(`Berhasil ${label} pengajuan. Status tersimpan di karsa_absensi/cuti.`);
      await refresh(true, true);
    } catch (err) {
      notify(err.message || "Gagal memproses pengajuan.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return <><Toast toast={toast} onClose={() => setToast({ message: "", type: "success" })} /><LoginScreen onLogin={login} loading={loading} /></>;

  const activeMeta = NAV_ITEMS.find((item) => item.id === active) || NAV_ITEMS[0];
  const pageInfo = PAGE_META[active] || { eyebrow: "Admin Dashboard", title: activeMeta.label, subtitle: "Rekap absensi, laporan, cuti, pesan, dan database karyawan", helper: "Live database" };
  const content = {
    dashboard: <DashboardScreen db={db} summary={summary} setActive={setActive} setSelected={setSelected} />,
    karyawan: <KaryawanScreen db={db} setSelected={setSelected} notify={notify} refresh={refresh} admin={admin} />,
    jam_kerja: <JamKerjaScreen db={db} notify={notify} refresh={refresh} admin={admin} />,
    absensi: <AbsensiScreen db={db} setSelected={setSelected} />,
    log_kehadiran: <LogKehadiranScreen db={db} setSelected={setSelected} />,
    statistik: <StatistikScreen db={db} setSelected={setSelected} />,
    rekap: <RekapScreen db={db} />,
    laporan: <LaporanScreen db={db} setSelected={setSelected} notify={notify} refresh={refresh} admin={admin} />,
    cuti: <CutiScreen db={db} setSelected={setSelected} onDecision={handleDecision} />,
    pesan: <PesanScreen db={db} notify={notify} refresh={refresh} />,
    broadcast: <BroadcastScreen db={db} notify={notify} refresh={refresh} />,
    app_update: <AppUpdateScreen db={db} notify={notify} refresh={refresh} admin={admin} />,
  }[active];

  return (
    <div className="h-[100dvh] overflow-hidden bg-slate-100 font-sans text-slate-900">
      <Toast toast={toast} onClose={() => setToast({ message: "", type: "success" })} />
      <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden bg-[#f8fbff] lg:my-4 lg:h-[calc(100dvh-2rem)] lg:rounded-[2rem] lg:shadow-2xl lg:shadow-slate-300/40">
        <Sidebar active={active} setActive={setActive} onLogout={logout} onRefresh={() => refresh(false)} loading={loading} />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {loading && <LoadingOverlay />}
          <Header title={pageInfo.title} subtitle={pageInfo.subtitle} eyebrow={pageInfo.eyebrow} helper={pageInfo.helper} icon={activeMeta.icon} lastSync={lastSync} syncError={syncError} />
          <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 lg:px-6 lg:pb-6 lg:pt-0">
            <div className="mx-auto max-w-7xl">{content}</div>
          </div>
        </main>
        <MobileNav active={active} setActive={setActive} />
      </div>
      <CompactEmployeeDetailModal selected={selected} onClose={() => setSelected(null)} />
      {isDeveloperRole(admin?.role) && <DeveloperModePanel admin={admin} />}
    </div>
  );
}
