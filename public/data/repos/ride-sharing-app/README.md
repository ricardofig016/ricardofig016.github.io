# Ride Sharing App

A web-based ride-sharing application, similar to Uber, built with Java Spring Boot and Vaadin Flow. This application allows users to create, manage, and participate in ride-sharing as either drivers or passengers, featuring an interactive Google Maps interface.

## Features

### Core Functionality

- **User Management**: Register users, manage profiles, and maintain car inventories
- **Ride Creation**: Create rides as driver or passenger with interactive map selection
- **Real-time Visualization**: Animated car movement simulation on Google Maps
- **Ride Matching**: Intelligent matching system between drivers and passengers
- **Rating System**: Star-based rating system for both drivers and passengers

### User Interface

- **Interactive Maps**: Google Maps integration for route planning and visualization
- **Responsive Design**: Dark-themed UI with Vaadin Flow components
- **Multi-panel Navigation**: Profile View, Ride Creation View, and Rides View
- **Real-time Updates**: Live car movement animation during ride simulation

## Technology Stack

- **Backend**: Java 17, Spring Boot 3.4.5
- **Frontend**: Vaadin Flow 24.7.4
- **Maps**: Google Maps JavaScript API
- **Build Tool**: Maven
- **Persistence**: Java Serialization
- **IDE**: IntelliJ IDEA

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ricardofig016/ride-sharing-app.git
   cd ride-sharing-app
   ```

2. **Run the application**

   - Import the project into IntelliJ IDEA or Eclipse
   - Run the `Application.java` class directly

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - The application will automatically create a default user profile

### Production Build

```bash
mvn spring-boot:run -Pproduction
```

## Project Structure

```plaintext
src/main/java/rsa/
├── Application.java                # Spring Boot application entry point
├── Manager.java                    # Core business logic and data management
├── RideSharingAppException.java    # Custom exception handling
├── match/                          # Matching algorithm components
│   ├── Location.java
│   ├── Matcher.java
│   ├── PreferredMatch.java
│   └── RideMatch.java
├── quad/
│   ├── HasPoint.java
│   ├── LeafTrie.java
│   ├── Location.java
│   ├── NodeTrie.java
│   ├── Point.java
│   ├── PointOutOfBoundException.java
│   ├── PointQuadtree.java
│   ├── Rectangle.java
│   └── Trie.java
├── ride/                           # Ride-related entities
│   ├── Ride.java
│   └── RideRole.java
├── ui/                             # User interface components
│   ├── MainLayout.java
│   ├── ProfilePanel.java
│   ├── RideCreationPanel.java
│   └── RidesViewPanel.java
└── user/                           # User-related entities
    ├── Car.java
    ├── User.java
    ├── UserStars.java
    └── Users.java
```

## How to Use

### 1. Profile Management

- Navigate to **"Manage Profile"** to set up your user information
- Add cars to your profile if you plan to be a driver
- Configure your ride matching preferences

### 2. Creating a Ride

- Go to **"Create Ride"** panel
- Select your role: **Driver** or **Passenger**
- Click on the map to set your **start point** (green marker)
- Click again to set your **destination** (red marker)
- Fill in additional details (cost, departure time, vehicle selection for drivers)
- Click **"Create Ride"** to publish your ride

### 3. Map Interactions

- **Left Click**: Set start/end points for your ride
- **Right Click**: Clear all markers and reset the map
- **Auto-centering**: Map automatically centers on your selected route

### 4. Viewing Rides

- Use **"View Rides"** to see all available rides in the system
- Browse rides created by other users
- View ride details including routes, costs, and user ratings

## Development

### Testing

The application includes comprehensive unit testing for all server-side components.

```bash
# Run unit tests
mvn test
```

## Data Persistence

The application uses Java serialization for data persistence:

- **User data**: Stored in `users.dat`
- **Ride data**: Stored in `rides.dat`
- Data is automatically saved when users or rides are created/modified, and automatically loaded when the application starts

## Academic Context

The project was developed for the CC3034 Software Architecture course from Faculdade de Ciências da Universidade do Porto (FCUP)

### Learning Objectives

- Full-stack web application development
- Integration of third-party services (Google Maps API)
- Modern UI framework usage (Vaadin Flow)
- Software architecture design patterns
- Version control
- Unit Testing

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
