import React, { useState, useEffect } from 'react';
import './VesselIntakeForm.css';

const VesselIntakeForm = () => {
    const [expandedSections, setExpandedSections] = useState([0, 1, 2, 3, 4, 5]);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        // Vessel Information
        vesselName: '',
        vesselId: '',
        imoNumber: '',
        flagState: '',
        vesselType: '',
        
        // Arrival & Berthing
        dateOfArrival: '',
        timeOfArrival: '',
        berthAssignment: '',
        estimatedDeparture: '',
        
        // Cargo Information
        productName: 'Methanol',
        quantity: '',
        quantityUnit: 'm³',
        cargoTemperature: '',
        cargoDensity: '',
        startupLoadRate: '',
        maxLoadRate: '',
        maxPressure: '',
        
        // Safety Checklist
        safetyChecks: {
            preLoadingMeeting: false,
            ppeReviewed: false,
            loadPlanAgreed: false,
            commChannels: false,
            emergencyShutdown: false,
            shipShoreSafety: false,
            fireResponse: false,
            spillResponse: false,
            emergencyContacts: false
        },
        
        // Equipment & Operations
        equipmentChecks: {
            valvePumpVerified: false,
            hosesInspected: false,
            mooringSecured: false,
            watchmanPositioned: false,
            samplingPlan: false,
            gaugingMethod: false
        },
        
        // Signatures
        vesselRepName: '',
        vesselRepSignature: '',
        terminalRepName: '',
        terminalRepSignature: '',
        approvalDateTime: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Load draft from localStorage
        const savedDraft = localStorage.getItem('vesselIntakeDraft');
        if (savedDraft) {
            try {
                setFormData(JSON.parse(savedDraft));
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }, []);

    const saveDraft = () => {
        localStorage.setItem('vesselIntakeDraft', JSON.stringify(formData));
        alert('Draft saved successfully!');
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('safety-')) {
            const checkName = name.replace('safety-', '');
            setFormData(prev => ({
                ...prev,
                safetyChecks: {
                    ...prev.safetyChecks,
                    [checkName]: checked
                }
            }));
        } else if (name.startsWith('equipment-')) {
            const checkName = name.replace('equipment-', '');
            setFormData(prev => ({
                ...prev,
                equipmentChecks: {
                    ...prev.equipmentChecks,
                    [checkName]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateIMO = (imo) => {
        const imoPattern = /^IMO\d{7}$/;
        return imoPattern.test(imo);
    };

    const getSectionStatus = (sectionIndex) => {
        switch(sectionIndex) {
            case 0: // Vessel Info
                return formData.vesselName && formData.vesselId && formData.imoNumber && 
                       formData.flagState && formData.vesselType;
            case 1: // Arrival
                return formData.dateOfArrival && formData.timeOfArrival && 
                       formData.berthAssignment && formData.estimatedDeparture;
            case 2: // Cargo
                return formData.quantity && formData.cargoTemperature && 
                       formData.cargoDensity && formData.startupLoadRate && 
                       formData.maxLoadRate && formData.maxPressure;
            case 3: // Safety
                return Object.values(formData.safetyChecks).every(v => v === true);
            case 4: // Equipment
                return Object.values(formData.equipmentChecks).every(v => v === true);
            case 5: // Signatures
                return formData.vesselRepName && formData.vesselRepSignature && 
                       formData.terminalRepName && formData.terminalRepSignature;
            default:
                return false;
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Vessel Information
        if (!formData.vesselName.trim()) newErrors.vesselName = 'Vessel name is required';
        if (!formData.vesselId.trim()) newErrors.vesselId = 'Vessel ID is required';
        if (!formData.imoNumber.trim()) {
            newErrors.imoNumber = 'IMO number is required';
        } else if (!validateIMO(formData.imoNumber)) {
            newErrors.imoNumber = 'Invalid IMO format (e.g., IMO1234567)';
        }
        if (!formData.flagState.trim()) newErrors.flagState = 'Flag state is required';
        if (!formData.vesselType.trim()) newErrors.vesselType = 'Vessel type is required';

        // Arrival & Berthing
        if (!formData.dateOfArrival) newErrors.dateOfArrival = 'Date of arrival is required';
        if (!formData.timeOfArrival) newErrors.timeOfArrival = 'Time of arrival is required';
        if (!formData.berthAssignment.trim()) newErrors.berthAssignment = 'Berth assignment is required';
        if (!formData.estimatedDeparture) newErrors.estimatedDeparture = 'Estimated departure is required';

        // Cargo Information
        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Quantity must be positive';
        }
        if (!formData.cargoTemperature) newErrors.cargoTemperature = 'Cargo temperature is required';
        if (!formData.cargoDensity) newErrors.cargoDensity = 'Cargo density is required';
        if (!formData.startupLoadRate) newErrors.startupLoadRate = 'Startup load rate is required';
        if (!formData.maxLoadRate) newErrors.maxLoadRate = 'Maximum load rate is required';
        if (!formData.maxPressure) newErrors.maxPressure = 'Maximum pressure is required';

        // Safety Checks
        const incompleteSafety = Object.values(formData.safetyChecks).some(v => !v);
        if (incompleteSafety) {
            newErrors.safetyChecks = 'All safety checks must be completed';
        }

        // Equipment Checks
        const incompleteEquipment = Object.values(formData.equipmentChecks).some(v => !v);
        if (incompleteEquipment) {
            newErrors.equipmentChecks = 'All equipment checks must be completed';
        }

        // Signatures
        if (!formData.vesselRepName.trim()) newErrors.vesselRepName = 'Vessel representative name is required';
        if (!formData.vesselRepSignature.trim()) newErrors.vesselRepSignature = 'Vessel representative signature is required';
        if (!formData.terminalRepName.trim()) newErrors.terminalRepName = 'Terminal representative name is required';
        if (!formData.terminalRepSignature.trim()) newErrors.terminalRepSignature = 'Terminal representative signature is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const submitData = {
                ...formData,
                approvalDateTime: new Date().toISOString()
            };
            
            console.log('Form submitted:', submitData);
            setSubmitted(true);
            localStorage.removeItem('vesselIntakeDraft');

            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } else {
            // Expand sections with errors
            const sectionsWithErrors = [];
            if (errors.vesselName || errors.vesselId || errors.imoNumber || errors.flagState || errors.vesselType) {
                sectionsWithErrors.push(0);
            }
            if (errors.dateOfArrival || errors.timeOfArrival || errors.berthAssignment || errors.estimatedDeparture) {
                sectionsWithErrors.push(1);
            }
            if (errors.quantity || errors.cargoTemperature || errors.cargoDensity || 
                errors.startupLoadRate || errors.maxLoadRate || errors.maxPressure) {
                sectionsWithErrors.push(2);
            }
            if (errors.safetyChecks) sectionsWithErrors.push(3);
            if (errors.equipmentChecks) sectionsWithErrors.push(4);
            if (errors.vesselRepName || errors.vesselRepSignature || 
                errors.terminalRepName || errors.terminalRepSignature) {
                sectionsWithErrors.push(5);
            }
            setExpandedSections(sectionsWithErrors);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to clear all form data?')) {
            setFormData({
                vesselName: '',
                vesselId: '',
                imoNumber: '',
                flagState: '',
                vesselType: '',
                dateOfArrival: '',
                timeOfArrival: '',
                berthAssignment: '',
                estimatedDeparture: '',
                productName: 'Methanol',
                quantity: '',
                quantityUnit: 'm³',
                cargoTemperature: '',
                cargoDensity: '',
                startupLoadRate: '',
                maxLoadRate: '',
                maxPressure: '',
                safetyChecks: {
                    preLoadingMeeting: false,
                    ppeReviewed: false,
                    loadPlanAgreed: false,
                    commChannels: false,
                    emergencyShutdown: false,
                    shipShoreSafety: false,
                    fireResponse: false,
                    spillResponse: false,
                    emergencyContacts: false
                },
                equipmentChecks: {
                    valvePumpVerified: false,
                    hosesInspected: false,
                    mooringSecured: false,
                    watchmanPositioned: false,
                    samplingPlan: false,
                    gaugingMethod: false
                },
                vesselRepName: '',
                vesselRepSignature: '',
                terminalRepName: '',
                terminalRepSignature: '',
                approvalDateTime: ''
            });
            setErrors({});
            localStorage.removeItem('vesselIntakeDraft');
        }
    };

    const sections = [
        {
            title: 'Vessel Information',
            content: (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Vessel Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="vesselName"
                                value={formData.vesselName}
                                onChange={handleChange}
                                className={`form-input ${errors.vesselName ? 'error' : ''}`}
                                placeholder="Enter vessel name"
                            />
                            {errors.vesselName && <span className="error-message">{errors.vesselName}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Vessel ID <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="vesselId"
                                value={formData.vesselId}
                                onChange={handleChange}
                                className={`form-input ${errors.vesselId ? 'error' : ''}`}
                                placeholder="Enter vessel ID"
                            />
                            {errors.vesselId && <span className="error-message">{errors.vesselId}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                IMO Number <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="imoNumber"
                                value={formData.imoNumber}
                                onChange={handleChange}
                                className={`form-input ${errors.imoNumber ? 'error' : ''}`}
                                placeholder="IMO1234567"
                            />
                            {errors.imoNumber && <span className="error-message">{errors.imoNumber}</span>}
                            <span className="info-text">Format: IMO followed by 7 digits</span>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Flag State <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="flagState"
                                value={formData.flagState}
                                onChange={handleChange}
                                className={`form-input ${errors.flagState ? 'error' : ''}`}
                                placeholder="Enter flag state"
                            />
                            {errors.flagState && <span className="error-message">{errors.flagState}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Vessel Type <span className="required">*</span>
                            </label>
                            <select
                                name="vesselType"
                                value={formData.vesselType}
                                onChange={handleChange}
                                className={`form-select ${errors.vesselType ? 'error' : ''}`}
                            >
                                <option value="">Select vessel type</option>
                                <option value="Chemical Tanker">Chemical Tanker</option>
                                <option value="Oil Tanker">Oil Tanker</option>
                                <option value="Gas Carrier">Gas Carrier</option>
                                <option value="Product Tanker">Product Tanker</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.vesselType && <span className="error-message">{errors.vesselType}</span>}
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Arrival & Berthing Details',
            content: (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Date of Arrival <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateOfArrival"
                                value={formData.dateOfArrival}
                                onChange={handleChange}
                                className={`form-input ${errors.dateOfArrival ? 'error' : ''}`}
                            />
                            {errors.dateOfArrival && <span className="error-message">{errors.dateOfArrival}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Time of Arrival <span className="required">*</span>
                            </label>
                            <input
                                type="time"
                                name="timeOfArrival"
                                value={formData.timeOfArrival}
                                onChange={handleChange}
                                className={`form-input ${errors.timeOfArrival ? 'error' : ''}`}
                            />
                            {errors.timeOfArrival && <span className="error-message">{errors.timeOfArrival}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Berth Assignment <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="berthAssignment"
                                value={formData.berthAssignment}
                                onChange={handleChange}
                                className={`form-input ${errors.berthAssignment ? 'error' : ''}`}
                                placeholder="e.g., Berth 3A"
                            />
                            {errors.berthAssignment && <span className="error-message">{errors.berthAssignment}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Estimated Departure <span className="required">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="estimatedDeparture"
                                value={formData.estimatedDeparture}
                                onChange={handleChange}
                                className={`form-input ${errors.estimatedDeparture ? 'error' : ''}`}
                            />
                            {errors.estimatedDeparture && <span className="error-message">{errors.estimatedDeparture}</span>}
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Cargo Information',
            content: (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                className="form-input read-only-field"
                                readOnly
                            />
                            <span className="info-text">Fixed product type for this terminal</span>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Quantity to be Loaded <span className="required">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className={`form-input ${errors.quantity ? 'error' : ''}`}
                                    placeholder="Enter quantity"
                                    step="0.01"
                                />
                                <select
                                    name="quantityUnit"
                                    value={formData.quantityUnit}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="m³">m³</option>
                                    <option value="liters">Liters</option>
                                    <option value="gallons">Gallons</option>
                                </select>
                            </div>
                            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Cargo Temperature (°C) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="cargoTemperature"
                                value={formData.cargoTemperature}
                                onChange={handleChange}
                                className={`form-input ${errors.cargoTemperature ? 'error' : ''}`}
                                placeholder="e.g., 20"
                                step="0.1"
                            />
                            {errors.cargoTemperature && <span className="error-message">{errors.cargoTemperature}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Cargo Density (kg/m³) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="cargoDensity"
                                value={formData.cargoDensity}
                                onChange={handleChange}
                                className={`form-input ${errors.cargoDensity ? 'error' : ''}`}
                                placeholder="e.g., 792"
                                step="0.1"
                            />
                            {errors.cargoDensity && <span className="error-message">{errors.cargoDensity}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Start-up Load Rate (m³/hr) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="startupLoadRate"
                                value={formData.startupLoadRate}
                                onChange={handleChange}
                                className={`form-input ${errors.startupLoadRate ? 'error' : ''}`}
                                placeholder="e.g., 100"
                                step="1"
                            />
                            {errors.startupLoadRate && <span className="error-message">{errors.startupLoadRate}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Maximum Load Rate (m³/hr) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxLoadRate"
                                value={formData.maxLoadRate}
                                onChange={handleChange}
                                className={`form-input ${errors.maxLoadRate ? 'error' : ''}`}
                                placeholder="e.g., 500"
                                step="1"
                            />
                            {errors.maxLoadRate && <span className="error-message">{errors.maxLoadRate}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Maximum Allowable Pressure (bar) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxPressure"
                                value={formData.maxPressure}
                                onChange={handleChange}
                                className={`form-input ${errors.maxPressure ? 'error' : ''}`}
                                placeholder="e.g., 10"
                                step="0.1"
                            />
                            {errors.maxPressure && <span className="error-message">{errors.maxPressure}</span>}
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Safety & Compliance Checklist',
            content: (
                <>
                    {errors.safetyChecks && (
                        <div style={{padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginBottom: '16px', color: '#856404'}}>
                            {errors.safetyChecks}
                        </div>
                    )}
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="preLoadingMeeting"
                                name="safety-preLoadingMeeting"
                                checked={formData.safetyChecks.preLoadingMeeting}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="preLoadingMeeting" className="checkbox-label">
                                Pre-loading operational meeting conducted
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="ppeReviewed"
                                name="safety-ppeReviewed"
                                checked={formData.safetyChecks.ppeReviewed}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="ppeReviewed" className="checkbox-label">
                                Personal Protective Equipment (PPE) procedures reviewed and confirmed
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="loadPlanAgreed"
                                name="safety-loadPlanAgreed"
                                checked={formData.safetyChecks.loadPlanAgreed}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="loadPlanAgreed" className="checkbox-label">
                                Load plan and shore tank assignments agreed
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="commChannels"
                                name="safety-commChannels"
                                checked={formData.safetyChecks.commChannels}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="commChannels" className="checkbox-label">
                                Communication channels established and tested
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="emergencyShutdown"
                                name="safety-emergencyShutdown"
                                checked={formData.safetyChecks.emergencyShutdown}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="emergencyShutdown" className="checkbox-label">
                                Emergency shutdown procedures verified
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="shipShoreSafety"
                                name="safety-shipShoreSafety"
                                checked={formData.safetyChecks.shipShoreSafety}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="shipShoreSafety" className="checkbox-label">
                                Ship/Shore safety checklist completed
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="fireResponse"
                                name="safety-fireResponse"
                                checked={formData.safetyChecks.fireResponse}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="fireResponse" className="checkbox-label">
                                Fire response procedures reviewed
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="spillResponse"
                                name="safety-spillResponse"
                                checked={formData.safetyChecks.spillResponse}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="spillResponse" className="checkbox-label">
                                Spill response procedures reviewed
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="emergencyContacts"
                                name="safety-emergencyContacts"
                                checked={formData.safetyChecks.emergencyContacts}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="emergencyContacts" className="checkbox-label">
                                Emergency contact information exchanged
                            </label>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Equipment & Operations Verification',
            content: (
                <>
                    {errors.equipmentChecks && (
                        <div style={{padding: '12px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginBottom: '16px', color: '#856404'}}>
                            {errors.equipmentChecks}
                        </div>
                    )}
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="valvePumpVerified"
                                name="equipment-valvePumpVerified"
                                checked={formData.equipmentChecks.valvePumpVerified}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="valvePumpVerified" className="checkbox-label">
                                Valve and pump line-up verified
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="hosesInspected"
                                name="equipment-hosesInspected"
                                checked={formData.equipmentChecks.hosesInspected}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="hosesInspected" className="checkbox-label">
                                Hoses/loading arms inspected and approved for use
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="mooringSecured"
                                name="equipment-mooringSecured"
                                checked={formData.equipmentChecks.mooringSecured}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="mooringSecured" className="checkbox-label">
                                Mooring line security confirmed
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="watchmanPositioned"
                                name="equipment-watchmanPositioned"
                                checked={formData.equipmentChecks.watchmanPositioned}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="watchmanPositioned" className="checkbox-label">
                                Watchman positioned at manifold
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="samplingPlan"
                                name="equipment-samplingPlan"
                                checked={formData.equipmentChecks.samplingPlan}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="samplingPlan" className="checkbox-label">
                                Sampling plan agreed upon
                            </label>
                        </div>
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                id="gaugingMethod"
                                name="equipment-gaugingMethod"
                                checked={formData.equipmentChecks.gaugingMethod}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <label htmlFor="gaugingMethod" className="checkbox-label">
                                Quantity gauging method confirmed
                            </label>
                        </div>
                    </div>
                </>
            )
        },
        {
            title: 'Signatures & Authorization',
            content: (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Vessel Representative Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="vesselRepName"
                                value={formData.vesselRepName}
                                onChange={handleChange}
                                className={`form-input ${errors.vesselRepName ? 'error' : ''}`}
                                placeholder="Enter full name"
                            />
                            {errors.vesselRepName && <span className="error-message">{errors.vesselRepName}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Terminal Representative Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="terminalRepName"
                                value={formData.terminalRepName}
                                onChange={handleChange}
                                className={`form-input ${errors.terminalRepName ? 'error' : ''}`}
                                placeholder="Enter full name"
                            />
                            {errors.terminalRepName && <span className="error-message">{errors.terminalRepName}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Vessel Representative Signature <span className="required">*</span>
                            </label>
                            <div className={`signature-field ${formData.vesselRepSignature ? 'signed' : ''}`}>
                                {formData.vesselRepSignature ? (
                                    <>
                                        <div className="signature-text">{formData.vesselRepSignature}</div>
                                        <div className="signature-meta">Vessel Representative</div>
                                    </>
                                ) : (
                                    <div className="signature-placeholder">Click below to enter signature</div>
                                )}
                            </div>
                            <input
                                type="text"
                                name="vesselRepSignature"
                                value={formData.vesselRepSignature}
                                onChange={handleChange}
                                className={`form-input ${errors.vesselRepSignature ? 'error' : ''}`}
                                placeholder="Type signature"
                                style={{marginTop: '8px'}}
                            />
                            {errors.vesselRepSignature && <span className="error-message">{errors.vesselRepSignature}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Terminal Representative Signature <span className="required">*</span>
                            </label>
                            <div className={`signature-field ${formData.terminalRepSignature ? 'signed' : ''}`}>
                                {formData.terminalRepSignature ? (
                                    <>
                                        <div className="signature-text">{formData.terminalRepSignature}</div>
                                        <div className="signature-meta">Terminal Representative</div>
                                    </>
                                ) : (
                                    <div className="signature-placeholder">Click below to enter signature</div>
                                )}
                            </div>
                            <input
                                type="text"
                                name="terminalRepSignature"
                                value={formData.terminalRepSignature}
                                onChange={handleChange}
                                className={`form-input ${errors.terminalRepSignature ? 'error' : ''}`}
                                placeholder="Type signature"
                                style={{marginTop: '8px'}}
                            />
                            {errors.terminalRepSignature && <span className="error-message">{errors.terminalRepSignature}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group full-width">
                            <p style={{fontSize: '13px', color: '#6c757d', fontStyle: 'italic', marginTop: '12px'}}>
                                By signing this form, both parties confirm that all safety procedures have been reviewed, 
                                all equipment has been verified, and the vessel is cleared for methanol loading operations.
                            </p>
                        </div>
                    </div>
                </>
            )
        }
    ];

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <h1>Methanol Vessel Intake Form</h1>
                    <p>Terminal Operations - Safety & Compliance Documentation</p>
                </div>

                {submitted && (
                    <div className="success-banner">
                        <span style={{fontSize: '24px'}}>✓</span>
                        <span>Form submitted successfully! All data has been recorded.</span>
                    </div>
                )}

                <div className="form-wrapper">
                    <div className="form-body">
                        {sections.map((section, index) => (
                            <div key={index} className="section">
                                <div 
                                    className="section-header" 
                                    onClick={() => toggleSection(index)}
                                >
                                    <div className="section-header-left">
                                        <div className="section-number">{index + 1}</div>
                                        <h2 className="section-title">{section.title}</h2>
                                    </div>
                                    <div className="section-status">
                                        <span className={`status-badge ${getSectionStatus(index) ? 'complete' : 'incomplete'}`}>
                                            {getSectionStatus(index) ? 'Complete' : 'Incomplete'}
                                        </span>
                                        <span className={`chevron ${expandedSections.includes(index) ? 'expanded' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                </div>
                                <div className={`section-content ${expandedSections.includes(index) ? 'expanded' : ''}`}>
                                    <div className="section-body">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={handleReset} className="btn btn-secondary">
                            Clear Form
                        </button>
                        <button type="button" onClick={saveDraft} className="btn btn-outline">
                            Save Draft
                        </button>
                        <button type="button" onClick={handlePrint} className="btn btn-outline">
                            Print
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Submit Form
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VesselIntakeForm;
