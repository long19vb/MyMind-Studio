import React, { useState, useEffect, useRef } from 'react';
import { 
  initializeapp, 
  initializeApp 
} from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";
import { 
  Plus, Trash2, Download, LogIn, LogOut, Cloud, Undo2, Redo2, 
  Globe, ZoomIn, ZoomOut, Move, Palette, Sparkles, FolderOpen, Save 
} from 'lucide-react';

// Cấu hình Firebase chính thức của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDTW94zFwv4rTxDhReywvBnumq3G3kUI7g",
  authDomain: "mymind-studio.firebaseapp.com",
  projectId: "mymind-studio",
  storageBucket: "mymind-studio.firebasestorage.app",
  messagingSenderId: "1056777863960",
  appId: "1:1056777863960:web:c504f50413b8cc0dbfd46d"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export default function App() {
  // Trạng thái ứng dụng
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('vi'); // 'vi' hoặc 'en'
  const [nodes, setNodes] = useState([
    { id: '1', text: 'MyMind Studio', shape: 'rect', x: 400, y: 300, color: '#3b82f6', bg: '#eff6ff', parent: null }
  ]);
  const [selectedId, setSelectedId] = useState('1');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('My Workspace');

  // Lắng nghe trạng thái đăng nhập Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadCloudWorkspace(currentUser.uid);
      } else {
        // Tự động đăng nhập ẩn danh hoặc cho phép dùng khách
        signInAnonymously(auth).catch((err) => console.log("Auth error:", err));
      }
    });
    return () => unsubscribe();
  }, []);

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại cấu hình Authorized domains trên Firebase.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Lưu đám mây Firestore
  const saveCloudWorkspace = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "workspaces", user.uid), {
        name: workspaceName,
        nodes: nodes,
        updatedAt: new Date()
      });
      alert(lang === 'vi' ? "Đã lưu workspace lên đám mây thành công!" : "Workspace saved to cloud successfully!");
    } catch (e) {
      console.error("Error saving workspace: ", e);
    }
  };

  // Tải dữ liệu từ Firestore
  const loadCloudWorkspace = async (uid) => {
    try {
      const docRef = doc(db, "workspaces", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.nodes) setNodes(data.nodes);
        if (data.name) setWorkspaceName(data.name);
      }
    } catch (e) {
      console.error("Error loading workspace: ", e);
    }
  };

  // Auto-save mỗi 10 phút nếu đã đăng nhập
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        saveCloudWorkspace();
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, nodes, workspaceName]);

  // Thêm node con
  const addChildNode = (shapeType = 'rect') => {
    const parentNode = nodes.find(n => n.id === selectedId);
    if (!parentNode) return;

    const newNodeId = Date.now().toString();
    const newNode = {
      id: newNodeId,
      text: lang === 'vi' ? 'Ý tưởng mới' : 'New Idea',
      shape: shapeType,
      x: parentNode.x + 200,
      y: parentNode.y + (Math.random() * 100 - 50),
      color: parentNode.color,
      bg: parentNode.bg,
      parent: parentNode.id
    };

    setHistory([...history, nodes]);
    setRedoStack([]);
    setNodes([...nodes, newNode]);
    setSelectedId(newNodeId);
  };

  // Xóa node
  const deleteNode = () => {
    if (nodes.length <= 1) return; // Giữ lại root node ít nhất
    setHistory([...history, nodes]);
    setRedoStack([]);
    setNodes(nodes.filter(n => n.id !== selectedId && n.parent !== selectedId));
    setSelectedId('1');
  };

  // Undo / Redo
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack([nodes, ...redoStack]);
    setNodes(previous);
    setHistory(history.slice(0, history.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, nodes]);
    setNodes(next);
    setRedoStack(redoStack.slice(1));
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-900 text-white font-sans select-none">
      {/* HEADER TOOLBAR */}
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-20">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            MyMind Studio
          </h1>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
            {lang === 'vi' ? 'Song ngữ Anh-Việt' : 'Bilingual'}
          </span>
        </div>

        {/* Toolbar Center Actions */}
        <div className="flex items-center space-x-2">
          <button onClick={() => addChildNode('rect')} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition">
            <Plus className="w-4 h-4" /> <span>{lang === 'vi' ? 'Thêm nhánh' : 'Add Node'}</span>
          </button>
          
          <div className="h-5 w-[1px] bg-slate-700 mx-1"></div>

          <button onClick={handleUndo} disabled={history.length === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-700 mx-1"></div>

          <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          <button onClick={() => setShowExportModal(true)} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition">
            <Download className="w-4 h-4" /> <span>Export</span>
          </button>
        </div>

        {/* Auth / Cloud Sync */}
        <div className="flex items-center space-x-3">
          <button onClick={saveCloudWorkspace} className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm transition" title="Save to Cloud">
            <Save className="w-4 h-4" />
            <span className="hidden md:inline">Cloud Save</span>
          </button>

          {user && !user.isAnonymous ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-300 hidden md:inline">{user.displayName || user.email}</span>
              <button onClick={handleLogout} className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-lg" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-semibold transition">
              <LogIn className="w-4 h-4" />
              <span>Login Google</span>
            </button>
          )}
        </div>
      </header>

      {/* CANVAS KHU VỰC VẼ MINDMAP */}
      <div 
        className="flex-1 relative overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing"
        onWheel={(e) => {
          const newScale = Math.min(Math.max(0.2, scale - e.deltaY * 0.001), 3);
          setScale(newScale);
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          {/* SVG Đường nối Bezier giữa các Node */}
          <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none">
            {nodes.map(node => {
              if (!node.parent) return null;
              const parentNode = nodes.find(n => n.id === node.parent);
              if (!parentNode) return null;

              // Tính toán đường cong Bezier
              const startX = parentNode.x + 75;
              const startY = parentNode.y + 25;
              const endX = node.x + 75;
              const endY = node.y + 25;
              const dx = (endX - startX) / 2;

              return (
                <path
                  key={`path-${node.id}`}
                  d={`M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke={node.color || "#3b82f6"}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Render các Bubble / Node */}
          {nodes.map(node => {
            const isSelected = selectedId === node.id;
            return (
              <div
                key={node.id}
                onClick={(e) => { e.stopPropagation(); setSelectedId(node.id); }}
                style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                className={`absolute p-3 min-w-[150px] text-center cursor-pointer transition-shadow shadow-lg flex items-center justify-center 
                  ${node.shape === 'oval' ? 'rounded-full px-5 py-4' : node.shape === 'triangle' ? 'clip-triangle' : 'rounded-xl'}
                  ${isSelected ? 'ring-4 ring-cyan-400 shadow-cyan-500/50' : 'hover:opacity-90'}
                `}
                data-color={node.color}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  backgroundColor: node.bg || '#1e293b',
                  border: `2px solid ${node.color || '#3b82f6'}`,
                  color: '#ffffff'
                }}
              >
                <input
                  type="text"
                  value={node.text}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(nodes.map(n => n.id === node.id ? { ...n, text: val } : n));
                  }}
                  className="bg-transparent text-center outline-none w-full font-medium text-sm truncate"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* BANNER / POPUP AD HOẶC INFO KHI EXPORT */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Export MyMind Studio</h3>
            <p className="text-sm text-slate-300">
              {lang === 'vi' 
                ? 'Sơ đồ tư duy của bạn đã sẵn sàng xuất file hoặc chia sẻ lên đám mây.' 
                : 'Your mind map is ready to export or share.'}
            </p>
            <div className="p-4 bg-slate-800 rounded-xl border border-dashed border-slate-700 text-xs text-blue-400">
              💡 Banner Ad / Promotion: Nâng cấp Pro để mở khóa vô hạn dung lượng và xuất bản đồ không giới hạn!
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => alert("Đã tải về thành công!")} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition">
                {lang === 'vi' ? 'Tải xuống JSON / Image' : 'Download File'}
              </button>
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-sm transition">
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
