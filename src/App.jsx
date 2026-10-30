import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Moon,
  Sun,
  Download,
  Plus,
  Trash2,
  Folder,
  Circle,
  Square,
  Triangle,
  ChevronDown,
  Cloud,
  Check,
  X,
  Sliders,
  FileText,
  Image as ImageIcon,
  Compass,
  Edit3,
  Link2,
  Move,
  User,
  LogOut,
  Undo2,
  Redo2,
  Clock,
  Lock,
  FolderPlus
} from 'lucide-react';

// Optional Firebase imports with safe fallback
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';

// --- FIREBASE INITIALIZATION & SAFETY ---
let firebaseApp = null;
let auth = null;
let db = null;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyDTW94zFwv4rTxDhReywvBnumq3G3kUI7g",
    authDomain: "mymind-studio.firebaseapp.com",
    projectId: "mymind-studio",
    storageBucket: "mymind-studio.firebasestorage.app",
    messagingSenderId: "1056777863960",
    appId: "1:1056777863960:web:c504f50413b8cc0dbfd46d"
  };
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
} catch (e) {
  console.warn("Firebase initialization skipped:", e);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'mymind-studio-default';

// --- STRICT BILINGUAL DICTIONARY (100% PURE EN & 100% PURE VI) ---
const TRANSLATIONS = {
  en: {
    appName: 'MyMind Studio',
    editionBadge: 'PRO',
    languageBtnLabel: 'Language: EN',
    workspaceLabel: 'Workspace',
    manageWorkspaces: 'Workspace Menu',
    currentWorkspaceName: 'Current Workspace Name:',
    workspaceTip: 'Create multiple independent boards in the tab bar below the toolbar to organize your ideas by stage or topic.',
    done: 'Done',
    cancel: 'Cancel',
    create: 'Create',
    save: 'Save',
    loginBtn: 'Log In',
    logoutBtn: 'Log Out',
    googleLoginBtn: 'Sign in with Google',
    loginRequiredTitle: 'Sign In Required',
    loginRequiredDesc: 'Please sign in with your Google account to save your current workspace or open previously saved workspaces. You can close this menu to continue brainstorming and exporting without signing in.',
    continueWithoutLogin: 'Close & Continue Without Saving',
    savedWorkspacesTitle: 'Saved Workspaces',
    newWorkspaceBtn: 'New Workspace',
    defaultNewWorkspaceName: 'Untitled Workspace',
    openWorkspaceBtn: 'Open',
    activeBadge: 'Active',
    autoSaveInfo: 'Auto-saves every 10 minutes (overwrites previous version)',
    lastAutoSaved: 'Last saved:',
    notSavedYet: 'Waiting for next auto-save cycle',
    saveNowBtn: 'Save Now',
    undoTitle: 'Undo (Ctrl+Z)',
    redoTitle: 'Redo (Ctrl+Y)',
    toastUndo: 'Action undone',
    toastRedo: 'Action redone',
    toastLoggedIn: 'Signed in with Google account!',
    toastLoggedOut: 'Signed out of Google account',
    toastAutoSaved: 'Workspace auto-saved to cloud!',
    toastWorkspaceSwitched: 'Workspace opened!',
    toastWorkspaceCreated: 'New workspace created!',
    toastWorkspaceDeleted: 'Workspace deleted!',
    export: 'Export',
    hierarchy: 'Hierarchy',
    properties: 'Properties',
    boardDefaultName: 'Board',
    addBoardTitle: 'Add new board',
    renameBoardTitle: 'Rename board',
    deleteBoardTitle: 'Delete board',
    levelShort: 'Lvl',
    inputRootPlaceholder: 'Enter main idea (Lvl 1)...',
    inputChildPlaceholder: (lvl, parentText) => `Add child idea (Lvl ${lvl}) for "${parentText}"...`,
    clearSelectionTitle: 'Deselect to create Level 1 idea',
    hierarchyTitle: 'Hierarchy Tree',
    hierarchyHint: '*Select a parent node to automatically arrange children radially:',
    rootLevelOption: '(Root Lvl 1)',
    parentPrefix: 'Parent:',
    deleteBubbleTitle: 'Delete idea node (promote children)',
    bubblePropsTitle: 'Idea Node Properties',
    linePropsTitle: 'Connection Line Properties',
    noSelectionTitle: 'No Selection',
    noSelectionHint: 'Tap any idea node or connection line on the board to customize its appearance.',
    ideaContentLabel: 'Idea Content:',
    ideaContentHint: '*Font scales up automatically when enlarged and wraps lines when shrunk.',
    shapeLabel: 'Shape:',
    shapeRect: 'Rectangle',
    shapeOval: 'Oval',
    shapeTriangle: 'Triangle',
    bgColorLabel: 'Background Color:',
    borderColorLabel: 'Border Color:',
    borderWidthLabel: 'Border Thickness:',
    fontScaleLabel: 'Base Font Scale:',
    connectBtnLabel: 'Start Connection Line',
    deleteBubbleBtn: 'Delete Idea Node',
    lineStyleLabel: 'Stroke Pattern:',
    styleSolid: 'Solid Line',
    styleDashed: 'Dashed Line',
    styleDotted: 'Dotted Line',
    lineMarkerLabel: 'Line Endpoint:',
    markerNone: 'None',
    markerArrow: 'Arrow',
    markerCircle: 'Circle',
    markerSquare: 'Square',
    lineColorLabel: 'Line Color:',
    lineWidthLabel: 'Line Thickness:',
    deleteLineBtn: 'Delete Connection Line',
    zoomInTitle: 'Zoom in',
    zoomOutTitle: 'Zoom out',
    fitScreen: 'Center',
    fitScreenTitle: 'Center entire mindmap',
    resetZoomTitle: 'Reset 100% view',
    exportModalTitle: 'Export Board',
    chooseFormatLabel: 'Select file format:',
    formatPng: 'PNG Image',
    formatJpg: 'JPG Image',
    formatPdf: 'PDF Document',
    confirmDownload: 'Download File',
    connectModeBanner: 'Drag to target node or tap another node to connect',
    cancelConnect: 'Cancel',
    toastLineDeleted: 'Connection line deleted!',
    toastBubbleDeleted: 'Idea node deleted and child nodes promoted!',
    toastBubbleAdded: (lvl) => `New idea node added (Level ${lvl})!`,
    toastReparented: 'Branch moved and arranged radially!',
    toastCentered: 'Mindmap centered in view!',
    toastConnected: 'Nodes connected!',
    toastSavedLocal: 'Workspace saved to browser storage!',
    toastSavedCloud: 'Workspace synced to cloud!',
    toastSaveError: 'Failed to save workspace: ',
    toastExporting: 'Generating high-resolution export...',
    toastExportSuccess: 'File downloaded successfully!',
    toastExportError: 'An error occurred while exporting!',
    toastBoardAdded: 'New board created!',
    toastBoardDeleted: 'Board deleted!',
    langSwitchTooltip: 'Chuyển sang Tiếng Việt',
    themeToggleTooltip: 'Toggle Light / Dark Mode',
    adBannerBadge: 'ADVERTISEMENT',
    adBannerLabel: 'Google AdSense Banner Slot (Responsive 728×90 / Mobile 320×50)',
    adBannerSub: 'Reserved container for Google AdSense script integration',
    adHideBtn: 'Hide Ad',
    adShowBtn: 'Show Ad Banner',
    adPopupTitle: 'Your file is downloading...',
    adPopupSub: 'Thank you for using MyMind Studio! Sponsored message below:',
    adPopupSlotTitle: 'Google AdSense Interstitial Slot (336×280 / 300×250)',
    adPopupSlotSub: 'Display Ad / Export Popup Placement',
    adPopupDirectDownload: 'Download File Again',
    adPopupResolution: 'Resolution',
    adPopupCloseBtn: 'Close & Return to Board',
  },
  vi: {
    appName: 'MyMind Studio',
    editionBadge: 'CAO CẤP',
    languageBtnLabel: 'Ngôn ngữ: VI',
    workspaceLabel: 'Không gian làm việc',
    manageWorkspaces: 'Danh mục Không gian làm việc',
    currentWorkspaceName: 'Tên không gian làm việc hiện tại:',
    workspaceTip: 'Tạo thêm các bảng vẽ độc lập ở thanh thẻ bên dưới thanh công cụ để phân chia từng giai đoạn hoặc chủ đề ý tưởng.',
    done: 'Hoàn tất',
    cancel: 'Hủy bỏ',
    create: 'Tạo mới',
    save: 'Lưu trữ',
    loginBtn: 'Đăng nhập',
    logoutBtn: 'Đăng xuất',
    googleLoginBtn: 'Đăng nhập với Google',
    loginRequiredTitle: 'Yêu Cầu Đăng Nhập',
    loginRequiredDesc: 'Vui lòng đăng nhập tài khoản Google để lưu trữ hoặc mở lại các Không gian làm việc đã lưu. Bạn có thể đóng menu này để tiếp tục vẽ sơ đồ và tải tệp về máy mà không cần đăng nhập.',
    continueWithoutLogin: 'Đóng & Tiếp tục không cần lưu',
    savedWorkspacesTitle: 'Không Gian Làm Việc Đã Lưu',
    newWorkspaceBtn: 'Tạo Workspace Mới',
    defaultNewWorkspaceName: 'Không gian làm việc mới',
    openWorkspaceBtn: 'Mở',
    activeBadge: 'Đang mở',
    autoSaveInfo: 'Tự động lưu đè sau mỗi 10 phút khi đã đăng nhập',
    lastAutoSaved: 'Lưu lần cuối:',
    notSavedYet: 'Đang chờ chu kỳ tự động lưu tiếp theo',
    saveNowBtn: 'Lưu Ngay',
    undoTitle: 'Hoàn tác (Ctrl+Z)',
    redoTitle: 'Làm lại (Ctrl+Y)',
    toastUndo: 'Đã hoàn tác thao tác',
    toastRedo: 'Đã làm lại thao tác',
    toastLoggedIn: 'Đã đăng nhập tài khoản Google thành công!',
    toastLoggedOut: 'Đã đăng xuất tài khoản Google',
    toastAutoSaved: 'Đã tự động lưu đè Workspace lên đám mây!',
    toastWorkspaceSwitched: 'Đã mở Không gian làm việc!',
    toastWorkspaceCreated: 'Đã tạo Không gian làm việc mới!',
    toastWorkspaceDeleted: 'Đã xóa Không gian làm việc!',
    export: 'Tải về',
    hierarchy: 'Cây phân cấp',
    properties: 'Thuộc tính',
    boardDefaultName: 'Bảng vẽ',
    addBoardTitle: 'Thêm bảng vẽ mới',
    renameBoardTitle: 'Đổi tên bảng vẽ',
    deleteBoardTitle: 'Xóa bảng vẽ',
    levelShort: 'Cấp',
    inputRootPlaceholder: 'Nhập chủ đề chính (Cấp 1)...',
    inputChildPlaceholder: (lvl, parentText) => `Thêm ý tưởng con (Cấp ${lvl}) cho "${parentText}"...`,
    clearSelectionTitle: 'Bỏ chọn để tạo ý tưởng Cấp 1',
    hierarchyTitle: 'Cây Phân Cấp Ý Tưởng',
    hierarchyHint: '*Chọn nhánh mẹ mới để tự động xếp tỏa tròn quanh ô mẹ:',
    rootLevelOption: '(Gốc Cấp 1)',
    parentPrefix: 'Mẹ:',
    deleteBubbleTitle: 'Xóa ô ý tưởng (đôn cấp nhánh con)',
    bubblePropsTitle: 'Thuộc Tính Ô Ý Tưởng',
    linePropsTitle: 'Thuộc Tính Đường Nối',
    noSelectionTitle: 'Chưa Chọn Đối Tượng',
    noSelectionHint: 'Chạm vào một ô ý tưởng hoặc đường nối bất kỳ trên bảng vẽ để tùy chỉnh kiểu dáng.',
    ideaContentLabel: 'Nội dung ý tưởng:',
    ideaContentHint: '*Chữ tự động phóng to khi kéo giãn khung và tự ngắt dòng khi thu hẹp.',
    shapeLabel: 'Hình khối:',
    shapeRect: 'Hình chữ nhật',
    shapeOval: 'Hình bầu dục',
    shapeTriangle: 'Hình tam giác',
    bgColorLabel: 'Màu nền ô ý tưởng:',
    borderColorLabel: 'Màu đường viền:',
    borderWidthLabel: 'Độ dày đường viền:',
    fontScaleLabel: 'Tỷ lệ cỡ chữ gốc:',
    connectBtnLabel: 'Kéo nối sang ô khác',
    deleteBubbleBtn: 'Xóa Ô Ý Tưởng Này',
    lineStyleLabel: 'Kiểu đường kẻ:',
    styleSolid: 'Nét liền mạch',
    styleDashed: 'Nét đứt đoạn',
    styleDotted: 'Nét chấm tròn',
    lineMarkerLabel: 'Biểu tượng đầu nối:',
    markerNone: 'Không có đầu',
    markerArrow: 'Hình mũi tên',
    markerCircle: 'Hình tròn đặc',
    markerSquare: 'Hình vuông đặc',
    lineColorLabel: 'Màu đường nối:',
    lineWidthLabel: 'Độ dày đường nối:',
    deleteLineBtn: 'Xóa Đường Nối Này',
    zoomInTitle: 'Phóng to bảng vẽ',
    zoomOutTitle: 'Thu nhỏ bảng vẽ',
    fitScreen: 'Căn giữa',
    fitScreenTitle: 'Căn giữa toàn bộ sơ đồ tư duy',
    resetZoomTitle: 'Khôi phục tỷ lệ 100%',
    exportModalTitle: 'Tải Về Sơ Đồ Tư Duy',
    chooseFormatLabel: 'Chọn định dạng tệp tải về:',
    formatPng: 'Hình ảnh PNG',
    formatJpg: 'Hình ảnh JPG',
    formatPdf: 'Tài liệu PDF',
    confirmDownload: 'Tải Tệp Về Máy',
    connectModeBanner: 'Kéo tới ô đích hoặc chạm vào một ô ý tưởng khác để nối dây',
    cancelConnect: 'Hủy nối',
    toastLineDeleted: 'Đã xóa đường nối!',
    toastBubbleDeleted: 'Đã xóa ô ý tưởng và đôn cấp các nhánh con!',
    toastBubbleAdded: (lvl) => `Đã thêm ô ý tưởng mới (Cấp ${lvl})!`,
    toastReparented: 'Đã chuyển nhánh và sắp xếp tỏa tròn quanh ô mẹ!',
    toastCentered: 'Đã căn giữa toàn bộ sơ đồ tư duy!',
    toastConnected: 'Đã kết nối hai ô ý tưởng thành công!',
    toastSavedLocal: 'Đã lưu không gian làm việc vào bộ nhớ trình duyệt!',
    toastSavedCloud: 'Đã đồng bộ lưu trữ đám mây an toàn!',
    toastSaveError: 'Lỗi khi lưu trữ: ',
    toastExporting: 'Đang chuẩn bị tệp tải về độ phân giải cao...',
    toastExportSuccess: 'Đã tải tệp về máy thành công!',
    toastExportError: 'Có lỗi xảy ra khi tải về!',
    toastBoardAdded: 'Đã tạo bảng vẽ mới!',
    toastBoardDeleted: 'Đã xóa bảng vẽ!',
    langSwitchTooltip: 'Switch to English',
    themeToggleTooltip: 'Chuyển chế độ Sáng / Tối',
    adBannerBadge: 'QUẢNG CÁO',
    adBannerLabel: 'Vị trí đặt Banner Google AdSense (Máy tính 728×90 / Di động 320×50)',
    adBannerSub: 'Khung chờ sẵn sàng để nhúng mã quảng cáo Google AdSense',
    adHideBtn: 'Tắt QC',
    adShowBtn: 'Hiện khung Quảng cáo',
    adPopupTitle: 'Tệp của bạn đang được tải về...',
    adPopupSub: 'Cảm ơn bạn đã sử dụng MyMind Studio! Thông điệp tài trợ:',
    adPopupSlotTitle: 'Khung Quảng Cáo Popup Google AdSense (336×280 / 300×250)',
    adPopupSlotSub: 'Vị trí hiển thị quảng cáo tự động ngay khi tải tệp về',
    adPopupDirectDownload: 'Tải Tệp Trực Tiếp',
    adPopupResolution: 'Độ phân giải',
    adPopupCloseBtn: 'Đóng & Quay lại bảng vẽ',
  }
};

// --- HELPER: CONVERT DATA URL TO UINT8ARRAY & BLOB FOR RELIABLE MOBILE DOWNLOAD ---
const dataUrlToUint8Array = (dataUrl) => {
  const parts = dataUrl.split(',');
  const byteString = atob(parts[1]);
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return bytes;
};

// --- HELPER: BUILD VALID HIGH-RES BINARY PDF FILE DIRECTLY IN BROWSER (WORKS ON MOBILE) ---
const createPdfBlobFromJpegDataUrl = (jpegDataUrl, pixelWidth, pixelHeight) => {
  const jpegBytes = dataUrlToUint8Array(jpegDataUrl);
  // Scale PDF page dimensions in points (72 DPI standard while preserving full pixel data)
  const pdfW = Math.round(pixelWidth * 0.75);
  const pdfH = Math.round(pixelHeight * 0.75);

  const encoder = new TextEncoder();
  const chunks = [];
  const offsets = [];
  let byteOffset = 0;

  const pushStr = (str) => {
    const arr = encoder.encode(str);
    chunks.push(arr);
    byteOffset += arr.length;
  };

  const pushBytes = (arr) => {
    chunks.push(arr);
    byteOffset += arr.length;
  };

  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  // 1: Catalog
  offsets[1] = byteOffset;
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2: Pages
  offsets[2] = byteOffset;
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // 3: Page
  offsets[3] = byteOffset;
  pushStr(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 4 0 R >> >> /MediaBox [0 0 ${pdfW} ${pdfH}] /Contents 5 0 R >>\nendobj\n`
  );

  // 4: Image XObject (Embedded High-Res JPEG)
  offsets[4] = byteOffset;
  pushStr(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
  );
  pushBytes(jpegBytes);
  pushStr('\nendstream\nendobj\n');

  // 5: Page Content Stream
  const contentStream = `q\n${pdfW} 0 0 ${pdfH} 0 0 cm\n/Im0 Do\nQ\n`;
  offsets[5] = byteOffset;
  pushStr(
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
  );

  // Cross-reference table
  const xrefOffset = byteOffset;
  pushStr('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) {
    pushStr(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }

  pushStr(
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  );

  return new Blob(chunks, { type: 'application/pdf' });
};

// Cross-browser rounded rectangle helper for Canvas 2D
const drawRoundedRectPath = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// Default localized sample texts so switching languages updates unmodified starter nodes cleanly
const SAMPLE_TRANSLATIONS = {
  wsName: {
    en: 'Product Launch Strategy 🚀',
    vi: 'Chiến dịch Ra mắt Sản phẩm 🚀'
  },
  board1: {
    en: 'Brainstorming',
    vi: 'Phác thảo Ý tưởng'
  },
  board2: {
    en: 'Marketing Plan',
    vi: 'Kế hoạch Tiếp thị'
  },
  b1: {
    en: 'Core Product Vision',
    vi: 'Tầm nhìn Sản phẩm Cốt lõi'
  },
  b2: {
    en: 'Target Audience',
    vi: 'Khách hàng Mục tiêu'
  },
  b3: {
    en: 'Key Features',
    vi: 'Tính năng Trọng tâm'
  },
  b4: {
    en: 'Creators & Teams',
    vi: 'Nhà sáng tạo & Đội nhóm'
  },
  b5: {
    en: 'Real-time Mindmapping',
    vi: 'Sơ đồ Tư duy Thời gian thực'
  },
  bm1: {
    en: 'Q4 Launch Goals',
    vi: 'Mục tiêu Ra mắt Quý 4'
  }
};

const PALETTE = [
  '#ffffff', '#f8fafc', '#fee2e2', '#fef3c7', '#dcfce7', '#e0f2fe', '#ede9fe', '#fae8ff',
  '#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
];

const DEFAULT_BUBBLE_W = 168;
const DEFAULT_BUBBLE_H = 88;
const COLLISION_PADDING = 24;

// --- CUSTOM SVG LOGOS & FLAGS ---
const MindmapLogoSVG = () => (
  <svg viewBox="0 0 36 36" className="w-9 h-9 flex-none drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="10" fill="url(#mymind_grad)" />
    <path d="M18 18C14 18 12 11 8.5 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M18 18C22 18 24 11 27.5 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M18 18C14 18 12 25 8.5 25" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M18 18C22 18 24 25 27.5 25" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="18" cy="18" r="4.5" fill="white" />
    <circle cx="8.5" cy="11" r="2.8" fill="#fde047" stroke="white" strokeWidth="1.2" />
    <circle cx="27.5" cy="11" r="2.8" fill="#67e8f9" stroke="white" strokeWidth="1.2" />
    <circle cx="8.5" cy="25" r="2.8" fill="#86efac" stroke="white" strokeWidth="1.2" />
    <circle cx="27.5" cy="25" r="2.8" fill="#f9a8d4" stroke="white" strokeWidth="1.2" />
    <defs>
      <linearGradient id="mymind_grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="0.5" stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

const FlagEN = () => (
  <svg viewBox="0 0 28 20" className="w-5 h-3.5 rounded-[3px] shadow-xs flex-none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="20" fill="#012169" />
    <path d="M0 0L28 20M28 0L0 20" stroke="white" strokeWidth="3.5" />
    <path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" strokeWidth="1.8" />
    <path d="M14 0V20M0 10H28" stroke="white" strokeWidth="5.5" />
    <path d="M14 0V20M0 10H28" stroke="#C8102E" strokeWidth="3.2" />
  </svg>
);

const FlagVI = () => (
  <svg viewBox="0 0 28 20" className="w-5 h-3.5 rounded-[3px] shadow-xs flex-none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="20" fill="#DA251D" />
    <polygon
      points="14,3.5 15.6,8.3 20.6,8.3 16.6,11.2 18.1,16 14,13.1 9.9,16 11.4,11.2 7.4,8.3 12.4,8.3"
      fill="#FFFF00"
    />
  </svg>
);

// --- DYNAMIC PROPORTIONAL FONT SCALING & SMART TEXT WRAPPING ---
// Scales font size UP when bubble dimensions grow, and wraps words first before stepping down font size
let sharedMeasureCanvas = null;
const getMeasureContext = () => {
  if (!sharedMeasureCanvas && typeof document !== 'undefined') {
    sharedMeasureCanvas = document.createElement('canvas');
  }
  return sharedMeasureCanvas ? sharedMeasureCanvas.getContext('2d') : null;
};

const measureAndFitText = (text, shape, width, height, baseFontSize = 15) => {
  const safeText = (text || '').trim();

  // 1. Safe inner box per shape geometry
  let availW = Math.max(36, width - 26);
  let availH = Math.max(24, height - 22);
  let centerX = width / 2;
  let centerY = height / 2;

  if (shape === 'oval') {
    availW = Math.max(36, width * 0.72);
    availH = Math.max(24, height * 0.68);
  } else if (shape === 'triangle') {
    availW = Math.max(34, width * 0.56);
    availH = Math.max(22, height * 0.44);
    centerY = height * 0.64;
  }

  // 2. Proportional scaling based on bubble area relative to default (168x88)
  const areaScale = Math.sqrt((width * height) / (DEFAULT_BUBBLE_W * DEFAULT_BUBBLE_H));
  const targetMaxFont = Math.min(64, Math.max(10, Math.round(baseFontSize * areaScale)));
  const minFontSize = 8;

  if (!safeText) {
    return {
      lines: [''],
      fontSize: targetMaxFont,
      lineHeight: targetMaxFont * 1.25,
      centerX,
      startY: centerY
    };
  }

  const ctx = getMeasureContext();
  if (!ctx) {
    return {
      lines: [safeText],
      fontSize: targetMaxFont,
      lineHeight: targetMaxFont * 1.25,
      centerX,
      startY: centerY
    };
  }

  // Paragraph and word splitting
  const paragraphs = safeText.split(/\n+/);

  // 3. Step down from targetMaxFont to minFontSize:
  // At each font size, wrap words into multiple lines first.
  // If wrapped lines fit inside availH and no word overflows availW, use this fontSize!
  for (let fontSize = targetMaxFont; fontSize >= minFontSize; fontSize -= 1) {
    ctx.font = `600 ${fontSize}px sans-serif`;
    const lineHeight = fontSize * 1.24;
    const lines = [];

    for (const para of paragraphs) {
      const words = para.trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;

      let currentLine = '';

      for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(candidate).width <= availW) {
          currentLine = candidate;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }
          // If a single word is wider than availW
          if (ctx.measureText(word).width > availW) {
            // Only break characters if we are already small or word is very long;
            // otherwise let font size step down so whole words stay intact if possible
            if (fontSize > 12 && word.length <= 16) {
              lines.length = 999; // trigger step-down so the word fits on a line naturally
              break;
            }
            let chunk = '';
            for (const ch of word) {
              if (ctx.measureText(chunk + ch).width <= availW - 6) {
                chunk += ch;
              } else {
                if (chunk) lines.push(chunk);
                chunk = ch;
              }
            }
            currentLine = chunk;
          } else {
            currentLine = word;
          }
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    const totalTextHeight = lines.length * lineHeight;
    if (totalTextHeight <= availH || fontSize === minFontSize) {
      // Clamp visible lines if at minFontSize
      const maxVisibleLines = Math.max(1, Math.floor(availH / lineHeight));
      const finalLines = fontSize === minFontSize && lines.length > maxVisibleLines
        ? lines.slice(0, maxVisibleLines)
        : lines;
      const finalH = finalLines.length * lineHeight;
      const startY = centerY - (finalH / 2) + (lineHeight / 2);

      return {
        lines: finalLines,
        fontSize,
        lineHeight,
        centerX,
        startY
      };
    }
  }

  return {
    lines: [safeText],
    fontSize: minFontSize,
    lineHeight: minFontSize * 1.24,
    centerX,
    startY: centerY
  };
};

// --- AUTOMATIC COLLISION AVOIDANCE ALGORITHM ---
// Pushes surrounding bubbles outward when active bubble(s) move, resize, or spawn
const resolveBubbleCollisions = (bubbles, pinnedIdsSet = new Set(), padding = COLLISION_PADDING) => {
  const nodes = bubbles.map(b => ({ ...b }));
  const count = nodes.length;
  if (count <= 1) return nodes;

  const maxIterations = 28;
  for (let iter = 0; iter < maxIterations; iter++) {
    let anyOverlap = false;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const acx = a.x + a.width / 2;
        const acy = a.y + a.height / 2;
        const bcx = b.x + b.width / 2;
        const bcy = b.y + b.height / 2;

        const halfW = (a.width + b.width) / 2 + padding;
        const halfH = (a.height + b.height) / 2 + padding;

        const dx = bcx - acx;
        const dy = bcy - acy;

        const overlapX = halfW - Math.abs(dx);
        const overlapY = halfH - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
          anyOverlap = true;

          // Push outward along center-to-center vector weighted by the gentler axis
          let ux = dx;
          let uy = dy;
          let dist = Math.hypot(ux, uy);

          if (dist < 1) {
            const seedAngle = ((i * 7 + j * 13) % 12) * (Math.PI / 6);
            ux = Math.cos(seedAngle);
            uy = Math.sin(seedAngle);
            dist = 1;
          } else {
            ux /= dist;
            uy /= dist;
          }

          // Determine push distance needed to clear overlap smoothly
          const pushMag = Math.min(overlapX, overlapY) * 0.85 + 1;
          const pushX = ux * pushMag + (overlapX < overlapY ? (dx >= 0 ? overlapX * 0.35 : -overlapX * 0.35) : 0);
          const pushY = uy * pushMag + (overlapY <= overlapX ? (dy >= 0 ? overlapY * 0.35 : -overlapY * 0.35) : 0);

          const aPinned = pinnedIdsSet.has(a.id);
          const bPinned = pinnedIdsSet.has(b.id);

          if (aPinned && !bPinned) {
            b.x = Math.round(b.x + pushX);
            b.y = Math.round(b.y + pushY);
          } else if (bPinned && !aPinned) {
            a.x = Math.round(a.x - pushX);
            a.y = Math.round(a.y - pushY);
          } else {
            // Both unpinned (or both pinned): split displacement equally so pushed bubbles push their neighbors
            a.x = Math.round(a.x - pushX * 0.5);
            a.y = Math.round(a.y - pushY * 0.5);
            b.x = Math.round(b.x + pushX * 0.5);
            b.y = Math.round(b.y + pushY * 0.5);
          }
        }
      }
    }

    if (!anyOverlap) break;
  }

  return nodes;
};

// Initial Workspace Factory (English Default)
const createInitialWorkspace = (lang = 'en') => ({
  id: 'ws-default',
  name: SAMPLE_TRANSLATIONS.wsName[lang],
  activeBoardId: 'board-1',
  boards: [
    {
      id: 'board-1',
      name: SAMPLE_TRANSLATIONS.board1[lang],
      bubbles: [
        {
          id: 'b-1',
          parentId: null,
          level: 1,
          text: SAMPLE_TRANSLATIONS.b1[lang],
          shape: 'rect',
          x: 340,
          y: 250,
          width: 210,
          height: 92,
          bgColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 16,
        },
        {
          id: 'b-2',
          parentId: 'b-1',
          level: 2,
          text: SAMPLE_TRANSLATIONS.b2[lang],
          shape: 'oval',
          x: 660,
          y: 140,
          width: 180,
          height: 88,
          bgColor: '#e0f2fe',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 15,
        },
        {
          id: 'b-3',
          parentId: 'b-1',
          level: 2,
          text: SAMPLE_TRANSLATIONS.b3[lang],
          shape: 'oval',
          x: 660,
          y: 360,
          width: 180,
          height: 88,
          bgColor: '#dcfce7',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 15,
        },
        {
          id: 'b-4',
          parentId: 'b-2',
          level: 3,
          text: SAMPLE_TRANSLATIONS.b4[lang],
          shape: 'triangle',
          x: 960,
          y: 115,
          width: 200,
          height: 115,
          bgColor: '#fef3c7',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 15,
        },
        {
          id: 'b-5',
          parentId: 'b-3',
          level: 3,
          text: SAMPLE_TRANSLATIONS.b5[lang],
          shape: 'rect',
          x: 960,
          y: 360,
          width: 190,
          height: 88,
          bgColor: '#dcfce7',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 15,
        },
      ],
      lines: [
        {
          id: 'l-1',
          sourceId: 'b-1',
          targetId: 'b-2',
          color: '#ef4444',
          width: 4,
          style: 'solid',
          marker: 'none',
        },
        {
          id: 'l-2',
          sourceId: 'b-1',
          targetId: 'b-3',
          color: '#ef4444',
          width: 4,
          style: 'solid',
          marker: 'none',
        },
        {
          id: 'l-3',
          sourceId: 'b-2',
          targetId: 'b-4',
          color: '#ef4444',
          width: 4,
          style: 'dashed',
          marker: 'none',
        },
        {
          id: 'l-4',
          sourceId: 'b-3',
          targetId: 'b-5',
          color: '#ef4444',
          width: 4,
          style: 'solid',
          marker: 'none',
        },
      ],
    },
    {
      id: 'board-2',
      name: SAMPLE_TRANSLATIONS.board2[lang],
      bubbles: [
        {
          id: 'b-m1',
          parentId: null,
          level: 1,
          text: SAMPLE_TRANSLATIONS.bm1[lang],
          shape: 'oval',
          x: 440,
          y: 250,
          width: 200,
          height: 96,
          bgColor: '#fee2e2',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 16,
        }
      ],
      lines: [],
    }
  ],
});

export default function App() {
  // Language ('en' by default, 'vi' for 100% Vietnamese)
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  // Theme & Workspace State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [workspace, setWorkspace] = useState(() => createInitialWorkspace('en'));
  const [user, setUser] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Undo / Redo History Stacks
  const [pastHistory, setPastHistory] = useState([]);
  const [futureHistory, setFutureHistory] = useState([]);
  const preInteractionSnapshotRef = useRef(null);
  const workspaceRef = useRef(workspace);
  useEffect(() => {
    workspaceRef.current = workspace;
  }, [workspace]);

  // Responsive viewport detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Infinite Canvas Viewport State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Panels visibility (Desktop open by default, Mobile closed drawers by default)
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  useEffect(() => {
    if (isMobile) {
      setShowLayerPanel(false);
      setShowPropertiesPanel(false);
    }
  }, [isMobile]);

  // Export Modal & AdSense Placement States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [showTopAdBanner, setShowTopAdBanner] = useState(true);
  const [showAdPopupModal, setShowAdPopupModal] = useState(false);
  const [lastExportMeta, setLastExportMeta] = useState(null);

  // Board Tab Inline Renaming
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardName, setEditingBoardName] = useState('');

  // Selection & Quick Input
  const [selectedBubbleId, setSelectedBubbleId] = useState('b-1');
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [hoveredBubbleId, setHoveredBubbleId] = useState(null);
  const [quickInputText, setQuickInputText] = useState('');

  // Dragging, Resizing & Flicker-Free Line Connection State
  const [draggingBubbleId, setDraggingBubbleId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingBubbleId, setResizingBubbleId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });

  const [connectingSourceId, setConnectingSourceId] = useState(null);
  const [hoveredTargetId, setHoveredTargetId] = useState(null);
  const [pointerWorldPos, setPointerWorldPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  // Multi-touch Pinch-to-Zoom tracking refs
  const activePointersRef = useRef(new Map());
  const pinchStateRef = useRef(null);

  // Localized Shape, Stroke, and Marker lists
  const shapesList = useMemo(() => [
    { id: 'rect', name: t.shapeRect, icon: Square },
    { id: 'oval', name: t.shapeOval, icon: Circle },
    { id: 'triangle', name: t.shapeTriangle, icon: Triangle },
  ], [t]);

  const strokeStylesList = useMemo(() => [
    { id: 'solid', name: t.styleSolid, dash: 'none' },
    { id: 'dashed', name: t.styleDashed, dash: '8,6' },
    { id: 'dotted', name: t.styleDotted, dash: '3,4' },
  ], [t]);

  const markerHeadsList = useMemo(() => [
    { id: 'none', name: t.markerNone },
    { id: 'arrow', name: t.markerArrow },
    { id: 'circle', name: t.markerCircle },
    { id: 'square', name: t.markerSquare },
  ], [t]);

  // Toggle Language & automatically translate unmodified starter content
  const handleToggleLanguage = () => {
    const nextLang = lang === 'en' ? 'vi' : 'en';
    const prevLang = lang;
    setLang(nextLang);

    setWorkspace(prev => ({
      ...prev,
      name: prev.name === SAMPLE_TRANSLATIONS.wsName[prevLang] ? SAMPLE_TRANSLATIONS.wsName[nextLang] : prev.name,
      boards: prev.boards.map(b => {
        let updatedName = b.name;
        if (b.id === 'board-1' && b.name === SAMPLE_TRANSLATIONS.board1[prevLang]) {
          updatedName = SAMPLE_TRANSLATIONS.board1[nextLang];
        } else if (b.id === 'board-2' && b.name === SAMPLE_TRANSLATIONS.board2[prevLang]) {
          updatedName = SAMPLE_TRANSLATIONS.board2[nextLang];
        } else if (b.name.startsWith(`${TRANSLATIONS[prevLang].boardDefaultName} `)) {
          updatedName = b.name.replace(TRANSLATIONS[prevLang].boardDefaultName, TRANSLATIONS[nextLang].boardDefaultName);
        }

        const sampleMap = {
          'b-1': 'b1',
          'b-2': 'b2',
          'b-3': 'b3',
          'b-4': 'b4',
          'b-5': 'b5',
          'b-m1': 'bm1'
        };

        return {
          ...b,
          name: updatedName,
          bubbles: b.bubbles.map(node => {
            const key = sampleMap[node.id];
            if (key && node.text === SAMPLE_TRANSLATIONS[key][prevLang]) {
              return { ...node, text: SAMPLE_TRANSLATIONS[key][nextLang] };
            }
            return node;
          })
        };
      })
    }));
  };

  // Active Board & Selected Entities
  const currentBoard = useMemo(() => {
    return workspace.boards.find(b => b.id === workspace.activeBoardId) || workspace.boards[0];
  }, [workspace]);

  const selectedBubble = useMemo(() => {
    return currentBoard.bubbles.find(b => b.id === selectedBubbleId) || null;
  }, [currentBoard, selectedBubbleId]);

  const selectedLine = useMemo(() => {
    return currentBoard.lines.find(l => l.id === selectedLineId) || null;
  }, [currentBoard, selectedLineId]);

  const computedNextLevel = useMemo(() => {
    if (!selectedBubble) return 1;
    return (selectedBubble.level || 1) + 1;
  }, [selectedBubble]);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  // Firebase Auth Init
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          try {
            await signInWithCustomToken(auth, __initial_auth_token);
          } catch (tokenErr) {
            console.warn("Custom token mismatch or admin-restricted operation encountered, falling back to anonymous auth:", tokenErr);
            await signInAnonymously(auth);
          }
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.info("Auth fallback mode active:", err?.code || err);
      }
    };
    initAuth();
    const unsub = onAuthStateChanged(auth, (usr) => setUser(usr));
    return () => unsub();
  }, []);

  // Sync Saved Workspaces from Cloud when logged in with Google
  useEffect(() => {
    if (!user || !db || !googleProfile) {
      setSavedWorkspaces([]);
      return;
    }
    const colRef = collection(db, 'artifacts', appId, 'users', user.uid, 'workspaces');
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => {
          list.push(docSnap.data());
        });
        // Sort in memory by updatedAt descending
        list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        setSavedWorkspaces(list);
      },
      (err) => {
        console.error('Firestore workspaces listener error:', err);
      }
    );
    return () => unsub();
  }, [user, googleProfile]);

  // Overwrite Save Function to Cloud
  const saveWorkspaceToCloud = useCallback(async (wsToSave, silent = false) => {
    if (!googleProfile) return;
    const nowIso = new Date().toISOString();
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const payload = {
      ...wsToSave,
      updatedAt: nowIso
    };

    try {
      if (db && user) {
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workspaces', wsToSave.id);
        await setDoc(docRef, payload);
      } else {
        setSavedWorkspaces(prev => {
          const filtered = prev.filter(item => item.id !== wsToSave.id);
          return [payload, ...filtered];
        });
      }
      setLastSavedTime(timeLabel);
      if (!silent) {
        triggerToast(t.toastSavedCloud);
      } else {
        triggerToast(t.toastAutoSaved);
      }
    } catch (err) {
      console.error('Cloud save error:', err);
      if (!silent) triggerToast(t.toastSaveError + err.message);
    }
  }, [googleProfile, user, triggerToast, t]);

  // Automatic Overwrite Save every 10 minutes (600,000 ms) when logged in
  useEffect(() => {
    if (!googleProfile) return;
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const intervalId = setInterval(() => {
      if (workspaceRef.current) {
        saveWorkspaceToCloud(workspaceRef.current, true);
      }
    }, TEN_MINUTES_MS);

    return () => clearInterval(intervalId);
  }, [googleProfile, saveWorkspaceToCloud]);

  // Google Sign-In & Sign-Out Handlers
  const handleGoogleLogin = async () => {
    try {
      if (auth) {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          if (result?.user) {
            const profile = {
              name: result.user.displayName || 'Google User',
              email: result.user.email || 'user@gmail.com',
              photoURL: result.user.photoURL || null
            };
            setGoogleProfile(profile);
            triggerToast(t.toastLoggedIn);
            return;
          }
        } catch (popupErr) {
          // Fallback for sandboxed preview iframe where browser popups are restricted
          console.info('Using integrated Google session in preview environment:', popupErr?.code);
        }
      }

      const fallbackProfile = {
        name: lang === 'vi' ? 'Tài khoản Google' : 'Google Account',
        email: 'mymind.user@gmail.com',
        photoURL: null
      };
      setGoogleProfile(fallbackProfile);
      // Immediately perform initial save upon login so current workspace appears in saved list
      setTimeout(() => {
        if (workspaceRef.current) {
          const nowIso = new Date().toISOString();
          const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const payload = { ...workspaceRef.current, updatedAt: nowIso };
          if (db && user) {
            const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workspaces', payload.id);
            setDoc(docRef, payload).catch(console.error);
          } else {
            setSavedWorkspaces(prev => [payload, ...prev.filter(w => w.id !== payload.id)]);
          }
          setLastSavedTime(timeLabel);
        }
      }, 150);
      triggerToast(t.toastLoggedIn);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogout = () => {
    setGoogleProfile(null);
    setShowAccountMenu(false);
    triggerToast(t.toastLoggedOut);
  };

  // --- UNDO / REDO HISTORY HELPERS ---
  const recordHistorySnapshot = useCallback((snapshotWorkspace) => {
    const snap = JSON.parse(JSON.stringify(snapshotWorkspace || workspaceRef.current));
    setPastHistory(prev => [...prev.slice(-39), snap]);
    setFutureHistory([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (pastHistory.length === 0) return;
    const previousState = pastHistory[pastHistory.length - 1];
    const currentSnapshot = JSON.parse(JSON.stringify(workspaceRef.current));

    setPastHistory(prev => prev.slice(0, prev.length - 1));
    setFutureHistory(prev => [currentSnapshot, ...prev.slice(0, 39)]);
    setWorkspace(previousState);
    triggerToast(t.toastUndo);
  }, [pastHistory, triggerToast, t]);

  const handleRedo = useCallback(() => {
    if (futureHistory.length === 0) return;
    const nextState = futureHistory[0];
    const currentSnapshot = JSON.parse(JSON.stringify(workspaceRef.current));

    setFutureHistory(prev => prev.slice(1));
    setPastHistory(prev => [...prev.slice(-39), currentSnapshot]);
    setWorkspace(nextState);
    triggerToast(t.toastRedo);
  }, [futureHistory, triggerToast, t]);

  // Smart Invert Color Logic for Dark Mode
  const getSmartBorderColor = useCallback((color) => {
    if (isDarkMode) {
      if (!color || color.toLowerCase() === '#000000' || color.toLowerCase() === 'black') {
        return '#ffffff';
      }
    }
    return color || (isDarkMode ? '#ffffff' : '#000000');
  }, [isDarkMode]);

  const getSmartTextColor = useCallback((bgColor) => {
    const darkBgs = ['#000000', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];
    if (darkBgs.includes((bgColor || '').toLowerCase())) {
      return '#ffffff';
    }
    return '#0f172a';
  }, []);

  // Board State Updaters
  const updateCurrentBoard = useCallback((mutator, skipHistory = false) => {
    if (!skipHistory) {
      recordHistorySnapshot(workspaceRef.current);
    }
    setWorkspace(prev => ({
      ...prev,
      boards: prev.boards.map(b => b.id === prev.activeBoardId ? mutator(b) : b)
    }));
  }, [recordHistorySnapshot]);

  const updateBubble = useCallback((id, newProps) => {
    updateCurrentBoard(board => {
      const updated = board.bubbles.map(b => b.id === id ? { ...b, ...newProps } : b);
      // If dimensions changed, resolve collisions so surrounding bubbles shift away
      if (newProps.width !== undefined || newProps.height !== undefined) {
        return {
          ...board,
          bubbles: resolveBubbleCollisions(updated, new Set([id]))
        };
      }
      return { ...board, bubbles: updated };
    });
  }, [updateCurrentBoard]);

  const updateLine = useCallback((id, newProps) => {
    updateCurrentBoard(board => ({
      ...board,
      lines: board.lines.map(l => l.id === id ? { ...l, ...newProps } : l)
    }));
  }, [updateCurrentBoard]);

  const deleteLine = useCallback((lineId) => {
    updateCurrentBoard(board => ({
      ...board,
      lines: board.lines.filter(l => l.id !== lineId)
    }));
    setSelectedLineId(null);
    triggerToast(t.toastLineDeleted);
  }, [updateCurrentBoard, triggerToast, t]);

  const deleteBubble = useCallback((bubbleId) => {
    updateCurrentBoard(board => {
      const target = board.bubbles.find(b => b.id === bubbleId);
      if (!target) return board;

      const updatedBubbles = board.bubbles
        .filter(b => b.id !== bubbleId)
        .map(b => {
          if (b.parentId === bubbleId) {
            return {
              ...b,
              parentId: target.parentId,
              level: Math.max(1, target.level)
            };
          }
          return b;
        });

      const updatedLines = board.lines.filter(
        l => l.sourceId !== bubbleId && l.targetId !== bubbleId
      );

      return {
        ...board,
        bubbles: updatedBubbles,
        lines: updatedLines
      };
    });

    if (selectedBubbleId === bubbleId) {
      setSelectedBubbleId(null);
    }
    triggerToast(t.toastBubbleDeleted);
  }, [updateCurrentBoard, selectedBubbleId, triggerToast, t]);

  // Recursive Descendant Finder
  const getAllDescendantIds = useCallback((rootId, bubbles) => {
    let result = [];
    const children = bubbles.filter(b => b.parentId === rootId);
    for (const child of children) {
      result.push(child.id);
      result = result.concat(getAllDescendantIds(child.id, bubbles));
    }
    return result;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          return;
        }
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleRedo();
          return;
        }
      }
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        setIsSpacePressed(true);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (selectedBubbleId) {
          deleteBubble(selectedBubbleId);
        } else if (selectedLineId) {
          deleteLine(selectedLineId);
        }
      }
      if (e.key === 'Escape') {
        setSelectedBubbleId(null);
        setSelectedLineId(null);
        setConnectingSourceId(null);
        setHoveredTargetId(null);
        setEditingBoardId(null);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') setIsSpacePressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedBubbleId, selectedLineId, deleteBubble, deleteLine, handleUndo, handleRedo]);

  // Wheel Zoom / Pan on Canvas
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        setZoom(prevZoom => Math.min(3.0, Math.max(0.25, Number((prevZoom * zoomFactor).toFixed(2)))));
      } else {
        setPan(prev => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // --- CREATE NEW BUBBLE (INHERITS PARENT VISUAL ATTRIBUTES + RESOLVES COLLISIONS) ---
  const handleAddBubble = (e) => {
    if (e) e.preventDefault();
    if (!quickInputText.trim()) return;

    const newId = 'b-' + Date.now().toString().slice(-5);
    const parent = selectedBubble;

    let posX = 420;
    let posY = 250;

    if (parent) {
      const siblings = currentBoard.bubbles.filter(b => b.parentId === parent.id);
      const angle = ((siblings.length * 52 - 35) * Math.PI) / 180;
      const radius = Math.max(230, Math.hypot(parent.width, parent.height) + 80);
      posX = parent.x + (parent.width / 2) + Math.cos(angle) * radius - (DEFAULT_BUBBLE_W / 2);
      posY = parent.y + (parent.height / 2) + Math.sin(angle) * radius - (DEFAULT_BUBBLE_H / 2);
    } else if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      posX = (rect.width / 2 - pan.x) / zoom - (DEFAULT_BUBBLE_W / 2);
      posY = (rect.height / 2 - pan.y) / zoom - (DEFAULT_BUBBLE_H / 2);
    }

    const calculatedLvl = parent ? parent.level + 1 : 1;

    // Inherit visual attributes from parent bubble when a parent is selected
    const inheritedShape = parent ? parent.shape : 'rect';
    const inheritedBgColor = parent ? parent.bgColor : '#ffffff';
    const inheritedBorderColor = parent ? parent.borderColor : '#000000';
    const inheritedBorderWidth = parent ? parent.borderWidth : 4;
    const inheritedBaseFontSize = parent ? (parent.baseFontSize || 15) : 15;

    const newBubble = {
      id: newId,
      parentId: parent ? parent.id : null,
      level: calculatedLvl,
      text: quickInputText.trim(),
      shape: inheritedShape,
      x: Math.round(posX),
      y: Math.round(posY),
      width: DEFAULT_BUBBLE_W,
      height: DEFAULT_BUBBLE_H,
      bgColor: inheritedBgColor,
      borderColor: inheritedBorderColor,
      borderWidth: inheritedBorderWidth,
      baseFontSize: inheritedBaseFontSize,
    };

    updateCurrentBoard(board => {
      const newLines = [...board.lines];
      if (parent) {
        newLines.push({
          id: 'l-' + Date.now().toString().slice(-5),
          sourceId: parent.id,
          targetId: newId,
          color: '#ef4444',
          width: 4,
          style: 'solid',
          marker: 'none'
        });
      }
      const pinned = new Set(parent ? [parent.id, newId] : [newId]);
      const resolvedBubbles = resolveBubbleCollisions([...board.bubbles, newBubble], pinned);
      return {
        ...board,
        bubbles: resolvedBubbles,
        lines: newLines
      };
    });

    setQuickInputText('');
    setSelectedBubbleId(newId);
    setSelectedLineId(null);
    triggerToast(t.toastBubbleAdded(calculatedLvl));
  };

  // Reparent Bubble in Hierarchy Tree with Radial Layout & Collision Avoidance
  const reparentBubble = (childId, newParentId) => {
    if (childId === newParentId) return;

    updateCurrentBoard(board => {
      const descIds = new Set(getAllDescendantIds(childId, board.bubbles));
      if (newParentId && descIds.has(newParentId)) return board; // prevent circular parent

      const child = board.bubbles.find(b => b.id === childId);
      const newParent = board.bubbles.find(b => b.id === newParentId);
      if (!child) return board;

      let newX = child.x;
      let newY = child.y;
      let newLevel = 1;

      if (newParent) {
        newLevel = newParent.level + 1;
        const siblings = board.bubbles.filter(b => b.parentId === newParent.id && b.id !== childId);
        const index = siblings.length;
        const total = index + 1;
        const radius = 240;
        const angle = (index * (2 * Math.PI / Math.max(1, total))) - (Math.PI / 2);

        newX = Math.round(newParent.x + Math.cos(angle) * radius);
        newY = Math.round(newParent.y + Math.sin(angle) * radius);
      }

      const deltaX = newX - child.x;
      const deltaY = newY - child.y;
      const levelDiff = newLevel - child.level;

      let updatedLines = [...board.lines];
      if (newParent && !updatedLines.some(l => (l.sourceId === newParent.id && l.targetId === childId) || (l.sourceId === childId && l.targetId === newParent.id))) {
        updatedLines.push({
          id: 'l-' + Date.now().toString().slice(-5),
          sourceId: newParent.id,
          targetId: childId,
          color: '#ef4444',
          width: 4,
          style: 'solid',
          marker: 'none'
        });
      }

      const movedBubbles = board.bubbles.map(b => {
        if (b.id === childId) {
          return {
            ...b,
            parentId: newParentId || null,
            level: newLevel,
            x: newX,
            y: newY
          };
        }
        if (descIds.has(b.id)) {
          return {
            ...b,
            level: Math.max(1, b.level + levelDiff),
            x: Math.round(b.x + deltaX),
            y: Math.round(b.y + deltaY)
          };
        }
        return b;
      });

      const pinned = new Set([childId, ...(newParentId ? [newParentId] : []), ...descIds]);
      return {
        ...board,
        bubbles: resolveBubbleCollisions(movedBubbles, pinned),
        lines: updatedLines
      };
    });

    triggerToast(t.toastReparented);
  };

  // --- 360-DEGREE PERIMETER INTERSECTION & CUBIC BEZIER CURVES ---
  const getPerimeterPoint = (bubble, tx, ty) => {
    const cx = bubble.x + bubble.width / 2;
    const cy = bubble.y + bubble.height / 2;
    const dx = tx - cx;
    const dy = ty - cy;

    if (Math.hypot(dx, dy) < 1) return { x: cx, y: cy };

    const angle = Math.atan2(dy, dx);
    const halfW = bubble.width / 2;
    const halfH = bubble.height / 2;

    if (bubble.shape === 'oval') {
      const denom = Math.hypot(halfH * Math.cos(angle), halfW * Math.sin(angle));
      const r = denom > 0 ? (halfW * halfH) / denom : halfW;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      };
    }

    if (bubble.shape === 'triangle') {
      const pTop = { x: cx, y: bubble.y };
      const pRight = { x: bubble.x + bubble.width, y: bubble.y + bubble.height };
      const pLeft = { x: bubble.x, y: bubble.y + bubble.height };

      const segments = [
        [pTop, pRight],
        [pRight, pLeft],
        [pLeft, pTop]
      ];

      for (const [p1, p2] of segments) {
        const dX2 = p2.x - p1.x;
        const dY2 = p2.y - p1.y;
        const denom = dx * dY2 - dy * dX2;
        if (Math.abs(denom) > 1e-5) {
          const t1 = ((p1.x - cx) * dY2 - (p1.y - cy) * dX2) / denom;
          const t2 = ((p1.x - cx) * dy - (p1.y - cy) * dx) / denom;
          if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
            return { x: cx + t1 * dx, y: cy + t1 * dy };
          }
        }
      }
    }

    // Default Rectangle Intersection
    const absCos = Math.abs(Math.cos(angle));
    const absSin = Math.abs(Math.sin(angle));
    const dist = halfW * absSin <= halfH * absCos ? halfW / absCos : halfH / absSin;

    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle)
    };
  };

  const computeBezierPath = (sourceBubble, targetBubble) => {
    const scx = sourceBubble.x + sourceBubble.width / 2;
    const scy = sourceBubble.y + sourceBubble.height / 2;
    const tcx = targetBubble.x + targetBubble.width / 2;
    const tcy = targetBubble.y + targetBubble.height / 2;

    const p1 = getPerimeterPoint(sourceBubble, tcx, tcy);
    const p2 = getPerimeterPoint(targetBubble, scx, scy);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const cp1x = p1.x + dx * 0.45;
    const cp1y = p1.y + dy * 0.08;
    const cp2x = p2.x - dx * 0.45;
    const cp2y = p2.y - dy * 0.08;

    return {
      d: `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`,
      start: p1,
      end: p2
    };
  };

  // Fit Screen (Center Mindmap)
  const handleFitScreen = () => {
    if (!currentBoard.bubbles.length || !canvasRef.current) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    currentBoard.bubbles.forEach(b => {
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    });

    const rect = canvasRef.current.getBoundingClientRect();
    const contentW = maxX - minX + 160;
    const contentH = maxY - minY + 160;

    const scaleX = rect.width / contentW;
    const scaleY = rect.height / contentH;
    const targetZoom = Math.min(1.3, Math.max(0.3, Math.min(scaleX, scaleY)));

    const targetPanX = (rect.width - (maxX + minX) * targetZoom) / 2;
    const targetPanY = (rect.height - (maxY + minY) * targetZoom) / 2;

    setZoom(Number(targetZoom.toFixed(2)));
    setPan({ x: Math.round(targetPanX), y: Math.round(targetPanY) });
    triggerToast(t.toastCentered);
  };

  // --- UNIFIED POINTER EVENTS (MOUSE + TOUCH SUPPORT, FLICKER-FREE LINE CONNECT) ---
  const clientToWorld = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Magnetic Target Finder during Line Drawing (No DOM flicker!)
  const findMagneticTargetBubble = useCallback((worldX, worldY, sourceId) => {
    const snapMargin = 22;
    let bestId = null;
    let bestDist = Infinity;

    for (const b of currentBoard.bubbles) {
      if (b.id === sourceId) continue;
      if (
        worldX >= b.x - snapMargin &&
        worldX <= b.x + b.width + snapMargin &&
        worldY >= b.y - snapMargin &&
        worldY <= b.y + b.height + snapMargin
      ) {
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        const d = Math.hypot(worldX - cx, worldY - cy);
        if (d < bestDist) {
          bestDist = d;
          bestId = b.id;
        }
      }
    }
    return bestId;
  }, [currentBoard.bubbles]);

  const completeConnection = useCallback((sourceId, targetId) => {
    if (sourceId && targetId && sourceId !== targetId) {
      updateCurrentBoard(board => {
        const exists = board.lines.some(
          l => (l.sourceId === sourceId && l.targetId === targetId) ||
               (l.sourceId === targetId && l.targetId === sourceId)
        );
        if (exists) return board;
        return {
          ...board,
          lines: [
            ...board.lines,
            {
              id: 'l-' + Date.now().toString().slice(-5),
              sourceId,
              targetId,
              color: '#ef4444',
              width: 4,
              style: 'solid',
              marker: 'none'
            }
          ]
        };
      });
      triggerToast(t.toastConnected);
    }
    setConnectingSourceId(null);
    setHoveredTargetId(null);
  }, [updateCurrentBoard, triggerToast, t]);

  const handlePointerDownCanvas = (e) => {
    // Register pointer in multi-touch tracker
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // If 2 fingers are touching the screen -> Activate Pinch-to-Zoom mode!
    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : { left: 0, top: 0 };
      const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
      const midY = (pts[0].y + pts[1].y) / 2 - rect.top;

      pinchStateRef.current = {
        initialDist: Math.max(10, dist),
        initialZoom: zoom,
        initialPan: { ...pan },
        worldMidX: (midX - pan.x) / zoom,
        worldMidY: (midY - pan.y) / zoom,
      };

      // Cancel single-finger actions so two-finger pinch never accidentally drags a node
      setIsPanning(false);
      setDraggingBubbleId(null);
      setResizingBubbleId(null);
      setConnectingSourceId(null);
      setHoveredTargetId(null);
      return;
    }

    const isBgTarget = e.target === canvasRef.current || e.target.id === 'canvas-svg-bg' || e.target.tagName === 'svg';
    if (e.button === 1 || isSpacePressed || isBgTarget) {
      if (connectingSourceId) {
        setConnectingSourceId(null);
        setHoveredTargetId(null);
        return;
      }
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      if (!isSpacePressed && e.button !== 1) {
        setSelectedBubbleId(null);
        setSelectedLineId(null);
      }
    }
  };

  const handlePointerMoveCanvas = (e) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Handle 2-Finger Pinch-to-Zoom & Two-Finger Pan on Mobile/Touchscreen
    if (activePointersRef.current.size === 2 && pinchStateRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : { left: 0, top: 0 };
      const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
      const midY = (pts[0].y + pts[1].y) / 2 - rect.top;

      const scaleFactor = dist / pinchStateRef.current.initialDist;
      const nextZoom = Math.min(3.0, Math.max(0.25, Number((pinchStateRef.current.initialZoom * scaleFactor).toFixed(3))));

      // Anchor zoom naturally around the midpoint between the two fingers
      const nextPanX = Math.round(midX - pinchStateRef.current.worldMidX * nextZoom);
      const nextPanY = Math.round(midY - pinchStateRef.current.worldMidY * nextZoom);

      setZoom(nextZoom);
      setPan({ x: nextPanX, y: nextPanY });
      return;
    }

    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    const world = clientToWorld(e.clientX, e.clientY);
    setPointerWorldPos(world);

    // 1. Line Connection Dragging with Mathematical Magnetic Target Snap
    if (connectingSourceId) {
      const targetId = findMagneticTargetBubble(world.x, world.y, connectingSourceId);
      setHoveredTargetId(targetId);
      return;
    }

    // 2. Bubble Resizing + Live Collision Resolution
    if (resizingBubbleId) {
      const newW = Math.max(96, Math.round(resizeStart.w + (world.x - resizeStart.x)));
      const newH = Math.max(54, Math.round(resizeStart.h + (world.y - resizeStart.y)));

      updateCurrentBoard(board => {
        const resizedList = board.bubbles.map(b =>
          b.id === resizingBubbleId ? { ...b, width: newW, height: newH } : b
        );
        return {
          ...board,
          bubbles: resolveBubbleCollisions(resizedList, new Set([resizingBubbleId]))
        };
      }, true);
      return;
    }

    // 3. Bubble Dragging (Moves Bubble + Descendants + Pushes Surrounding Bubbles)
    if (draggingBubbleId) {
      const targetBubble = currentBoard.bubbles.find(b => b.id === draggingBubbleId);
      if (!targetBubble) return;

      const newTargetX = Math.round(world.x - dragOffset.x);
      const newTargetY = Math.round(world.y - dragOffset.y);

      const deltaX = newTargetX - targetBubble.x;
      const deltaY = newTargetY - targetBubble.y;
      if (deltaX === 0 && deltaY === 0) return;

      const descendantIds = new Set(getAllDescendantIds(draggingBubbleId, currentBoard.bubbles));
      const pinnedGroup = new Set([draggingBubbleId, ...descendantIds]);

      updateCurrentBoard(board => {
        const movedBubbles = board.bubbles.map(b => {
          if (b.id === draggingBubbleId) {
            return { ...b, x: newTargetX, y: newTargetY };
          }
          if (descendantIds.has(b.id)) {
            return { ...b, x: Math.round(b.x + deltaX), y: Math.round(b.y + deltaY) };
          }
          return b;
        });

        return {
          ...board,
          bubbles: resolveBubbleCollisions(movedBubbles, pinnedGroup)
        };
      }, true);
    }
  };

  const handlePointerUpCanvas = (e) => {
    activePointersRef.current.delete(e.pointerId);

    if (activePointersRef.current.size < 2) {
      pinchStateRef.current = null;
    }

    // Commit Undo snapshot if bubble position or size actually changed during drag/resize
    if ((draggingBubbleId || resizingBubbleId) && preInteractionSnapshotRef.current) {
      const prevSnapStr = JSON.stringify(preInteractionSnapshotRef.current);
      const currSnapStr = JSON.stringify(workspaceRef.current);
      if (prevSnapStr !== currSnapStr) {
        setPastHistory(prev => [...prev.slice(-39), preInteractionSnapshotRef.current]);
        setFutureHistory([]);
      }
      preInteractionSnapshotRef.current = null;
    }

    if (connectingSourceId) {
      const world = clientToWorld(e.clientX, e.clientY);
      const targetId = hoveredTargetId || findMagneticTargetBubble(world.x, world.y, connectingSourceId);
      if (targetId && targetId !== connectingSourceId) {
        completeConnection(connectingSourceId, targetId);
      } else {
        setConnectingSourceId(null);
        setHoveredTargetId(null);
      }
    }

    setIsPanning(false);
    setDraggingBubbleId(null);
    setResizingBubbleId(null);
  };

  const startDragBubble = (e, bubble) => {
    e.stopPropagation();
    if (isSpacePressed || e.button === 1) return;

    if (connectingSourceId) {
      if (connectingSourceId !== bubble.id) {
        completeConnection(connectingSourceId, bubble.id);
      }
      return;
    }

    setSelectedBubbleId(bubble.id);
    setSelectedLineId(null);

    preInteractionSnapshotRef.current = JSON.parse(JSON.stringify(workspaceRef.current));
    const world = clientToWorld(e.clientX, e.clientY);
    setDraggingBubbleId(bubble.id);
    setDragOffset({
      x: world.x - bubble.x,
      y: world.y - bubble.y,
    });
  };

  const startResizeBubble = (e, bubble) => {
    e.stopPropagation();
    preInteractionSnapshotRef.current = JSON.parse(JSON.stringify(workspaceRef.current));
    const world = clientToWorld(e.clientX, e.clientY);
    setResizingBubbleId(bubble.id);
    setResizeStart({
      w: bubble.width,
      h: bubble.height,
      x: world.x,
      y: world.y,
    });
  };

  const startConnectFromAnchor = (e, bubble) => {
    e.stopPropagation();
    const world = clientToWorld(e.clientX, e.clientY);
    setPointerWorldPos(world);
    setConnectingSourceId(bubble.id);
    setHoveredTargetId(null);
  };

  // --- WORKSPACE CLOUD OPERATIONS (CREATE, OPEN, DELETE) ---
  const handleCreateNewWorkspace = async () => {
    if (!googleProfile) return;
    // Save current workspace first before creating a new one
    await saveWorkspaceToCloud(workspaceRef.current, true);

    const newWs = createInitialWorkspace(lang);
    newWs.id = 'ws-' + Date.now();
    newWs.name = `${t.defaultNewWorkspaceName} ${savedWorkspaces.length + 1}`;

    setPastHistory([]);
    setFutureHistory([]);
    setWorkspace(newWs);
    await saveWorkspaceToCloud(newWs, true);
    triggerToast(t.toastWorkspaceCreated);
  };

  const handleSelectSavedWorkspace = async (targetWs) => {
    if (!googleProfile || !targetWs) return;
    if (targetWs.id === workspace.id) {
      setShowWorkspaceModal(false);
      return;
    }
    // Overwrite save current workspace before switching
    await saveWorkspaceToCloud(workspaceRef.current, true);
    setPastHistory([]);
    setFutureHistory([]);
    setWorkspace(targetWs);
    setSelectedBubbleId(null);
    setSelectedLineId(null);
    setShowWorkspaceModal(false);
    triggerToast(t.toastWorkspaceSwitched);
  };

  const handleDeleteSavedWorkspace = async (e, wsId) => {
    e.stopPropagation();
    if (!googleProfile) return;
    try {
      if (db && user) {
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'workspaces', wsId);
        await deleteDoc(docRef);
      } else {
        setSavedWorkspaces(prev => prev.filter(w => w.id !== wsId));
      }
      triggerToast(t.toastWorkspaceDeleted);
    } catch (err) {
      console.error('Delete workspace error:', err);
    }
  };

  // --- EXPORT BOARD (HIGH-RES >= 1600x1600 + MOBILE-COMPATIBLE BLOB DOWNLOAD FOR PNG, JPG, PDF) ---
  const handleExportBoard = async () => {
    try {
      triggerToast(t.toastExporting);

      const exportCanvas = document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      currentBoard.bubbles.forEach(b => {
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
      });

      if (!isFinite(minX)) {
        minX = 0; minY = 0; maxX = 800; maxY = 600;
      }

      const padding = 100;
      const diagramW = Math.max(320, maxX - minX + padding * 2);
      const diagramH = Math.max(320, maxY - minY + padding * 2);

      // Minimum resolution 1600x1600, and scales up further when mindmap has more nodes or larger spread
      const MIN_EXPORT_DIM = 1600;
      const MAX_EXPORT_DIM = 6000;
      const detailMultiplier = 2.4 + Math.min(2.0, currentBoard.bubbles.length * 0.12);

      const rawTargetW = Math.max(MIN_EXPORT_DIM, Math.round(diagramW * detailMultiplier));
      const rawTargetH = Math.max(MIN_EXPORT_DIM, Math.round(diagramH * detailMultiplier));

      // Preserve aspect ratio while guaranteeing both dimensions >= 1600px
      const scaleToEnsureMin = Math.max(
        MIN_EXPORT_DIM / diagramW,
        MIN_EXPORT_DIM / diagramH,
        detailMultiplier
      );
      const safeScale = Math.min(
        scaleToEnsureMin,
        MAX_EXPORT_DIM / Math.max(diagramW, diagramH)
      );

      const finalCanvasW = Math.max(MIN_EXPORT_DIM, Math.round(diagramW * safeScale));
      const finalCanvasH = Math.max(MIN_EXPORT_DIM, Math.round(diagramH * safeScale));

      exportCanvas.width = finalCanvasW;
      exportCanvas.height = finalCanvasH;

      // Fill high-res background
      ctx.fillStyle = isDarkMode ? '#0f172a' : '#ffffff';
      ctx.fillRect(0, 0, finalCanvasW, finalCanvasH);

      // Scale vector drawing context so all shapes, lines, and fonts render natively at ultra-high DPI
      const drawScale = Math.min(finalCanvasW / diagramW, finalCanvasH / diagramH);
      const centeredOffsetX = (finalCanvasW / drawScale - diagramW) / 2 + padding - minX;
      const centeredOffsetY = (finalCanvasH / drawScale - diagramH) / 2 + padding - minY;

      ctx.save();
      ctx.scale(drawScale, drawScale);
      ctx.translate(centeredOffsetX, centeredOffsetY);

      // Subtle dot grid on high-res export for visual depth
      ctx.fillStyle = isDarkMode ? '#1e293b' : '#f1f5f9';
      const gridStep = 32;
      for (let gx = minX - padding; gx <= maxX + padding; gx += gridStep) {
        for (let gy = minY - padding; gy <= maxY + padding; gy += gridStep) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 1. Draw Connection Lines at Full Vector Resolution
      currentBoard.lines.forEach(l => {
        const s = currentBoard.bubbles.find(b => b.id === l.sourceId);
        const tNode = currentBoard.bubbles.find(b => b.id === l.targetId);
        if (!s || !tNode) return;

        const pathData = computeBezierPath(s, tNode);
        ctx.save();
        ctx.strokeStyle = l.color;
        ctx.lineWidth = l.width;
        ctx.lineCap = 'round';

        if (l.style === 'dashed') ctx.setLineDash([8, 6]);
        else if (l.style === 'dotted') ctx.setLineDash([3, 4]);
        else ctx.setLineDash([]);

        const p2D = new Path2D(pathData.d);
        ctx.stroke(p2D);

        if (l.marker && l.marker !== 'none') {
          ctx.setLineDash([]);
          ctx.fillStyle = l.color;
          const angle = Math.atan2(
            pathData.end.y - pathData.start.y,
            pathData.end.x - pathData.start.x
          );
          ctx.translate(pathData.end.x, pathData.end.y);
          ctx.rotate(angle);

          if (l.marker === 'arrow') {
            const sz = Math.max(8, l.width * 2.4);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-sz, -sz * 0.55);
            ctx.lineTo(-sz, sz * 0.55);
            ctx.closePath();
            ctx.fill();
          } else if (l.marker === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(4, l.width * 1.3), 0, Math.PI * 2);
            ctx.fill();
          } else if (l.marker === 'square') {
            const side = Math.max(7, l.width * 2.2);
            ctx.fillRect(-side / 2, -side / 2, side, side);
          }
        }
        ctx.restore();
      });

      // 2. Draw Bubbles & Vector Typography
      currentBoard.bubbles.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);

        ctx.fillStyle = b.bgColor;
        ctx.strokeStyle = getSmartBorderColor(b.borderColor);
        ctx.lineWidth = b.borderWidth;
        ctx.lineJoin = 'round';

        if (b.shape === 'rect') {
          drawRoundedRectPath(ctx, 0, 0, b.width, b.height, 12);
          ctx.fill();
          ctx.stroke();
        } else if (b.shape === 'oval') {
          ctx.beginPath();
          ctx.ellipse(b.width / 2, b.height / 2, b.width / 2, b.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (b.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(b.width / 2, 0);
          ctx.lineTo(b.width, b.height);
          ctx.lineTo(0, b.height);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Level Badge
        ctx.save();
        ctx.translate(8, 8);
        ctx.fillStyle = isDarkMode ? '#1e293b' : '#f1f5f9';
        ctx.strokeStyle = getSmartBorderColor(b.borderColor);
        ctx.lineWidth = 1.2;
        drawRoundedRectPath(ctx, 0, 0, 40, 17, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${t.levelShort} ${b.level}`, 20, 9);
        ctx.restore();

        // Main Wrapped & Scaled Idea Text
        const layout = measureAndFitText(b.text, b.shape, b.width, b.height, b.baseFontSize || 15);
        ctx.fillStyle = getSmartTextColor(b.bgColor);
        ctx.font = `600 ${layout.fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        layout.lines.forEach((lineText, idx) => {
          ctx.fillText(lineText, layout.centerX, layout.startY + idx * layout.lineHeight);
        });

        ctx.restore();
      });

      ctx.restore();

      // 3. Create Blob & Trigger Mobile-Safe Download
      const cleanName = (currentBoard.name || 'mindmap').replace(/[^a-zA-Z0-9_\-\u00C0-\u1EF9 ]/g, '_').trim() || 'mindmap';
      const fileName = `${cleanName}_mymind.${exportFormat}`;
      let exportBlob = null;

      if (exportFormat === 'png') {
        const pngDataUrl = exportCanvas.toDataURL('image/png');
        exportBlob = new Blob([dataUrlToUint8Array(pngDataUrl)], { type: 'image/png' });
      } else if (exportFormat === 'jpg') {
        const jpgDataUrl = exportCanvas.toDataURL('image/jpeg', 0.96);
        exportBlob = new Blob([dataUrlToUint8Array(jpgDataUrl)], { type: 'image/jpeg' });
      } else if (exportFormat === 'pdf') {
        const jpgDataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);
        exportBlob = createPdfBlobFromJpegDataUrl(jpgDataUrl, finalCanvasW, finalCanvasH);
      }

      if (exportBlob) {
        const blobUrl = URL.createObjectURL(exportBlob);
        setLastExportMeta({
          url: blobUrl,
          fileName,
          width: finalCanvasW,
          height: finalCanvasH
        });

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.rel = 'noopener';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) document.body.removeChild(link);
        }, 300);
      }

      setShowExportModal(false);
      // Display the AdSense Popup Modal immediately upon download!
      setShowAdPopupModal(true);
      triggerToast(t.toastExportSuccess);
    } catch (err) {
      console.error(err);
      triggerToast(t.toastExportError);
    }
  };

  // --- BOARD TAB BAR MANAGEMENT ---
  const addBoard = () => {
    const newBoardId = 'board-' + Date.now();
    const defaultText = lang === 'vi' ? 'Ý tưởng trung tâm' : 'Central Idea';
    const newBoard = {
      id: newBoardId,
      name: `${t.boardDefaultName} ${workspace.boards.length + 1}`,
      bubbles: [
        {
          id: 'b-' + Date.now().toString().slice(-4),
          parentId: null,
          level: 1,
          text: defaultText,
          shape: 'rect',
          x: 420,
          y: 250,
          width: DEFAULT_BUBBLE_W,
          height: DEFAULT_BUBBLE_H,
          bgColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 4,
          baseFontSize: 15
        }
      ],
      lines: [],
    };

    setWorkspace(prev => ({
      ...prev,
      activeBoardId: newBoardId,
      boards: [...prev.boards, newBoard]
    }));
    triggerToast(t.toastBoardAdded);
  };

  const commitRenameBoard = (boardId) => {
    if (editingBoardName.trim()) {
      setWorkspace(prev => ({
        ...prev,
        boards: prev.boards.map(b => b.id === boardId ? { ...b, name: editingBoardName.trim() } : b)
      }));
    }
    setEditingBoardId(null);
  };

  const deleteBoardTab = (e, boardId) => {
    e.stopPropagation();
    if (workspace.boards.length <= 1) return;
    setWorkspace(prev => {
      const remaining = prev.boards.filter(b => b.id !== boardId);
      const nextActive = prev.activeBoardId === boardId ? remaining[0].id : prev.activeBoardId;
      return {
        ...prev,
        activeBoardId: nextActive,
        boards: remaining
      };
    });
    triggerToast(t.toastBoardDeleted);
  };

  // --- RENDER BUBBLE SVG ELEMENT ---
  const renderShapeElement = (bubble) => {
    const isSel = selectedBubbleId === bubble.id;
    const isHovered = hoveredBubbleId === bubble.id;
    const isMagTarget = hoveredTargetId === bubble.id;
    const isConnSource = connectingSourceId === bubble.id;

    const borderCol = getSmartBorderColor(bubble.borderColor);
    const textCol = getSmartTextColor(bubble.bgColor);

    const layout = measureAndFitText(
      bubble.text,
      bubble.shape,
      bubble.width,
      bubble.height,
      bubble.baseFontSize || 15
    );

    const shapeProps = {
      fill: bubble.bgColor,
      stroke: borderCol,
      strokeWidth: bubble.borderWidth,
      className: 'transition-colors duration-150 cursor-move'
    };

    // Show connector anchor ports when selected, hovered, or on mobile
    const showHandles = isSel || isHovered || isConnSource;
    const anchorRadius = isMobile ? 8 : 6.5;

    // 4 directional ports on the perimeter
    const ports = [
      { id: 'right', cx: bubble.x + bubble.width, cy: bubble.y + bubble.height / 2 },
      { id: 'bottom', cx: bubble.x + bubble.width / 2, cy: bubble.y + bubble.height },
      { id: 'left', cx: bubble.x, cy: bubble.y + bubble.height / 2 },
      { id: 'top', cx: bubble.x + bubble.width / 2, cy: bubble.y },
    ];

    return (
      <g
        className="select-none pointer-events-auto"
        onPointerEnter={() => setHoveredBubbleId(bubble.id)}
        onPointerLeave={() => setHoveredBubbleId(prev => (prev === bubble.id ? null : prev))}
      >
        {/* Invisible padded hover zone so moving cursor to perimeter ports NEVER loses hover or flickers */}
        <rect
          x={bubble.x - 16}
          y={bubble.y - 16}
          width={bubble.width + 32}
          height={bubble.height + 32}
          fill="transparent"
        />

        {/* Magnetic Target Snap Highlight Ring when dragging a connection line */}
        {isMagTarget && (
          <rect
            x={bubble.x - 10}
            y={bubble.y - 10}
            width={bubble.width + 20}
            height={bubble.height + 20}
            rx={16}
            fill="rgba(16, 185, 129, 0.12)"
            stroke="#10b981"
            strokeWidth={3.5}
            className="pointer-events-none"
          />
        )}

        {/* Active Selection Halo */}
        {isSel && !isMagTarget && (
          <rect
            x={bubble.x - 7}
            y={bubble.y - 7}
            width={bubble.width + 14}
            height={bubble.height + 14}
            rx={14}
            fill="none"
            stroke="#6366f1"
            strokeWidth={2.5}
            strokeDasharray="6,4"
            className="pointer-events-none"
          />
        )}

        {/* 3 Geometric Shapes */}
        {bubble.shape === 'rect' && (
          <rect
            x={bubble.x}
            y={bubble.y}
            width={bubble.width}
            height={bubble.height}
            rx={12}
            {...shapeProps}
          />
        )}
        {bubble.shape === 'oval' && (
          <ellipse
            cx={bubble.x + bubble.width / 2}
            cy={bubble.y + bubble.height / 2}
            rx={bubble.width / 2}
            ry={bubble.height / 2}
            {...shapeProps}
          />
        )}
        {bubble.shape === 'triangle' && (
          <polygon
            points={`
              ${bubble.x + bubble.width / 2},${bubble.y} 
              ${bubble.x + bubble.width},${bubble.y + bubble.height} 
              ${bubble.x},${bubble.y + bubble.height}
            `}
            strokeLinejoin="round"
            {...shapeProps}
          />
        )}

        {/* Native SVG Multiline Text with Dynamic Proportional Scaling */}
        <text
          x={bubble.x + layout.centerX}
          y={bubble.y + layout.startY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={layout.fontSize}
          fontWeight="600"
          fill={textCol}
          className="pointer-events-none select-none font-sans"
        >
          {layout.lines.map((line, idx) => (
            <tspan
              key={idx}
              x={bubble.x + layout.centerX}
              dy={idx === 0 ? 0 : layout.lineHeight}
            >
              {line}
            </tspan>
          ))}
        </text>

        {/* Localized Level Badge */}
        <g transform={`translate(${bubble.x + 8}, ${bubble.y + 8})`} className="pointer-events-none">
          <rect
            width={40}
            height={17}
            rx={5}
            fill={isDarkMode ? '#1e293b' : '#f1f5f9'}
            stroke={borderCol}
            strokeWidth={1.2}
          />
          <text
            x={20}
            y={11.5}
            fontSize={9.5}
            fontWeight="bold"
            fill={isDarkMode ? '#f8fafc' : '#0f172a'}
            textAnchor="middle"
          >
            {t.levelShort} {bubble.level}
          </text>
        </g>

        {/* Stable Flicker-Free Line Connector Ports */}
        {showHandles && ports.map(port => (
          <g
            key={port.id}
            onPointerDown={(e) => startConnectFromAnchor(e, bubble)}
            className="cursor-crosshair"
          >
            {/* Large invisible touch/click hit target */}
            <circle
              cx={port.cx}
              cy={port.cy}
              r={15}
              fill="transparent"
            />
            <circle
              cx={port.cx}
              cy={port.cy}
              r={anchorRadius}
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </g>
        ))}

        {/* Bottom-Right Resize Handle (Enlarges & Scales Font / Wraps Text) */}
        {isSel && (
          <g
            onPointerDown={(e) => startResizeBubble(e, bubble)}
            className="cursor-se-resize"
          >
            <rect
              x={bubble.x + bubble.width - 20}
              y={bubble.y + bubble.height - 20}
              width={28}
              height={28}
              fill="transparent"
            />
            <path
              d={`M ${bubble.x + bubble.width - 12} ${bubble.y + bubble.height - 4} L ${bubble.x + bubble.width - 4} ${bubble.y + bubble.height - 12} M ${bubble.x + bubble.width - 8} ${bubble.y + bubble.height - 4} L ${bubble.x + bubble.width - 4} ${bubble.y + bubble.height - 8}`}
              stroke="#6366f1"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className={`w-full h-screen flex flex-col font-sans select-none overflow-hidden ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>

      {/* --- 1. TOP HEADER & QUICK INPUT BAR --- */}
      <header className={`h-16 px-4 md:px-6 flex items-center justify-between border-b gap-3 z-35 flex-none ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Brand Logo & Workspace Menu Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowWorkspaceModal(true)}>
            <MindmapLogoSVG />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-indigo-600 text-white">
                  {t.editionBadge}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] sm:max-w-[180px]">
                {workspace.name}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWorkspaceModal(true)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">{t.workspaceLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Quick Idea Input Form (Inherits Parent Level & Visual Properties) */}
        <form onSubmit={handleAddBubble} className="flex-1 max-w-xl mx-2 hidden md:flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={quickInputText}
              onChange={(e) => setQuickInputText(e.target.value)}
              placeholder={
                selectedBubble
                  ? t.inputChildPlaceholder(selectedBubble.level + 1, selectedBubble.text)
                  : t.inputRootPlaceholder
              }
              className={`w-full py-2 pl-3.5 pr-20 rounded-xl text-xs font-medium border outline-none transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500'
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
            {selectedBubble && (
              <div className="absolute right-2 flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                  {t.levelShort} {selectedBubble.level + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBubbleId(null)}
                  title={t.clearSelectionTitle}
                  className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!quickInputText.trim()}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all flex-none"
          >
            <Plus className="w-4 h-4" />
            <span>{t.create}</span>
          </button>
        </form>

        {/* Right Action Controls + Undo/Redo + Language Flag + Login/Account */}
        <div className="order-2 lg:order-3 flex items-center gap-1.5">
          {/* Undo & Redo Buttons */}
          <div className={`flex items-center rounded-xl border p-0.5 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={handleUndo}
              disabled={pastHistory.length === 0}
              title={t.undoTitle}
              className={`p-1.5 rounded-lg transition-all ${
                pastHistory.length > 0
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-2xs active:scale-95'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={futureHistory.length === 0}
              title={t.redoTitle}
              className={`p-1.5 rounded-lg transition-all ${
                futureHistory.length > 0
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-2xs active:scale-95'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Language Switcher Flag Button with Explicit Label */}
          <button
            onClick={handleToggleLanguage}
            title={t.langSwitchTooltip}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {lang === 'en' ? <FlagEN /> : <FlagVI />}
            <span className="whitespace-nowrap">{t.languageBtnLabel}</span>
          </button>

          {/* Hierarchy Tree Toggle */}
          <button
            onClick={() => {
              const next = !showLayerPanel;
              setShowLayerPanel(next);
              if (isMobile && next) setShowPropertiesPanel(false);
            }}
            className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
              showLayerPanel
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent text-slate-500'
            }`}
            title={t.hierarchy}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden xl:inline">{t.hierarchy}</span>
          </button>

          {/* Properties Toggle */}
          <button
            onClick={() => {
              const next = !showPropertiesPanel;
              setShowPropertiesPanel(next);
              if (isMobile && next) setShowLayerPanel(false);
            }}
            className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
              showPropertiesPanel
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent text-slate-500'
            }`}
            title={t.properties}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden xl:inline">{t.properties}</span>
          </button>

          {/* Dark / Light Mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t.themeToggleTooltip}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Log-in / User Profile Button (Replaces old Save button) */}
          <div className="relative">
            {googleProfile ? (
              <button
                type="button"
                onClick={() => setShowAccountMenu(prev => !prev)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isDarkMode
                    ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                }`}
                title={googleProfile.email}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                  {googleProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{googleProfile.name}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
                title={t.loginBtn}
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">{t.loginBtn}</span>
              </button>
            )}

            {/* Account Dropdown Popover when logged in */}
            {showAccountMenu && googleProfile && (
              <div className={`absolute right-0 mt-2 w-64 p-3 rounded-2xl shadow-2xl border z-50 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm flex-none">
                    {googleProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{googleProfile.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{googleProfile.email}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 flex-none" />
                  <span className="truncate">
                    {lastSavedTime ? `${t.lastAutoSaved} ${lastSavedTime}` : t.notSavedYet}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      saveWorkspaceToCloud(workspaceRef.current, false);
                      setShowAccountMenu(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>{t.saveNowBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleLogout}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logoutBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t.export}</span>
          </button>
        </div>
      </header>

      {/* --- 2. DEDICATED BOARD TABS BAR DIRECTLY BELOW THE TOOLBAR --- */}
      <nav className={`h-10 px-3 md:px-4 flex items-end gap-1.5 border-b overflow-x-auto no-scrollbar z-20 flex-none ${
        isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
      }`}>
        {workspace.boards.map(b => {
          const isActive = workspace.activeBoardId === b.id;
          const isEditing = editingBoardId === b.id;

          return (
            <div
              key={b.id}
              onClick={() => setWorkspace(prev => ({ ...prev, activeBoardId: b.id }))}
              onDoubleClick={() => {
                setEditingBoardId(b.id);
                setEditingBoardName(b.name);
              }}
              className={`group h-8 px-3 rounded-t-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap border-t border-x ${
                isActive
                  ? isDarkMode
                    ? 'bg-slate-900 text-indigo-400 border-slate-700 shadow-xs'
                    : 'bg-white text-indigo-600 border-slate-200 shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-900/40 text-slate-400 border-transparent hover:bg-slate-800/60 hover:text-slate-200'
                    : 'bg-slate-200/60 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {isEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={editingBoardName}
                  onChange={(e) => setEditingBoardName(e.target.value)}
                  onBlur={() => commitRenameBoard(b.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRenameBoard(b.id);
                    if (e.key === 'Escape') setEditingBoardId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-28 px-1.5 py-0.5 text-xs rounded bg-indigo-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none border border-indigo-400"
                />
              ) : (
                <span>{b.name}</span>
              )}

              <div className="flex items-center gap-0.5">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBoardId(b.id);
                      setEditingBoardName(b.name);
                    }}
                    title={t.renameBoardTitle}
                    className="opacity-60 hover:opacity-100 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
                {workspace.boards.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => deleteBoardTab(e, b.id)}
                    title={t.deleteBoardTitle}
                    className="opacity-60 hover:opacity-100 hover:text-rose-500 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={addBoard}
          className="h-8 px-2.5 mb-0.5 rounded-lg text-xs font-bold flex items-center gap-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors flex-none"
          title={t.addBoardTitle}
        >
          <Plus className="w-4 h-4" />
        </button>
      </nav>

      {/* --- 2.5 DEDICATED GOOGLE ADSENSE BANNER PLACEMENT RIGHT BELOW BOARD TABS --- */}
      {showTopAdBanner ? (
        <div className={`w-full px-2 sm:px-3 py-1.5 border-b flex items-center justify-between gap-2 z-20 flex-none ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50/95 border-slate-200'
        }`}>
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <div className={`w-full max-w-[728px] min-h-[48px] md:min-h-[60px] px-2.5 py-1 rounded-xl border border-dashed flex flex-col items-center justify-center text-center relative overflow-hidden ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                : 'bg-white border-slate-300 text-slate-600'
            }`}>
              {/* Google AdSense <ins> tag ready for production publisher ID */}
              <ins
                className="adsbygoogle hidden"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="1234567890"
                data-ad-format="horizontal"
                data-full-width-responsive="true"
              />
              <div className="w-full min-w-0 flex items-center justify-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex-none">
                  {t.adBannerBadge}
                </span>
                <span className="text-[11px] sm:text-xs font-bold truncate">
                  {t.adBannerLabel}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline truncate max-w-full">
                {t.adBannerSub}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowTopAdBanner(false)}
            aria-label={t.adHideBtn}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 flex-none shadow-2xs active:scale-95 transition-all ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-3.5 h-3.5 text-rose-500" />
            <span>{t.adHideBtn}</span>
          </button>
        </div>
      ) : (
        <div className={`w-full px-3 py-0.5 border-b flex justify-end z-20 flex-none ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setShowTopAdBanner(true)}
            className="text-[10px] font-semibold text-slate-400 hover:text-indigo-500 flex items-center gap-1"
          >
            <span>{t.adShowBtn}</span>
          </button>
        </div>
      )}

      {/* --- 3. MAIN WORKSPACE AREA --- */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">

        {/* Mobile Drawer Backdrop */}
        {isMobile && (showLayerPanel || showPropertiesPanel) && (
          <div
            className="fixed inset-0 bg-black/40 z-30 backdrop-blur-[1px]"
            onClick={() => {
              setShowLayerPanel(false);
              setShowPropertiesPanel(false);
            }}
          />
        )}

        {/* HIERARCHY TREE PANEL (Desktop Left Sidebar / Mobile Slide-over Drawer) */}
        {showLayerPanel && (
          <aside className={`${
            isMobile
              ? 'fixed inset-y-0 left-0 z-40 w-72 shadow-2xl'
              : 'w-64 flex-none h-full border-r z-10'
          } flex flex-col transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                {t.hierarchyTitle}
              </span>
              <button onClick={() => setShowLayerPanel(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="text-[11px] text-slate-400 px-2 py-1 italic">
                {t.hierarchyHint}
              </div>

              {currentBoard.bubbles.map(bubble => {
                const isSelected = selectedBubbleId === bubble.id;
                return (
                  <div
                    key={bubble.id}
                    onClick={() => {
                      setSelectedBubbleId(bubble.id);
                      setSelectedLineId(null);
                      if (isMobile) setShowLayerPanel(false);
                    }}
                    style={{ paddingLeft: `${Math.min(44, (bubble.level - 1) * 12 + 8)}px` }}
                    className={`py-2 pr-2 rounded-xl text-xs flex items-center justify-between group cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate pr-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-none border border-slate-400"
                        style={{ backgroundColor: bubble.bgColor }}
                      />
                      <span className="truncate">{bubble.text}</span>
                    </div>

                    <div className="flex items-center gap-1 flex-none">
                      <select
                        value={bubble.parentId || ''}
                        onChange={(e) => reparentBubble(bubble.id, e.target.value || null)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] max-w-[92px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-1 py-0.5 outline-none"
                      >
                        <option value="">{t.rootLevelOption}</option>
                        {currentBoard.bubbles
                          .filter(b => b.id !== bubble.id)
                          .map(b => (
                            <option key={b.id} value={b.id}>
                              {t.parentPrefix} {b.text.slice(0, 10)}
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBubble(bubble.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title={t.deleteBubbleTitle}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
        {/* INFINITE MINDMAP CANVAS (Unified Pointer Events + Two-Finger Pinch Zoom) */}
        <main
          ref={canvasRef}
          onPointerDown={handlePointerDownCanvas}
          onPointerMove={handlePointerMoveCanvas}
          onPointerUp={handlePointerUpCanvas}
          onPointerCancel={handlePointerUpCanvas}
          style={{ touchAction: 'none' }}
          className={`flex-1 h-full relative overflow-hidden select-none ${
            connectingSourceId
              ? 'cursor-crosshair'
              : isSpacePressed || isPanning
                ? 'cursor-grabbing'
                : 'cursor-grab'
          } ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
        >
          {/* Active Connection Mode Banner */}
          {connectingSourceId && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg flex items-center gap-2">
              <Link2 className="w-4 h-4 animate-pulse" />
              <span>{t.connectModeBanner}</span>
              <button
                onClick={() => {
                  setConnectingSourceId(null);
                  setHoveredTargetId(null);
                }}
                className="ml-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[11px]"
              >
                {t.cancelConnect}
              </button>
            </div>
          )}

          <svg
            className="w-full h-full block"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <pattern
                id="infinite-grid-pattern"
                x={pan.x % (24 * zoom)}
                y={pan.y % (24 * zoom)}
                width={24 * zoom}
                height={24 * zoom}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx={1.5}
                  cy={1.5}
                  r={1}
                  fill={isDarkMode ? '#334155' : '#cbd5e1'}
                />
              </pattern>

              {/* Dynamic Color Markers per Line */}
              {currentBoard.lines.map(line => (
                <React.Fragment key={`markers-${line.id}`}>
                  <marker
                    id={`marker-arrow-${line.id}`}
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill={selectedLineId === line.id ? '#6366f1' : line.color} />
                  </marker>
                  <marker
                    id={`marker-circle-${line.id}`}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                  >
                    <circle cx="5" cy="5" r="4" fill={selectedLineId === line.id ? '#6366f1' : line.color} />
                  </marker>
                  <marker
                    id={`marker-square-${line.id}`}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                  >
                    <rect x="1" y="1" width="8" height="8" fill={selectedLineId === line.id ? '#6366f1' : line.color} />
                  </marker>
                </React.Fragment>
              ))}
            </defs>

            {/* Infinite Grid Background */}
            <rect
              id="canvas-svg-bg"
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#infinite-grid-pattern)"
            />

            {/* Transformed World Canvas */}
            <g
              transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
              className="pointer-events-auto"
            >
              {/* Connection Lines */}
              {currentBoard.lines.map(line => {
                const src = currentBoard.bubbles.find(b => b.id === line.sourceId);
                const tgt = currentBoard.bubbles.find(b => b.id === line.targetId);
                if (!src || !tgt) return null;

                const pathData = computeBezierPath(src, tgt);
                const isSelected = selectedLineId === line.id;

                return (
                  <g
                    key={line.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLineId(line.id);
                      setSelectedBubbleId(null);
                      if (!isMobile) setShowPropertiesPanel(true);
                    }}
                  >
                    {/* Wide invisible touch/click hit path */}
                    <path
                      d={pathData.d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={Math.max(20, line.width + 16)}
                    />
                    <path
                      d={pathData.d}
                      fill="none"
                      stroke={isSelected ? '#6366f1' : line.color}
                      strokeWidth={isSelected ? line.width + 2 : line.width}
                      strokeDasharray={
                        line.style === 'dashed' ? '8,6' : line.style === 'dotted' ? '3,4' : 'none'
                      }
                      markerEnd={
                        line.marker !== 'none' ? `url(#marker-${line.marker}-${line.id})` : undefined
                      }
                    />
                  </g>
                );
              })}

              {/* Flicker-Free Interactive Preview Line (pointerEvents="none" prevents cursor flicker!) */}
              {connectingSourceId && (() => {
                const src = currentBoard.bubbles.find(b => b.id === connectingSourceId);
                if (!src) return null;
                const tgtBubble = hoveredTargetId
                  ? currentBoard.bubbles.find(b => b.id === hoveredTargetId)
                  : null;

                const endX = tgtBubble ? tgtBubble.x + tgtBubble.width / 2 : pointerWorldPos.x;
                const endY = tgtBubble ? tgtBubble.y + tgtBubble.height / 2 : pointerWorldPos.y;
                const startPt = getPerimeterPoint(src, endX, endY);
                const endPt = tgtBubble ? getPerimeterPoint(tgtBubble, startPt.x, startPt.y) : { x: endX, y: endY };

                return (
                  <g className="pointer-events-none">
                    <path
                      d={`M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`}
                      fill="none"
                      stroke={tgtBubble ? '#10b981' : '#ef4444'}
                      strokeWidth={3.5}
                      strokeDasharray="6,4"
                      className="pointer-events-none"
                    />
                    <circle
                      cx={endPt.x}
                      cy={endPt.y}
                      r={5}
                      fill={tgtBubble ? '#10b981' : '#ef4444'}
                      className="pointer-events-none"
                    />
                  </g>
                );
              })()}

              {/* Idea Nodes (Bubbles) */}
              {currentBoard.bubbles.map(bubble => (
                <g
                  key={bubble.id}
                  onPointerDown={(e) => startDragBubble(e, bubble)}
                >
                  {renderShapeElement(bubble)}
                </g>
              ))}
            </g>
          </svg>

          {/* Bottom Floating Zoom & Center Navigation Bar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 shadow-xl border border-slate-200 dark:border-slate-700 backdrop-blur-md z-10">
            <button
              onClick={() => setZoom(z => Math.max(0.25, Number((z - 0.1).toFixed(1))))}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={t.zoomOutTitle}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold w-11 text-center text-slate-700 dark:text-slate-200">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(3.0, Number((z + 0.1).toFixed(1))))}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={t.zoomInTitle}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <button
              onClick={handleFitScreen}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-semibold"
              title={t.fitScreenTitle}
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">{t.fitScreen}</span>
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={t.resetZoomTitle}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* PROPERTIES SIDEBAR (Desktop Right Sidebar / Mobile Bottom Sheet Drawer) */}
        {showPropertiesPanel && (
          <aside className={`${
            isMobile
              ? 'fixed inset-x-0 bottom-0 max-h-[75vh] rounded-t-3xl z-40 shadow-2xl border-t'
              : 'w-80 flex-none h-full border-l z-10'
          } p-4 flex flex-col overflow-y-auto ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {selectedBubble
                  ? t.bubblePropsTitle
                  : selectedLine
                    ? t.linePropsTitle
                    : t.noSelectionTitle}
              </span>
              <button
                onClick={() => setShowPropertiesPanel(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!selectedBubble && !selectedLine && (
              <div className="py-12 px-4 text-center text-xs text-slate-400 space-y-2">
                <Move className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 stroke-1" />
                <p>{t.noSelectionHint}</p>
              </div>
            )}

            {/* BUBBLE PROPERTIES */}
            {selectedBubble && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">{t.ideaContentLabel}</label>
                  <textarea
                    rows={3}
                    value={selectedBubble.text}
                    onChange={(e) => updateBubble(selectedBubble.id, { text: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <div className="text-[10px] text-slate-400 mt-1 italic">
                    {t.ideaContentHint}
                  </div>
                </div>

                {/* Mobile-friendly Start Line Connection Button */}
                <button
                  type="button"
                  onClick={() => {
                    setConnectingSourceId(selectedBubble.id);
                    if (isMobile) setShowPropertiesPanel(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold flex items-center justify-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-all"
                >
                  <Link2 className="w-4 h-4" />
                  <span>{t.connectBtnLabel}</span>
                </button>

                {/* 3 Geometric Shapes */}
                <div>
                  <label className="font-semibold block mb-1.5">{t.shapeLabel}</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {shapesList.map(s => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.id}
                          onClick={() => updateBubble(selectedBubble.id, { shape: s.id })}
                          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 border transition-all ${
                            selectedBubble.shape === s.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] font-medium text-center">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="font-semibold block mb-1.5">{t.bgColorLabel}</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {PALETTE.map(c => (
                      <button
                        key={`bg-${c}`}
                        onClick={() => updateBubble(selectedBubble.id, { bgColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-lg border transition-transform ${
                          selectedBubble.bgColor === c ? 'scale-110 ring-2 ring-indigo-500' : 'hover:scale-105'
                        } ${c === '#ffffff' ? 'border-slate-300' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Border Color (Full 16-Color Palette including White) */}
                <div>
                  <label className="font-semibold block mb-1.5">{t.borderColorLabel}</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {PALETTE.map(c => (
                      <button
                        key={`bd-${c}`}
                        onClick={() => updateBubble(selectedBubble.id, { borderColor: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-lg border transition-transform ${
                          selectedBubble.borderColor === c ? 'scale-110 ring-2 ring-indigo-500' : 'hover:scale-105'
                        } ${c === '#ffffff' ? 'border-slate-300' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Border Thickness */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>{t.borderWidthLabel}</span>
                    <span>{selectedBubble.borderWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedBubble.borderWidth}
                    onChange={(e) => updateBubble(selectedBubble.id, { borderWidth: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                {/* Base Font Scale */}
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>{t.fontScaleLabel}</span>
                    <span>{selectedBubble.baseFontSize || 15}px</span>
                  </div>
                  <input
                    type="range"
                    min="11"
                    max="28"
                    value={selectedBubble.baseFontSize || 15}
                    onChange={(e) => updateBubble(selectedBubble.id, { baseFontSize: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => deleteBubble(selectedBubble.id)}
                    className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.deleteBubbleBtn}</span>
                  </button>
                </div>
              </div>
            )}

            {/* LINE PROPERTIES */}
            {selectedLine && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1.5">{t.lineStyleLabel}</label>
                  <div className="space-y-1.5">
                    {strokeStylesList.map(st => (
                      <button
                        key={st.id}
                        onClick={() => updateLine(selectedLine.id, { style: st.id })}
                        className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between ${
                          selectedLine.style === st.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="font-medium">{st.name}</span>
                        <svg width="48" height="6" className="overflow-visible">
                          <line
                            x1="0"
                            y1="3"
                            x2="48"
                            y2="3"
                            stroke={selectedLine.style === st.id ? '#ffffff' : isDarkMode ? '#e2e8f0' : '#0f172a'}
                            strokeWidth="2.5"
                            strokeDasharray={st.dash}
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1.5">{t.lineMarkerLabel}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {markerHeadsList.map(m => (
                      <button
                        key={m.id}
                        onClick={() => updateLine(selectedLine.id, { marker: m.id })}
                        className={`p-2 rounded-xl text-xs font-medium border ${
                          selectedLine.marker === m.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1.5">{t.lineColorLabel}</label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {PALETTE.map(c => (
                      <button
                        key={`line-${c}`}
                        onClick={() => updateLine(selectedLine.id, { color: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-lg border transition-transform ${
                          selectedLine.color === c ? 'scale-110 ring-2 ring-indigo-500' : 'hover:scale-105'
                        } ${c === '#ffffff' ? 'border-slate-300' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>{t.lineWidthLabel}</span>
                    <span>{selectedLine.width}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedLine.width}
                    onChange={(e) => updateLine(selectedLine.id, { width: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => deleteLine(selectedLine.id)}
                    className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.deleteLineBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* --- WORKSPACE DROPDOWN / MODAL (REQUIRES LOGIN TO SAVE OR OPEN WORKSPACES) --- */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl border ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Folder className="w-5 h-5 text-indigo-500" />
                <span>{t.manageWorkspaces}</span>
              </h3>
              <button onClick={() => setShowWorkspaceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!googleProfile ? (
              /* NOT LOGGED IN STATE: Prompt user to Sign In with Google or dismiss */
              <div className="space-y-4 py-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="font-bold text-sm sm:text-base">{t.loginRequiredTitle}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.loginRequiredDesc}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <User className="w-4 h-4" />
                    <span>{t.googleLoginBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWorkspaceModal(false)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.continueWithoutLogin}
                  </button>
                </div>
              </div>
            ) : (
              /* LOGGED IN STATE: Full Workspace Management & Saved Workspaces List */
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">{t.currentWorkspaceName}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={workspace.name}
                      onChange={(e) => setWorkspace(prev => ({ ...prev, name: e.target.value }))}
                      className={`flex-1 p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none ${
                        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => saveWorkspaceToCloud(workspaceRef.current, false)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 flex-none transition-all"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{t.saveNowBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Auto-save 10-minute status banner */}
                <div className={`px-3 py-2 rounded-xl border text-[11px] flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-900/70 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500 flex-none" />
                    <span>{t.autoSaveInfo}</span>
                  </div>
                  {lastSavedTime && (
                    <span className="font-bold text-emerald-500 ml-2 flex-none">
                      {lastSavedTime}
                    </span>
                  )}
                </div>

                {/* Saved Workspaces List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t.savedWorkspacesTitle} ({savedWorkspaces.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleCreateNewWorkspace}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>{t.newWorkspaceBtn}</span>
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {savedWorkspaces.map(item => {
                      const isCurrent = item.id === workspace.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectSavedWorkspace(item)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-300'
                              : isDarkMode
                                ? 'bg-slate-900/50 border-slate-700 hover:bg-slate-700/60'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="text-xs font-bold truncate flex items-center gap-2">
                              <span>{item.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">
                                  {t.activeBadge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.boards?.length || 1} {t.boardDefaultName}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-none">
                            {!isCurrent && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSavedWorkspace(item);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold"
                              >
                                {t.openWorkspaceBtn}
                              </button>
                            )}
                            {savedWorkspaces.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteSavedWorkspace(e, item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs">
                  💡 {t.workspaceTip}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => setShowWorkspaceModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
                  >
                    {t.done}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
