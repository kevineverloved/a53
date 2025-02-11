
interface QuizQuestionProps {
  questionIndex: number;
  question: string;
  imageUrl?: string;
}

const QuizQuestion = ({ questionIndex, question, imageUrl }: QuizQuestionProps) => {
  return (
    <div className="space-y-6">
      {imageUrl && (
        <div className="flex justify-center">
          <img 
            src={imageUrl}
            alt="Question Image"
            className="w-48 h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
      <h2 className="text-xl font-georgia">{question}</h2>
    </div>
  );
};

export default QuizQuestion;
