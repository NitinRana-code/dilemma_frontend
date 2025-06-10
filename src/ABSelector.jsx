import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { getQuestion } from "../hooks/getQuestion";
import { appendVote } from "../hooks/appendVote";

export default function ABSelector({ questionId, onNext }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [targetVotesA, setTargetVotesA] = useState(0);
  const [targetVotesB, setTargetVotesB] = useState(0);
  const [showVotes, setShowVotes] = useState(false);

  const votesAAnim = useSpring({ votes: targetVotesA });
  const votesBAnim = useSpring({ votes: targetVotesB });

  useEffect(() => {
    if (!questionId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setShowVotes(false); // hide votes on new question
      try {
        const result = await getQuestion(questionId);
        setData(result);
        setTargetVotesA(result.votes_a || 0);
        setTargetVotesB(result.votes_b || 0);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  const handleVote = async (whichVote) => {
    try {
      const result = await appendVote({
        id: questionId,
        whichVote,
        value: 1,
      });

      if (whichVote === "votes_a") {
        setTargetVotesA(result.votes_a);
      } else {
        setTargetVotesB(result.votes_b);
      }

      setShowVotes(true); // show votes only after voting

      setTimeout(onNext, 3000); // next question after delay
    } catch (err) {
      console.error("Voting failed:", err);
    }
  };

  return (
    <div className="flex flex-row h-1/3 font-bold text-xl select-none bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 shadow-xl p-1 gap-1">
      <div
        className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-pink-600 to-yellow-400 text-white cursor-pointer transition-transform transform hover:scale-101 shadow-lg  p-8 relative overflow-hidden"
        onClick={() => handleVote("votes_a")}
        // Prevent scroll conflicts by disabling pointer events on scrollbar area
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="text-3xl drop-shadow-lg text-center select-text px-2">
          {loading ? "Loading..." : error ? `⚠️ ${error}` : data?.option_a || "Option A"}
        </div>
        {showVotes && (
          <animated.div className="mt-3 text-xl text-black font-extrabold bg-white/80 px-6 py-2 rounded-full shadow-inner select-none">
            {votesAAnim.votes.to((v) => `🔥 ${Math.floor(v)} votes`)}
          </animated.div>
        )}
      </div>

      <div
        className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white cursor-pointer transition-transform transform hover:scale-101 shadow-lg p-8 relative overflow-hidden"
        onClick={() => handleVote("votes_b")}
        style={{ overscrollBehavior: "contain" }}
      >
        <div className="text-3xl drop-shadow-lg text-center select-text px-2">
          {loading ? "Loading..." : error ? `⚠️ ${error}` : data?.option_b || "Option B"}
        </div>
        {showVotes && (
          <animated.div className="mt-3 text-xl text-black font-extrabold bg-white/80 px-6 py-2 rounded-full shadow-inner select-none">
            {votesBAnim.votes.to((v) => `🔥 ${Math.floor(v)} votes`)}
          </animated.div>
        )}
      </div>
    </div>
  );
}
