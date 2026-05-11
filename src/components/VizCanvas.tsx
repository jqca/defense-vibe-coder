import React from 'react';

export type VizType =
  | 'missile' | 'radar' | 'logistics' | 'crypto' | 'satellite'
  | 'uav' | 'submarine' | 'ew' | 'supplychain' | 'formation'
  | 'mine' | 'debris' | 'cyber' | 'comm' | 'base'
  | 'airport' | 'procurement' | 'pqc' | 'strategy' | 'imaging';

const VIZ_MAP: Record<string, VizType> = {
  'missile': 'missile',
  'trajectory': 'missile',
  'radar': 'radar',
  'logistics-supply': 'logistics',
  'crypto-simulation': 'crypto',
  'satellite-orbit': 'satellite',
  'satellite-imaging': 'imaging',
  'uav': 'uav',
  'submarine': 'submarine',
  'electronic-warfare': 'ew',
  'supply-chain-defense': 'supplychain',
  'fighter-formation': 'formation',
  'mine-detection': 'mine',
  'space-debris': 'debris',
  'cyber-defense': 'cyber',
  'comm-encryption': 'comm',
  'base-placement': 'base',
  'airport-radar': 'airport',
  'defense-procurement': 'procurement',
  'post-quantum': 'pqc',
  'strategy-simulation': 'strategy',
  'fusion-control': 'imaging',
};

export function getVizType(id: string): VizType {
  for (const key of Object.keys(VIZ_MAP)) {
    if (id.includes(key)) return VIZ_MAP[key];
  }
  return 'missile';
}

type VizProps = {
  running: boolean;
  optimized: boolean;
  progress: number;
  optLevel: number;
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
};

const C1 = '#6366F1';
const C2 = '#A5B4FC';
const BG = '#0a1628';
const TX = '#f8f9fa';
const MU = '#8e9aaf';

/* ---- missile: trajectory arcs ---- */
const MissileViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const launchers = [[60, 170], [140, 165], [220, 175]];
  const targets = [[280, 60], [340, 80], [310, 40]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ミサイル弾道最適化</text>
      {launchers.map(([x, y], i) => (
        <g key={`l${i}`} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <rect x={x - 8} y={y - 5} width="16" height="10" rx="2" fill={C1} opacity={optimized ? 0.8 : 0.4}>
            {running && <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
          </rect>
        </g>
      ))}
      {targets.map(([x, y], i) => (
        <circle key={`t${i}`} cx={x} cy={y} r={5} fill="none" stroke={optimized ? '#2dd4bf' : MU} strokeWidth="1.5" opacity={optimized ? 0.8 : 0.3} />
      ))}
      {optimized && launchers.map(([lx, ly], i) => {
        const [tx, ty] = targets[i];
        const mx = (lx + tx) / 2;
        const my = Math.min(ly, ty) - 40 - i * 15;
        return <path key={`a${i}`} d={`M${lx},${ly} Q${mx},${my} ${tx},${ty}`} fill="none" stroke={C2} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />;
      })}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'CEP -67% 命中精度向上' : '弾道計算待機'}</text>
    </g>
  );
};

/* ---- radar: sweep animation ---- */
const RadarViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const blips = [[150, 60], [250, 80], [180, 130], [300, 110], [100, 100]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">レーダー信号処理最適化</text>
      {[1, 2, 3, 4].map(i => (
        <circle key={i} cx="200" cy="120" r={i * 25} fill="none" stroke={MU} strokeWidth="0.5" opacity="0.2" />
      ))}
      <line x1="200" y1="120" x2="200" y2="30" stroke={optimized ? C1 : MU} strokeWidth="1" opacity="0.4">
        {running && <animateTransform attributeName="transform" type="rotate" values="0 200 120;360 200 120" dur="3s" repeatCount="indefinite" />}
      </line>
      {blips.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={optimized ? 5 : 3} fill={optimized ? '#2dd4bf' : C2} opacity={optimized ? 0.8 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'SNR +18dB / 偽陽性 -92%' : 'レーダー待機'}</text>
    </g>
  );
};

