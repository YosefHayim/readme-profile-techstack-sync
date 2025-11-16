# 3D Portfolio Website

An immersive, interactive 3D portfolio experience built with Three.js and modern web technologies. This project showcases a stunning 3D user interface with smooth animations, particle effects, and responsive design.

## Features

- **Full 3D Experience**: Interactive 3D scenes for each portfolio section
- **Smooth Animations**: GSAP-powered transitions and camera movements
- **Post-Processing Effects**: Bloom effects for a polished, professional look
- **Performance Optimized**: Following Three.js best practices for optimal performance
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Interactive Objects**: Raycasting for object picking and hover effects
- **Section Navigation**: Smooth transitions between Hero, About, Projects, Skills, and Contact sections

## Technology Stack

- **Three.js** - 3D graphics library
- **GSAP** - Animation library
- **Vite** - Build tool and dev server
- **Modern JavaScript (ES6+)** - Modular architecture
- **CSS3** - Responsive styling with modern features

## Project Structure

```
portfolio-web-3d/
├── src/
│   ├── main.js                    # Main entry point
│   ├── scripts/
│   │   ├── SceneManager.js        # Scene setup and environment
│   │   ├── CameraController.js    # Camera movements and controls
│   │   ├── PortfolioObjects.js    # 3D objects for each section
│   │   └── InteractionManager.js  # User interaction handling
│   ├── utils/
│   │   └── PerformanceMonitor.js  # Performance tracking
│   └── styles/
│       └── main.css               # Styling
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
└── package.json                   # Dependencies

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YosefHayim/portfolio-web-3d.git
cd portfolio-web-3d
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Development Best Practices

### Three.js Optimization

- **Geometry Reuse**: Geometries are created once and reused where possible
- **Material Management**: Proper disposal of materials to prevent memory leaks
- **Texture Optimization**: Limited pixel ratio for performance on high-DPI displays
- **Draw Call Optimization**: Efficient scene graph organization
- **Post-Processing**: Selective use of effects for visual quality without performance impact

### Code Organization

- **Modular Architecture**: Each major component is in its own module
- **Separation of Concerns**: Scene, camera, objects, and interactions are handled separately
- **Event Management**: Proper event listener cleanup on disposal
- **Resource Disposal**: All Three.js resources are properly disposed when no longer needed

### Performance Monitoring

Development mode includes a performance monitor showing:
- FPS (Frames Per Second)
- Frame time in milliseconds
- Memory usage

## Customization

### Updating Content

Edit the HTML sections in `index.html` to customize text content for each section (Hero, About, Projects, Skills, Contact).

### Modifying 3D Scenes

Each section's 3D objects are defined in `src/scripts/PortfolioObjects.js`. Modify the `create*Section()` methods to change the 3D visuals.

### Adjusting Animations

Camera positions and transitions are configured in `src/scripts/CameraController.js`. Modify the `sectionPositions` array to change camera angles.

### Styling

Update colors, fonts, and layout in `src/styles/main.css`. CSS custom properties make it easy to adjust the color scheme.

## Browser Support

- Modern browsers with WebGL support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details
