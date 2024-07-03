import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
