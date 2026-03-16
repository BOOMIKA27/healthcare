import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Doctor } from "../types";
import { Star, Calendar, Check, Clock, User, Video, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppointmentList } from "./AppointmentList";

export const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [booking, setBooking] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  useEffect(() => {
    const q = query(collection(db, "doctors"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setDoctors([
          {
            uid: "doc1",
            fullName: "Dr. Sarah Sharma",
            specialty: "General Physician",
            rating: 4.8,
            isAvailable: true,
            reviews: ["Very helpful and patient.", "Excellent diagnosis."],
            experience: "12 Years",
            imageUrl: "https://picsum.photos/seed/doc1/200/200"
          },
          {
            uid: "doc2",
            fullName: "Dr. Rajesh Kumar",
            specialty: "Pediatrician",
            rating: 4.5,
            isAvailable: true,
            reviews: ["Great with kids.", "Highly recommended."],
            experience: "8 Years",
            imageUrl: "https://picsum.photos/seed/doc2/200/200"
          }
        ]);
      } else {
        setDoctors(snapshot.docs.map(d => d.data() as Doctor));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBook = async (doctorId: string) => {
    if (!auth.currentUser || !selectedSlot) return;
    setBooking(doctorId);
    
    // Create a timestamp for the selected slot (today + time)
    const now = new Date();
    const [time, period] = selectedSlot.split(" ");
    const [hours, minutes] = time.split(":");
    let h = parseInt(hours);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    
    const scheduledDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, parseInt(minutes));

    try {
      await addDoc(collection(db, "appointments"), {
        patientId: auth.currentUser.uid,
        doctorId,
        status: "scheduled",
        scheduledAt: Timestamp.fromDate(scheduledDate),
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setBooking(null);
        setSelectedSlot(null);
        setShowSchedule(true); // Show the list after booking
      }, 2000);
    } catch (error) {
      console.error("Booking failed", error);
      setBooking(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-[#F5F5F0] p-1 rounded-2xl flex gap-1 border border-[#E5E5E0]">
          <button 
            onClick={() => setShowSchedule(false)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${!showSchedule ? "bg-white text-[#5A5A40] shadow-sm" : "text-[#8E8E8E]"}`}
          >
            Find Doctors
          </button>
          <button 
            onClick={() => setShowSchedule(true)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${showSchedule ? "bg-white text-[#5A5A40] shadow-sm" : "text-[#8E8E8E]"}`}
          >
            My Schedule
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showSchedule ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AppointmentList />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Available Doctors</h3>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <Clock size={12} /> Online Now
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.uid}
                  className="bg-white p-6 rounded-[32px] border border-[#E5E5E0] shadow-sm space-y-6"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={doc.imageUrl || `https://picsum.photos/seed/${doc.uid}/200/200`} 
                      alt={doc.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#E5E5E0]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#1A1A1A]">{doc.fullName}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                          <Star size={14} fill="currentColor" />
                          {doc.rating}
                        </div>
                      </div>
                      <p className="text-xs text-[#5A5A40] font-medium">{doc.specialty}</p>
                      <p className="text-[10px] text-[#8E8E8E] uppercase tracking-wider mt-1">{doc.experience} Experience</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-[#8E8E8E]">Select Time Slot (Today)</p>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                              selectedSlot === slot 
                                ? "bg-[#5A5A40] text-white border-[#5A5A40]" 
                                : "bg-[#F5F5F0] text-[#5A5A40] border-transparent hover:border-[#5A5A40]/30"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={!doc.isAvailable || booking === doc.uid || !selectedSlot}
                      onClick={() => handleBook(doc.uid)}
                      className={`w-full py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        doc.isAvailable && selectedSlot
                          ? "bg-[#5A5A40] text-white hover:bg-[#4A4A30] shadow-md" 
                          : "bg-[#E5E5E0] text-[#8E8E8E] cursor-not-allowed"
                      }`}
                    >
                      {booking === doc.uid && success ? (
                        <><Check size={16} /> Appointment Booked!</>
                      ) : (
                        <><Calendar size={16} /> Confirm Booking</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
