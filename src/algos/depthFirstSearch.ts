import { GraphType, GraphUnitTypes, NodeCords } from "../types";
import {
	TimeoutChangeGraphUnitType,
	FindNodeType,
	findAdjancentNonQueuedNodes,
	displayShortestPathUsingPreviousNode,
} from "../functions/GraphFunctions";
import React from "react";

const hasNodeNotBeenVisited = (Graph: GraphType, MarkingNodeCords: NodeCords) => {
	const nodeInQuestion = Graph[MarkingNodeCords[0]][MarkingNodeCords[1]];
	if (!nodeInQuestion.visited) {
		return true;
	}
	return false;
};

export const deapthFirstSearch = (
	Graph: GraphType,
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	endingProgramCallback: () => void,
	TIME_TO_DELAY: number
) => {
	const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
	const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
	const GraphWidth = Graph.length;
	const GraphHeight = Graph[0].length;

	let Stack: NodeCords[] = [];
	Stack.push(StartNode.cords);
	let timer = 0;

	while (Stack.length !== 0) {
		const currentNode = Stack.shift();

		if (!currentNode) throw new Error("The stack was empty when that was already checked");

		if (currentNode[0] === FinishNode.cords[0] && currentNode[1] === FinishNode.cords[1]) {
			break;
		}

		timer = TimeoutChangeGraphUnitType(
			currentNode[0],
			currentNode[1],
			SetGraph,
			GraphUnitTypes.VISITED_NODE,
			TIME_TO_DELAY,
			timer,
			true,
			Graph
		);
		const [Xcord, Ycord] = currentNode;
		Graph[Xcord][Ycord].visited = true;
		const neighbors = findAdjancentNonQueuedNodes(currentNode, Graph, GraphHeight, GraphWidth, hasNodeNotBeenVisited);
		neighbors.forEach(([X, Y]) => {
			Stack.unshift([X, Y]);
			Graph[X][Y].queued = true;
			Graph[X][Y].previous = currentNode;
		});
	}

	displayShortestPathUsingPreviousNode(
		timer,
		TIME_TO_DELAY,
		Graph,
		SetGraph,
		FinishNode,
		StartNode,
		endingProgramCallback
	);
};
