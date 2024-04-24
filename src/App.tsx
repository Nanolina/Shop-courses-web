import { useEffect } from 'react';
import HomePage from './pages/HomePage/HomePage';

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <>
      <HomePage />
    </>
  );
}

export default App;
