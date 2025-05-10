import React, { useState } from 'react';
import './Dialog.css'; // Add your custom styles here
import { Button } from '@mui/material';

const BookDialog = ({ onClose }) => {
  const [date, setDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const handleSubmit = () => {
    alert(`Booked \n Date: ${date}, Number of People: ${numberOfPeople}`);
    onClose();
  };

  const close = () => {
    onClose();
  };

  return (
      <div className="dialog-overlay">
        <div className="dialog">
          <div className="wrong" style={{ marginLeft: '380px' }} onClick={close}>x</div>
          <center>
            <h2>Reserve a Table</h2>
          </center>
          <label>Select Date:</label>
          <select value={date} onChange={(e) => setDate(e.target.value)}>
            <option value="">--Select a Date--</option>
            <option value="2024-10-25">October 25, 2024</option>
            <option value="2024-10-26">October 26, 2024</option>
            <option value="2024-10-27">October 27, 2024</option>
          </select>

          <br />
          <label>Number of People:</label>
          <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              min="1"
          />
          <div className="timeings">
            <Button>9.30 AM</Button>
            <Button>11.00 AM</Button>
            <Button>12.30 PM</Button>
            <Button>Customize</Button>
          </div>

          <div className="button-group">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
  );
};

export default BookDialog;
