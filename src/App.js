import React from 'react';
import Waves from './Waves';

function App() {
  return (
    <div className="App" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Waves as full-screen background (inline styles ensure it fills parent) */}
      <Waves
        lineColor="#fff"
        backgroundColor="#071028" // ← make background dark so white lines show
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        className=""
      />

      {/* App content above the Waves */}
      <div style={{ position: 'relative', zIndex: 1, color: '#fff', padding: 24 }}>
        <h1>App content</h1>
        <p>Waves should appear behind this content.</p>
      </div>
    </div>
  );
}

export default App;