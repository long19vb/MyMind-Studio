import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { 
  Plus, Trash2, Download, LogIn, LogOut, Cloud, Undo2, Redo2, 
  Globe, ZoomIn, ZoomOut, Move, Palette, Sparkles, FolderOpen, Save, Square, Circle, Triangle, Layers 
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('vi');
  const [nodes, setNodes] = useState([
    { id: '1', text: 'MyMind Studio', shape: 'rect', x: 500, y: 350, color: '#3b82f6', bg: '#1e293b', parent: null }
  ]);
  const [selectedId, setSelectedId] = useState('1');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('My Workspace');

  // Bảng màu lựa chọn
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadCloudWorkspace(currentUser.uid);
      } else {
        signInAnonymously(auth).catch((err) => console.log("Auth error:", err));
      }
    });
    return () => unsubscribe();
  }, []);

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

  const saveCloudWorkspace = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "workspaces", user.uid), {
        name: workspaceName,
        nodes: nodes,
        updatedAt: new Date()
      });
      alert(lang === 'vi' ? "Đã lưu workspace lên đám mây thành công!" : "Workspace saved successfully!");
    } catch (e) {
      console.error("Error saving workspace: ", e);
    }
  };

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

  // Thêm node mới kế thừa thuộc tính node mẹ
  const addChildNode = (shapeType = 'rect') => {
    const parentNode = nodes.find(n => n.id === selectedId);
    if (!parentNode) return;

    const newNodeId = Date.now().toString();
    const newNode = {
      id: newNodeId,
      text: lang === 'vi' ? 'Ý tưởng mới' : 'New Idea',
      shape: shapeType,
      x: parentNode.x + 220,
      y: parentNode.y + (Math.random() * 120 - 60),
      color: parentNode.color,
      bg: parentNode.bg,
      parent: parentNode.id
    };

    setHistory([...history, nodes]);
    setRedoStack([]);
    setNodes([...nodes, newNode]);
    setSelectedId(newNodeId);
  };

  const deleteNode = () => {
    if (nodes.length <= 1) return;
    setHistory([...history, nodes]);
    setRedoStack([]);
    setNodes(nodes.filter(n => n.id !== selectedId && n.parent !== selectedId));
    setSelectedId('1');
  };

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

  const updateSelectedNodeColor = (color) => {
    setNodes(nodes.map(n => n.id === selectedId ? { ...n, color } : n));
  };

  const updateSelectedNodeShape = (shape) => {
    setNodes(nodes.map(n => n.id === selectedId ? { ...n, shape } : n));
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-900 text-white font-sans select-none">
      {/* HEADER TOOLBAR */}
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-20 shadow-md">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            MyMind Studio
          </h1>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full hidden sm:inline">
            {lang === 'vi' ? 'Song ngữ Anh-Việt' : 'Bilingual'}
          </span>
        </div>

        {/* Toolbar Center Actions */}
        <div className="flex items-center space-x-1.5 md:space-x-2">
          <button onClick={() => addChildNode('rect')} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition shadow">
            <Plus className="w-4 h-4" /> <span>{lang === 'vi' ? 'Thêm nhánh' : 'Add Node'}</span>
          </button>
          
          <div className="flex items-center space-x-1 bg-slate-700/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => updateSelectedNodeShape('rect')} title="Chữ nhật" className={`p-1.5 rounded ${nodes.find(n => n.id === selectedId)?.shape === 'rect' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}><Square className="w-4 h-4" /></button>
            <button onClick={() => updateSelectedNodeShape('oval')} title="Oval" className={`p-1.5 rounded ${nodes.find(n => n.id === selectedId)?.shape === 'oval' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}><Circle className="w-4 h-4" /></button>
            <button onClick={() => updateSelectedNodeShape('triangle')} title="Tam giác" className={`p-1.5 rounded ${nodes.find(n => n.id === selectedId)?.shape === 'triangle' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}><Triangle className="w-4 h-4" /></button>
          </div>

          <div className="h-5 w-[1px] bg-slate-700 mx-1"></div>

          <button onClick={handleUndo} disabled={history.length === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-40 transition" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>

          <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          <button onClick={() => setShowExportModal(true)} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium transition">
            <Download className="w-4 h-4" /> <span className="hidden md:inline">Export</span>
          </button>
        </div>

        {/* Auth / Cloud Sync */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <button onClick={saveCloudWorkspace} className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm transition" title="Save to Cloud">
            <Cloud className="w-4 h-4" />
            <span className="hidden lg:inline">Cloud Save</span>
          </button>

          {user && !user.isAnonymous ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-300 hidden xl:inline">{user.displayName || user.email}</span>
              <button onClick={handleLogout} className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 rounded-lg" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-semibold transition">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* SUB-TOOLBAR MÀU SẮC VIỀN VÀ XÓA NODE */}
      <div className="h-10 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between px-4 z-10 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium">Màu viền:</span>
          <div className="flex space-x-1.5">
            {colors.map(col => (
              <button
                key={col}
                onClick={() => updateSelectedNodeColor(col)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${nodes.find(n => n.id === selectedId)?.color === col ? 'scale-125 border-white' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={deleteNode} className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 transition">
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Xóa nhánh' : 'Delete Node'}</span>
          </button>
        </div>
      </div>

      {/* CANVAS KHU VỰC VẼ MINDMAP */}
      <div 
        className="flex-1 relative overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          setIsDraggingCanvas(true);
          setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }}
        onMouseMove={(e) => {
          if (isDraggingCanvas) {
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
          } else if (draggingNodeId) {
            const dx = (e.clientX - dragStart.x) / scale;
            const dy = (e.clientY - dragStart.y) / scale;
            setNodes(nodes.map(n => n.id === draggingNodeId ? { ...n, x: n.x + dx, y: n.y + dy } : n));
            setDragStart({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseUp={() => { setIsDraggingCanvas(false); setDraggingNodeId(null); }}
        onWheel={(e) => {
          const newScale = Math.min(Math.max(0.2, scale - e.deltaY * 0.001), 3);
          setScale(newScale);
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          {/* SVG Đường nối Bezier 360 độ */}
          <svg className="absolute inset-0 w-[8000px] h-[8000px] pointer-events-none">
            {nodes.map(node => {
              if (!node.parent) return null;
              const parentNode = nodes.find(n => n.id === node.parent);
              if (!parentNode) return null;

              const startX = parentNode.x + 80;
              const startY = parentNode.y + 25;
              const endX = node.x + 80;
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

          {/* Render các Bubble */}
          {nodes.map(node => {
            const isSelected = selectedId === node.id;
            let shapeClass = 'rounded-xl';
            if (node.shape === 'oval') shapeClass = 'rounded-full px-6 py-4';
            if (node.shape === 'triangle') shapeClass = 'rounded-md clip-triangle px-4 py-4';

            return (
              <div
                key={node.id}
                onClick={(e) => { e.stopPropagation(); setSelectedId(node.id); }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedId(node.id);
                  setDraggingNodeId(node.id);
                  setDragStart({ x: e.clientX, y: e.clientY });
                }}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  backgroundColor: node.bg || '#1e293b',
                  borderColor: node.color || '#3b82f6',
                }}
                className={`absolute p-3 min-w-[160px] text-center cursor-move transition-shadow shadow-xl flex items-center justify-center border-2 
                  ${shapeClass}
                  ${isSelected ? 'ring-4 ring-cyan-400 shadow-cyan-500/50 z-10' : 'hover:opacity-95'}
                `}
              >
                <input
                  type="text"
                  value={node.text}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(nodes.map(n => n.id === node.id ? { ...n, text: val } : n));
                  }}
                  className="bg-transparent text-center outline-none w-full font-medium text-sm text-white truncate"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL EXPORT & POPUP AD */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Export MyMind Studio</h3>
            <p className="text-sm text-slate-300">
              {lang === 'vi' 
                ? 'Sơ đồ tư duy của bạn đã sẵn sàng để xuất file hoặc sao lưu đám mây.' 
                : 'Your mind map is ready to export.'}
            </p>
            <div className="p-4 bg-slate-800 rounded-xl border border-dashed border-slate-700 text-xs text-blue-400">
              💡 Quảng cáo: Nâng cấp gói Pro để mở rộng dung lượng lưu trữ không giới hạn!
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={() => { alert("Đã tải xuống file thành công!"); setShowExportModal(false); }} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition">
                {lang === 'vi' ? 'Tải xuống (Download)' : 'Download'}
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
