# Live Unit Converter

![Live Unit Converter UI](./public/unit-converter.png)

A standalone, beginner-friendly React application for real-time live unit conversions. It features a clean, minimalist dark-mode UI that perfectly matches the Text Cipher design system, performing all calculations locally in your browser instantly.

## Features

- **Interactive UI:** A modern, responsive design built with Tailwind CSS.
- **Client-Side Processing:** All conversion mathematics happen in your browser with zero latency and no external server requests.
- **Supported Categories:**
  - **Temperature:** Celsius, Fahrenheit, and Kelvin.
  - **Weight:** Kilograms, Pounds, and Ounces.
  - **Length:** Meters, Feet, Inches, and Kilometers.
- **Symmetric Two-Way Sync:** Modify either input or output value, and the counterpart updates in real time.
- **Unit Swapping:** Easily swap units and values back and forth with a single button click.
- **Clipboard Integration:** Instantly copy input or output values to your clipboard.

## Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository (or download the source code):
   ```bash
   git clone https://github.com/Reva2473/Unit-Converter-utility.git
   ```

2. Navigate into the project directory:
   ```bash
   cd Unit-Converter-utility
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` by default.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The bundled files will be generated in the `dist` folder.

## License

This project is open-source and available for educational purposes.
