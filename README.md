# Next.js RTL Dashboard Replication

This project is a replication of the dashboard UI from the Abha Chamber of Commerce e-services portal, built with Next.js and TypeScript. It is designed to be fully responsive and supports Right-to-Left (RTL) for Arabic localization.

## Features

- **Next.js 14 App Router**: Utilizes the latest features of Next.js for optimal performance and developer experience.
- **TypeScript**: Ensures type safety and improves code quality.
- **RTL Support**: The layout is designed to work seamlessly with Arabic and other RTL languages.
- **Responsive Design**: A mobile-first approach ensures the dashboard looks great on all devices.
- **Modular Components**: The UI is broken down into reusable components for the Header, Sidebar, and Layout.
- **CSS Modules**: Scoped CSS for styling components without conflicts.
- **React Icons**: Includes a rich set of icons for the UI elements.

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd my-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app/`: Contains the pages and layouts of the application.
- `src/components/`: Reusable React components (Header, Sidebar, etc.).
- `src/styles/`: Global styles and CSS modules for components.
- `public/`: Static assets like images and fonts.

## Deployment

This application is ready to be deployed on any platform that supports Next.js, such as Vercel or Netlify. For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
