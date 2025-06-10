// App.jsx
import React, { useState } from "react";
import Navbar from "../components/navbar";
import ABSelector from "./ABSelector";
import ChatSection from "./ChatSection";
import "./App.css";

export default function App() {
  const [questionId, setQuestionId] = useState(() => Math.floor(Math.random() * 10) + 1);

  const getRandomQuestionId = () => Math.floor(Math.random() * 10) + 1;

  return (
    <div className="h-screen">
      <Navbar setQuestionId={() => setQuestionId(getRandomQuestionId())} />
      <ABSelector questionId={questionId} onNext={() => setQuestionId(getRandomQuestionId())} />
      <ChatSection questionId={questionId} />
    </div>
  );
}
