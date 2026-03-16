import React from "react";
import { motion } from "motion/react";
import { AlertCircle, CheckCircle, Info, ArrowRight } from "lucide-react";
import Markdown from "react-markdown";
import { DiagnosisRecord } from "../types";

interface ResultProps {
  result: DiagnosisRecord;
  onReset: () => void;
}

export const DiagnosisResult: React.FC<ResultProps> = ({ result, onReset }) => {
  const triageColors = {
    emergency: "bg-red-50 text-red-700 border-red-200",
    urgent: "bg-orange-50 text-orange-700 border-orange-200",
    routine: "bg-emerald-50 text-emerald-700 border-emerald-200"
  };

  const triageIcons = {
    emergency: <AlertCircle className="text-red-600" />,
    urgent: <Info className="text-orange-600" />,
    routine: <CheckCircle className="text-emerald-600" />
  };

  return (
    <div className="space-y-8">
      {/* Triage Header */}
      <div className={`p-6 rounded-[32px] border flex items-center gap-4 ${triageColors[result.triageLevel]}`}>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          {triageIcons[result.triageLevel]}
        </div>
        <div>
          <h2 className="text-xl font-bold capitalize leading-tight">{result.triageLevel} Priority</h2>
          <p className="text-sm opacity-80">AI-assisted preliminary assessment based on your input.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analysis Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E0] shadow-sm">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40] mb-4">Detailed Analysis</h3>
            <div className="prose prose-sm max-w-none text-[#4A4A4A] leading-relaxed">
              <Markdown>{result.aiAnalysis}</Markdown>
            </div>
          </div>

          <div className="bg-[#5A5A40] p-8 rounded-[32px] text-white shadow-lg">
            <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-70 mb-4">Recommendations</h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] flex-shrink-0">{i + 1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Translation & Summary */}
        <div className="space-y-6">
          {result.doctorVerification && (
            <div className="bg-emerald-600 p-8 rounded-[32px] text-white shadow-lg">
              <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-70 mb-4">Doctor's Verification</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold opacity-60 block">Notes</span>
                  <p className="text-sm font-medium">{result.doctorVerification.notes}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold opacity-60 block">Prescribed Medicines</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.doctorVerification.medicines.map((m, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-[#E5E5E0] shadow-sm">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40] mb-4">Summary ({result.language})</h3>
            <p className="text-lg font-serif italic text-[#1A1A1A] leading-relaxed">
              {result.translatedSummary}
            </p>
          </div>

          <div className="bg-[#F5F5F0] p-8 rounded-[32px] border border-dashed border-[#5A5A40]/30">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40] mb-4">Next Steps</h3>
            <p className="text-sm text-[#4A4A4A] mb-6">
              This is an AI-generated assessment. Please consult a medical professional for a definitive diagnosis.
            </p>
            <button 
              onClick={onReset}
              className="group flex items-center gap-2 text-sm font-bold text-[#5A5A40] hover:underline"
            >
              Start New Assessment
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
