import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Layout } from "./components/Layout";
import { Auth } from "./components/Auth";
import { DiagnosisForm } from "./components/DiagnosisForm";
import { DiagnosisResult } from "./components/DiagnosisResult";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { DoctorList } from "./components/DoctorList";
import { EmergencyGuide } from "./components/EmergencyGuide";
import { getAIDiagnosis } from "./services/aiService";
import { DiagnosisRecord } from "./types";
import { Loader2, AlertCircle, User as UserIcon, Stethoscope, Heart, ShieldAlert, Calendar } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"patient" | "doctor">("patient");
  const [activeTab, setActiveTab] = useState<"assess" | "doctors" | "emergency">("assess");

  const isAdmin = user?.email === "boomika4225@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDiagnosis = async (data: { symptoms: string; vitals: any; image?: string; language: string }) => {
    if (!user) return;
    
    setAnalyzing(true);
    setError(null);
    
    try {
      const aiResponse = await getAIDiagnosis(data.symptoms, data.vitals, data.language, data.image);
      
      const record: DiagnosisRecord = {
        patientId: user.uid,
        symptoms: data.symptoms,
        vitals: data.vitals,
        aiAnalysis: aiResponse.analysis,
        triageLevel: aiResponse.triageLevel,
        recommendations: aiResponse.recommendations,
        translatedSummary: aiResponse.translatedSummary,
        language: data.language,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "diagnoses"), record);
      
      if (aiResponse.triageLevel === "emergency") {
        await addDoc(collection(db, "alerts"), {
          diagnosisId: docRef.id,
          patientId: user.uid,
          location: "Unknown (Rural)",
          status: "pending",
          createdAt: serverTimestamp()
        });
        setActiveTab("emergency");
      }

      setResult({ ...record, id: docRef.id });
    } catch (err: any) {
      console.error("Diagnosis error:", err);
      setError("Failed to analyze symptoms. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <Loader2 className="animate-spin text-[#5A5A40]" size={48} />
      </div>
    );
  }

  return (
    <Layout user={user}>
      {!user ? (
        <Auth />
      ) : (
        <div className="space-y-8">
          {/* Role Switcher */}
          {isAdmin && (
            <div className="flex justify-center mb-4">
              <div className="bg-white p-1 rounded-full border border-[#E5E5E0] flex gap-1 shadow-sm">
                <button
                  onClick={() => setView("patient")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    view === "patient" ? "bg-[#5A5A40] text-white shadow-md" : "text-[#5A5A40] hover:bg-[#F5F5F0]"
                  }`}
                >
                  <UserIcon size={16} /> Patient View
                </button>
                <button
                  onClick={() => setView("doctor")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    view === "doctor" ? "bg-[#5A5A40] text-white shadow-md" : "text-[#5A5A40] hover:bg-[#F5F5F0]"
                  }`}
                >
                  <Stethoscope size={16} /> Doctor View
                </button>
              </div>
            </div>
          )}

          {/* Patient Navigation */}
          {view === "patient" && (
            <div className="flex justify-center mb-8">
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setActiveTab("assess")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "assess" ? "bg-white text-[#5A5A40] shadow-sm border border-[#5A5A40]" : "text-[#8E8E8E] hover:text-[#5A5A40]"
                  }`}
                >
                  <Heart size={18} /> Health Assessment
                </button>
                <button
                  onClick={() => setActiveTab("doctors")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "doctors" ? "bg-white text-[#5A5A40] shadow-sm border border-[#5A5A40]" : "text-[#8E8E8E] hover:text-[#5A5A40]"
                  }`}
                >
                  <Calendar size={18} /> Online Appointments
                </button>
                <button
                  onClick={() => setActiveTab("emergency")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "emergency" ? "bg-red-600 text-white shadow-md" : "text-red-600/70 hover:text-red-600"
                  }`}
                >
                  <ShieldAlert size={18} /> Emergency Guide
                </button>
              </div>
            </div>
          )}

          {view === "doctor" && isAdmin ? (
            <DoctorDashboard />
          ) : activeTab === "emergency" ? (
            <EmergencyGuide />
          ) : activeTab === "doctors" ? (
            <DoctorList />
          ) : result ? (
            <DiagnosisResult result={result} onReset={() => setResult(null)} />
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-2 mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Health Assessment</h2>
                <p className="text-[#8E8E8E]">Please provide details about your current symptoms.</p>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <DiagnosisForm onSubmit={handleDiagnosis} loading={analyzing} />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
