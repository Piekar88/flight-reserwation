// Importing the necessary React hooks and external components
import React, { useState, useEffect } from 'react';
import { WeatherWidget as JBWeatherWidget } from 'jb-react-weather-widget';

// Creating a functional React component called CustomWeatherWidget
const CustomWeatherWidget = ({ location }) => {
  // Convert the 'location' prop to a string
  var location = String(location);
  // Declare a state variable 'currentLocation' and initialize it with the 'location' prop
  const [currentLocation, setCurrentLocation] = useState(location);

  // Function to check if the provided location string is in a valid format
  const isValidLocation = (location) => {
    // Regular expression pattern to match "City, Country" format
    const pattern = /^[a-zA-Z\s]+,\s*[a-zA-Z\s]+$/;
    // Test the location against the pattern and return the result (true or false)
    return pattern.test(location);
  };

  // useEffect hook to handle location updates
  useEffect(() => {
    // If the location is in a valid format, update the 'currentLocation' state
    if (isValidLocation(location)) {
      console.warn('You are trying to set: ' + location);
      setCurrentLocation(location);
    } else {
      // If the location is not in a valid format, log a warning message
      console.warn('Invalid location format. Expected format: "City, Country"');
    }
  }, [location]);

  // Render the component UI, passing the 'currentLocation' state as the 'defaultLocation' prop
  return <JBWeatherWidget defaultLocation={currentLocation} />;
};

// Export the CustomWeatherWidget as the default export
export default CustomWeatherWidget;
