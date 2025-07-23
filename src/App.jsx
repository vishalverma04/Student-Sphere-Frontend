import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UploadQuestion from "./pages/UploadQuestion";
import Navbar from "./components/Navbar";
import React from "react";
import QuestionUpload from "./components/QuestionUpload/QuestionUpload.jsx";
import MarkdownEditor from "./components/QuestionUpload/MarkdownEditor.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<QuestionUpload />} />
        <Route path="/editor" element={<MarkdownEditor />} />
      </Routes>
    </div>
  );
}

export default App;
