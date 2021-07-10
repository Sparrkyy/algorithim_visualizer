import { GraphType, GraphUnitTypes, NodeCords, GraphUnit } from "../types";

const TIMER_BETWEEN_RENDERS = 10;

export const depthFirstSearch = (Graph: GraphType, SetGraph: React.Dispatch<React.SetStateAction<GraphType>>) => {
	const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
	const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
	console.log(FinishNode);
	const GraphWidth = Graph.length;
	const GraphHeight = Graph[0].length;

	let queue: NodeCords[] = [];
	queue.push(StartNode.cords);

	//timer to help with calcuation
	let timer = 0;

	while (Graph[FinishNode.cords[0]][FinishNode.cords[1]].queued !== true) {
		//Grabs first node in the list
		const currentNode = queue.shift();
		//console.log("this is current node: " + currentNode);

		if (!currentNode) {
			console.log("there was nothing let in the queue");
			break;
		}
		//Gets neighbors and sets all visited to true for them to avoid putting them in the queue twice
		const AllNeighbors = findAdjancentNodes(currentNode, Graph, GraphHeight, GraphWidth);
		AllNeighbors.forEach((item) => {
			queue.push(item);
			const [Xcord, Ycord] = item;
			Graph[Xcord][Ycord].queued = true;
			Graph[Xcord][Ycord].previous = currentNode;
			timer = TimeoutChangeGraphUnitType(
				Xcord,
				Ycord,
				SetGraph,
				GraphUnitTypes.NODE_IN_QUEUE,
				TIMER_BETWEEN_RENDERS,
				timer
			);
		});

		//Chaning the state of a node
		const [Xcord, Ycord] = currentNode;
		timer = TimeoutChangeGraphUnitType(
			Xcord,
			Ycord,
			SetGraph,
			GraphUnitTypes.VISITED_NODE,
			TIMER_BETWEEN_RENDERS,
			timer
		);
	}

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
};

//Finds all the nodes around a single node
const findAdjancentNodes = (Node: NodeCords, Graph: GraphType, Height: number, Width: number) => {
	const TopNodeCords: NodeCords = [Node[0], Node[1] - 2];
	const BottomNodeCords: NodeCords = [Node[0], Node[1] + 2];
	const RightNodeCords: NodeCords = [Node[0] + 2, Node[1]];
	const LeftNodeCords: NodeCords = [Node[0] - 2, Node[1]];

	const AdjancentNodes: NodeCords[] = [];
	//I should make a function for this
	//Graph[TopNodeCords[0]][TopNodeCords[1]].type !== GraphUnitTypes.VISITED_NODE && Graph[TopNodeCords[0]][TopNodeCords[1]].type !== GraphUnitTypes.NODE_IN_QUEUE

	//Graph[TopNodeCords[0]][TopNodeCords[1]].visited === false
	if (TopNodeCords[1] >= 0 && hasNodeNotBeenQueued(Graph, TopNodeCords)) {
		AdjancentNodes.push(TopNodeCords);
	}
	//Graph[BottomNodeCords[0]][BottomNodeCords[1]].visited === false
	if (BottomNodeCords[1] <= Height && hasNodeNotBeenQueued(Graph, BottomNodeCords)) {
		AdjancentNodes.push(BottomNodeCords);
	}
	//Graph[LeftNodeCords[0]][LeftNodeCords[1]].visited === false
	if (LeftNodeCords[0] >= 0 && hasNodeNotBeenQueued(Graph, LeftNodeCords)) {
		AdjancentNodes.push(LeftNodeCords);
	}
	//Graph[RightNodeCords[0]][RightNodeCords[1]].visited === false
	if (RightNodeCords[0] <= Width && hasNodeNotBeenQueued(Graph, RightNodeCords)) {
		AdjancentNodes.push(RightNodeCords);
	}
	return AdjancentNodes;
};

const hasNodeNotBeenQueued = (Graph: GraphType, MarkingNodeCords: NodeCords) => {
	const nodeInQuestion = Graph[MarkingNodeCords[0]][MarkingNodeCords[1]];
	if (!nodeInQuestion.queued) {
		return true;
	}
	return false;
};

// //Returns whether or not a node can be added to the queue
// const isNodeNotVistedOrInQueue = (Graph: GraphType, NodeCords: NodeCords) => {
// 	const nodeInQuestion = Graph[NodeCords[0]][NodeCords[1]];
// 	if (nodeInQuestion.type !== GraphUnitTypes.NODE_IN_QUEUE && nodeInQuestion.type !== GraphUnitTypes.VISITED_NODE)
// 		return true;
// 	return false;
// };

//Returns the first instance of that node type in a graph
const FindNodeType = (Graph: GraphType, TypeToFind: GraphUnitTypes) => {
	let NodeToFind: GraphUnit = { type: GraphUnitTypes.EMPTY_SPACE, visited: false, cords: [0, 0], queued: false };
	Graph.forEach((col) => {
		col.forEach((node) => {
			if (node.type === TypeToFind) {
				NodeToFind = node;
			}
		});
	});
	return NodeToFind;
};

//Changes a Graph Unit type without time, but with a state update
const ChangeGraphUnitType = (
	Xcord: number,
	Ycord: number,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	TypeToChange: GraphUnitTypes
) => {
	SetGraph((prevGraph) => {
		const dup = [...prevGraph];
		dup[Xcord][Ycord].type = TypeToChange;
		return dup;
	});
};

//Changes a Graph Unit WIth a timeout, and returns a incremented timer for slickness
const TimeoutChangeGraphUnitType = (
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
