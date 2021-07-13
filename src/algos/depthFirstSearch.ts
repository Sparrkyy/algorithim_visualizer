import { GraphType, GraphUnitTypes, NodeCords } from "../types";
import { TimeoutChangeGraphUnitType, FindNodeType, findAdjancentNodes } from "../functions/GraphFunctions";

const TIME_TO_DELAY = 20;

export const deapthFirstSearch = (Graph: GraphType, SetGraph: React.Dispatch<React.SetStateAction<GraphType>>) => {
	const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
	const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
	const GraphWidth = Graph.length;
	const GraphHeight = Graph[0].length;

	//intialize the stack
	let Stack: NodeCords[] = [];
	Stack.push(StartNode.cords);

	//timer to help with calcuation
	let timer = 0;

	//while the stack isnt empty
	while (Stack.length !== 0) {
		const currentNode = Stack.shift();

		if (!currentNode) throw new Error("The stack was empty when that was already checked");
		TimeoutChangeGraphUnitType(
			currentNode[0],
			currentNode[1],
			SetGraph,
			GraphUnitTypes.VISITED_NODE,
			TIME_TO_DELAY,
			timer
		);
		const neighbors = findAdjancentNodes(currentNode, Graph, GraphHeight, GraphWidth);
		neighbors.forEach(([X, Y]) => {
			Stack.unshift([X, Y]);
			Graph[X][Y].queued = true;
			Graph[X][Y].previous = currentNode;
		});
		if (neighbors.filter(([X, Y]) => Graph[X][Y].type === GraphUnitTypes.FINISH).length > 0) {
			break;
		}
	}

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
			TIME_TO_DELAY,
			timer
		);
	});

	//recoloring the START node
	timer = TimeoutChangeGraphUnitType(
		StartNode.cords[0],
		StartNode.cords[1],
		SetGraph,
		GraphUnitTypes.START,
		TIME_TO_DELAY,
		timer
	);
	//recoloring the FINISH node
	timer = TimeoutChangeGraphUnitType(
		FinishNode.cords[0],
		FinishNode.cords[1],
		SetGraph,
		GraphUnitTypes.FINISH,
		TIME_TO_DELAY,
		timer
	);
};
