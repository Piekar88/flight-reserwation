// Import necessary React libraries and components
import React from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import { users } from './users.json';
import flightData from './flights.json';
import airportData from './airports.json';
import MyListComponent from './components/MyListComponent';
import CustomWeatherWidget from './components/CustomWeatherWidget';

// Main App component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      logged: null,
      reservations: [],
      destinationCity: airportData.airports[0].name,
    };
  }

  // Update the destination city in the state
  updateDestinationCity(city) {
    this.setState({ destinationCity: city });
  }

  // Add a reservation to the state
  addReservation(reservation) {
    this.setState((prevState) => ({ reservations: [...prevState.reservations, reservation], }));
    const findAirportIndex = (airports, name) => { return airports.findIndex(airport => airport.name === name); };
    const airports = airportData.airports;
    const index = findAirportIndex(airports, reservation.destination);
    this.setState({ destinationCity: airportData.airports[index].name });
  }

  // Set up a timer when the component mounts
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  // Clear the timer when the component unmounts
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // Update the date in the state every second
  tick() {
    this.setState({
      date: new Date()
    });
  }

  // Handle login and update the state
  handleLogin(username) {
    this.setState({ logged: `Logged in as ${username}` });
  }

  // Handle logout and update the state
  handleLogout() {
    this.setState({ logged: null });
  }

  // Render the main app component
  render() {
    const { logged, destinationCity } = this.state;
    const selectedAirport = airportData.airports.find(airport => airport.name === destinationCity);

    return (
      <div className="main-div">
        <div className="logo">Flight Reservation</div>
        <p><b>Current Date and Time:</b> {this.state.date.toLocaleString()}</p>
        <br></br>
        <header>
          <ul className="horizontal-menu">
            <li><Link to="/search">Your flights</Link></li>
            <li><Link to="/reservation">Search for flight</Link></li>
            {!logged && <li><Link to="/login">LogIn</Link></li>}
            {logged && <li><Link to="/logout" onClick={this.handleLogout.bind(this)}>LogOut</Link></li>}
          </ul>
          <br></br>
          {logged && <p style={{ color: 'green' }}>{logged}</p>}
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={FlightReservation}/>
            <Route path="/search" render={(props) => ( <Reservation {...props} reservations={this.state.reservations} /> )} />
            <Route path="/reservation" render={(props) => ( <FlightReservation {...props} onAddReservation={(reservation) => this.addReservation(reservation) } onUpdateDestinationCity={(city) => this.updateDestinationCity(city) } /> )} />
            {!logged && <Route path="/login" render={(props) => (<LogIn {...props} onLogin={(username) => this.handleLogin(username)} />)} />}
            {logged && <Route path="/logout" component={LogOut} />}
            <Route path="*" component={FlightReservation}/>
          </Switch>
        </main>
        <br></br>
        <hr></hr>
        <br></br>
        <div className="weather-widget-container">
          <CustomWeatherWidget location={selectedAirport.location} />
        </div>
      </div>
    );
  }
};

// Reservation component for displaying reservations
class Reservation extends React.Component {
  render() {
    if (!this.props.reservations || this.props.reservations.length === 0) {
      return (
        <div>
          <p>No reservation data available.</p>
        </div>
      );
    }
    return (
      <div>
        <br></br>
        <h1>Your reservations</h1>
        <br></br>
        {this.props.reservations.map((reservation, index) => (
          <div key={index}>
            <p>Origin: {reservation.origin}</p>
            <p>Destination: {reservation.destination}</p>
            <p>
              Seat Numbers:{" "}
              {reservation.seats.map((seat, index) => (
                <span key={index}>
                  {seat}
                  {index < reservation.seats.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <br></br>
          </div>
        ))}
      </div>
    );
  }  
};

// LogIn component for handling user login
class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      success: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle the submission of the login form
  handleSubmit(event) {
    event.preventDefault();
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;
    var user = "empty" 
    user = users.find((u) => u.username === username && u.password === password);
    console.log(user);
    if (user && user.username) {
      console.log(user.username);
      console.log(user.password);
      alert(`Welcome ${user.username}!`);
      this.setState({ success: `Welcome ${user.username}!` });
      this.props.onLogin(user.username);
    } else {
      this.setState({ error: 'Invalid credentials' });
    }
  };

  // Render the login form
  render() {
    const { error } = this.state;
    const { success } = this.state;
    return (
      <div>
        <br></br>
        <h1>Login</h1>
        <br></br>
        <div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" name="username" placeholder="Username" ref={(input) => this.usernameInput = input} />
            <br />
            <input type="password" name="password" placeholder="Password" ref={(input) => this.passwordInput = input} />
            <br />
            <button type="submit">Log In</button>
          </form>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    );
  }
};

// LogOut component for handling user logout
class LogOut extends React.Component {
  // Handle the logout button click
  handleButtonClick() {
    this.props.onLogout();
  };

  // Render the logout button
  render() {
    return (
      <div>
        <br></br>
        <h1>Logout</h1>
        <br></br>
        <div className="divlogout">
          <button className="logout" onClick={() => this.handleButtonClick()}>Log Out</button>
        </div>
      </div>
    );
  }
};

// FlightReservation component for searching and booking flights
class FlightReservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flights: flightData.flights,
      origin: "",
      destination: "",
      date: "",
      airports: airportData.airports,
      filteredFlights: [],
      selectedSeats: [],
    };
    this.handleSeatSelection = this.handleSeatSelection.bind(this);
  }

