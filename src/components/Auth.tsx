import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { LogIn, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export const Auth: React.FC = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-[#5A5A40]"
      >
        <ShieldCheck size={48} />
      </motion.div>
      
      <div className="space-y-4 max-w-md">
        <h2 className="text-4xl font-bold tracking-tight">Secure Healthcare Access</h2>
        <p className="text-[#8E8E8E] leading-relaxed">
          Sign in to access AI-powered remote diagnosis. Your medical data is encrypted and protected.
        </p>
      </div>

      <button
        onClick={handleLogin}
        className="group flex items-center gap-3 px-8 py-4 bg-white border border-[#E5E5E0] rounded-full font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        <span>Continue with Google</span>
        <LogIn size={18} className="text-[#5A5A40] group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="pt-8 grid grid-cols-3 gap-8 text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]/50">
        <div className="flex flex-col gap-2">
          <span className="text-xl text-[#5A5A40]">24/7</span>
          <span>Availability</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl text-[#5A5A40]">100%</span>
          <span>Private</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl text-[#5A5A40]">AI</span>
          <span>Powered</span>
        </div>
      </div>
    </div>
  );
};
