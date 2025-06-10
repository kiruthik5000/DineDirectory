import React, { useState, useRef, useEffect } from 'react';
import './Dialog.css';
import { Button } from '@mui/material';

const BookDialog = ({ onClose }) => {
  const [date, setDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const dialogRef = useRef(null);

  // Close when clicking outside the dialog
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = () => {
    alert(`Booked\nDate: ${date}\nNumber of People: ${numberOfPeople}`);
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog" ref={dialogRef}>
        <div className="wrong" style={{ marginLeft: '380px', cursor: 'pointer' }} onClick={onClose}>×</div>
        <center><h2>Reserve a Table</h2></center>

        <label>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        /><br />

        <label>Number of People:</label>
        <input
          type="number"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          min="1"
        />

        <div className="timeings">
          <span>timeings</span>
          <div>
          <Button>9:30 AM</Button>
          <Button>11:00 AM</Button>
          <Button>12:30 PM</Button>
          <Button>Customize</Button>
          </div>
        </div>

        <div className="button-group">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default BookDialog;
