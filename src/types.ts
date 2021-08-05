export type NodeCords = [row: number, col: number];

export enum graphTypes {
	NORMAL = "Normal",
	HOLES = "Holes",
	HORIZONTAL_DIVIDE = "Horizontal Divide",
}

export enum GraphUnitTypes {
	START = "start-node",
	FINISH = "finish-node",
	NODE = "normal-node",
	NODE_IN_QUEUE = "node-in-queue",
	LEFT_RIGHT_EDGE = "left-right-edge",
	UP_DOWN_EDGE = "up-down-edge",
	EMPTY_SPACE = "empty-space",
	VISITED_NODE = "visited-node",
	IN_SHORTEST_PATH_NODE = "shortest-path-node",
}

export type GraphUnit = {
	type: GraphUnitTypes;
	visited: boolean;
	queued: boolean;
	cords: NodeCords;
	previous?: NodeCords;
};

export type GraphType = GraphUnit[][];

export enum AlgoTypes {
	DFS = "Depth First Search",
	BFS = "Breadth First Search",
}
