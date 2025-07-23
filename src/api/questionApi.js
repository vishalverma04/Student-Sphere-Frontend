import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080/api/questions", // backend endpoint
// });

// export const fetchAllQuestions = () => API.get("/");

export const fetchAllQuestions = async() => await axios.get("http://localhost:8080/api/questions");
export const uploadQuestion = async(data) => await axios.post("http://localhost:8080/api/questions", data);
