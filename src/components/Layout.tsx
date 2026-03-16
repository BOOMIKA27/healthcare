import React from "react";
import { motion } from "motion/react";
import { Activity, Heart, AlertTriangle, User, LogOut } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface LayoutProps {
  children: React.ReactNode;
  user: any;
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E0] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
              <Heart size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none">RuralHealth AI</h1>
              <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold">Remote Diagnosis</span>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">{user.displayName || "Patient"}</span>
                <span className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Verified User</span>
              </div>
              <button 
                onClick={() => signOut(auth)}
                className="p-2 hover:bg-[#F5F5F0] rounded-full transition-colors text-[#5A5A40]"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-top border-[#E5E5E0] py-12 mt-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-[#8E8E8E] text-sm italic serif">
            "Empowering rural communities with advanced AI diagnostics."
          </p>
          <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]">
            <span>Telemedicine</span>
            <span>Emergency Triage</span>
            <span>Multilingual</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
