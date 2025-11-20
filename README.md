# Methanol Vessel Intake Form

A comprehensive React-based form for recording methanol vessel intake information, designed for terminal operations with full safety compliance and operational documentation.

## Features

- ✅ **Comprehensive Form Sections**: 6 organized sections with collapsible accordion UI
- ✅ **Vessel Information**: Name, ID, IMO number (with validation), Flag State, Vessel Type
- ✅ **Arrival & Berthing**: Date/time of arrival, berth assignment, estimated departure
- ✅ **Cargo Details**: Quantity with unit selector, temperature, density, loading rates, pressure limits
- ✅ **Safety Checklist**: 9-point safety and compliance verification checklist
- ✅ **Equipment Verification**: 6-point equipment and operations checklist
- ✅ **Signatures & Authorization**: Vessel and terminal representative signatures
- ✅ **Form Validation**: Comprehensive validation for all required fields
- ✅ **Draft Saving**: Local storage support for saving work in progress
- ✅ **Print Support**: Print-optimized CSS for physical documentation
- ✅ **Professional UI**: Terminal operations styling with completion indicators
- ✅ **Responsive Design**: Optimized for desktop and tablet use

## Form Sections

1. **Vessel Information** - Complete vessel identification and details
2. **Arrival & Berthing Details** - Arrival time, berth assignment, departure estimates
3. **Cargo Information** - Methanol quantity, temperature, density, loading parameters
4. **Safety & Compliance Checklist** - 9 safety verification points
5. **Equipment & Operations Verification** - 6 equipment checkpoints
6. **Signatures & Authorization** - Official sign-off from both parties

## Quick Start

### Option 1: Standalone HTML (No Build Required)

Simply open `vessel-intake-standalone.html` in your browser - it works immediately!

### Option 2: React Development Server

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

**Quick Deploy:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` in the project directory
3. Follow the prompts

**GitHub Integration:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Usage

1. Fill in all required fields (marked with *)
2. Click "Submit" to record the vessel intake
3. Use "Reset" to clear the form

## Project Structure

```
├── vessel-intake-standalone.html  # Standalone HTML file (ready to deploy)
├── vercel.json                    # Vercel deployment configuration
├── src/
│   ├── VesselIntakeForm.jsx       # Main form component
│   ├── VesselIntakeForm.css       # Styling for the form
│   ├── App.jsx                    # Root application component
│   └── index.js                   # React entry point
├── public/
│   └── index.html                 # HTML template
├── package.json                   # Dependencies and scripts
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                      # This file
```

## Customization

You can customize the form by:
- Modifying validation rules in `VesselIntakeForm.jsx`
- Changing colors and styles in `VesselIntakeForm.css`
- Adding additional fields as needed
- Implementing backend API integration in the `handleSubmit` function

## Backend Integration

To connect this form to a backend API, update the `handleSubmit` function in `VesselIntakeForm.jsx`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    try {
      const response = await fetch('/api/vessel-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        // Handle success
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  }
};
```

