export const courses = [
  {
    id: 1,
    title: 'Advanced Mathematics',
    instructor: 'Dr. Priya Sharma',
    description: 'Master calculus, linear algebra, and differential equations with accessible, step-by-step visual aids.',
    progress: 72,
    totalLessons: 24,
    completedLessons: 17,
    category: 'Mathematics',
    color: '#6366f1',
    nextLesson: 'Integration by Parts',
    duration: '45 min',
  },
  {
    id: 2,
    title: 'Basics of Physics',
    instructor: 'Prof. Rajesh Kumar',
    description: 'Explore mechanics, thermodynamics, and optics through interactive simulations and audio narration.',
    progress: 45,
    totalLessons: 20,
    completedLessons: 9,
    category: 'Science',
    color: '#06b6d4',
    nextLesson: 'Newton\'s Laws of Motion',
    duration: '50 min',
  },
  {
    id: 3,
    title: 'English Literature',
    instructor: 'Ms. Ananya Desai',
    description: 'Dive into prose, poetry, and drama with dyslexia-friendly text rendering and text-to-speech support.',
    progress: 88,
    totalLessons: 18,
    completedLessons: 16,
    category: 'Humanities',
    color: '#f59e0b',
    nextLesson: 'Shakespeare\'s Sonnets',
    duration: '35 min',
  },
  {
    id: 4,
    title: 'Computer Science Fundamentals',
    instructor: 'Dr. Vikram Patel',
    description: 'Learn algorithms, data structures, and programming logic with high-contrast code editors and screen reader support.',
    progress: 30,
    totalLessons: 30,
    completedLessons: 9,
    category: 'Technology',
    color: '#10b981',
    nextLesson: 'Binary Search Trees',
    duration: '55 min',
  },
  {
    id: 5,
    title: 'Indian History & Culture',
    instructor: 'Prof. Meera Joshi',
    description: 'Journey through India\'s rich past with narrated timelines, accessible maps, and audio descriptions.',
    progress: 60,
    totalLessons: 22,
    completedLessons: 13,
    category: 'Social Studies',
    color: '#ec4899',
    nextLesson: 'The Mughal Era',
    duration: '40 min',
  },
];

export const lessonTranscript = [
  {
    timestamp: '00:00',
    text: 'Welcome to today\'s lesson on Integration by Parts. This is a fundamental technique in calculus that allows us to integrate products of functions.',
  },
  {
    timestamp: '00:45',
    text: 'The formula for integration by parts is derived from the product rule of differentiation. If we have two functions u and v, then the integral of u dv equals uv minus the integral of v du.',
  },
  {
    timestamp: '01:30',
    text: 'Let us consider a simple example. Suppose we want to find the integral of x times e to the power x. We choose u equals x and dv equals e to the x dx.',
  },
  {
    timestamp: '02:15',
    text: 'Then du equals dx, and v equals e to the x. Applying the formula: the integral of x e^x dx equals x e^x minus the integral of e^x dx.',
  },
  {
    timestamp: '03:00',
    text: 'Simplifying, we get x e^x minus e^x plus the constant of integration C. This can be factored as e^x times (x minus 1) plus C.',
  },
  {
    timestamp: '03:45',
    text: 'The key to mastering integration by parts is choosing the right u and dv. A helpful mnemonic is LIATE: Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, and Exponential.',
  },
  {
    timestamp: '04:30',
    text: 'The function that appears first in LIATE should typically be chosen as u. This heuristic works because the derivative of such functions tends to simplify the integral.',
  },
  {
    timestamp: '05:15',
    text: 'Let us try another example: the integral of ln(x) dx. Here, we choose u equals ln(x) and dv equals dx. Then du equals 1 over x dx, and v equals x.',
  },
  {
    timestamp: '06:00',
    text: 'Applying the formula: integral of ln(x) dx equals x ln(x) minus the integral of x times (1/x) dx, which simplifies to x ln(x) minus x plus C.',
  },
  {
    timestamp: '06:45',
    text: 'Excellent! In the next segment, we will explore tabular integration, a technique that speeds up repeated applications of integration by parts.',
  },
];

export const notifications = [
  { id: 1, text: 'New assignment posted in Advanced Mathematics', time: '2 hours ago', unread: true },
  { id: 2, text: 'Your Physics quiz score: 85/100', time: '5 hours ago', unread: true },
  { id: 3, text: 'Reminder: English Literature essay due tomorrow', time: '1 day ago', unread: false },
];

export const userProfile = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@edu.in',
  avatar: null,
  role: 'Student',
  enrolledCourses: 5,
  completedCourses: 2,
};
