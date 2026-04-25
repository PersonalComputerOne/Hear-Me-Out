# Music Player

This is a simple music player application built with React, TypeScript, and Tailwind CSS. The application allows users to select from four different bands and play their respective audio tracks. 

## Features

- **Band Selection**: Users can choose from four bands (Band 1–4) using the BandSelector component.
- **Audio Playback**: The Player component provides play/pause functionality for the selected band's audio track.
- **Responsive Design**: The UI is fully responsive and styled using Tailwind CSS.
- **Animations**: Framer Motion is used for smooth animations throughout the application.
- **Theming**: Each band has a unique gradient theme defined in `bandThemes.ts`.

## Project Structure

```
music-player
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── BandSelector.tsx
│   │   ├── Player.tsx
│   │   └── common
│   │       └── Button.tsx
│   ├── hooks
│   │   └── useAudioPlayer.ts
│   ├── pages
│   │   └── Home.tsx
│   ├── styles
│   │   └── index.css
│   ├── utils
│   │   └── bandThemes.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types
│       └── index.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd music-player
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## Improvements

- Implement a volume control feature in the Player component.
- Add a progress bar to visualize the current playback position.
- Include keyboard shortcuts for play/pause and track navigation.
- Enhance accessibility by adding ARIA attributes to interactive elements.
- Consider adding a playlist feature to allow users to queue multiple tracks.

## License

This project is open-source and available under the MIT License.