import React, { useState } from 'react';

const zodiacSigns = [
  { name: 'Capricorn', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', start: [2, 19], end: [3, 20] },
  { name: 'Aries', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', start: [6, 21], end: [7, 22] },
  { name: 'Leo', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', start: [8, 23], end: [9, 22] },
  { name: 'Libra', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

function getZodiacSign(month, day) {
  for (const sign of zodiacSigns) {
    if (
      (month === sign.start[0] && day >= sign.start[1]) ||
      (month === sign.end[0] && day <= sign.end[1])
    ) {
      return sign.name;
    }
  }
  return 'Unknown';
}

function AgeCalculator() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');

  const calculateAge = () => {
    if (!day || !month || !year) {
      setError('Please enter day, month, and year');
      setAge(null);
      return;
    }

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
      setError('Invalid month');
      setAge(null);
      return;
    }

    if (dayNum < 1 || dayNum > 31) {
      setError('Invalid day');
      setAge(null);
      return;
    }

    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();

    if (birthDate > today) {
      setError('Birth date cannot be in the future');
      setAge(null);
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    const dayOfWeek = birthDate.toLocaleDateString('en-US', { weekday: 'long' });
    const zodiacSign = getZodiacSign(monthNum, dayNum);

    let nextBirthday = new Date(today.getFullYear(), monthNum - 1, dayNum);
    if (nextBirthday < today) {
      nextBirthday = new Date(today.getFullYear() + 1, monthNum - 1, dayNum);
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday - today) / (1000 * 60 * 60 * 24)
    );

    setAge({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      dayOfWeek,
      zodiacSign,
      daysUntilBirthday,
    });
    setError('');
  };

  return (
    <div className="container">
      <h1>Age Calculator</h1>
      <div className="input-group">
        <label>Enter your birth date:</label>
        <div className="date-inputs">
          <input
            type="number"
            className="date-input"
            placeholder="Day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min="1"
            max="31"
          />
          <input
            type="number"
            className="date-input"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
          <input
            type="number"
            className="date-input"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button className="calculate-btn" onClick={calculateAge}>
          Calculate Age
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {age && (
        <div className="result">
          <h2>Your Age:</h2>
          <div className="age-display">
            <span className="age-item">{age.years}</span>
            <span className="age-label">years</span>
            <span className="age-item">{age.months}</span>
            <span className="age-label">months</span>
            <span className="age-item">{age.days}</span>
            <span className="age-label">days</span>
          </div>
          <div className="extra-info">
            <div className="info-card">
              <span className="info-value">{age.totalDays}</span>
              <span className="info-label">Total Days</span>
            </div>
            <div className="info-card">
              <span className="info-value">{age.totalWeeks}</span>
              <span className="info-label">Total Weeks</span>
            </div>
            <div className="info-card">
              <span className="info-value">{age.daysUntilBirthday}</span>
              <span className="info-label">Days to Birthday</span>
            </div>
            <div className="info-card">
              <span className="info-value">{age.zodiacSign}</span>
              <span className="info-label">Zodiac Sign</span>
            </div>
            <div className="info-card">
              <span className="info-value">{age.dayOfWeek}</span>
              <span className="info-label">Day Born</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgeCalculator;