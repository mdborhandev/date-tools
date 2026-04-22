import React, { useState, useRef, useEffect } from 'react';

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
    if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
  }
  return null;
};

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

function MonthDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedMonth = months.find((m) => m.value === parseInt(value));

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToPrevMonth = () => {
    const current = parseInt(value) || 1;
    const newMonth = current === 1 ? 12 : current - 1;
    onChange(newMonth.toString());
  };

  const goToNextMonth = () => {
    const current = parseInt(value) || 1;
    const newMonth = current === 12 ? 1 : current + 1;
    onChange(newMonth.toString());
  };

  return (
    <div className="custom-dropdown month-input" ref={dropdownRef}>
      <button className="year-btn" onClick={goToPrevMonth}>-</button>
      <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedMonth ? selectedMonth.label : 'Month'}</span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path fill="currentColor" d="M6 8L1 3h10z" />
        </svg>
      </div>
      <button className="year-btn" onClick={goToNextMonth}>+</button>
      {isOpen && (
        <div className="dropdown-options">
          {months.map((month) => (
            <div
              key={month.value}
              className={`dropdown-option ${parseInt(value) === month.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(month.value.toString());
                setIsOpen(false);
              }}
            >
              {month.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NumberInput({ value, onChange, placeholder, min, max }) {
  const decrease = () => {
    const current = parseInt(value) || min;
    if (current > min) onChange(String(current - 1));
  };

  const increase = () => {
    const current = parseInt(value) || min;
    if (current < max) onChange(String(current + 1));
  };

  return (
    <div className="year-input">
      <button className="year-btn" onClick={decrease}>-</button>
      <input
        type="number"
        className="date-input year-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
      />
      <button className="year-btn" onClick={increase}>+</button>
    </div>
  );
}

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
  const [day, setDay] = useState(() => getCookie('day') || '1');
  const [month, setMonth] = useState(() => getCookie('month') || '1');
  const [year, setYear] = useState(() => getCookie('year') || '2000');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => getCookie('theme') || 'dark');

  useEffect(() => {
    document.body.className = theme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme;
    setCookie('theme', newTheme, 365);
  };

  const updateDay = (value) => {
    setDay(value);
    setCookie('day', value, 365);
  };

  const updateMonth = (value) => {
    setMonth(value);
    setCookie('month', value, 365);
  };

  const updateYear = (value) => {
    setYear(value);
    setCookie('year', value, 365);
  };

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
    <div className={`container ${theme}`}>
      <div className="header">
        <h1>Age Calculator</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
      <div className="input-group">
        <label>Enter your birth date:</label>
        <div className="date-inputs">
          <NumberInput
            value={day}
            onChange={updateDay}
            placeholder="Day"
            min={1}
            max={31}
          />
          <MonthDropdown value={month} onChange={updateMonth} />
          <NumberInput
            value={year}
            onChange={updateYear}
            placeholder="Year"
            min={1900}
            max={2100}
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