import { GraphType, GraphUnit, GraphUnitTypes, NodeCords } from "../types";

//Returns if a node has been queued or not
const hasNodeNotBeenQueued = (Graph: GraphType, MarkingNodeCords: NodeCords) => {
	const nodeInQuestion = Graph[MarkingNodeCords[0]][MarkingNodeCords[1]];
	if (!nodeInQuestion.queued) {
		return true;
	}
	return false;
};

//Finds all the nodes around a single node
export const findAdjancentNodes = (Node: NodeCords, Graph: GraphType, Height: number, Width: number) => {
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
