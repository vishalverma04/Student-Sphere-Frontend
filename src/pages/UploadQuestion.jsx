import { useState } from "react";
import { uploadQuestion } from "../api/questionApi";

function UploadQuestion() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    company: "",
    questionType: "",
    difficultyLevel: "",
    tags: "",
    topics: "",
    uploadedBy: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags.split(","),
      topics: form.topics.split(","),
      uploadedAt: new Date().toISOString()
    };
    await uploadQuestion(data);
    alert("Question uploaded!");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Upload Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" className="input" onChange={handleChange} />
        <textarea name="content" placeholder="Content" className="input" onChange={handleChange} />
        <input name="company" placeholder="Company" className="input" onChange={handleChange} />
        <input name="questionType" placeholder="Question Type" className="input" onChange={handleChange} />
        <input name="difficultyLevel" placeholder="Difficulty" className="input" onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma separated)" className="input" onChange={handleChange} />
        <input name="topics" placeholder="Topics (comma separated)" className="input" onChange={handleChange} />
        <input name="uploadedBy" placeholder="Uploaded By" className="input" onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}

export default UploadQuestion;
