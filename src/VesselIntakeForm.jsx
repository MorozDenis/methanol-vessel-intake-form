import React, { useState } from 'react';
import './VesselIntakeForm.css';

const VesselIntakeForm = () => {
  const [formData, setFormData] = useState({
    vesselId: '',
    dateOfArrival: '',
    methanolVolume: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vesselId.trim()) {
      newErrors.vesselId = 'Vessel ID is required';
    }

    if (!formData.dateOfArrival) {
      newErrors.dateOfArrival = 'Date of arrival is required';
    }

    if (!formData.methanolVolume) {
      newErrors.methanolVolume = 'Methanol volume is required';
    } else if (isNaN(formData.methanolVolume) || Number(formData.methanolVolume) <= 0) {
      newErrors.methanolVolume = 'Please enter a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitted(true);
      console.log('Form submitted:', formData);
      
      // Here you would typically send the data to your backend
      // Example: await fetch('/api/vessel-intake', { method: 'POST', body: JSON.stringify(formData) });
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          vesselId: '',
          dateOfArrival: '',
          methanolVolume: ''
        });
        setSubmitted(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setFormData({
      vesselId: '',
      dateOfArrival: '',
      methanolVolume: ''
    });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="vessel-intake-container">
      <div className="form-wrapper">
        <h1 className="form-title">Vessel Intake Form</h1>
        <p className="form-subtitle">Please provide vessel arrival and loading details</p>

        {submitted && (
          <div className="success-message">
            ✓ Vessel intake recorded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="vessel-form">
          <div className="form-group">
            <label htmlFor="vesselId" className="form-label">
              Vessel ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="vesselId"
              name="vesselId"
              value={formData.vesselId}
              onChange={handleChange}
              className={`form-input ${errors.vesselId ? 'error' : ''}`}
              placeholder="Enter vessel identification number"
            />
            {errors.vesselId && (
              <span className="error-message">{errors.vesselId}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfArrival" className="form-label">
              Date of Arrival <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dateOfArrival"
              name="dateOfArrival"
              value={formData.dateOfArrival}
              onChange={handleChange}
              className={`form-input ${errors.dateOfArrival ? 'error' : ''}`}
            />
            {errors.dateOfArrival && (
              <span className="error-message">{errors.dateOfArrival}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="methanolVolume" className="form-label">
              Volume of Methanol (Liters) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="methanolVolume"
              name="methanolVolume"
              value={formData.methanolVolume}
              onChange={handleChange}
              className={`form-input ${errors.methanolVolume ? 'error' : ''}`}
              placeholder="Enter volume in liters"
              min="0"
              step="0.01"
            />
            {errors.methanolVolume && (
              <span className="error-message">{errors.methanolVolume}</span>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button type="button" onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VesselIntakeForm;