/* ---- logistics: supply routes ---- */
const LogisticsViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const depots = [[60, 110], [160, 60], [280, 70], [340, 140], [200, 160]];
  const routes: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 3], [1, 4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">兵站補給ルート最適化</text>
      {routes.map(([a, b], i) => {
        const active = optimized && (i === 0 || i === 2 || i === 4);
        return (
          <line key={i} x1={depots[a][0]} y1={depots[a][1]} x2={depots[b][0]} y2={depots[b][1]}
            stroke={active ? '#2dd4bf' : MU} strokeWidth={active ? 2.5 : 1} opacity={active ? 0.7 : 0.2}>
            {running && <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" repeatCount="indefinite" />}
          </line>
        );
      })}
      {depots.map(([x, y], i) => (
        <rect key={i} x={x - 8} y={y - 8} width="16" height="16" rx="3"
          fill={selectedNode === String(i) ? '#eab308' : C1} opacity="0.8"
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />}
        </rect>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '補給時間 -45% / コスト -33%' : '補給路計算待機'}</text>
    </g>
  );
};

/* ---- crypto: lattice grid ---- */
const CryptoViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 6;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">暗号解読量子シミュレーション</text>
      {Array.from({ length: grid }).flatMap((_, r) =>
        Array.from({ length: grid }).map((_, c) => {
          const idx = r * grid + c;
          const x = 70 + c * 50;
          const y = 40 + r * 28;
          const col = optimized ? (idx % 5 === 0 ? '#2dd4bf' : C1) : MU;
          return (
            <circle key={idx} cx={x} cy={y} r={3} fill={col} opacity={optimized ? 0.7 : 0.2}
              onClick={() => onNodeClick(String(idx))} style={{ cursor: 'pointer' }}>
              {running && <animate attributeName="r" values="2;4;2" dur={`${1.5 + idx * 0.02}s`} repeatCount="indefinite" />}
            </circle>
          );
        })
      )}
      {optimized && <text x="200" y="200" fill="#2dd4bf" fontSize="8" textAnchor="middle">格子基底縮約 完了</text>}
      {!optimized && <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">暗号格子解析待機</text>}
    </g>
  );
};

