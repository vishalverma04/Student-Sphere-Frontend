import React, { useState } from 'react';
import { CheckCircle, Heart, MessageCircle, User, Calendar, Building2, Tag } from 'lucide-react';
import { convertMarkdownToHTML } from '../utils/MarkdownToHtml'; // Assuming you have a utility function for markdown conversion

const question = {
  id: "q123456",
  title: "Two Sum Problem",
  content: `
## Problem Statement

Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in **any order**.

---

## Example

\`\`\`text
Input: nums = [2, 7, 11, 15], target = 9  
Output: [0, 1]  
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

---

## Constraints

- $2 \\leq nums.length \\leq 10^4$
- $-10^9 \\leq nums[i] \\leq 10^9$
- $-10^9 \\leq target \\leq 10^9$
- **Only one valid answer exists**

---

## Approach

1. Use a HashMap to store visited numbers and their indices.
2. For each number, calculate \`target - num\`.
3. If that number exists in the map, return indices.

\`\`\`java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No solution found");
}
\`\`\`
  `,
  company: "Amazon",
  questionType: "OA",
  difficultyLevel: "Easy",
  topics: ["HashMap", "Array", "Brute Force"],
  askedDate: "2024-10-15",
  uploadedAt: "2025-07-20",
  uploadedBy: "user@example.com",
  likes: 25,
  comments: [
    {
      commentedBy: "alice_dev",
      text: "Classic problem, great explanation!",
      timestamp: "2025-07-21T10:30:00"
    },
    {
      commentedBy: "bob123",
      text: "This was asked in my Amazon OA last week.",
      timestamp: "2025-07-22T09:00:00"
    }
  ],
  verified: true
};

import { useLocation } from 'react-router-dom';

const CodingQuestionViewer = () => {
    const location = useLocation();
    const questionData = location.state?.question || question; // Fallback to a default question if not provided


  const MarkdownToHTML = (markdown) => {
    return convertMarkdownToHTML(markdown);
  };

  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentUser] = useState('currentuser'); // Simulated current user

  const handleLike = () => {
    setIsLiked(!isLiked);
    setQuestionData(prev => ({
      ...prev,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        commentedBy: currentUser,
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      };
      
      setQuestionData(prev => ({
        ...prev,
        comments: [...prev.comments, comment]
      }));
      
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mr-4">{questionData.title}</h1>
          {questionData.verified && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="font-medium">{questionData.company}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
              {questionData.questionType}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(questionData.difficultyLevel)}`}>
              {questionData.difficultyLevel}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Asked: {formatDate(questionData.askedDate)}</span>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {questionData.topics.map((topic, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              <Tag className="w-3 h-3 mr-1" />
              {topic}
            </span>
          ))}
        </div>

        {/* Upload Info */}
        <div className="text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>Uploaded by {questionData.uploadedBy} on {formatDate(questionData.uploadedAt)}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mb-8">
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: MarkdownToHTML(questionData.content)
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            isLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{questionData.likes}</span>
        </button>
        
        <div className="flex items-center gap-2 text-gray-600">
          <MessageCircle className="w-4 h-4" />
          <span>{questionData.comments.length} comments</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
        
        {/* Add Comment */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {questionData.comments.map((comment, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium text-gray-900">{comment.commentedBy}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>

        {questionData.comments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingQuestionViewer;