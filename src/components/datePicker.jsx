import React, { useState, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, setDate } from 'date-fns';
import { BiCalendar } from 'react-icons/bi';

export default function DateInput({ value, onChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef(null);

  const handleSelect = (date) => {
    onChange(date);        // Gửi ngày đã chọn lên component cha
    setShowPicker(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginTop: '10px' }}>
      <div
        onClick={() => setShowPicker(!showPicker)}
        style={{
          border: '1px solid #ddd',
          padding: '10px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          minWidth: 400
        }}
      >
        <input
          type="text"
          readOnly
          placeholder="Chọn ngày"
          value={value ? format(value, 'dd/MM/yyyy') : ''}
          style={{
            border: 'none',
            outline: 'none',
            flexGrow: 1,
            background: 'transparent',
            fontSize: '14px'
          }}
        />
        <span role="img" aria-label="calendar"><BiCalendar /></span>
      </div>

      {showPicker && (
        <div
          ref={ref}
          style={{
            position: 'absolute',
            right: '-40%',
            zIndex: 10,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            marginTop: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

