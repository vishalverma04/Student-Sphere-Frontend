import React, { useState } from 'react';
import { Send, RotateCcw, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { uploadQuestion } from '../../api/questionApi';
import toast from 'react-hot-toast';
import MarkdownEditor from './MarkdownEditor';


const topicOptions = [
  'Array', 'Dynamic Programming', 'SQL', 'Graph', 'Tree', 'Linked List',
  'Stack', 'Queue', 'Hash Table', 'Binary Search', 'Sorting', 'Recursion',
  'Backtracking', 'Greedy', 'Math', 'String', 'Two Pointers', 'Sliding Window'
];

const questionTypes = [
  'MCQ', 'Coding', 'Open-ended', 'OA', 'Technical Round', 'System Design'
];

import { useNavigate } from 'react-router-dom';
export default function QuestionUploadPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    company: '',
    questionType: '',
    difficultyLevel: '',
    tags: [],
    topics: [],
    askedDate: '',
    uploadedBy: ''
  });

  const [customTag, setCustomTag] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, loading, success, error
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicChange = (topic) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleAddTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim().toLowerCase()]
      }));
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.content.trim()) errors.push('Content is required');
    if (!formData.questionType) errors.push('Question Type is required');
    if (!formData.difficultyLevel) errors.push('Difficulty Level is required');
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setUploadStatus('error');
      setStatusMessage(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    setUploadStatus('loading');
    setStatusMessage('Uploading question...');

    // Prepare the data in the format you specified
    const questionData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      company: formData.company.trim(),
      questionType: formData.questionType,
      difficultyLevel: formData.difficultyLevel,
      tags: formData.tags,
      topics: formData.topics,
      askedDate: formData.askedDate ? new Date(formData.askedDate).toISOString() : null,
      uploadedAt: new Date().toISOString(),
      uploadedBy: formData.uploadedBy.trim() || 'anonymous'
    };

    console.log('Submitting question data:', questionData);
    console.log(questionData.content);

    try {
      await uploadQuestion(questionData);
      setUploadStatus('success');
      setStatusMessage('Question uploaded successfully!');
      toast.success('Question uploaded successfully!');
      handleReset();
    } catch (error) {
      console.error('Error uploading question:', error);
      setUploadStatus('error');
      setStatusMessage('Failed to upload question. Please try again.');
      toast.error('Failed to upload question. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      content: '',
      company: '',
      questionType: '',
      difficultyLevel: '',
      tags: [],
      topics: [],
      askedDate: '',
      uploadedBy: ''
    });
    setCustomTag('');
    setUploadStatus('idle');
    setStatusMessage('');
    window.scrollTo(0, 0);
    window.location.href = '/upload'; // Navigate to the upload page
  };

  const StatusAlert = () => {
    if (uploadStatus === 'idle') return null;
    
    const statusConfig = {
      loading: { icon: Loader, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
      success: { icon: CheckCircle, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
      error: { icon: AlertCircle, color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200' }
    };
    
    const config = statusConfig[uploadStatus];
    const IconComponent = config.icon;
    
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg max-w-md`}>
        <div className="flex items-center">
          <IconComponent className={`w-5 h-5 mr-3 text-${config.color}-600 ${uploadStatus === 'loading' ? 'animate-spin' : ''}`} />
          <p className={`${config.textColor} font-medium`}>{statusMessage}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
      <StatusAlert />

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-white/20 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Upload Question
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Fill out the form below to add a new question to the database.</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="e.g., Two Sum Problem"
              />
            </div>

            {/* Content */}

            {/* Company and Question Type Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="e.g., Amazon, Google, Microsoft"
                />
              </div>

              <div>
                <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type *
                </label>
                <select
                  id="questionType"
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">Select question type</option>
                  {questionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty Level and Asked Date Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label htmlFor="askedDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Asked Date
                </label>
                <input
                  type="date"
                  id="askedDate"
                  name="askedDate"
                  value={formData.askedDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>

            {/* Topics */}
            <div className="bg-gray-50/50 p-4 sm:p-6 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                Topics
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {topicOptions.map((topic) => (
                  <div key={topic} className="flex items-center p-2 rounded-lg hover:bg-white/80 transition-colors duration-200">
                    <input
                      type="checkbox"
                      id={topic}
                      checked={formData.topics.includes(topic)}
                      onChange={() => handleTopicChange(topic)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={topic} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
                      {topic}
                    </label>
                  </div>
                ))}
              </div>
              {formData.topics.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    Selected topics ({formData.topics.length}): {formData.topics.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Uploaded By */}
            <div>
              <label htmlFor="uploadedBy" className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded By
              </label>
              <input
                type="text"
                id="uploadedBy"
                name="uploadedBy"
                value={formData.uploadedBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Your username or name"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Question Content *
              </label>
              <MarkdownEditor title={formData.title} onContentChange={(value) => setFormData({ ...formData, content: value })} />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploadStatus === 'loading'}
                className="flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {uploadStatus === 'loading' ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                )}
                <span className="text-sm sm:text-base">
                  {uploadStatus === 'loading' ? 'Uploading...' : 'Upload Question'}
                </span>
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={uploadStatus === 'loading'}
                className="flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Reset Form</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}