import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import React from "react";
import QuestionUpload from "./components/QuestionUpload/QuestionUpload.jsx";
import MarkdownEditor from "./components/QuestionUpload/MarkdownEditor.jsx";
import QuestionDetails from "./pages/QuestionDetails.jsx";
import Footer from "./components/Footer.jsx";


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<QuestionUpload />} />
        <Route path="/editor" element={<MarkdownEditor />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