  // Handle the selection of seats
  handleSeatSelection(selectedSeats) {
    this.setState({ selectedSeats });
  }

  // Handle input changes
  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  // Handle flight search
  handleSearch(event) {
    event.preventDefault();
    const { flights, origin, destination, date, dateend } = this.state;
    const filteredFlights = flights.filter(
      (flight) =>
        flight.origin === origin &&
        flight.destination === destination
    );
    this.setState({ filteredFlights });
  }

  // Handle selected flight change
  handleSelectedFlightChange(event) {
    this.setState({ selectedFlightIndex: event.target.value });
  }

  // Handle seat selection
  handleSeatSelection(selectedSeats) {
    this.setState({ selectedSeats });
  }

  // Handle making a reservation
  handleMakeReservation(event) {
    event.preventDefault();
    const { selectedFlightIndex, selectedSeats, flights, airports } = this.state;
    const selectedFlight = flights[selectedFlightIndex];
    
  
    if (selectedSeats.length > 0) {
      const reservation = {
        origin: selectedFlight.origin,
        destination: selectedFlight.destination,
        seats: selectedSeats,
      };
      const destinationLocation = airports.find(airport => airport.name === selectedFlight.destination).location;
      this.props.onAddReservation(reservation);
      this.props.onUpdateDestinationCity(destinationLocation);
      console.warn("Reservation made successfully!");
    } else {
      console.warn("Please select at least one seat.");
    }
  }  

  // Render the flight reservation form and results
  render() {
    const {
      origin,
      destination,
      date,
      dateend,
      filteredFlights,
      airports,
      selectedSeats,
    } = this.state;
    const selectedAirport = airportData.airports.find(airport => airport.name === destination);

    return (
      <div>
        <br></br>
        <h1>Search for your flight</h1>
        <br></br>
        <form onSubmit={(event) => this.handleSearch(event)}>
          <label>
            <input type="text" name="origin" placeholder="Origin" value={origin} onChange={(event) => this.handleInputChange(event)} list="origin-airports" />
            <datalist id="origin-airports">
              {airports.map((airport, index) => (<option key={index} value={airport.name}>{airport.name}</option>))}
            </datalist>
          </label>
          <br />
          <label>
            <input type="text" name="destination" placeholder="Destination" value={destination} onChange={(event) => this.handleInputChange(event)} list="destination-airports"/>
            <datalist id="destination-airports">
              {airports.map((airport, index) => (<option key={index} value={airport.name}>{airport.name}</option>))}
            </datalist>
          </label>
          <br />
          <label>
            Start date: &nbsp; 
            <input type="date" name="date" value={date} onChange={(event) => this.handleInputChange(event)} />
          </label>
          <label>
            End date: &nbsp; &nbsp; &nbsp;
            <input type="date" name="dateEnd" value={dateend} onChange={(event) => this.handleInputChange(event)} />
          </label>
          <br />
          <button type="submit">Search</button>
        </form>
         {/* Render the list of filtered flights */}
        <ul>
          {filteredFlights.map((flight, index) => (
            <li key={index}>
              <p>Plane Type: {flight.planeType}</p>
              <p>Price: ${flight.price}</p>
              Free seats are:{" "}
              <MyListComponent
                data={flight.freeSeats}
                onSeatSelection={this.handleSeatSelection}
                onUpdateDestinationCity={this.props.onUpdateDestinationCity}
              />
            </li>
          ))}
        </ul>
         {/* Render the Make Reservation button if seats are selected */}
        {selectedSeats.length > 0 && (
          <Link
            to={{
              pathname: "/search",
              state: { origin, destination, seats: selectedSeats, },
            }}
            onClick={() => this.props.onAddReservation({ origin, destination, seats: selectedSeats, })}
          >
            <button className="logout">Make reservation</button>
          </Link>
        )}
      </div>
    ); 
  }
}

// Render the main App component with BrowserRouter
render((
  <BrowserRouter>
    <Route path="/" component={App} />
  </BrowserRouter>
), document.getElementById('root'));