/* ---- satellite: orbital paths ---- */
const SatelliteViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const orbits = [1, 2, 3];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">衛星軌道最適化</text>
      <circle cx="200" cy="115" r="20" fill={C1} opacity="0.3" />
      <text x="200" y="119" fill={TX} fontSize="8" textAnchor="middle">地球</text>
      {orbits.map(i => (
        <ellipse key={i} cx="200" cy="115" rx={40 + i * 30} ry={20 + i * 12}
          fill="none" stroke={optimized ? C2 : MU} strokeWidth={optimized ? 1.2 : 0.6} opacity={optimized ? 0.5 : 0.2}
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="ry" values={`${18 + i * 10};${22 + i * 14};${18 + i * 10}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />}
        </ellipse>
      ))}
      {optimized && orbits.map(i => (
        <circle key={`s${i}`} cx={200 + (40 + i * 30)} cy="115" r="4" fill="#2dd4bf" opacity="0.9">
          <animateTransform attributeName="transform" type="rotate" values={`0 200 115;360 200 115`} dur={`${4 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'カバレッジ +28% / 燃料 -35%' : '軌道計算待機'}</text>
    </g>
  );
};

/* ---- uav: drone swarm paths ---- */
const UavViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const drones = [[80, 60], [160, 80], [240, 55], [120, 140], [200, 150], [300, 130]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">UAV群制御最適化</text>
      <rect x="50" y="30" width="310" height="150" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2" />
      {optimized && [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]].map(([a, b], i) => (
        <line key={i} x1={drones[a][0]} y1={drones[a][1]} x2={drones[b][0]} y2={drones[b][1]}
          stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
      ))}
      {drones.map(([x, y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <polygon points={`${x},${y - 6} ${x - 7},${y + 4} ${x + 7},${y + 4}`} fill={optimized ? C1 : MU} opacity={optimized ? 0.7 : 0.3}>
            {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />}
          </polygon>
          {optimized && <text x={x} y={y + 16} fill={C2} fontSize="6" textAnchor="middle">{`D${i + 1}`}</text>}
        </g>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'カバレッジ +62% / 衝突回避' : 'ドローン待機'}</text>
    </g>
  );
};

/* ---- submarine: sonar waves ---- */
const SubmarineViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const sub = [80, 120];
  const rings = [1, 2, 3, 4, 5];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">潜水艦探知最適化</text>
      <rect x={sub[0] - 20} y={sub[1] - 6} width="40" height="12" rx="6" fill={C1} opacity="0.6" onClick={() => onNodeClick('0')} style={{ cursor: 'pointer' }} />
      {rings.map(i => (
        <ellipse key={i} cx={sub[0] + i * 25} cy={sub[1]} rx={i * 22} ry={i * 15}
          fill="none" stroke={optimized ? C2 : MU} strokeWidth={optimized ? 1 : 0.6} opacity={optimized ? 0.4 - i * 0.05 : 0.15}>
          {running && <animate attributeName="rx" values={`${i * 20};${i * 25};${i * 20}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />}
        </ellipse>
      ))}
      {optimized && <circle cx="310" cy="100" r="6" fill="#ff4444" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" /></circle>}
      {optimized && <text x="310" y="90" fill="#ff4444" fontSize="7" textAnchor="middle">敵艦</text>}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '探知距離 +40% / 偽陽性 -85%' : 'ソナー待機'}</text>
    </g>
  );
};

/* ---- ew: electronic warfare spectrum ---- */
const EwViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const x = 30 + i * 22;
    const base = optimized ? 80 + Math.sin(i * 0.8) * 30 + (i % 3 === 0 ? -20 : 0) : 110 - Math.cos(i * 0.5) * 15;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">電子戦スペクトル解析</text>
      <line x1="30" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <line x1="30" y1="30" x2="30" y2="180" stroke={MU} strokeWidth="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized ? 2 : 1.2} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />}
      </polyline>
      {optimized && <polyline points={pts.map((p, i) => { const [x] = p.split(','); return `${x},${100 + Math.sin(i * 0.6) * 10}`; }).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />}
      <circle cx="30" cy={110} r="3" fill={C1} onClick={() => onNodeClick('0')} style={{ cursor: 'pointer' }} />
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? 'ジャミング効率 +55%' : '周波数帯域'}</text>
    </g>
  );
};

/* ---- supplychain: defense supply network ---- */
const SupplyChainViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const nodes = [[60, 60], [180, 50], [300, 65], [100, 140], [220, 150], [340, 135]];
  const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">防衛サプライチェーン最適化</text>
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.2 : 0.5} opacity={optimized ? 0.4 : 0.15}>
          {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />}
        </line>
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r={selectedNode === String(i) ? 8 : 5}
            fill={selectedNode === String(i) ? '#eab308' : (optimized ? C1 : C2)} opacity="0.8">
            {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1 + i * 0.15}s`} repeatCount="indefinite" />}
          </circle>
          {optimized && <text x={x} y={y - 10} fill={C1} fontSize="6" textAnchor="middle">{`N${i + 1}`}</text>}
        </g>
      ))}
      <text x="200" y="190" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'リードタイム -38% / 冗長性確保' : 'サプライチェーン待機'}</text>
    </g>
  );
};

