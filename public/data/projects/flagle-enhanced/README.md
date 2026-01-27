# Flagle Enhanced

A Wordle-inspired flag guessing game where players identify countries and territories by progressively revealed flag sections. Test your geography knowledge with 300 different flags!

## Play Now

**Live Demo**: [https://ricardofig016.github.io/flagle-enhanced/](https://ricardofig016.github.io/flagle-enhanced/)

## How to Play

1. **Start the game** - One random section of a flag (out of 6) is revealed
2. **Make a guess** - Type the country or territory name using the autocomplete search
3. **Get feedback** - Correct guess wins! Wrong guess reveals another flag section
4. **Win or lose** - You have 6 attempts total to identify the flag
5. **Track your stats** - Monitor your win streak, win rate, and average attempts

## Features

- **300 Flags**: Includes UN Member States and other territories
- **Three Difficulty Levels**: Easy, Medium, and Hard flags
- **Smart Autocomplete**: Type-ahead search with keyboard navigation
- **Progressive Reveal**: Flag sections revealed one at a time
- **Persistent Stats**: Track your performance across sessions with localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Zero Dependencies**: Pure vanilla JavaScript - no frameworks or libraries

## Getting Started

### Play Online

Visit the live game at [https://ricardofig016.github.io/flagle-enhanced/](https://ricardofig016.github.io/flagle-enhanced/) - no installation required!

### Local Development

#### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended)

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ricardofig016/flagle-enhanced.git
   cd flagle-enhanced
   ```

2. Open `index.html` in your browser, or serve with a local server:

   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (with http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` and start playing!

## Technologies Used

- **JavaScript (ES6+)** - Game logic and interactions
- **HTML5** - Semantic page structure
- **CSS3** - Responsive styling with custom properties
- **Fetch API** - Asynchronous CSV data loading
- **localStorage** - Client-side stat persistence
- **DOM API** - Dynamic UI manipulation

## Project Structure

```
flagle-enhanced/
├── index.html          # Main HTML structure
├── script.js           # Game logic and state management
├── style.css           # Styling and responsive layout
├── data.csv            # Flag data (300 entries)
├── assets/
│   └── flags/          # Flag image files
├── fonts/
│   └── Montserrat/     # Local font files
└── .github/
    └── copilot-instructions.md  # AI coding guidelines
```

## Statistics Tracked

- **Current Streak**: Consecutive wins
- **Highest Streak**: Best winning streak achieved
- **Win Rate**: Percentage of games won
- **Average Attempts**: Mean number of guesses for won games

## About the Flags

### Categorization of Geopolitical Entities

The game includes two categories of flags:

#### UN Member States (Difficulty 1-2)

Independent countries recognized for their full sovereignty, with defined territories, permanent populations, and governments. Examples include the United States, Japan, Australia, Brazil, and South Africa.

#### Other Territories (Difficulty 3)

Regions dependent on another sovereign state, including colonies, overseas territories, and areas with limited self-governance. Examples include Puerto Rico, Greenland, Gibraltar, French Guiana, and Hong Kong.

## Difficulty Levels

Choose a difficulty that matches your geography expertise:

### Easy (Default)

**For newcomers and casual players**

- Features well-known countries with distinctive flags
- Includes major world powers and commonly-recognized nations
- Examples: United States, France, Japan, Canada, Brazil, India
- Recommended for: Learning geography, building confidence, high win rate

### Medium

**For experienced players**

- Mix of less common countries and territories
- Requires solid geographic knowledge
- Examples: Malta, Cyprus, Mongolia, Belize, Seychelles
- Recommended for: Regular players, geographic enthusiasts, balanced challenge

### Hard

**For geography experts**

- Obscure and lesser-known territories
- Includes autonomous regions, overseas territories, and non-sovereign entities
- Examples: Aland, Nagorno-Karabakh, Northern Cyprus, Sint Eustatius
- Recommended for: Advanced players, extreme challenge seekers

**Note**: Use the difficulty selector in the dropdown menu to switch levels between games. Your performance stats are cumulative across all difficulties.

## Game Design

- **Default Difficulty**: Easy (1) - more accessible for new players
- **Initial Reveal**: One section shown at start
- **Progressive Difficulty**: Harder flags require more geographic knowledge
- **Smart Filtering**: Only shows flags matching selected difficulty level
- **Fair Gameplay**: Case-insensitive matching, substring autocomplete

## Development

This project uses no build tools or package managers - just pure vanilla JavaScript. To modify:

1. Edit `script.js` for game logic
2. Edit `style.css` for visual styling
3. Edit `data.csv` to add/modify flags

## License

This project is open source and available under the MIT License.
