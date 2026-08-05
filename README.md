# Poke Idle World Tier List & Team Builder

A powerful and intuitive web application designed to help players of **Poke Idle World** optimize their teams and analyze Pokémon statistics. Built with React and Vite, this tool provides real-time ranking, filtering, and team-building features with a modern and responsive user interface.

## 🌟 Features

- **Dynamic Tier List:** View all Pokémon ranked based on their calculated battle performance.
- **Ranking Modes:** 
  - **🔥 Maximum Damage:** Ranks Pokémon purely based on raw DPS potential.
  - **🛡️ Balanced:** Considers defensive stats alongside damage output for a well-rounded ranking.
- **Smart Team Builder:** 
  - Manually select up to 6 Pokémon to form your ultimate team.
  - **✨ Auto-Build Team:** Automatically generate an optimized team based on current filters and rankings.
- **Advanced Filtering & Configuration:**
  - **Type Filters:** Instantly filter Pokémon by their elemental types.
  - **Clan Synergies (Rank 5):** Select your clan (Naturia, Volcanic, Seavell, etc.) to calculate clan-specific buffs.
  - **Detailed Toggles:** Option to include 600+ TMs, consider move Cooldowns, consider Speed stat, and allow/disallow Type Overlaps in auto-builds.
- **Detailed Pokémon Insights:** Click on any Pokémon to open a detailed modal containing its base stats, calculated DPS, types, and more.

## 🚀 Technologies Used

- **React 19**
- **Vite** - For blazing fast builds and hot module replacement.
- **CSS3** - Custom styling utilizing modern techniques like glassmorphism.
- **Vitest & React Testing Library** - For robust unit and component testing.
- **Oxlint** - For fast and reliable code linting.
- **Lucide React** - For beautiful, consistent iconography.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd pokemon-tools
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App Locally

To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/` by default.

## 🧪 Testing and Linting

- **Run Tests:** `npm run test`
- **Run Linter:** `npm run lint`

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
You can preview the built app using:
```bash
npm run preview
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
