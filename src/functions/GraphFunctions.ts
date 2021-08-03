import { GraphType, GraphUnit, GraphUnitTypes, NodeCords } from "../types";

//Returns if a node has been queued or not
export const hasNodeNotBeenQueued = (Graph: GraphType, MarkingNodeCords: NodeCords) => {
	const nodeInQuestion = Graph[MarkingNodeCords[0]][MarkingNodeCords[1]];
	if (!nodeInQuestion.queued) {
		return true;
	}
	return false;
};

const nodeIsNotEmptySpace = (Graph: GraphType, MarkingNodeCords: NodeCords) => {
	const [X, Y] = MarkingNodeCords;
	if (Graph[X][Y].type !== GraphUnitTypes.EMPTY_SPACE) {
		return true;
	}
	return false;
};

//Finds all the nodes around a single node
export const findAdjancentNonQueuedNodes = (
	Node: NodeCords,
	Graph: GraphType,
	Height: number,
	Width: number,
	callbackCheck: (Graph: GraphType, MarkingNodeCords: NodeCords) => boolean
) => {
	const TopNodeCords: NodeCords = [Node[0], Node[1] - 2];
	const BottomNodeCords: NodeCords = [Node[0], Node[1] + 2];
	const RightNodeCords: NodeCords = [Node[0] + 2, Node[1]];
	const LeftNodeCords: NodeCords = [Node[0] - 2, Node[1]];

	const AdjancentNodes: NodeCords[] = [];

	if (TopNodeCords[1] >= 0 && callbackCheck(Graph, TopNodeCords) && nodeIsNotEmptySpace(Graph, TopNodeCords)) {
		AdjancentNodes.push(TopNodeCords);
	}
	if (
		RightNodeCords[0] < Graph.length &&
		callbackCheck(Graph, RightNodeCords) &&
		nodeIsNotEmptySpace(Graph, RightNodeCords)
	) {
		AdjancentNodes.push(RightNodeCords);
	}
	if (
		BottomNodeCords[1] < Graph[0].length &&
		callbackCheck(Graph, BottomNodeCords) &&
		nodeIsNotEmptySpace(Graph, BottomNodeCords)
	) {
		AdjancentNodes.push(BottomNodeCords);
	}
	if (LeftNodeCords[0] >= 0 && callbackCheck(Graph, LeftNodeCords) && nodeIsNotEmptySpace(Graph, LeftNodeCords)) {
		AdjancentNodes.push(LeftNodeCords);
	}
	return AdjancentNodes;
};

//Changes a Graph Unit type without time, but with a state update
export const ChangeGraphUnitType = (
	Xcord: number,
	Ycord: number,
	Graph: GraphType,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	TypeToChange: GraphUnitTypes,
	deleteEdges: boolean = false,
	replacePreviousEdge: boolean = false
) => {
	SetGraph((prevGraph) => {
		const dup = [...prevGraph];

		if (dup[Xcord][Ycord].type !== GraphUnitTypes.START || dup[Xcord][Ycord].type !== GraphUnitTypes.FINISH) {
			dup[Xcord][Ycord].type = TypeToChange;
		}
		//for deleting a node and all its edges
		if (deleteEdges) {
			if (Xcord + 1 < Graph.length) {
				dup[Xcord + 1][Ycord].type = GraphUnitTypes.EMPTY_SPACE;
			}
			if (Xcord - 1 >= 0) {
				dup[Xcord - 1][Ycord].type = GraphUnitTypes.EMPTY_SPACE;
			}
			if (Ycord + 1 < Graph[0].length) {
				dup[Xcord][Ycord + 1].type = GraphUnitTypes.EMPTY_SPACE;
			}
			if (Ycord - 1 >= 0) {
				dup[Xcord][Ycord - 1].type = GraphUnitTypes.EMPTY_SPACE;
			}
		}
		//for replacing the edges in the shortest path's path
		const prevNode = dup[Xcord][Ycord].previous;
		if (replacePreviousEdge && prevNode) {
			if (Xcord === prevNode[0]) {
				dup[(Xcord + prevNode[0]) / 2][(Ycord + prevNode[1]) / 2].type = GraphUnitTypes.LEFT_RIGHT_EDGE;
			} else {
				dup[(Xcord + prevNode[0]) / 2][(Ycord + prevNode[1]) / 2].type = GraphUnitTypes.UP_DOWN_EDGE;
			}
		}

		return dup;
	});
};

