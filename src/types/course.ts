export interface Lesson {
  id: number; // 1 to 60
  chapterId: number; // 1 to 6
  lessonNumber: number; // 1 to 10
  title: string;
  subtitle: string;
  slides: string[]; // Bullet points for presentation
  theory: string; // Markdown / Text explanation in Hebrew
  codeExample: string; // Starter code example
  starterCode: string; // Blank slate or boilerplate for practice
  practiceTask: string; // Hebrew task description
  testCondition: {
    type: "output" | "regex" | "custom";
    expected?: string;
    regex?: string;
    fn?: string; // JavaScript validation code as string
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
}

export interface UserProgress {
  completedLessons: number[]; // ids of completed lessons
  currentLessonId: number;
  unlockedChapters: number[];
  editorCode: { [lessonId: number]: string };
}

export interface ChatMessage {
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
}
