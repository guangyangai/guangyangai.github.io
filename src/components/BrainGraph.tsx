import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NODES, EDGES, GROUP_COLORS, type GraphNode } from './graphData';

const SCALE = 1.15;
const nodeById = new Map(NODES.map((n) => [n.id, n]));

function vec(n: GraphNode) {
	return new THREE.Vector3(n.pos[0] * SCALE, n.pos[1] * SCALE, n.pos[2] * SCALE);
}

// ---- Brain-shaped floating point cloud --------------------------------
// Two ellipsoidal hemispheres, surface-biased, with a top sulcus gap so the
// silhouette reads as a brain rather than a generic ball.
function makeBrainPoints(count: number): Float32Array {
	const arr = new Float32Array(count * 3);
	const rx = 4.6, ry = 3.1, rz = 3.7;
	let i = 0;
	while (i < count) {
		// random point in unit sphere, pushed toward the surface
		let x = Math.random() * 2 - 1;
		let y = Math.random() * 2 - 1;
		let z = Math.random() * 2 - 1;
		const len = Math.hypot(x, y, z);
		if (len === 0 || len > 1) continue;
		const shell = 0.72 + Math.random() * 0.28; // hollow-ish
		x = (x / len) * shell;
		y = (y / len) * shell;
		z = (z / len) * shell;

		// two hemispheres: widen along x, carve a central fissure near the top
		const px = x * rx;
		const py = y * ry;
		const pz = z * rz;
		const fissure = Math.exp(-(px * px) / 0.5) * Math.max(0, py); // dip at x~0, upper half
		arr[i * 3] = px + (px > 0 ? 0.5 : -0.5) * 0.4; // nudge lobes apart
		arr[i * 3 + 1] = py - fissure * 0.9 + 0.2;
		arr[i * 3 + 2] = pz;
		i++;
	}
	return arr;
}

function BrainCloud({ reducedMotion }: { reducedMotion: boolean }) {
	const ref = useRef<THREE.Points>(null);
	const positions = useMemo(() => makeBrainPoints(2200), []);
	const geom = useMemo(() => {
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		return g;
	}, [positions]);

	useFrame((state) => {
		if (!ref.current) return;
		if (!reducedMotion) {
			const t = state.clock.elapsedTime;
			// gentle breathing shimmer
			const m = ref.current.material as THREE.PointsMaterial;
			m.opacity = 0.5 + Math.sin(t * 0.8) * 0.12;
		}
	});

	return (
		<points ref={ref} geometry={geom}>
			<pointsMaterial
				color="#6fd8ff"
				size={0.045}
				sizeAttenuation
				transparent
				opacity={0.55}
				depthWrite={false}
				blending={THREE.AdditiveBlending}
			/>
		</points>
	);
}

// ---- Camera zoom controller -------------------------------------------
// Smoothly flies the camera toward a focus point, then (optionally) navigates.
function CameraRig({ focus }: { focus: THREE.Vector3 | null }) {
	const { camera } = useThree();
	const home = useMemo(() => new THREE.Vector3(0, 0, 12), []);
	const target = useRef(new THREE.Vector3(0, 0, 0));
	const desired = useRef(home.clone());

	useEffect(() => {
		if (focus) {
			// stop short of the node so it fills the frame (zoom-in)
			const dir = focus.clone().sub(new THREE.Vector3(0, 0, 0)).normalize();
			desired.current = focus.clone().add(dir.multiplyScalar(3.2));
			target.current = focus.clone();
		} else {
			desired.current = home.clone();
			target.current.set(0, 0, 0);
		}
	}, [focus, home]);

	useFrame(() => {
		camera.position.lerp(desired.current, 0.08);
		camera.lookAt(target.current);
	});
	return null;
}

