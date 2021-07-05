import { GraphType, GraphUnitTypes, NodeCords, GraphUnit } from "../types";

export const depthFirstSearch = (Graph: GraphType, SetGraph: React.Dispatch<React.SetStateAction<GraphType>>) => {
	let timer = 1;
	Graph.forEach((col) => {
		col.forEach((node) => {
			if (node.type === GraphUnitTypes.NODE) {
				setTimeout(() => {
					SetGraph((prevGraph) => {
						const dup = [...prevGraph];
						const [X, Y] = node.cords;
						dup[X][Y].type = GraphUnitTypes.VISITEDNODE;
						return dup;
					});
				}, timer * 10);
			}
			timer = timer + 1;
		});
	});
};

const DelayedNodeVisiting = (
	GraphUnit: GraphUnit,
	renderBool: boolean,
	rerender: React.Dispatch<React.SetStateAction<boolean>>,
	timeout: number
) => {
	setTimeout(() => {
		GraphUnit.type = GraphUnitTypes.VISITEDNODE;
		rerender(!renderBool);
		console.log("node changed");
	}, timeout);
};

const visitOneNode = (
	nodeCords: NodeCords,
	Graph: React.MutableRefObject<GraphType>,
	renderBool: boolean,
	rerender: React.Dispatch<React.SetStateAction<boolean>>
) => {
	const [Xcord, Ycord] = nodeCords;
	Graph.current[Xcord][Ycord] = { type: GraphUnitTypes.VISITEDNODE, visited: true, cords: nodeCords };
	rerender(!renderBool);
};
