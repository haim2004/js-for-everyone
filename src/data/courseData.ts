export const courseData = [
  {
    id: 1,
    chapter: 1,
    chapterTitle: "פרק 1: יסודות השפה",
    title: "1. ברוכים הבאים ל-JavaScript",
    content: `
# ברוכים הבאים ל-JavaScript!

שפת ה-JavaScript היא השפה שמפעילה את האינטרנט. היא התחילה כשפה קטנה להוספת אינטראקטיביות לאתרים, והיום היא משמשת לבניית אפליקציות מורכבות (כמו זו שאתם קוראים בה עכשיו!), שרתים, ואפילו משחקים.

## למה ללמוד JavaScript?
* **פופולריות:** השפה הנפוצה ביותר בעולם.
* **Full-Stack:** אפשר לכתוב גם צד לקוח (React, Angular) וגם צד שרת (Node.js).
* **קהילה עצומה:** תמיד יש עזרה וספריות קוד מוכנות.

## איך מתחילים?
הדרך הטובה ביותר ללמוד היא פשוט לכתוב קוד. לחיצה על כפתור "עורך קוד" תפתח את הסביבה שלנו. נסו לכתוב \`console.log("Hello, World!");\` ולהריץ!
    `,
    quiz: {
      question: "באילו תחומים ניתן להשתמש ב-JavaScript כיום?",
      options: [
        "רק בדפדפן (צד לקוח)",
        "רק בשרתים",
        "גם בצד לקוח וגם בצד שרת (Full-Stack)",
        "לעיצוב דפים בלבד"
      ],
      correctAnswer: 2,
      explanation: "כיום JavaScript משמשת לפיתוח צד לקוח (למשל עם React) וגם לפיתוח צד שרת (עם Node.js)."
    }
  },
  {
    id: 2,
    chapter: 1,
    chapterTitle: "פרק 1: יסודות השפה",
    title: "2. משתנים וסוגי נתונים",
    content: `
# משתנים ב-JavaScript

משתנים הם כמו "קופסאות" ששומרות נתונים בזיכרון של התוכנית. ב-JavaScript המודרנית אנחנו משתמשים בשתי מילים שמורות עיקריות להגדרת משתנים:

* \`let\` - משתנה שהערך שלו יכול להשתנות בהמשך.
* \`const\` - קבוע, הערך שלו לא יכול להשתנות לאחר שנקבע בהתחלה.

\`\`\`javascript
let age = 25;
age = 26; // תקין!

const name = "דוד";
// name = "משה"; // שגיאה! אי אפשר לשנות const
\`\`\`

## סוגי נתונים נפוצים (Data Types)
1. **String** (מחרוזת טקסט) - מוקף במרכאות: \`"שלום"\`
2. **Number** (מספר) - יכול להיות שלם או עשרוני: \`42\` או \`3.14\`
3. **Boolean** (בוליאני) - נכון או לא נכון: \`true\` / \`false\`
    `,
    quiz: {
      question: "באיזו מילת מפתח נשתמש כדי להגדיר משתנה שהערך שלו לא אמור להשתנות לעולם?",
      options: ["var", "let", "const", "static"],
      correctAnswer: 2,
      explanation: "מילת המפתח const משמשת להגדרת קבועים בעלי ערך שאינו משתנה לאחר ההשמה הראשונית."
    }
  },
  {
    id: 3,
    chapter: 1,
    chapterTitle: "פרק 1: יסודות השפה",
    title: "3. תנאים והחלטות",
    content: `
# תנאים ב-JavaScript

ברוב התוכניות אנחנו רוצים לבצע פעולות שונות בהתאם למצבים שונים. לשם כך אנו משתמשים בתנאי \`if/else\`.

\`\`\`javascript
const currentHour = 14;

if (currentHour < 12) {
  console.log("בוקר טוב!");
} else if (currentHour < 18) {
  console.log("צהריים טובים!");
} else {
  console.log("ערב טוב!");
}
\`\`\`

## אופרטורים להשוואה:
* \`===\` שווה לחלוטין (גם ערך וגם סוג)
* \`!==\` לא שווה
* \`>\`, \`<\`, \`>=\`, \`<=\` גדול מ, קטן מ וכו'.
    `,
    quiz: {
      question: "איזה אופרטור מומלץ להשוואת שוויון ב-JavaScript (בודק גם סוג וגם ערך)?",
      options: ["=", "==", "===", "!=="],
      correctAnswer: 2,
      explanation: "האופרטור === בודק שוויון מוחלט (Strict Equality), בניגוד ל-== שעלול לבצע המרות סוגים בלתי צפויות."
    }
  }
];

export const getCourseChapters = () => {
    const chapters: { [key: number]: { title: string, lessons: any[] } } = {};
    courseData.forEach(lesson => {
        if (!chapters[lesson.chapter]) {
            chapters[lesson.chapter] = { title: lesson.chapterTitle, lessons: [] };
        }
        chapters[lesson.chapter].lessons.push(lesson);
    });
    return Object.values(chapters);
};
