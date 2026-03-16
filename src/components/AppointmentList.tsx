import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Appointment, Doctor } from "../types";
import { Clock, Calendar, CheckCircle, XCircle, User, Video, MapPin } from "lucide-react";
import { motion } from "motion/react";

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<(Appointment & { doctor?: Doctor })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", auth.currentUser.uid),
      orderBy("scheduledAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const appts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      
      // Fetch doctor details for each appointment (in a real app, use a join or denormalize)
      // For this demo, we'll just map them
      const enrichedAppts = appts.map(appt => ({
        ...appt,
        // We'll assume doctor info is fetched or mocked
      }));
      
      setAppointments(enrichedAppts as any);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center py-8 text-[#8E8E8E]">Loading your schedule...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">Your Schedule</h3>
        <span className="text-[10px] uppercase font-bold text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-[#E5E5E0]">
          {appointments.length} Appointments
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-[#E5E5E0] rounded-[32px] text-center space-y-4">
          <div className="w-16 h-16 bg-[#F5F5F0] rounded-full flex items-center justify-center text-[#5A5A40] mx-auto">
            <Calendar size={32} />
          </div>
          <div>
            <p className="font-bold">No appointments yet</p>
            <p className="text-sm text-[#8E8E8E]">Book a consultation with one of our available doctors.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[32px] border border-[#E5E5E0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F5F5F0] rounded-2xl flex items-center justify-center text-[#5A5A40]">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A1A]">Consultation</h4>
                  <p className="text-xs text-[#5A5A40] font-medium">Doctor ID: {appt.doctorId.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#8E8E8E]" />
                  <div className="text-sm">
                    <p className="font-bold text-[#1A1A1A]">
                      {appt.scheduledAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-[#8E8E8E] uppercase font-bold">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#8E8E8E]" />
                  <div className="text-sm">
                    <p className="font-bold text-[#1A1A1A]">
                      {appt.scheduledAt?.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[10px] text-[#8E8E8E] uppercase font-bold">Time</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${
                  appt.status === 'scheduled' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  appt.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {appt.status}
                </div>
                <button className="p-3 bg-[#5A5A40] text-white rounded-full hover:bg-[#4A4A30] transition-colors shadow-sm">
                  <Video size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