//Changes a Graph Unit WIth a timeout, and returns a incremented timer for slickness
export const TimeoutChangeGraphUnitType = (
	Xcord: number,
	Ycord: number,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	TypeToChange: GraphUnitTypes,
	MuliplierToDelay: number,
	CurrentTime: number,
	deleteEdges: boolean,
	Graph: GraphType,
	replacePreviousEdge: boolean = false
) => {
	setTimeout(function () {
		ChangeGraphUnitType(Xcord, Ycord, Graph, SetGraph, TypeToChange, deleteEdges, replacePreviousEdge);
	}, CurrentTime * MuliplierToDelay);
	return CurrentTime + 1;
};

//Returns the first instance of that node type in a graph
export const FindNodeType = (Graph: GraphType, TypeToFind: GraphUnitTypes) => {
	let NodeToFind: GraphUnit = {
		type: GraphUnitTypes.EMPTY_SPACE,
		visited: false,
		cords: [0, 0],
		queued: false,
	};
	Graph.forEach((col) => {
		col.forEach((node) => {
			if (node.type === TypeToFind) {
				NodeToFind = node;
			}
		});
	});
	return NodeToFind;
};

const traceBackShortestPath = (Graph: GraphType, FinishNode: GraphUnit, StartNode: GraphUnit) => {
	const shortestPath: NodeCords[] = [];
	let node: NodeCords | undefined = Graph[FinishNode.cords[0]][FinishNode.cords[1]].cords;
	shortestPath.push(node);

	while (node && node !== StartNode.cords) {
		shortestPath.push(node);
		const x: number = node[0];
		const y: number = node[1];
		node = Graph[x][y].previous;
	}

	if (node) {
		shortestPath.push(node);
	}

	return shortestPath;
};

//Displays the shortest path at the end of depth first and bredth first search through essentially tracing back previous nodes
export const displayShortestPathUsingPreviousNode = (
	timer: number,
	TIMER_BETWEEN_RENDERS: number,
	Graph: GraphType,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	FinishNode: GraphUnit,
	StartNode: GraphUnit,
	endingProgramCallback: () => void
) => {
	const shortestPath: NodeCords[] = traceBackShortestPath(Graph, FinishNode, StartNode);
	shortestPath.forEach((cordInShortestPath) => {
		const [Xcord, Ycord] = cordInShortestPath;
		timer = TimeoutChangeGraphUnitType(
			Xcord,
			Ycord,
			SetGraph,
			GraphUnitTypes.IN_SHORTEST_PATH_NODE,
			TIMER_BETWEEN_RENDERS,
			timer,
			false,
			Graph,
			true
		);
	});

	setTimeout(() => {
		endingProgramCallback();
	}, timer * TIMER_BETWEEN_RENDERS);
};

//method that makes a node and all its edges into EMPTY_SPACE
export const makeEmptySpace = (
	Graph: GraphType,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	Xcord: number,
	Ycord: number,
	width: number,
	height: number
) => {
	ChangeGraphUnitType(Xcord, Ycord, Graph, SetGraph, GraphUnitTypes.EMPTY_SPACE, false);
	deleteNodeEdges(Graph, SetGraph, Xcord, Ycord, width, height);
};

export const deleteNodeEdges = (
	Graph: GraphType,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	Xcord: number,
	Ycord: number,
	width: number,
	height: number
) => {
	//Getting node neighbors
	const neighbors = findAdjancentNonQueuedNodes([Xcord, Ycord], Graph, height, width, () => true);
	neighbors.forEach((item) => {
		ChangeGraphUnitType(
			(Xcord + item[0]) / 2,
			(Ycord + item[1]) / 2,
			Graph,
			SetGraph,
			GraphUnitTypes.EMPTY_SPACE,
			false
		);
	});
};
