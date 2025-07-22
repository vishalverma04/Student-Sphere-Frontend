function QuestionCard({ question }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold">{question.title}</h3>
      <p className="text-sm text-gray-600">{question.company} • {question.questionType}</p>
      <p className="mt-2">{question.content}</p>
      <div className="mt-2 text-sm text-gray-500">
        Tags: {question.tags?.join(", ")}
      </div>
    </div>
  );
}

export default QuestionCard;
