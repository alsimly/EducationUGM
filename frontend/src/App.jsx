import { useState } from 'react';
import { solveProjectileRendezvous } from '../../engine/physics-engine.js';
import MotionDiagram from './MotionDiagram.jsx';

function App() {
  const [v, setV] = useState(10);
  const [t, setT] = useState(5);
  const [hasil, setHasil] = useState(null);

const handleSubmit = (e) => {
  e.preventDefault();
  const result = solveProjectileRendezvous({ v1: 30, x: 12 });
  setHasil(result);
};

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Physics Engine — GLB</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Kecepatan (v, m/s):
          <input type="number" value={v} onChange={(e) => setV(e.target.value)} />
        </label>
        <br />
        <label>
          Waktu (t, s):
          <input type="number" value={t} onChange={(e) => setT(e.target.value)} />
        </label>
        <br />
        <button type="submit">Hitung</button>
      </form>

      {hasil && <MotionDiagram result={hasil} />}
    </div>
  );
}

export default App;