/* ---- formation: fighter formation ---- */
const FormationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const fighters = [[200, 60], [140, 100], [260, 100], [100, 140], [200, 140], [300, 140]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">戦闘機編隊最適化</text>
      {optimized && [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5]].map(([a, b], i) => (
        <line key={i} x1={fighters[a][0]} y1={fighters[a][1]} x2={fighters[b][0]} y2={fighters[b][1]}
          stroke={C2} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.4" />
      ))}
      {fighters.map(([x, y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <polygon points={`${x},${y - 8} ${x - 10},${y + 6} ${x},${y + 2} ${x + 10},${y + 6}`}
            fill={optimized ? C1 : MU} opacity={optimized ? 0.7 : 0.3}>
            {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1 + i * 0.15}s`} repeatCount="indefinite" />}
          </polygon>
          {optimized && <text x={x} y={y + 18} fill={C2} fontSize="6" textAnchor="middle">{i === 0 ? 'リーダー' : `W${i}`}</text>}
        </g>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '燃料効率 +22% / 生存性 +45%' : '編隊計算待機'}</text>
    </g>
  );
};

/* ---- mine: mine field detection ---- */
const MineViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const mines = [[90, 70], [170, 90], [260, 60], [120, 150], [220, 140], [310, 120], [150, 110]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">機雷探知AI最適化</text>
      <rect x="50" y="35" width="310" height="145" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2" />
      {mines.map(([x, y], i) => {
        const detected = optimized ? i < 5 : false;
        const col = detected ? '#2dd4bf' : (optimized ? '#ff4444' : MU);
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={optimized ? 10 : 6} fill={col} opacity={optimized ? 0.25 : 0.1}>
              {running && <animate attributeName="r" values="5;12;5" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
            </circle>
            {optimized && <text x={x} y={y + 4} fill={TX} fontSize="7" textAnchor="middle">{detected ? '✓' : '!'}</text>}
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '探知率 98.7% / 誤警報 -90%' : '機雷探査待機'}</text>
    </g>
  );
};

/* ---- debris: space debris tracking ---- */
const DebrisViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const debris = [[100, 50], [180, 70], [280, 55], [130, 120], [250, 130], [320, 90], [80, 160], [200, 155]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">宇宙デブリ追跡最適化</text>
      <circle cx="200" cy="110" r="25" fill={C1} opacity="0.15" />
      {debris.map(([x, y], i) => {
        const col = optimized ? (i < 5 ? '#2dd4bf' : '#ff4444') : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={3} fill={col} opacity={optimized ? 0.8 : 0.3}>
              {running && <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />}
            </circle>
            {optimized && <circle cx={x} cy={y} r="8" fill="none" stroke={col} strokeWidth="0.5" opacity="0.3" />}
          </g>
        );
      })}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '追跡精度 +35% / 衝突回避' : 'デブリ追跡待機'}</text>
    </g>
  );
};

/* ---- cyber: network defense ---- */
const CyberViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 5;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">サイバー防衛最適化</text>
      {Array.from({ length: grid }).flatMap((_, r) =>
        Array.from({ length: grid }).map((_, c) => {
          const idx = r * grid + c;
          const x = 60 + c * 65;
          const y = 35 + r * 34;
          const pass = optimized ? idx % 6 !== 2 : true;
          const col = pass ? '#2dd4bf' : '#ff4444';
          return (
            <rect key={idx} x={x} y={y} width="55" height="28" rx="4"
              fill={optimized ? col : MU} opacity={optimized ? 0.35 : 0.1}
              stroke={optimized ? col : 'none'} strokeWidth="0.8"
              onClick={() => onNodeClick(String(idx))} style={{ cursor: 'pointer' }}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5 + idx * 0.04}s`} repeatCount="indefinite" />}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '脅威検知 完了 / 4件ブロック' : 'ネットワーク監視待機'}</text>
    </g>
  );
};

