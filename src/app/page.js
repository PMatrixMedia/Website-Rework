import Intro from "./Components/Intro/Intro";

/**
 * In the Next.js App Router, you can export a metadata object
 * to define the page's title, description, and other meta tags.
 *
 * Tailwind is applied app-wide via `import "./globals.css"` in `app/layout.js`
 * (which pulls in `@import "tailwindcss"`). This route uses Tailwind utilities
 * on the shell below and throughout `Intro`.
 */
export const metadata = {
  title: 'PhaseMatrixMedia',
  description: 'Welcome to PhaseMatrixMedia',
};

/**
 * The main homepage for the Next.js application using the App Router.
 * A file at `app/page.js` becomes the root route of your site.
 */
export default function HomePage() {
  return (
    <main className="min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-(--background) text-(--foreground)">
      <Intro />
    </main>
  );
}
