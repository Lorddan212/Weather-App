# WeatherApp

A modern, production-ready weather application built with React, TypeScript, and Tailwind CSS. Features real-time weather data, 5-day forecasts, geolocation support, and a beautiful responsive UI with dynamic backgrounds.

![WeatherApp Screenshot](https://via.placeholder.com/800x400?text=WeatherApp+Screenshot)

## Features

### Core Features

- **Real-time Weather Data**: Current temperature, conditions, humidity, wind speed, and more
- **5-Day Forecast**: Detailed weather predictions with expandable daily views
- **Geolocation Support**: Automatically detect and display weather for your current location
- **City Search**: Search weather by city name worldwide
- **Search History**: Quick access to recently searched cities

### UI/UX Features

- **Dynamic Backgrounds**: Weather-based animated backgrounds (rain, snow, clouds, clear sky, etc.)
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Beautiful transitions and micro-interactions
- **Loading States**: Skeleton loaders and animated spinners

### Technical Features

- **TypeScript**: Strong typing throughout the application
- **Error Handling**: Graceful error messages with retry functionality
- **Local Storage Persistence**: Remember last searched city and search history
- **Debounced Search**: Optimized search input performance
- **API Error Recovery**: Handles network errors, rate limiting, and invalid inputs

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **API**: OpenWeatherMap
- **Icons**: Lucide React
- **Notifications**: Sonner

## Project Structure

src/
├── components/          # Reusable UI components
│   ├── CurrentWeather.tsx    # Current weather display
│   ├── Forecast.tsx          # 5-day forecast component
│   ├── SearchBar.tsx         # Search input with history
│   ├── Header.tsx            # App header with controls
│   ├── ErrorDisplay.tsx      # Error message component
│   ├── LoadingState.tsx      # Loading skeletons
│   └── WeatherBackground.tsx # Dynamic background
├── hooks/              # Custom React hooks
│   ├── useWeather.ts        # Weather data fetching
│   ├── useGeolocation.ts    # Browser geolocation
│   ├── useLocalStorage.ts   # Local storage management
│   └── useTheme.ts          # Dark/light mode
├── services/           # API services
│   └── weatherApi.ts        # OpenWeatherMap API calls
├── types/              # TypeScript definitions
│   └── weather.ts           # Weather data types
├── utils/              # Utility functions
│   └── weatherUtils.ts      # Weather data transformation
├── App.tsx             # Main application component
├── index.css           # Global styles and animations
└── main.tsx            # Application entry point

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd weatherapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenWeatherMap API key:

   VITE_OPENWEATHER_API_KEY=your_api_key_here

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## API Configuration

### Getting an OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to "API Keys" in your account dashboard
4. Generate a new API key
5. Copy the key to your `.env` file

### API Endpoints Used

- **Current Weather**: `/data/2.5/weather`
- **5-Day Forecast**: `/data/2.5/forecast`
- **Reverse Geocoding**: `/geo/1.0/reverse`

## Customization

### Changing Default City

Edit `src/App.tsx` and modify the default city in the `useEffect` hook:

```typescript
// Default city if no history and no geolocation
fetchByCity('New York');
```

### Adding Custom Animations

Add new animations to `src/index.css` in the `@layer utilities` section:

```css
@keyframes my-animation {
  /* keyframes */
}

.animate-my-animation {
  animation: my-animation 1s ease-in-out infinite;
}
```

### Modifying Color Schemes

Edit the CSS variables in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... */
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Debounced search input (500ms)
- Lazy loading of weather icons
- Optimized re-renders with React hooks
- Local storage caching for preferences
- Request timeouts (10 seconds)

## Error Handling

The application handles various error scenarios:

- **Network errors**: Connection issues, timeouts
- **API errors**: Invalid API key, rate limiting, city not found
- **Geolocation errors**: Permission denied, unavailable
- **Input validation**: Empty city names, invalid characters

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

## Support

For issues and feature requests, please use the GitHub issue tracker.
# Weather-App
