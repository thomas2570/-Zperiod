import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useAppContext } from '../context/AppContext';

function Nucleus({ protons, neutrons, isDark }) {
  const particles = useMemo(() => {
    const temp = [];
    const pCount = Math.min(protons, 40);
    const nCount = Math.min(neutrons || protons, 40);
    const count = pCount + nCount;
    const radius = Math.pow(count, 0.33) * 0.22;

    let pAdded = 0;
    let nAdded = 0;

    for (let i = 0; i < count; i++) {
      let isProton;
      if (pAdded < pCount && nAdded < nCount) {
        isProton = Math.random() > 0.5;
        if (isProton) pAdded++; else nAdded++;
      } else if (pAdded < pCount) {
        isProton = true; pAdded++;
      } else {
        isProton = false; nAdded++;
      }
      
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = Math.cbrt(Math.random()) * radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      temp.push({ position: [x, y, z], isProton });
    }
    return temp;
  }, [protons, neutrons]);

  return (
    <group>
      {particles.map((p, i) => (
        <Sphere args={[0.18, 16, 16]} position={p.position} key={i}>
          <meshStandardMaterial 
            color={p.isProton ? '#ff3333' : '#64748b'} 
            roughness={0.1}
            metalness={0.2}
          />
        </Sphere>
      ))}
      <pointLight intensity={10} distance={10} color="#ffffff" />
    </group>
  );
}

function OrbitPath({ radius, isDark }) {
  return (
    <Ring args={[radius - 0.015, radius + 0.015, 64]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color={isDark ? "#ffffff" : "#d1d5db"} side={THREE.DoubleSide} transparent opacity={isDark ? 0.15 : 0.3} />
    </Ring>
  );
}

function Electron({ radius, speed, speedOffset, isDark, globalSpeed, playback }) {
  const ref = useRef();
  const timeRef = useRef(speedOffset);
  
  useFrame((state, delta) => {
    if (playback === 'running') {
      timeRef.current += delta * speed * globalSpeed;
    }
    const t = timeRef.current;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    ref.current.position.set(x, 0, z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshBasicMaterial color="#ffff00" />
    </mesh>
  );
}

function AtomScene({ element, isDark, globalSpeed, playback }) {
  const shells = element.shells || [];
  const protons = element.number;
  const neutrons = Math.round((element.atomic_mass || protons * 2)) - protons;
  
  const orbits = useMemo(() => {
    const list = [];
    let currentRadius = 1.8;
    shells.forEach((count) => {
      const electrons = [];
      const speed = (1 / Math.sqrt(currentRadius)) * 1.5;
      for (let i = 0; i < count; i++) {
        electrons.push({
          speed,
          speedOffset: (i * (Math.PI * 2) / count) + (Math.random() * 0.2)
        });
      }
      list.push({ radius: currentRadius, electrons });
      currentRadius += 1.2; 
    });
    return list;
  }, [shells]);

  return (
    <group rotation={[0.4, 0, 0]}>
      <ambientLight intensity={isDark ? 1.2 : 1} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.8 : 1.5} />
      
      <Nucleus protons={protons} neutrons={neutrons} isDark={isDark} />
      
      {orbits.map((orbit, i) => (
        <group key={`orbit-${i}`}>
          <OrbitPath radius={orbit.radius} isDark={isDark} />
          {orbit.electrons.map((e, j) => (
            <Trail
              key={`e-${j}`}
              width={0.2}
              length={4}
              color={new THREE.Color('#ffff00')}
              attenuation={(t) => t * t}
            >
              <Electron 
                radius={orbit.radius} 
                speed={e.speed} 
                speedOffset={e.speedOffset} 
                isDark={isDark}
                globalSpeed={globalSpeed}
                playback={playback}
              />
            </Trail>
          ))}
        </group>
      ))}
    </group>
  );
}

export default function AtomicModel3D({ element }) {
  const { state: globalState } = useAppContext();
  const [isDark, setIsDark] = React.useState(false);
  
  const { playback, speed: globalSpeed } = globalState.settings.animation;

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark-theme'));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!element) return null;
  
  return (
    <div className="w-full h-full relative pointer-events-auto flex items-center justify-center overflow-hidden keep-color" style={{ background: isDark ? '#0a0a0a' : '#fafafa' }}>
      {/* Huge background text using SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <svg viewBox="0 0 100 100" style={{ width: '80%', height: '80%', opacity: isDark ? 0.08 : 0.04 }}>
          <text x="50" y="50" dominantBaseline="central" textAnchor="middle" fontSize="48" fontWeight="900" fontFamily="'Inter', sans-serif" fill={isDark ? "#ffffff" : "#000000"} letterSpacing="-0.05em">
            {element.symbol}
          </text>
        </svg>
      </div>

      <div className="absolute inset-0 z-10 w-full h-full">
        <Canvas camera={{ position: [0, 8, 16], fov: 40 }}>
          <AtomScene 
            element={element} 
            isDark={isDark} 
            globalSpeed={globalSpeed} 
            playback={playback} 
          />
          <OrbitControls 
            enablePan={false} 
            maxDistance={30} 
            minDistance={5} 
            autoRotate={playback === 'running'} 
            autoRotateSpeed={0.5 * globalSpeed} 
          />
        </Canvas>
      </div>
    </div>
  );
}
