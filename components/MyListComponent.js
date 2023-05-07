// Importing the necessary React hooks and functions
import React, { useState } from "react";

// Creating a functional React component called MyListComponent
const MyListComponent = (props) => {
  // Destructuring the 'data' prop from the props object
  const { data } = props;
  // Declare a state variable 'checkedSeats' and initialize it with an empty array
  const [checkedSeats, setCheckedSeats] = useState([]);

  // Function to handle changes in the checkboxes for seat selection
  const handleCheckboxChange = (event, seat) => {
    // Destructuring the 'checked' property from the event.target object
    const { checked } = event.target;
    // Updating the 'checkedSeats' state
    setCheckedSeats((prevCheckedSeats) => {
      // If the checkbox is checked, add the seat to the list; otherwise, remove it
      const updatedCheckedSeats = checked
        ? [...prevCheckedSeats, seat]
        : prevCheckedSeats.filter((s) => s !== seat);

      // Call the 'onSeatSelection' prop function to update the parent component
      props.onSeatSelection(updatedCheckedSeats);
      // Return the updated list of checked seats
      return updatedCheckedSeats;
    });
  };

  // Render the component UI
  return (
    <div>
    {/* Mapping through the 'data' prop and creating a checkbox for each item */}
      {data.map((item, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={checkedSeats.includes(item)}
            onChange={(event) => handleCheckboxChange(event, item)}
          />{" "}
          {item}
        </div>
      ))}
    </div>
  );
};

// Export the MyListComponent as the default export
export default MyListComponent;