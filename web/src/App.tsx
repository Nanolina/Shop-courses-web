import { useEffect } from 'react';

const tg = window.Telegram.WebApp;

function App() {
  const onClose = () => tg.close();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div>
      <header>Welcome back!</header>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

export default App;
