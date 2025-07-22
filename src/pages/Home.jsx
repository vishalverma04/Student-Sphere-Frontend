import { useEffect, useState } from "react";
import { fetchAllQuestions } from "../api/questionApi";
import QuestionCard from "../components/QuestionCard";

function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchAllQuestions().then((res) => {
      setQuestions(res.data);
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Questions</h2>
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}

export default Home;