/* ---- comm: encrypted comm links ---- */
const CommViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const nodes = [[80, 70], [200, 50], [320, 75], [120, 150], [260, 145]];
  const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">量子暗号通信最適化</text>
      {links.map(([a, b], i) => {
        const active = optimized && (i === 0 || i === 2 || i === 4);
        return (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={active ? '#2dd4bf' : MU} strokeWidth={active ? 2 : 0.8} opacity={active ? 0.7 : 0.2}>
            {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite" />}
          </line>
        );
      })}
      {nodes.map(([x, y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r={5} fill={optimized ? C1 : MU} opacity="0.8">
            {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />}
          </circle>
          {optimized && <text x={x} y={y - 10} fill={C2} fontSize="6" textAnchor="middle">{`QKD${i + 1}`}</text>}
        </g>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '量子鍵配送 完了' : '通信リンク待機'}</text>
    </g>
  );
};

/* ---- base: military base placement ---- */
const BaseViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const bases = [
    { x: 80, y: 70, w: 60, h: 45, label: '基地A' },
    { x: 200, y: 55, w: 70, h: 50, label: '基地B' },
    { x: 300, y: 80, w: 55, h: 40, label: '基地C' },
    { x: 140, y: 140, w: 65, h: 45, label: '基地D' },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">基地配置最適化</text>
      {bases.map((b, i) => {
        const col = optimized ? (i < 2 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={col} opacity={optimized ? 0.3 : 0.12} stroke={col} strokeWidth="1">
              {running && <animate attributeName="opacity" values="0.08;0.3;0.08" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />}
            </rect>
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} fill={TX} fontSize="7" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      {optimized && bases.map((b, i) => (
        <circle key={`r${i}`} cx={b.x + b.w / 2} cy={b.y + b.h / 2} r="30" fill="none" stroke={C2} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.3" />
      ))}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'カバー率 95% / コスト -28%' : '配置計算待機'}</text>
    </g>
  );
};

/* ---- airport: airport radar coverage ---- */
const AirportViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const radars = [[100, 100], [200, 80], [300, 110]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">空港レーダー統合最適化</text>
      {radars.map(([x, y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r="40" fill="none" stroke={optimized ? C2 : MU} strokeWidth="1" opacity={optimized ? 0.3 : 0.12}>
            {running && <animate attributeName="r" values="35;45;35" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />}
          </circle>
          <circle cx={x} cy={y} r="6" fill={C1} opacity="0.7" />
          {optimized && <text x={x} y={y + 20} fill="#2dd4bf" fontSize="6" textAnchor="middle">{`R${i + 1}`}</text>}
        </g>
      ))}
      <line x1="50" y1="170" x2="350" y2="170" stroke={MU} strokeWidth="2" opacity="0.3" />
      <text x="200" y="185" fill={MU} fontSize="7">━━ 滑走路 ━━</text>
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '死角 0% / 追跡精度 +32%' : 'レーダー待機'}</text>
    </g>
  );
};

/* ---- procurement: budget allocation ---- */
const ProcurementViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const items = [
    { label: '装備', h: 50 }, { label: '人員', h: 60 }, { label: '研究', h: 35 },
    { label: '維持', h: 40 }, { label: '訓練', h: 25 },
  ];
  let cumY = 30;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">防衛調達最適化</text>
      {items.map((it, i) => {
        const h = optimized ? it.h * 0.82 : it.h;
        const y = cumY;
        cumY += h + 4;
        const col = optimized ? '#2dd4bf' : C1;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x="80" y={y} width={optimized ? 220 : 200} height={h} rx="3" fill={col} opacity={optimized ? 0.5 : 0.25}>
              {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
            </rect>
            <text x="70" y={y + h / 2 + 4} fill={MU} fontSize="7" textAnchor="end">{it.label}</text>
            {optimized && <text x={310} y={y + h / 2 + 4} fill="#2dd4bf" fontSize="7">-18%</text>}
          </g>
        );
      })}
    </g>
  );
};

/* ---- pqc: post-quantum crypto lattice ---- */
const PqcViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const bars = 10;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">耐量子暗号アルゴリズム解析</text>
      {Array.from({ length: bars }).map((_, i) => {
        const x = 45 + i * 32;
        const h = optimized ? 30 + Math.sin(i * 0.7) * 50 + 60 : 40 + i * 8;
        const col = optimized ? (i % 3 === 0 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={x} y={180 - h} width="22" height={h} rx="2" fill={col} opacity={optimized ? 0.5 : 0.2}>
              {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite" />}
            </rect>
          </g>
        );
      })}
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'CRYSTALS-Kyber 安全性確認' : '格子暗号解析待機'}</text>
    </g>
  );
};

