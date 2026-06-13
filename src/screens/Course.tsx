import React, { useState } from 'react';
import { BookOpen, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { courseData, getCourseChapters } from '../data/courseData';
import ReactMarkdown from 'react-markdown';

interface CourseProps {
    onOpenEditor: () => void;
}

export function Course({ onOpenEditor }: CourseProps) {
    const [activeLessonId, setActiveLessonId] = useState(1);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);
    const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number | null }>({});

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
    };

    return (
        <div className="flex h-full w-full bg-slate-50 font-sans" dir="rtl">
            {/* Sidebar Syllabus */}
            <div className="hidden md:flex w-72 bg-slate-900 border-l border-slate-800 text-slate-300 flex-col overflow-y-auto">
                <div className="p-6 border-b border-white/10 shrink-0">
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-400" />
                        תוכנית הלימודים
                    </h2>
                </div>
                <div className="p-4 space-y-6">
                    {chapters.map((chap, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-indigo-300 text-xs mb-3 uppercase tracking-wider">{chap.title}</h3>
                            <ul className="space-y-1">
                                {chap.lessons.map((lesson: any) => {
                                    const isCompleted = completedLessons.includes(lesson.id);
                                    const isActive = lesson.id === activeLessonId;
                                    return (
                                        <li key={lesson.id}>
                                            <button 
                                                onClick={() => setActiveLessonId(lesson.id)}
                                                className={`w-full text-right px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${isActive ? 'bg-indigo-600/20 text-indigo-300 font-medium' : 'hover:bg-white/5 text-slate-400'}`}
                                            >
                                                <span>{lesson.title}</span>
                                                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-white flex flex-col min-h-0 relative">
                
                {/* Mobile Header for Syllabus Toggle (Simplified) */}
                <div className="md:hidden p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
                    <span className="font-bold text-slate-800">{activeLesson.chapterTitle}</span>
                    <span className="text-sm text-indigo-600">שיעור {activeLesson.title.split('.')[0]}</span>
                </div>

                <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-10 lg:p-16">
                    <div className="mb-8">
                        <span className="text-indigo-600 font-semibold tracking-wider text-sm mb-2 block uppercase">{activeLesson.chapterTitle}</span>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{activeLesson.title}</h1>
                    </div>

                    <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-700 prose-headings:text-slate-900 prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:text-slate-100 mb-12">
                        <ReactMarkdown>{activeLesson.content}</ReactMarkdown>
                    </div>

                    {/* Quiz Section */}
                    {activeLesson.quiz && (
                        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                בוחן הבנה
                            </h3>
                            <p className="text-slate-700 font-medium mb-4">{activeLesson.quiz.question}</p>
                            
                            <div className="space-y-3">
                                {activeLesson.quiz.options.map((option, idx) => {
                                    const isSelected = quizAnswers[activeLesson.id] === idx;
                                    const isCorrect = idx === activeLesson.quiz.correctAnswer;
                                    const hasAnswered = quizAnswers[activeLesson.id] !== undefined && quizAnswers[activeLesson.id] !== null;
                                    
                                    let btnClass = "w-full text-right p-4 rounded-xl border transition-all duration-200 ";
                                    
                                    if (!hasAnswered) {
                                        btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer";
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
                                <div className={`mt-6 p-4 rounded-xl flex gap-3 ${quizAnswers[activeLesson.id] === activeLesson.quiz.correctAnswer ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    <AlertCircle className="w-6 h-6 shrink-0" />
                                    <p className="leading-relaxed font-medium">
                                        {activeLesson.quiz.explanation}
                                    </p>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Next Lesson Button */}
                    <div className="mt-12 flex justify-end pb-32">
                        <button
                            onClick={markAsCompleted}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            {completedLessons.includes(activeLesson.id) ? "המשך לשיעור הבא" : "סמן כהושלם והמשך"}
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
