import { GraphType, GraphUnitTypes, NodeCords } from "../types";
import { TimeoutChangeGraphUnitType, FindNodeType, findAdjancentNodes } from "../functions/GraphFunctions";

const TIMER_BETWEEN_RENDERS = 20;

export const breadthFirstSearch = (Graph: GraphType, SetGraph: React.Dispatch<React.SetStateAction<GraphType>>) => {
	const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
	const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
	//console.log(FinishNode);
	const GraphWidth = Graph.length;
	const GraphHeight = Graph[0].length;

	let queue: NodeCords[] = [];
	queue.push(StartNode.cords);

	//timer to help with calcuation
	let timer = 0;

	while (Graph[FinishNode.cords[0]][FinishNode.cords[1]].queued !== true) {
		//Grabs first node in the list
		const currentNode = queue.shift();
		if (currentNode) {
			const [currentNodeCordX, currentNodeCordY] = currentNode;
			Graph[currentNodeCordX][currentNodeCordY].queued = true;
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
			// timer = TimeoutChangeGraphUnitType(
			// 	Xcord,
			// 	Ycord,
			// 	SetGraph,
			// 	GraphUnitTypes.NODE_IN_QUEUE,
			// 	TIMER_BETWEEN_RENDERS,
			// 	timer
			// );
		});
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
};
