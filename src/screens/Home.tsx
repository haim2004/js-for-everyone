import React from 'react';
import { Layers, CheckCircle2, ChevronLeft, ShieldAlert } from 'lucide-react';

interface HomeProps {
    onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
    return (
        <div className="flex-1 overflow-y-auto bg-white font-sans w-full" dir="rtl">
            {/* Header */}
            <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                            <Layers className="text-white w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl text-slate-800 tracking-tight">JS Masterclass</span>
                    </div>
                    <nav className="hidden md:flex gap-8 font-medium text-slate-600">
                        <a href="#about" className="hover:text-indigo-600 transition-colors">אודות הקורס</a>
                        <a href="#syllabus" className="hover:text-indigo-600 transition-colors">סילבוס</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">תמחור</a>
                    </nav>
                    <button onClick={onStart} className="bg-indigo-50 text-indigo-600 font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-100 transition-colors shrink-0">
                        התחברות
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 z-0"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs sm:text-sm mb-8 border border-indigo-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        קורס JavaScript מעודכן לשנת 2024
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                        משפת אינטרנט <br className="hidden sm:block" /> לפיתוח <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-600 to-cyan-500">Full-Stack</span> מודרני
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                        בואו ללמוד JavaScript מאפס ועד רמת המקצוענים. קורס אינטראקטיבי הכולל משימות, מבחנים מובנים ומנטור AI שילווה אתכם לאורך כל הדרך.
                    </p>
                    
                    <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 justify-center items-center px-4">
                        <button onClick={onStart} className="w-full sm:w-auto bg-indigo-600 text-white font-medium text-lg px-8 py-4 rounded-full shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                            מתחילים ללמוד עכשיו
                            <ChevronLeft className="w-5 h-5 shrink-0" />
                        </button>
                        <a href="#syllabus" className="w-full sm:w-auto text-center bg-white text-slate-700 border border-slate-200 font-medium text-lg px-8 py-4 rounded-full hover:bg-slate-50 transition-all">
                            צפייה בסילבוס
                        </a>
                    </div>
                </div>
            </section>

            {/* Disclaimer Section */}
            <section className="py-16 bg-slate-50 border-y border-slate-100 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white border border-yellow-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-sm">
                        <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-7 h-7 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">דיסקליימר ואזהרת תשלום</h3>
                            <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                                מערכת זו נועדה למטרות למידה והדגמה בלבד. **אין להזין פרטי אשראי אמיתיים או מידע מזהה אישי.** ההרשמה כרגע פתוחה בחינם כחלק מההדגמה (Demo). כאשר הקורס יושק רשמית, מערכת התשלומים תופעל מול ספקי אשראי מאובטחים מחוץ לפלטפורמה.
                            </p>
                            <button onClick={onStart} className="text-yellow-700 font-semibold hover:text-yellow-800 inline-flex items-center gap-1 hover:gap-2 transition-all underline underline-offset-4 text-sm sm:text-base">
                                הבנתי, ברצוני להמשיך לסביבת הלימוד <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 px-4 sm:px-6 mb-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: 'למידה אינטראקטיבית', desc: 'במקום לצפות בסרטונים, כותבים קוד. מערכת שאלות ומבחנים אחרי כל שיעור לוודא הבנה.' },
                            { title: 'עורך קוד מובנה', desc: 'אין צורך להתקין כלום. כותבים, מריצים ובודקים את ה-JavaScript שלכם ישירות מהדפדפן.' },
                            { title: 'מנטור AI צמוד', desc: 'נתקעתם? לא הבנתם? רובוט אינטליגנטי זמין בכל עת בלחיצת כפתור בסביבת הלמידה לסיעור מוחות.' }
                        ].map((b, i) => (
                            <div key={i} className="text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shrink-0">
                                    <CheckCircle2 className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">{b.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
