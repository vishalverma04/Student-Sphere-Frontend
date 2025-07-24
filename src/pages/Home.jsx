import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Calendar, Building, Tag, TrendingUp,Search } from 'lucide-react';
import { fetchAllQuestions } from '../api/questionApi';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const QuestionsHomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchAllQuestions();
        setQuestions(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'coding': return 'bg-blue-100 text-blue-800';
      case 'system design': return 'bg-purple-100 text-purple-800';
      case 'behavioral': return 'bg-orange-100 text-orange-800';
      case 'product management': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navigate = useNavigate();

  const handleClick = (question) => {
    navigate(`/questions/${question.title}`, { state: { question } });
  }
    


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Questions</h1>
              <p className="text-gray-600 mt-1">Discover the latest questions from top tech companies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {questions.length} questions from recent interviews
          </p>
        </div>

        {/* Questions Grid */}
        

         {questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ):<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {questions.map((question) => (
            <div
              onClick={() => handleClick(question)}
              key={question.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
            >
              {/* Header with company and date */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{question.company}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(question.askedDate)}</span>
                </div>
                
              </div>

              {/* Question Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {question.title}
              </h3>

              {/* Question Type and Difficulty */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(question.questionType)}`}>
                  {question.questionType}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficultyLevel)}`}>
                  {question.difficultyLevel}
                </span>
              </div>

              {/* Topics */}
              <div className="flex items-center mb-4">
                <Tag className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {question.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{question.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{question.comments.length}</span>
                  </div>
                </div>
                
              </div>
              
            </div>
          ))}
        </div>}

        {/* Load More Button */}
        {/* <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Load More Questions
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default QuestionsHomePage;