/* ---- strategy: wargame grid ---- */
const StrategyViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const units = [
    { x: 80, y: 60, label: '赤軍', col: '#ff4444' },
    { x: 200, y: 80, label: '中立', col: '#eab308' },
    { x: 300, y: 55, label: '青軍', col: C2 },
    { x: 120, y: 140, label: '赤支援', col: '#ff4444' },
    { x: 260, y: 150, label: '青支援', col: C2 },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ウォーゲーム戦略シミュレーション</text>
      <rect x="50" y="35" width="310" height="140" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2" />
      {units.map((u, i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <rect x={u.x - 15} y={u.y - 12} width="30" height="24" rx="4"
            fill={optimized ? u.col : MU} opacity={optimized ? 0.4 : 0.15}
            stroke={optimized ? u.col : MU} strokeWidth="1">
            {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />}
          </rect>
          <text x={u.x} y={u.y + 4} fill={TX} fontSize="6" textAnchor="middle">{u.label}</text>
        </g>
      ))}
      {optimized && <path d="M80,60 L200,80 M200,80 L300,55" fill="none" stroke="#ff4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '勝率 78% / 最適戦略導出' : 'シミュレーション待機'}</text>
    </g>
  );
};

/* ---- imaging: satellite imaging ---- */
const ImagingViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const tiles = Array.from({ length: 16 }, (_, i) => ({
    x: 60 + (i % 4) * 75,
    y: 40 + Math.floor(i / 4) * 38,
    w: 65,
    h: 32,
  }));
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">衛星画像解析最適化</text>
      {tiles.map((t, i) => {
        const col = optimized ? (i % 5 === 0 ? '#ff4444' : (i % 3 === 0 ? '#eab308' : '#2dd4bf')) : MU;
        return (
          <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} rx="3"
            fill={col} opacity={optimized ? 0.3 : 0.08}
            stroke={optimized ? col : 'none'} strokeWidth="0.5"
            onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            {running && <animate attributeName="opacity" values="0.05;0.3;0.05" dur={`${1.5 + i * 0.05}s`} repeatCount="indefinite" />}
          </rect>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '異常検出 3件 / 解析完了' : '画像タイル待機'}</text>
    </g>
  );
};

/* ---- registry & main component ---- */

const VIZ_COMPONENTS: Record<VizType, React.FC<VizProps>> = {
  missile: MissileViz, radar: RadarViz, logistics: LogisticsViz,
  crypto: CryptoViz, satellite: SatelliteViz, uav: UavViz,
  submarine: SubmarineViz, ew: EwViz, supplychain: SupplyChainViz,
  formation: FormationViz, mine: MineViz, debris: DebrisViz,
  cyber: CyberViz, comm: CommViz, base: BaseViz,
  airport: AirportViz, procurement: ProcurementViz, pqc: PqcViz,
  strategy: StrategyViz, imaging: ImagingViz,
};

export default function VizCanvas({
  vizType, running, optimized, progress, optLevel, selectedNode, onNodeClick,
}: VizProps & { vizType: VizType }) {
  const Comp = VIZ_COMPONENTS[vizType];
  return (
    <svg viewBox="0 0 400 220" width="100%" style={{ display: 'block' }}>
      <rect width="400" height="220" fill={BG} rx="8" />
      <Comp running={running} optimized={optimized} progress={progress}
        optLevel={optLevel} selectedNode={selectedNode} onNodeClick={onNodeClick} />
      {running && (
        <g>
          <rect x="10" y="212" width="380" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="10" y="212" width={380 * (progress / 100)} height="4" rx="2" fill={C1} opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
