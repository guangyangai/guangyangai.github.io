// Knowledge-graph data for the 3D brain homepage.
// Strict 3-level hierarchy:
//   L1 core  = Guang Yang (the mind)
//   L2 topics = the three topics of interest
//   L3 leaves = concrete work (projects / blog posts / streams) under each topic
// Edges are ONLY parent -> child (hierarchy). No arbitrary cross-links.
// Kept framework-agnostic so both the 3D island and the static SSR fallback can use it.

export type GraphNode = {
	id: string;
	label: string;
	sub?: string;
	href?: string;
	group: 'core' | 'physical' | 'ageval' | 'ai4s';
	level: 1 | 2 | 3;
	parent?: string;
	/** relative position (unit-ish); the component scales/animates these */
	pos: [number, number, number];
	/** visual size weight */
	size?: number;
};

// Color is driven by which topic branch a node belongs to.
export const GROUP_COLORS: Record<GraphNode['group'], string> = {
	core: '#eaf6ff',
	physical: '#38e1ff', // Physical AI — cyan
	ageval: '#5ff0d0', // Agent Evaluation — teal
	ai4s: '#8fb4ff', // AI for Science / UQ — blue
};

// Human-readable summaries for the three topics (used on the homepage text block).
export const TOPICS = [
	{
		id: 'physical',
		label: 'Physical AI',
		summary:
			'Embodied intelligence that has to work in the real world — robot manipulation, sim-to-real, and large-scale simulation data. From LLM-driven grasping to distributed synthetic-data pipelines.',
	},
	{
		id: 'ageval',
		label: 'Agent Evaluation',
		summary:
			'The softest spot in AI agents: why should anyone trust a multi-agent system’s decisions? I bring uncertainty quantification and honest negative results to how we measure agents.',
	},
	{
		id: 'ai4s',
		label: 'AI for Science / UQ',
		summary:
			'The rigor of earth science — uncertainty quantification, simulation, geostatistics — carried into AI. Turning scientific methodology into communicable ideas and sharper models.',
	},
] as const;

export const NODES: GraphNode[] = [
	// ---- L1: core ----
	{ id: 'core', label: 'Guang Yang', sub: '杨光 · mind', group: 'core', level: 1, pos: [0, 0.1, 0], size: 1.7 },

	// ---- L2: topics of interest ----
	{ id: 'physical', label: 'Physical AI', sub: 'embodied, sim-to-real', group: 'physical', level: 2, parent: 'core', pos: [3.0, 1.3, 0.2], size: 1.15 },
	{ id: 'ageval', label: 'Agent Evaluation', sub: 'trust & uncertainty', group: 'ageval', level: 2, parent: 'core', pos: [-0.2, -3.0, 0.4], size: 1.15 },
	{ id: 'ai4s', label: 'AI for Science / UQ', sub: 'rigor → models', group: 'ai4s', level: 2, parent: 'core', pos: [-3.0, 1.6, -0.3], size: 1.15 },

	// ---- L3: concrete work ----
	// Physical AI branch
	{ id: 'dummy', label: 'Dummy V2', sub: 'LLM-agent grasping', href: '/projects', group: 'physical', level: 3, parent: 'physical', pos: [4.6, 2.6, 0.9] },
	{ id: 'isaac', label: 'Isaac Sim SDG', sub: 'distributed sim data', href: '/projects', group: 'physical', level: 3, parent: 'physical', pos: [5.0, 0.6, -0.6] },
	{ id: 'geocord', label: 'GeoCoRD', sub: 'causal multi-agent RL', href: '/projects', group: 'physical', level: 3, parent: 'physical', pos: [4.3, 1.0, 1.8] },

	// Agent Evaluation branch
	{ id: 'geocord-post', label: 'GeoCoRD: an honest negative result', sub: 'blog post', href: '/blog/geocord-honest-negative-result', group: 'ageval', level: 3, parent: 'ageval', pos: [1.6, -4.6, 0.7] },
	{ id: 'blog', label: 'Writing', sub: 'the blog', href: '/blog', group: 'ageval', level: 3, parent: 'ageval', pos: [-1.9, -4.4, -0.5] },

	// AI for Science / UQ branch
	{ id: 'streams', label: 'Streams', sub: 'AI4S/UQ · paper takes', href: '/streams', group: 'ai4s', level: 3, parent: 'ai4s', pos: [-4.9, 2.6, 0.4] },
	{ id: 'cognitive-post', label: 'Your cognitive boundary is the ceiling', sub: 'blog post', href: '/blog/cognitive-boundary-is-the-ceiling', group: 'ai4s', level: 3, parent: 'ai4s', pos: [-4.7, 0.7, -1.1] },
	{ id: 'about', label: 'About / Stanford', sub: 'the longer story', href: '/about', group: 'ai4s', level: 3, parent: 'ai4s', pos: [-4.4, 2.9, -1.6] },
];

// Edges are derived strictly from parent -> child.
export const EDGES: [string, string][] = NODES.filter((n) => n.parent).map(
	(n) => [n.parent!, n.id] as [string, string],
);
