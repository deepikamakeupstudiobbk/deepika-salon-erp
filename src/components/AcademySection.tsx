import React, { useState } from 'react';
import { ACADEMY_COURSES, STUDIO_INFO, ACADEMY_CERTIFICATE_SAMPLE } from '../data/initialData';
import { GraduationCap, Award, BookOpen, CheckCircle, ArrowRight, Clock, Calendar, Sparkles, Eye, X, Maximize2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AcademySection: React.FC = () => {
  const { openLeadModal } = useStudio();
  const [selectedCourse, setSelectedCourse] = useState(ACADEMY_COURSES[0]);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  return (
    <section id="academy" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
              <span>Deepika Sharma Beauty Academy</span>
              <span aria-hidden="true">·</span>
              <span>Barabanki, Uttar Pradesh</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100">
              Professional Makeup & Cosmetology Academy
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-xl font-light">
              Transform your passion into a thriving career. Learn hands-on bridal airbrushing, advanced color theory, and bridal hair couture directly from Master Artist Deepika Sharma.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-950 border border-stone-800 px-4 py-3 rounded-xl text-xs text-stone-300">
            <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-white block">Deepika Sharma Makeup Studio & Academy Certificate</span>
              <span className="text-[11px] text-amber-300/90 font-medium">Professional Certified Diploma (Private Academy - Non-Government)</span>
            </div>
          </div>
        </div>

        {/* 3 Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACADEMY_COURSES.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
                    {course.batch}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-stone-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider block">
                    Curriculum Highlights:
                  </span>
                  {course.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Course Fee</span>
                  <span className="font-mono text-lg font-bold text-amber-200">{course.fee}</span>
                </div>

                <button
                  onClick={openLeadModal}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-400 text-stone-200 hover:text-stone-950 border border-stone-700 hover:border-amber-400 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire / Enroll</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL ACADEMY CERTIFICATE SAMPLE SHOWCASE (USER REQUIREMENT) */}
        {/* ========================================================================= */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Certificate Preview Image */}
            <div className="lg:col-span-5 relative group">
              <div className="relative p-2 rounded-2xl bg-stone-900 border-2 border-amber-400/60 shadow-2xl overflow-hidden group-hover:border-amber-400 transition-all duration-300">
                <img
                  src={ACADEMY_CERTIFICATE_SAMPLE}
                  alt="Deepika Sharma Makeup Studio & Academy Official Certificate Sample"
                  className="w-full h-auto rounded-xl object-cover shadow-inner group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                  onClick={() => setIsCertificateModalOpen(true)}
                />
                
                <div 
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-xl"
                >
                  <span className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                    <span>View Full Certificate Sample</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Certificate Sample</span>
                </span>
                <span>Barabanki, Uttar Pradesh</span>
              </div>
            </div>

            {/* Certificate Highlights & Credentials */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Deepika Sharma Academy Certified Credential</span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white leading-tight">
                Deepika Sharma Makeup Studio & Academy Certificate
              </h3>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Every enrolled student upon successful completion of hands-on model exams receives our official, authorized <strong className="text-amber-200 font-semibold">Master Makeup Artistry & Cosmetology Diploma</strong>. This private academy certification carries the signature of Founder & Master Makeup Artist <strong>Deepika Sharma</strong> and an embossed gold foil seal stamp.
              </p>

              {/* Certificate Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Private Studio Certified</strong>
                    <span className="text-[11px] text-stone-400">Deepika Sharma Makeup Studio & Academy (Non-Government)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Unique Verification Serial</strong>
                    <span className="text-[11px] text-stone-400">Authentic credentials registered in Barabanki Studio archive</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Master Artist Signature</strong>
                    <span className="text-[11px] text-stone-400">Personally assessed & signed by Deepika Sharma</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Freelance & Job Ready</strong>
                    <span className="text-[11px] text-stone-400">Eligible for bridal bookings, vanity kits & salon jobs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Preview Full Sample Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={openLeadModal}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Apply for Next Academy Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Academy Trust Badge Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-wrap items-center justify-around gap-6 text-xs text-stone-300 text-center">
          <div>
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
            <strong className="text-white block font-serif-luxury text-base">Deepika Sharma Academy Certificate</strong>
            <span className="text-stone-400">Official Studio Certified Diploma</span>
          </div>
          <div className="hidden sm:block w-[1px] h-10 bg-stone-800" />
          <div>
            <BookOpen className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
            <strong className="text-white block font-serif-luxury text-base">Vanity Kit Assistance</strong>
            <span className="text-stone-500">International brands product guide</span>
          </div>
          <div className="hidden sm:block w-[1px] h-10 bg-stone-800" />
          <div>
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
            <strong className="text-white block font-serif-luxury text-base">Studio Internship</strong>
            <span className="text-stone-500">Live brides prep experience in Barabanki</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* CERTIFICATE FULL PREVIEW LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {isCertificateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[95vh] bg-stone-950 border border-amber-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-white">
                    Deepika Sharma Makeup Studio & Academy
                  </h4>
                  <p className="text-[11px] text-amber-300 font-mono">
                    Official Certificate Sample · Barabanki, Uttar Pradesh
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCertificateModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800 hover:bg-stone-750 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Image */}
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-stone-950">
              <div className="relative border-4 border-amber-500/30 rounded-xl overflow-hidden shadow-2xl max-w-3xl">
                <img
                  src={ACADEMY_CERTIFICATE_SAMPLE}
                  alt="Deepika Sharma Makeup Studio & Academy Certificate Sample Full View"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-stone-300">
                Issued upon completion of 6-Week Master Makeup & Cosmetology Diploma course.
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCertificateModalOpen(false);
                  openLeadModal();
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-stone-950 font-bold uppercase rounded-xl text-xs cursor-pointer shadow"
              >
                Enroll / Inquire Now
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
