import Intro from '../app/Components/Intro/Intro';

/**
 * In the Next.js App Router, you can export a metadata object
 * to define the page's title, description, and other meta tags.
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
    <main>
      <Intro />
    </main>
  );
}