import React, { useState } from 'react';
import { BookOpen, AlertCircle, CheckCircle2, ChevronLeft, Menu, X, TerminalSquare } from 'lucide-react';
import { courseData, getCourseChapters } from '../data/courseData';
import ReactMarkdown from 'react-markdown';
import { FloatingChat } from '../components/FloatingChat';
import { SlidingCodeEditor } from '../components/SlidingCodeEditor';

export function Course() {
    const [activeLessonId, setActiveLessonId] = useState(1);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);
    const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number | null }>({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const activeLesson = courseData.find(l => l.id === activeLessonId)!;
    const chapters = getCourseChapters();

    const handleQuizSelect = (optionIndex: number) => {
        setQuizAnswers(prev => ({ ...prev, [activeLesson.id]: optionIndex }));
    };

    const markAsCompleted = () => {
        if (!completedLessons.includes(activeLesson.id)) {
            setCompletedLessons(prev => [...prev, activeLesson.id]);
        }
        // Go to next lesson if available
        const nextContent = courseData.find(l => l.id === activeLesson.id + 1);
        if (nextContent) {
            setActiveLessonId(nextContent.id);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const SyllabusList = (
        <div className="space-y-6 pb-20">
            {chapters.map((chap, i) => (
                <div key={i}>
                    <h3 className="font-semibold text-indigo-300 text-xs mb-3 uppercase tracking-wider">{chap.title}</h3>
                    <ul className="space-y-1 flex flex-col">
                        {chap.lessons.map((lesson: any) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isActive = lesson.id === activeLessonId;
                            return (
                                <li key={lesson.id} className="w-full">
                                    <button 
                                        onClick={() => {
                                            setActiveLessonId(lesson.id);
                                            setIsMobileMenuOpen(false); // Close mobile menu if opened
                                        }}
                                        className={`w-full text-right px-3 py-2.5 sm:py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${isActive ? 'bg-indigo-600/20 text-indigo-300 font-medium' : 'hover:bg-white/5 text-slate-400'}`}
                                    >
                                        <span className="truncate pl-2">{lesson.title}</span>
                                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex h-full w-full bg-slate-50 font-sans relative overflow-hidden" dir="rtl">
            
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex items-stretch">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-4/5 max-w-[320px] bg-slate-900 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900 shrink-0 h-16">
                            <span className="font-bold text-white text-lg flex items-center gap-2">
                               <BookOpen className="w-5 h-5 text-indigo-400"/> סילבוס הקורס
                            </span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2 shrink-0">
                                <X className="w-6 h-6"/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {SyllabusList}
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar Syllabus */}
            <div className="hidden md:flex w-72 lg:w-80 bg-slate-900 border-l border-slate-800 text-slate-300 flex-col overflow-hidden shrink-0">
                <div className="p-6 border-b border-white/10 shrink-0 h-[72px] flex items-center">
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-400" />
                        תוכנית הלימודים
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {SyllabusList}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-white flex flex-col min-h-0 relative custom-scrollbar">
                
                {/* Mobile Header for Syllabus Toggle */}
                <div className="md:hidden p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10 shrink-0 shadow-sm h-16">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-600 rounded-lg hover:bg-slate-100 shrink-0">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-slate-800 tracking-tight truncate pl-2">{activeLesson.chapterTitle}</span>
                    </div>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded shrink-0">שיעור {activeLesson.id}</span>
                </div>

                <div className="flex-1 max-w-4xl mx-auto w-full p-5 md:p-10 lg:p-16">
                    <div className="mb-8 hidden md:block">
                        <span className="text-indigo-600 font-semibold tracking-wider text-sm mb-2 block uppercase">{activeLesson.chapterTitle}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{activeLesson.title}</h1>
                    </div>
                    <div className="mb-8 md:hidden mt-2">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">{activeLesson.title}</h1>
                    </div>

                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 mb-12">
                        <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                    </div>

                    {/* Quiz Section */}
                    {activeLesson.quiz && (
                        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-8">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                                בוחן הבנה - תורכם
                            </h3>
                            <p className="text-slate-700 font-medium mb-4">{activeLesson.quiz.question}</p>
                            
                            <div className="space-y-3">
                                {activeLesson.quiz.options.map((option, idx) => {
                                    const isSelected = quizAnswers[activeLesson.id] === idx;
                                    const isCorrect = idx === activeLesson.quiz.correctAnswer;
                                    const hasAnswered = quizAnswers[activeLesson.id] !== undefined && quizAnswers[activeLesson.id] !== null;
                                    
                                    let btnClass = "w-full text-right p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm sm:text-base ";
                                    
                                    if (!hasAnswered) {
                                        btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-sm cursor-pointer";
                                    } else if (isSelected && isCorrect) {
                                        btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium";
                                    } else if (isSelected && !isCorrect) {
                                        btnClass += "bg-red-50 border-red-300 text-red-800";
                                    } else if (!isSelected && isCorrect) {
                                        btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium opacity-60";
                                    } else {
                                        btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                                    }

                                    return (
                                        <button 
                                            key={idx}
                                            disabled={hasAnswered}
                                            onClick={() => handleQuizSelect(idx)}
                                            className={btnClass}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {quizAnswers[activeLesson.id] !== undefined && quizAnswers[activeLesson.id] !== null && (
                                <div className={`mt-6 p-4 rounded-xl flex items-start sm:items-center flex-col sm:flex-row gap-3 shadow-sm animate-in fade-in ${quizAnswers[activeLesson.id] === activeLesson.quiz.correctAnswer ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-red-100 text-red-900 border border-red-200'}`}>
                                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 sm:mt-0" />
                                    <p className="leading-relaxed font-medium text-sm sm:text-base">
                                        {activeLesson.quiz.explanation}
                                    </p>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Next Lesson Button */}
                    <div className="mt-12 flex justify-start sm:justify-end pb-32">
                        <button
                            onClick={markAsCompleted}
                            className="w-full sm:w-auto bg-indigo-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-medium text-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                        >
                            {completedLessons.includes(activeLesson.id) ? "המשך לשיעור הבא" : "סמן כהושלם והמשך לחומר הבא"}
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Floating Integrations */}
            <FloatingChat />
            <SlidingCodeEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
            
            {!isEditorOpen && (
                <button
                    onClick={() => setIsEditorOpen(true)}
                    className="fixed bottom-6 top-auto left-4 sm:left-6 z-[30] bg-slate-800 text-white shadow-xl flex items-center justify-center p-3.5 sm:px-5 sm:py-3.5 rounded-full hover:bg-slate-700 hover:-translate-y-1 transition-all pointer-events-auto group"
                    title="פתח עורך קוד (ליד תורת החומר)"
                >
                    <TerminalSquare className="w-6 h-6 sm:w-5 sm:h-5 shrink-0" />
                    <span className="font-medium mr-2 hidden sm:inline group-hover:text-indigo-200 transition-colors">פתח עורך קוד</span>
                </button>
            )}

        </div>
    );
}
