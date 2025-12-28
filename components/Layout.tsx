
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                <span className="text-white font-extrabold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">EduQuest</h1>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Premium Learning</span>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {user.role === 'teacher' ? 'Giảng viên' : `Sinh viên • ${user.studentId}`}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-gray-500 font-bold">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Thoát
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 lg:px-8 py-10">
        {children}
      </main>

      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 bg-gray-400 rounded-lg"></div>
            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">EduQuest Platform</span>
          </div>
          <p className="text-sm font-medium text-gray-400">
            © {new Date().getFullYear()} Tinh hoa công nghệ giáo dục. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
