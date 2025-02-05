interface QuizQuestionProps {
  questionIndex: number;
  question: string;
  imageUrl?: string;
}

const QuizQuestion = ({ questionIndex, question, imageUrl }: QuizQuestionProps) => {
  return (
    <>
      {questionIndex === 0 && imageUrl && (
        <div className="flex justify-center mb-6">
          <img 
            src={imageUrl}
            alt="Question Image"
            className="w-48 h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
      <h2 className="text-xl font-georgia mb-6">{question}</h2>
    </>
  );
};

export default QuizQuestion;