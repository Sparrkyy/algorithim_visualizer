import { GraphType, GraphUnitTypes, NodeCords, GraphUnit } from "../types";

export const depthFirstSearch = (Graph: GraphType, SetGraph: React.Dispatch<React.SetStateAction<GraphType>>) => {
	const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
	const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
	console.log(FinishNode);
	const GraphWidth = Graph.length;
	const GraphHeight = Graph[0].length;

	let queue: NodeCords[] = [];
	queue.push(StartNode.cords);
	let timer = 0;

	do {
		//Grabs first node in the list
		const currentNode = queue.shift();
		//console.log("this is current node: " + currentNode);

		if (!currentNode) {
			console.log("there was nothing let in the queue");
			break;
		}
		//Gets neighbors and sets all visited to true for them to avoid putting them in the queue twice
		const AllNeighbors = FindAdjancentNodes(currentNode, Graph, GraphHeight, GraphWidth);
		AllNeighbors.forEach((item) => {
			queue.push(item);
			const [X, Y] = item;
			Graph[X][Y].visited = true;
		});

		//Changing the actual state of the nodes
		setTimeout(function () {
			console.log("Timeout");
			SetGraph((prevGraph) => {
				const dup = [...prevGraph];
				const [X, Y] = currentNode;
				dup[X][Y].type = GraphUnitTypes.VISITEDNODE;
				return dup;
			});
		}, timer * 40);
		timer = timer + 1;
	} while (Graph[FinishNode.cords[0]][FinishNode.cords[1]].visited !== true);

	console.log(FinishNode);
	// for (let i = 0; i < 5; i++) {
	// 	const Neighbors = FindAdjancentNodes(currentNode, Graph, GraphHeight, GraphWidth);
	// 	queue = [...queue, ...Neighbors];
	// 	console.log(queue);

	// 	//console.log("Coloring this node: " + currentNode);

	// 	SetGraph((prev) => {
	// 		prev[currentNode[0]][currentNode[1]].type = GraphUnitTypes.VISITEDNODE;
	// 		return [...prev];
	// 	});
	// 	// SetGraph((prevGraph) => {
	// 	// 	const dup = [...prevGraph];
	// 	// 	const [X, Y] = currentNode;
	// 	// 	dup[X][Y].type = GraphUnitTypes.VISITEDNODE;
	// 	// 	return dup;
	// 	// });

	//     const nextCurrentNote = queue.shift();
	// 	console.log(nextCurrentNote);

	// 	if (!nextCurrentNote) {
	// 		break;
	// 	} else {
	// 		currentNode = nextCurrentNote;
	// 	}
	// }

	// console.log(queue);

	// while (currentNode[0] !== FinishNode.cords[0] && currentNode[1] !== FinishNode.cords[1]) {
	// 	// if (currentNode.type === GraphUnitTypes.EMPTYSPACE){
	// 	//     throw new Error("Somehow wasn't about to find node through FindNodeType()")
	// 	// }
	// 	// SetGraph((prevGraph) => {
	// 	// 	const dup = [...prevGraph];
	// 	// 	const [X, Y] = currentNode;
	// 	// 	dup[X][Y].type = GraphUnitTypes.VISITEDNODE;
	// 	// 	return dup;
	// 	// });
	// 	const AdjancentNodes = FindAdjancentNodes(currentNode, Graph, GraphHeight, GraphWidth);
	// 	queue = [...queue, ...AdjancentNodes];
	// 	const nextCurrentNote = queue.shift();
	// 	if (!nextCurrentNote) {
	// 		break;
	// 	} else {
	// 		currentNode = nextCurrentNote;
	// 	}
	// }

	// let timer = 1;
	// Graph.forEach((col) => {
	// 	col.forEach((node) => {
	// 		if (node.type === GraphUnitTypes.NODE) {
	// 			setTimeout(() => {
	// 				SetGraph((prevGraph) => {
	// 					const dup = [...prevGraph];
	// 					const [X, Y] = node.cords;
	// 					dup[X][Y].type = GraphUnitTypes.VISITEDNODE;
	// 					return dup;
	// 				});
	// 			}, timer * 10);
	// 		}
	// 		timer = timer + 1;
	// 	});
	// });
};

const FindAdjancentNodes = (Node: NodeCords, Graph: GraphType, Height: number, Width: number) => {
	const TopNodeCords: NodeCords = [Node[0], Node[1] - 2];
	const BottomNodeCords: NodeCords = [Node[0], Node[1] + 2];
	const RightNodeCords: NodeCords = [Node[0] + 2, Node[1]];
	const LeftNodeCords: NodeCords = [Node[0] - 2, Node[1]];

	const AdjancentNodes: NodeCords[] = [];

	if (TopNodeCords[1] >= 0 && Graph[TopNodeCords[0]][TopNodeCords[1]].visited === false) {
		AdjancentNodes.push(TopNodeCords);
	}
	if (BottomNodeCords[1] <= Height && Graph[BottomNodeCords[0]][BottomNodeCords[1]].visited === false) {
		AdjancentNodes.push(BottomNodeCords);
	}
	if (LeftNodeCords[0] >= 0 && Graph[LeftNodeCords[0]][LeftNodeCords[1]].visited === false) {
		AdjancentNodes.push(LeftNodeCords);
	}
	if (RightNodeCords[0] <= Width && Graph[RightNodeCords[0]][RightNodeCords[1]].visited === false) {
		AdjancentNodes.push(RightNodeCords);
	}
	return AdjancentNodes;
};

const FindNodeType = (Graph: GraphType, TypeToFind: GraphUnitTypes) => {
	let NodeToFind: GraphUnit = { type: GraphUnitTypes.EMPTYSPACE, visited: false, cords: [0, 0] };
	Graph.forEach((col) => {
		col.forEach((node) => {
			if (node.type === TypeToFind) {
				NodeToFind = node;
			}
		});
	});
	return NodeToFind;
};

// const DelayedNodeVisiting = (
// 	GraphUnit: GraphUnit,
// 	renderBool: boolean,
// 	rerender: React.Dispatch<React.SetStateAction<boolean>>,
// 	timeout: number
// ) => {
// 	setTimeout(() => {
// 		GraphUnit.type = GraphUnitTypes.VISITEDNODE;
// 		rerender(!renderBool);
// 		console.log("node changed");
// 	}, timeout);
// };

// const visitOneNode = (
// 	nodeCords: NodeCords,
// 	Graph: React.MutableRefObject<GraphType>,
// 	renderBool: boolean,
// 	rerender: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
// 	const [Xcord, Ycord] = nodeCords;
// 	Graph.current[Xcord][Ycord] = { type: GraphUnitTypes.VISITEDNODE, visited: true, cords: nodeCords };
// 	rerender(!renderBool);
// };
