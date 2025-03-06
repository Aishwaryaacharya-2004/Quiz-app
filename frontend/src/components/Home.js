import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState("");
  const [usn, setUsn] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && usn) {
      // Check if USN has exactly 10 characters
      if (usn.length !== 10) {
        alert("USN must be exactly 10 characters long.");
        return;
      }
      // Store username and USN in localStorage for later use
      localStorage.setItem("username", username);
      localStorage.setItem("usn", usn);
      navigate("/quiz");
    } else {
      alert("Please enter both your name and USN.");
    }
  };

  // Define styles
  const styles = {
    body: {
      margin: 0,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1c1c1c', // Dark background
      color: '#e0e0e0', // Light text color
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    heading: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(30, 30, 30, 0.8)', // Semi-transparent dark background
      padding: '30px',
      borderRadius: '10px', // Rounded corners
      boxShadow: '0px 0px 15px rgba(0,0,0,0.5)', // Shadow effect
    },
    inputField: {
      marginBottom: '15px',
      padding: '10px',
      borderRadius: '5px', // Rounded corners for inputs
      border: 'none',
      backgroundColor: '#333', // Input background
      color: '#fff', // Input text color
    },
    placeholderStyle: {
      color: '#888', // Placeholder color
    },
    loginButton: {
      padding: '10px',
      borderRadius: '5px', // Rounded corners for button
      border: 'none',
      backgroundColor: '#00ccff', // Neon pink button
      color: 'white', // Button text color
      fontSize: 'large',
    },
    loginButtonHover: {
       backgroundColor: '#00ccff', // Lighter pink on hover
       cursor: 'pointer', // Pointer cursor on hover
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome to the Debugging Competition</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={styles.inputField}
          />
          <input 
            type="text" 
            placeholder="Enter your USN" 
            value={usn} 
            onChange={(e) => setUsn(e.target.value)} 
            required 
            style={styles.inputField}
          />
          <button type="submit" style={styles.loginButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Home;