import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  LogOut, 
  Settings, 
  Menu,
  X,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from '../components/admin/Dashboard';
import ProductManager from '../components/admin/ProductManager';
import ContentManager from '../components/admin/ContentManager';
import { useToast } from '../context/ToastContext';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'content'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { addToast } = useToast();

  // Check auth on load
  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
    // Auto-collapse sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      addToast('Welcome back, Admin!', 'success');
    } else {
      addToast('Incorrect Password. Access Denied.', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    addToast('Logged out successfully.', 'info');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-rose/60 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-brand-sage/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">Fatma's Corner</h1>
            <p className="text-brand-text/50 text-sm font-sans uppercase tracking-widest">CMS Access Portal</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-brand-brown mb-2 uppercase tracking-wide ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-brand-rose/30 focus:border-brand-sageDark outline-none bg-white/50 focus:bg-white transition-all text-lg"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-brand-brown text-white font-bold py-4 rounded-xl hover:bg-brand-sageDark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const NavItem = ({ view, icon: Icon, label }: { view: typeof activeView, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveView(view); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        activeView === view 
          ? 'bg-brand-sageDark text-white shadow-md' 
          : 'text-brand-text/60 hover:bg-brand-sage/30 hover:text-brand-brown'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
             <div>
               <h2 className="font-serif font-bold text-xl text-brand-brown">Fatma's CMS</h2>
               <span className="text-xs text-brand-sageDark font-bold bg-brand-sage/20 px-2 py-0.5 rounded-full">v2.0</span>
             </div>
             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
               <X size={24} />
             </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="products" icon={ShoppingBag} label="Inventory" />
            <NavItem view="content" icon={FileText} label="Site Content" />
            
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-8">System</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-text/60 hover:bg-gray-100 transition-all font-medium">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-500">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg border-0">
               <Search size={16} />
               <input placeholder="Global Search..." className="bg-transparent border-none outline-none text-sm w-48 text-brand-text" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-brand-brown">Admin User</span>
                <span className="text-xs text-green-500 font-medium">● Online</span>
             </div>
             <div className="h-10 w-10 bg-brand-sageDark rounded-full flex items-center justify-center text-white font-bold font-serif">
               A
             </div>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              {activeView === 'dashboard' && <Dashboard onViewChange={setActiveView} />}
              {activeView === 'products' && <ProductManager />}
              {activeView === 'content' && <ContentManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
};

export default Admin;