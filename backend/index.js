const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Define a schema for storing user results
const resultSchema = new mongoose.Schema({
  username: String,
  usn: String,
  finalScore: Number,
  timestamp: { 
      type: Date, 
      default: () => new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000) // Adjust to IST
  }
});

const Result = mongoose.model('Result', resultSchema);

// Sample code snippets for the competition
const codeSnippets = [
    {
        id: 1,
        snippet: `#include<iostream>
        using namespace std;
        void show(const int const1=5){
            const int const2=5;
            int array001[const1];
            int arrray002[const2];
            for(int i=0;i<5;i++){
                array001[i]=i;
                array002[i]=i*10;
                cout<<array001[i]<<' '<<array002[i]<< ' ';
            }
        }
        void main(){
            show();
        }`,
        answer: `#include<iostream>
        using namespace std;
        void show(){
            const int const1=5;
            const int const2=5;
            int array001[const1];
            int array002[const2];
            for(int i=0;i<5;i++){
                array001[i]=i;
                array002[i]=i*10;
                cout<<array001[i]<<' '<<array002[i]<< ' ';
            }
        }
        void main(){
            show();
        }`,
    },
    {
        id: 2,
        snippet: `function greet(name) { return "Hello, " + name; }`,
        answer: `function greet(name) { return "Hello, " + name; }`,
    },
    {
        id: 3,
        snippet: `const isEven = (num) => num % 2 === 0;`,
        answer: `const isEven = (num) => num % 2 === 0;`,
    },
];

// Function to normalize whitespace in code snippets
const normalizeWhitespace = (code) => {
    return code
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim(); // Trim leading and trailing whitespace
};

// Route to fetch code snippets
app.get("/snippets", (req, res) => {
    res.json(codeSnippets);
});

// Route to validate the edited snippet
app.post("/validate", (req, res) => {
    const { snippetId, userSnippet } = req.body;

    const snippet = codeSnippets.find(s => s.id === snippetId);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });

    // Normalize both the user's input and the correct answer
    const normalizedUserSnippet = normalizeWhitespace(userSnippet);
    const normalizedCorrectAnswer = normalizeWhitespace(snippet.answer);

    const isCorrect = normalizedCorrectAnswer === normalizedUserSnippet;
    res.json({ correct: isCorrect });
});

// Route to save user results
app.post("/save-results", async (req, res) => {
    const { username, usn, finalScore } = req.body;

    if (!username || !usn || finalScore === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const resultData = new Result({ username, usn, finalScore });
        await resultData.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "Failed to save results" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));