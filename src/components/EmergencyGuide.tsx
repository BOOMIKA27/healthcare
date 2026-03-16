import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Play, Pill, Heart, ShieldAlert, BookOpen } from "lucide-react";

export const EmergencyGuide: React.FC = () => {
  const firstAidVideos = [
    { title: "CPR Basics", duration: "3:45", thumbnail: "https://picsum.photos/seed/cpr/400/225", id: "1" },
    { title: "Choking Relief", duration: "2:20", thumbnail: "https://picsum.photos/seed/choke/400/225", id: "2" },
    { title: "Wound Care", duration: "4:10", thumbnail: "https://picsum.photos/seed/wound/400/225", id: "3" },
    { title: "Burn Treatment", duration: "3:15", thumbnail: "https://picsum.photos/seed/burn/400/225", id: "4" }
  ];

  const emergencyMeds = [
    { name: "Aspirin", use: "Chest pain / Heart attack", dosage: "325mg (Chewable)" },
    { name: "Epinephrine", use: "Severe allergic reactions", dosage: "Auto-injector" },
    { name: "Nitroglycerin", use: "Angina / Chest pain", dosage: "Under tongue" },
    { name: "Naloxone", use: "Opioid overdose", dosage: "Nasal spray" }
  ];

  return (
    <div className="space-y-10">
      {/* Emergency Alert Banner */}
      <div className="bg-red-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <ShieldAlert size={32} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-1">Emergency Protocol</h2>
            <p className="text-white/80 text-sm max-w-lg">
              If someone is unconscious or not breathing, call emergency services immediately. 
              Follow the guides below while waiting for help.
            </p>
          </div>
          <button className="md:ml-auto px-8 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-red-50 transition-colors shadow-lg">
            Call Ambulance
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Emergency Medicines */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <Pill className="text-red-500" size={20} />
            <h3 className="text-lg font-bold">Emergency Medicines</h3>
          </div>
          <div className="space-y-4">
            {emergencyMeds.map((med, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-[#E5E5E0] shadow-sm hover:border-red-200 transition-colors">
                <h4 className="font-bold text-[#1A1A1A] mb-1">{med.name}</h4>
                <p className="text-xs text-[#5A5A40] font-medium mb-2">{med.use}</p>
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#8E8E8E] bg-[#F5F5F0] px-3 py-1 rounded-lg w-fit">
                  Dosage: {med.dosage}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
            <AlertCircle className="text-orange-500 shrink-0" size={18} />
            <p className="text-[10px] text-orange-800 leading-relaxed">
              <strong>WARNING:</strong> Only administer medicines if you are trained or instructed by a medical professional.
            </p>
          </div>
        </div>

        {/* First Aid Videos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#5A5A40]" size={20} />
            <h3 className="text-lg font-bold">First Aid Methods</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {firstAidVideos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-[24px] overflow-hidden border border-[#E5E5E0] shadow-sm mb-3">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-[#1A1A1A] shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                    {video.duration}
                  </div>
                </div>
                <h4 className="font-bold text-[#1A1A1A] px-2">{video.title}</h4>
                <p className="text-[10px] text-[#8E8E8E] px-2 uppercase tracking-widest font-bold mt-1">Video Tutorial</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
