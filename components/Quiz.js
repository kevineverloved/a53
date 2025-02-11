import { doc, updateDoc, increment } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Quiz = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    // Fetch questions from Firestore
    const fetchQuestions = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setQuestions(userData.quizQuestions || []);
          setCurrentQuestion(userData.quizQuestions[0] || null);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSubmit = async (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 10);
      
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        toast.success(`Quiz completed! You earned ${score + 10} points`);
        
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, {
            progress: increment(score + 10)
          });
        } catch (error) {
          console.error("Error updating progress:", error);
        }
        
        navigate("/roadrules");
      }
    } else {
      toast.error("Incorrect answer. Try again!");
    }
  };

  return (
    <div>
      {/* Render your quiz components here */}
    </div>
  );
};

export default Quiz; 