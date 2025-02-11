import { Level } from "@/types/learning";

export const learningPath: Level[] = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn the basics of vehicle controls and fundamental road rules",
    totalPoints: 100,
    requiredPoints: 0,
    isUnlocked: true,
    sections: [
      {
        id: 101,
        title: "Introduction to Vehicle Controls",
        description: "Learn about basic vehicle controls and their functions",
        points: 50,
        type: "study",
        content: {
          sections: [
            {
              title: "Basic Vehicle Controls",
              content: "Understanding the fundamental controls in your vehicle...",
              image: "/images/vehicle-controls.jpg"
            },
            // Add more content sections
          ]
        },
        isCompleted: false
      },
      {
        id: 102,
        title: "Vehicle Controls Quiz",
        description: "Test your knowledge of vehicle controls",
        points: 50,
        type: "quiz",
        quiz: {
          id: 1001,
          title: "Vehicle Controls Assessment",
          description: "25 questions about vehicle controls",
          timeLimit: 30,
          questions: [], // Add questions here
          pointsPerQuestion: 2,
          totalPoints: 50,
          minimumPassScore: 35
        },
        isCompleted: false
      },
      // Add more sections
    ]
  },
  // Add more levels following the same structure
];

export const achievements = [
  {
    id: "road-scholar",
    title: "Road Scholar",
    description: "Complete all quizzes in a level",
    icon: "🎓",
    requiredScore: 100,
    isUnlocked: false
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "⭐",
    requiredScore: 100,
    isUnlocked: false
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete any quiz in under 5 minutes with at least 80% accuracy",
    icon: "⚡",
    requiredScore: 80,
    isUnlocked: false
  },
  {
    id: "safety-expert",
    title: "Safety Expert",
    description: "Get 100% on the Safety and Emergency section",
    icon: "🛡️",
    requiredScore: 100,
    isUnlocked: false
  },
  {
    id: "sign-master",
    title: "Sign Master",
    description: "Complete all sign-related quizzes with at least 90% accuracy",
    icon: "🚸",
    requiredScore: 90,
    isUnlocked: false
  },
  {
    id: "road-warrior",
    title: "Road Warrior",
    description: "Complete the entire course with at least 90% total score",
    icon: "🏆",
    requiredScore: 90,
    isUnlocked: false
  }
]; 