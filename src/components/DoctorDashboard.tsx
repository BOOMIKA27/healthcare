import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { DiagnosisRecord } from "../types";
import { CheckCircle, XCircle, Clock, Pill, User, Stethoscope, ClipboardList } from "lucide-react";
import { motion } from "motion/react";

export const DoctorDashboard: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [selected, setSelected] = useState<DiagnosisRecord | null>(null);
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "diagnoses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DiagnosisRecord));
      setDiagnoses(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleVerify = async (status: "verified" | "rejected") => {
    if (!selected || !selected.id) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "diagnoses", selected.id), {
        doctorVerification: {
          status,
          notes,
          medicines: medicines.split(",").map(m => m.trim()).filter(m => m),
          doctorId: auth.currentUser?.uid,
          verifiedAt: serverTimestamp()
        }
      });
      setSelected(null);
      setNotes("");
      setMedicines("");
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Stethoscope size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doctor Dashboard</h2>
          <p className="text-sm text-[#8E8E8E]">Review and verify patient health assessments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">Recent Assessments</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {diagnoses.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?.id === d.id 
                    ? "bg-white border-[#5A5A40] shadow-md ring-1 ring-[#5A5A40]" 
                    : "bg-white border-[#E5E5E0] hover:border-[#5A5A40]/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    d.triageLevel === 'emergency' ? 'bg-red-100 text-red-700' : 
                    d.triageLevel === 'urgent' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {d.triageLevel}
                  </span>
                  <span className="text-[10px] text-[#8E8E8E]">
                    {d.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#1A1A1A] line-clamp-2 mb-2">{d.symptoms}</p>
                <div className="flex items-center gap-2 text-[10px] text-[#5A5A40] font-bold">
                  {d.doctorVerification?.status === 'verified' ? (
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> Verified</span>
                  ) : d.doctorVerification?.status === 'rejected' ? (
                    <span className="flex items-center gap-1 text-red-600"><XCircle size={12} /> Rejected</span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600"><Clock size={12} /> Pending</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Details & Form */}
        <div className="lg:col-span-2">
          {selected ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[32px] border border-[#E5E5E0] shadow-sm space-y-8"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">Assessment Details</h3>
                <button onClick={() => setSelected(null)} className="text-sm text-[#8E8E8E] hover:underline">Close</button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Symptoms</span>
                  <p className="text-sm text-[#4A4A4A]">{selected.symptoms}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#8E8E8E]">Vitals</span>
                  <div className="flex gap-4 text-sm text-[#4A4A4A]">
                    <span>Temp: {selected.vitals?.temperature}°C</span>
                    <span>HR: {selected.vitals?.heartRate}</span>
                    <span>BP: {selected.vitals?.bloodPressure}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#F5F5F0] rounded-2xl">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] mb-2 block">AI Analysis</span>
                <p className="text-sm text-[#4A4A4A] italic leading-relaxed">{selected.aiAnalysis}</p>
              </div>

              {selected.doctorVerification?.status ? (
                <div className="p-6 border-2 border-dashed border-[#5A5A40]/20 rounded-2xl space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <ClipboardList size={18} /> Doctor's Verification
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8E8E8E] block">Notes</span>
                      <p>{selected.doctorVerification.notes}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8E8E8E] block">Medicines</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selected.doctorVerification.medicines.map((m, i) => (
                          <span key={i} className="px-2 py-1 bg-[#5A5A40] text-white text-[10px] rounded-md">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-6 border-t border-[#E5E5E0]">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">Doctor's Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter clinical observations..."
                      className="w-full p-4 bg-[#F5F5F0] border-none rounded-2xl text-sm min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-[#5A5A40]">Prescribed Medicines (comma separated)</label>
                    <div className="relative">
                      <Pill className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/50" size={18} />
                      <input
                        type="text"
                        value={medicines}
                        onChange={(e) => setMedicines(e.target.value)}
                        placeholder="e.g., Paracetamol 500mg, Amoxicillin..."
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F5F0] border-none rounded-2xl text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      disabled={submitting}
                      onClick={() => handleVerify("verified")}
                      className="flex-1 py-4 bg-[#5A5A40] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#4A4A30] transition-all disabled:opacity-50"
                    >
                      <CheckCircle size={20} /> Verify & Prescribe
                    </button>
                    <button
                      disabled={submitting}
                      onClick={() => handleVerify("rejected")}
                      className="px-8 py-4 border border-red-200 text-red-600 rounded-full font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-[#E5E5E0] rounded-[32px]">
              <div className="w-16 h-16 bg-[#F5F5F0] rounded-full flex items-center justify-center text-[#5A5A40] mb-4">
                <User size={32} />
              </div>
              <h4 className="text-lg font-bold">Select an assessment</h4>
              <p className="text-sm text-[#8E8E8E] max-w-xs">Choose a patient assessment from the list to review details and provide verification.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