// ---- Node --------------------------------------------------------------
function Node({
	node,
	hovered,
	setHovered,
	onSelect,
}: {
	node: GraphNode;
	hovered: string | null;
	setHovered: (id: string | null) => void;
	onSelect: (n: GraphNode) => void;
}) {
	const isCore = node.level === 1;
	const color = GROUP_COLORS[node.group];
	const isHover = hovered === node.id;
	const baseR = node.level === 1 ? 0.42 : node.level === 2 ? 0.32 : 0.2;
	const r = (node.size ?? 1) * baseR * (isHover ? 1.35 : 1) / (node.level === 2 ? 1.15 : 1);
	const p = vec(node);

	return (
		<group position={p}>
			<mesh
				onPointerOver={(e: ThreeEvent<PointerEvent>) => {
					e.stopPropagation();
					setHovered(node.id);
					document.body.style.cursor = node.href ? 'pointer' : 'default';
				}}
				onPointerOut={() => {
					setHovered(null);
					document.body.style.cursor = 'default';
				}}
				onClick={(e: ThreeEvent<MouseEvent>) => {
					e.stopPropagation();
					onSelect(node);
				}}
			>
				<sphereGeometry args={[r, 24, 24]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={isHover ? 1.8 : isCore ? 1.15 : 0.75}
					roughness={0.35}
					metalness={0.1}
				/>
			</mesh>
			<mesh>
				<sphereGeometry args={[r * 1.8, 20, 20]} />
				<meshBasicMaterial color={color} transparent opacity={isHover ? 0.2 : 0.08} />
			</mesh>
			{(isHover || isCore || node.level === 2) && (
				<Html center distanceFactor={11} style={{ pointerEvents: 'none' }}>
					<div
						style={{
							whiteSpace: 'nowrap',
							transform: 'translateY(-2.4em)',
							textAlign: 'center',
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',
							color: '#eaf2ff',
							textShadow: '0 1px 8px rgba(0,0,0,0.9)',
						}}
					>
						<div style={{ fontWeight: 700, fontSize: isCore ? '1.05rem' : '0.95rem' }}>
							{node.label}
						</div>
						{node.sub && <div style={{ fontSize: '0.72rem', color: '#9fc0e6' }}>{node.sub}</div>}
					</div>
				</Html>
			)}
		</group>
	);
}

function Edge({ from, to, active }: { from: GraphNode; to: GraphNode; active: boolean }) {
	const points = useMemo(() => [vec(from), vec(to)], [from, to]);
	// color by the child's topic branch; L1->L2 edges are a touch bolder
	const base = GROUP_COLORS[to.group] ?? '#3f6da8';
	const isTrunk = to.level === 2;
	return (
		<Line
			points={points}
			color={active ? '#eaf6ff' : base}
			lineWidth={active ? 2.2 : isTrunk ? 1.4 : 0.8}
			transparent
			opacity={active ? 0.95 : isTrunk ? 0.55 : 0.32}
		/>
	);
}

function Graph({
	reducedMotion,
	selected,
	setSelected,
}: {
	reducedMotion: boolean;
	selected: GraphNode | null;
	setSelected: (n: GraphNode | null) => void;
}) {
	const grp = useRef<THREE.Group>(null);
	const [hovered, setHovered] = useState<string | null>(null);

	useFrame((_, delta) => {
		// pause auto-rotation while a node is focused (zoomed in)
		if (grp.current && !reducedMotion && !selected) {
			grp.current.rotation.y += delta * 0.12;
		}
	});

	const activeEdge = (a: string, b: string) =>
		hovered != null && (hovered === a || hovered === b);

	const handleSelect = (n: GraphNode) => {
		setSelected(n);
		// zoom-in animation runs, then navigate
		if (n.href) {
			window.setTimeout(() => {
				window.location.href = n.href!;
			}, 900);
		}
	};

	return (
		<group ref={grp}>
			<BrainCloud reducedMotion={reducedMotion} />
			{EDGES.map(([a, b], i) => {
				const from = nodeById.get(a)!;
				const to = nodeById.get(b)!;
				return <Edge key={i} from={from} to={to} active={activeEdge(a, b)} />;
			})}
			{NODES.map((n) => (
				<Node
					key={n.id}
					node={n}
					hovered={hovered}
					setHovered={setHovered}
					onSelect={handleSelect}
				/>
			))}
		</group>
	);
}

function webglAvailable() {
	try {
		const c = document.createElement('canvas');
		return !!(
			window.WebGLRenderingContext &&
			(c.getContext('webgl') || c.getContext('experimental-webgl'))
		);
	} catch {
		return false;
	}
}

export default function BrainGraph() {
	const [ok, setOk] = useState<boolean | null>(null);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [selected, setSelected] = useState<GraphNode | null>(null);

	useEffect(() => {
		setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
		setOk(webglAvailable());
	}, []);

	if (ok === null || ok === false) return null;

	const focus = selected ? vec(selected) : null;

	return (
		<div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
			<Canvas
				camera={{ position: [0, 0, 12], fov: 55 }}
				dpr={[1, 2]}
				onPointerMissed={() => setSelected(null)}
			>
				<color attach="background" args={['#070d18']} />
				<fog attach="fog" args={['#070d18', 14, 30]} />
				<ambientLight intensity={0.6} />
				<pointLight position={[10, 10, 10]} intensity={1.1} color="#8fd4ff" />
				<pointLight position={[-10, -6, -8]} intensity={0.6} color="#5ff0d0" />
				<CameraRig focus={focus} />
				<Graph reducedMotion={reducedMotion} selected={selected} setSelected={setSelected} />
			</Canvas>
		</div>
	);
}
