import { GraphType, GraphUnit, GraphUnitTypes, NodeCords } from "../types";

//Returns if a node has been queued or not
export const hasNodeNotBeenQueued = (Graph: GraphType, MarkingNodeCords: NodeCords) => {
	const nodeInQuestion = Graph[MarkingNodeCords[0]][MarkingNodeCords[1]];
	if (!nodeInQuestion.queued) {
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
	//I should make a function for this
	//Graph[TopNodeCords[0]][TopNodeCords[1]].type !== GraphUnitTypes.VISITED_NODE && Graph[TopNodeCords[0]][TopNodeCords[1]].type !== GraphUnitTypes.NODE_IN_QUEUE

	//Graph[TopNodeCords[0]][TopNodeCords[1]].visited === false
	if (TopNodeCords[1] >= 0 && callbackCheck(Graph, TopNodeCords)) {
		AdjancentNodes.push(TopNodeCords);
	}
	//Graph[RightNodeCords[0]][RightNodeCords[1]].visited === false
	if (RightNodeCords[0] <= Width && callbackCheck(Graph, RightNodeCords)) {
		AdjancentNodes.push(RightNodeCords);
	}
	//Graph[BottomNodeCords[0]][BottomNodeCords[1]].visited === false
	if (BottomNodeCords[1] <= Height && callbackCheck(Graph, BottomNodeCords)) {
		AdjancentNodes.push(BottomNodeCords);
	}
	//Graph[LeftNodeCords[0]][LeftNodeCords[1]].visited === false
	if (LeftNodeCords[0] >= 0 && callbackCheck(Graph, LeftNodeCords)) {
		AdjancentNodes.push(LeftNodeCords);
	}
	return AdjancentNodes;
};

//Changes a Graph Unit type without time, but with a state update
export const ChangeGraphUnitType = (
	Xcord: number,
	Ycord: number,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	TypeToChange: GraphUnitTypes
) => {
	SetGraph((prevGraph) => {
		const dup = [...prevGraph];
		if (dup[Xcord][Ycord].type !== GraphUnitTypes.START || dup[Xcord][Ycord].type !== GraphUnitTypes.FINISH) {
			dup[Xcord][Ycord].type = TypeToChange;
		} else {
			console.log(dup[Xcord][Ycord].type);
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
	CurrentTime: number
) => {
	setTimeout(function () {
		ChangeGraphUnitType(Xcord, Ycord, SetGraph, TypeToChange);
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
	//displaying the shortest path by following the linked list back

	//intializing the array of node for shortest path
	const shortestPath: NodeCords[] = [];
	const finishNode = Graph[FinishNode.cords[0]][FinishNode.cords[1]];
	shortestPath.push(finishNode.cords);
	//typescript check
	if (!finishNode.previous) {
		throw new Error("The FINISH NODE did not have a previous node");
	}
	let prevNode: NodeCords | undefined = finishNode.previous;
	//Follows the link list back like a linked list
	while (prevNode !== StartNode.cords && prevNode) {
		shortestPath.push(prevNode);
		prevNode = Graph[prevNode[0]][prevNode[1]].previous;
	}
	//Going through the shortest path and calling the render change function for each
	shortestPath.forEach((cordInShortestPath) => {
		const [Xcord, Ycord] = cordInShortestPath;
		timer = TimeoutChangeGraphUnitType(
			Xcord,
			Ycord,
			SetGraph,
			GraphUnitTypes.IN_SHORTEST_PATH_NODE,
			TIMER_BETWEEN_RENDERS,
			timer
		);
	});

	//recoloring the START node
	timer = TimeoutChangeGraphUnitType(
		StartNode.cords[0],
		StartNode.cords[1],
		SetGraph,
		GraphUnitTypes.START,
		TIMER_BETWEEN_RENDERS,
		timer
	);
	//recoloring the FINISH node
	timer = TimeoutChangeGraphUnitType(
		FinishNode.cords[0],
		FinishNode.cords[1],
		SetGraph,
		GraphUnitTypes.FINISH,
		TIMER_BETWEEN_RENDERS,
		timer
	);

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
	//Getting node neighbors
	const neighbors = findAdjancentNonQueuedNodes([Xcord, Ycord], Graph, height, width, () => true);
	//for each neighbor, make the edge empty space
	ChangeGraphUnitType(Xcord, Ycord, SetGraph, GraphUnitTypes.EMPTY_SPACE);
	neighbors.forEach((item) => {
		ChangeGraphUnitType(item[0], item[1], SetGraph, GraphUnitTypes.EMPTY_SPACE);
	});
};
