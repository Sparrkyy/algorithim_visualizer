import "../css/Graph.css";
import { FC } from "react";
import { GraphType, NodeCords, GraphUnitTypes } from "../types";
import GraphNode from "./GraphNode";

//Function used to generate the code representation of the graph
export const generateGraph = (startNode: NodeCords, finishNode: NodeCords, width: number, height: number) => {
	//intializing the first start of the graph
	const retGraph: GraphType = [];
	for (let i = 0; i < width; i++) {
		retGraph[i] = [];
		for (let j = 0; j < height; j++) {
			retGraph[i][j] = generateGraphNode(i, j);
		}
	}
	try {
		const [startXcord, startYCord] = startNode;
		if (retGraph[startXcord][startYCord].type === GraphUnitTypes.NODE) {
			retGraph[startXcord][startYCord].type = GraphUnitTypes.START;
		} else {
			throw new Error("The start node coordinate is not a valid node");
		}
		//setting the finish node
		const [finishXcord, finishYCord] = finishNode;
		if (retGraph[finishXcord][finishYCord].type === GraphUnitTypes.NODE) {
			retGraph[finishXcord][finishYCord].type = GraphUnitTypes.FINISH;
		} else {
			throw new Error("The finish node coordinate is not a valid node");
		}
	} catch (e) {
		retGraph[0][0].type = GraphUnitTypes.START;
		retGraph[0][2].type = GraphUnitTypes.FINISH;
	}
	//setting the start node
	return retGraph;
};

//helper function that generates a node based on a paterrn in order to get the graph / edge ratio that I want in the shape I want
const generateGraphNode = (row: number, col: number) => {
	//if row is even
	if (row % 2 === 0) {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return {
				type: GraphUnitTypes.NODE,
				queued: false,
				visited: false,
				cords: theCords,
			};
		} else {
			const theCords: NodeCords = [row, col];
			return {
				type: GraphUnitTypes.LEFT_RIGHT_EDGE,
				queued: false,
				visited: false,
				cords: theCords,
			};
		}
	}
	// if row is odd
	else {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return {
				type: GraphUnitTypes.UP_DOWN_EDGE,
				queued: false,
				visited: false,
				cords: theCords,
			};
		} else {
			const theCords: NodeCords = [row, col];
			return {
				type: GraphUnitTypes.EMPTY_SPACE,
				queued: false,
				visited: false,
				cords: theCords,
			};
		}
	}
};

//Generates the react representation from the code representation of the matrix graph
const renderGraph = (
	graph: GraphType,
	setGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	nodeDiameter: number
) => {
	return (
		<>
			{" "}
			{graph.map((row, i) => {
				return (
					<div className='graph-col' key={i}>
						{row.map((item, j) => {
							return (
								<GraphNode
									GraphNode={item}
									setGraph={setGraph}
									Graph={graph}
									key={i + 37 * j}
									nodeDiameter={nodeDiameter}
								/>
							);
						})}
					</div>
				);
			})}{" "}
		</>
	);
};
interface GraphComponentContent {
	graph: GraphType;
	setGraph: React.Dispatch<React.SetStateAction<GraphType>>;
	nodeDiameter: React.MutableRefObject<number>;
}

const GraphComponent: FC<GraphComponentContent> = ({ graph, setGraph, nodeDiameter }) => {
	return (
		<div className='graph_meta_container'>
			<div className='graph_container'>{renderGraph(graph, setGraph, nodeDiameter.current)}</div>
		</div>
	);
};

export default GraphComponent;
