import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/Chat';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
