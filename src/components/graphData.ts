// Knowledge-graph data for the 3D brain homepage.
// Nodes map to Guang Yang's real assets; edges connect them to the core.
// Kept framework-agnostic so both the 3D island and the static SSR fallback can use it.

export type GraphNode = {
	id: string;
	label: string;
	sub?: string;
	href?: string;
	group: 'core' | 'origin' | 'projects' | 'directions' | 'content' | 'about';
	/** relative position (unit-ish); the component scales/animates these */
	pos: [number, number, number];
	/** visual size weight */
	size?: number;
};

export const GROUP_COLORS: Record<GraphNode['group'], string> = {
	core: '#eaf6ff',
	origin: '#7aa2ff',
	projects: '#38e1ff',
	directions: '#5ff0d0',
	content: '#8fb4ff',
	about: '#9db4d4',
};

export const NODES: GraphNode[] = [
	{ id: 'core', label: 'Guang Yang', sub: '杨光 · mind', group: 'core', pos: [0, 0.2, 0], size: 1.6 },

	// Left hemisphere — Origin (back-left) + Content/Writing (front-left)
	{ id: 'stanford', label: 'Stanford', sub: 'Energy Resources PhD', href: '/about', group: 'origin', pos: [-2.9, 1.5, -1.2] },
	{ id: 'earth', label: 'Earth Science / UQ', sub: 'geostatistics, simulation', href: '/about', group: 'origin', pos: [-3.3, -0.4, -0.2] },
	{ id: 'streams', label: 'Streams', sub: 'AI4S/UQ · paper takes', href: '/streams', group: 'content', pos: [-2.6, 1.0, 1.6] },
	{ id: 'blog', label: 'Writing', sub: 'the blog', href: '/blog', group: 'about', pos: [-2.1, -1.6, 1.3] },
	{ id: 'mas', label: 'Multi-Agent Systems', sub: 'coordination under uncertainty', href: '/blog', group: 'directions', pos: [-1.5, -2.3, -0.6] },

	// Right hemisphere — Projects (back-right) + Physical AI / About (front-right)
	{ id: 'geocord', label: 'GeoCoRD', sub: 'causal multi-agent RL', href: '/projects', group: 'projects', pos: [2.8, 1.5, -1.1] },
	{ id: 'dummy', label: 'Dummy V2', sub: 'LLM-agent grasping', href: '/projects', group: 'projects', pos: [3.3, -0.2, 0.3] },
	{ id: 'isaac', label: 'Isaac Sim SDG', sub: 'distributed sim data', href: '/projects', group: 'projects', pos: [2.5, -1.8, -0.7] },
	{ id: 'ageval', label: 'Agent Evaluation', sub: 'error bars for agents', href: '/blog', group: 'directions', pos: [1.6, 2.3, 1.0] },
	{ id: 'physical', label: 'Physical AI', sub: 'embodied, sim-to-real', href: '/projects', group: 'directions', pos: [2.2, -1.2, 1.5] },
	{ id: 'about', label: 'About', sub: 'the longer story', href: '/about', group: 'about', pos: [0.6, -2.6, 1.2] },
];

// Edges: mostly spokes from the core, plus a few cross-links that reflect real relationships.
export const EDGES: [string, string][] = [
	['core', 'stanford'],
	['core', 'earth'],
	['core', 'geocord'],
	['core', 'dummy'],
	['core', 'isaac'],
	['core', 'ageval'],
	['core', 'physical'],
	['core', 'mas'],
	['core', 'streams'],
	['core', 'blog'],
	['core', 'about'],
	// cross-links (real relationships)
	['earth', 'ageval'],       // UQ rigor -> agent evaluation
	['geocord', 'mas'],        // GeoCoRD is a MAS
	['geocord', 'physical'],   // MARL scheduling under physical constraints
	['dummy', 'physical'],
	['isaac', 'physical'],
	['ageval', 'streams'],     // eval thinking flows into content
	['streams', 'blog'],       // streams graduate into blog posts
];
