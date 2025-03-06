import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const [snippets, setSnippets] = useState([]);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [userSnippet, setUserSnippet] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answeredStatus, setAnsweredStatus] = useState([]); // Track if each snippet has been answered

  const username = localStorage.getItem("username");
  const usn = localStorage.getItem("usn");

  const navigate = useNavigate();

  // Fetch snippets on mount
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("---link----");
        const data = await response.json();
        setSnippets(data);
        // Initialize answered status for each snippet
        setAnsweredStatus(new Array(data.length).fill(false));
      } catch (error) {
        console.error("Error fetching snippets:", error);
      }
    };
    fetchSnippets();
  }, []);

  // Handle submission of snippet
  const submitSnippet = async () => {
    if (!userSnippet) return;

    const snippetId = snippets[currentSnippetIndex]?.id;

    try {
      const response = await fetch("---link----", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippetId, userSnippet }),
      });

      const result = await response.json();
      
      // Update score based on correctness
      if (result.correct) {
        setScore(prevScore => prevScore + 5); // Correct answer gives +5 points
        setFeedback("Correct!");
      } else {
        setScore(prevScore => prevScore - 1); // Wrong answer deducts -1 point
        setFeedback("Wrong!");
      }

      // Mark this snippet as answered
      setAnsweredStatus(prevStatus => {
        const newStatus = [...prevStatus];
        newStatus[currentSnippetIndex] = true; // Set current index to true
        return newStatus;
      });

    } catch (error) {
      console.error("Error validating snippet:", error);
    }
  };

  // Function to save results
  const saveResults = async () => {
    try {
      await fetch("---link-----", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, usn, finalScore: score }), 
      });
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  // Handle navigation to the next snippet
  const nextSnippet = () => {
    if (currentSnippetIndex < snippets.length - 1) {
      setCurrentSnippetIndex(currentSnippetIndex + 1);
      setUserSnippet(""); // Clear input field for the next question
      setFeedback(""); // Clear feedback for the new question
    } else {
      saveResults(); // Save results before finishing
      navigate("/results"); // Redirect to results page
    }
  };

  // Handle navigation to the previous snippet
  const prevSnippet = () => {
    if (currentSnippetIndex > 0) {
      setCurrentSnippetIndex(currentSnippetIndex - 1);
      setUserSnippet(""); // Clear input field for the previous question
      setFeedback(""); // Clear feedback for the previous question
    }
  };

  return (
    <div className="quiz-container">
      <h2>Debugging Quiz</h2>
      {snippets.length > 0 && (
        <>
          <p>Edit the following code snippet:</p>
          <pre>{snippets[currentSnippetIndex]?.snippet}</pre>
          <textarea 
            value={userSnippet} 
            onChange={(e) => !answeredStatus[currentSnippetIndex] && setUserSnippet(e.target.value)} 
            placeholder="Edit the code here" 
            rows={5} 
            cols={50} 
            disabled={answeredStatus[currentSnippetIndex]} // Disable textarea if already answered
          />
          <button onClick={submitSnippet} disabled={answeredStatus[currentSnippetIndex]}>Submit</button>
          <p>{feedback}</p>
          <p>Score: {score}</p>

          <div className="navigation-buttons">
            <button onClick={prevSnippet} disabled={currentSnippetIndex === 0}>Back</button>
            <button onClick={nextSnippet}>Next</button> {/* Allow next without submission */}
          </div>
        </>
      )}
    </div>
  );   
};

export default Quiz;
