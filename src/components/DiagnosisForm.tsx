import React, { useState } from "react";
import { Camera, Send, Loader2, Thermometer, Heart, Activity } from "lucide-react";
import { motion } from "motion/react";

interface DiagnosisFormProps {
  onSubmit: (data: { symptoms: string; vitals: any; image?: string; language: string }) => void;
  loading: boolean;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onSubmit, loading }) => {
  const [symptoms, setSymptoms] = useState("");
  const [language, setLanguage] = useState("English");
  const [vitals, setVitals] = useState({
    temperature: "",
    heartRate: "",
    bloodPressure: ""
  });
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ symptoms, vitals, image: image || undefined, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[32px] shadow-sm border border-[#E5E5E0]">
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">Preferred Language</label>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 bg-[#F5F5F0] border-none rounded-2xl text-sm focus:ring-2 ring-[#5A5A40]"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Bengali</option>
          <option>Marathi</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">Describe Symptoms</label>
        <textarea
          required
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., High fever for 2 days, persistent cough..."
          className="w-full p-4 bg-[#F5F5F0] border-none rounded-2xl text-sm min-h-[120px] focus:ring-2 ring-[#5A5A40]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">
            <Thermometer size={14} /> Temp (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={vitals.temperature}
            onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
            className="w-full p-3 bg-[#F5F5F0] border-none rounded-2xl text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">
            <Heart size={14} /> Heart Rate
          </label>
          <input
            type="number"
            value={vitals.heartRate}
            onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
            className="w-full p-3 bg-[#F5F5F0] border-none rounded-2xl text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">
            <Activity size={14} /> BP (e.g. 120/80)
          </label>
          <input
            type="text"
            value={vitals.bloodPressure}
            onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
            className="w-full p-3 bg-[#F5F5F0] border-none rounded-2xl text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">Upload Image (Optional)</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-[#F5F5F0] rounded-2xl hover:bg-[#E5E5E0] transition-colors text-sm font-medium">
            <Camera size={18} />
            <span>{image ? "Change Photo" : "Take/Upload Photo"}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {image && (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#E5E5E0]">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Analyzing Symptoms...</span>
          </>
        ) : (
          <>
            <Send size={20} />
            <span>Get AI Diagnosis</span>
          </>
        )}
      </button>
    </form>
  );
};
