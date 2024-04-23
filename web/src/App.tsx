import { useEffect } from 'react';
import Button from './components/Button/Button';

const tg = window.Telegram.WebApp;

function App() {
  const onClose = () => tg.close();

  const onToggleButton = () => {
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div>
      <header>Welcome back!</header>
      <Button onClick={onToggleButton}>Закрыть</Button>
    </div>
  );
}

export default App;
