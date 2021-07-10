import { v4 as uuidv4 } from "uuid";
import "../css/Graph.css";
import { useState } from "react";
import { GraphType, NodeCords, GraphUnitTypes } from "../types";
import { depthFirstSearch } from "../algos/breadthFirstSearch";

const START_NODE_CORDS: NodeCords = [2, 2];
const FINISH_NODE_CORDS: NodeCords = [26, 22];
const GRAPH_HEIGHT: number = 27;
const GRAPH_WIDTH: number = 27;

//Function used to generate the code representation of the graph
const generateGraph = (startNode: NodeCords, finishNode: NodeCords, width: number, height: number) => {
	//intializing the first start of the graph
	const retGraph: GraphType = [];
	for (let i = 0; i < width; i++) {
		retGraph[i] = [];
		for (let j = 0; j < height; j++) {
			retGraph[i][j] = generateGraphNode(i, j);
		}
	}
	//setting the start node
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

	return retGraph;
};

//helper function that generates a node based on a paterrn in order to get the graph / edge ratio that I want in the shape I want
const generateGraphNode = (row: number, col: number) => {
	//if row is even
	if (row % 2 === 0) {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.NODE, queued: false, visited: false, cords: theCords };
		} else {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.UP_DOWN_EDGE, queued: false, visited: false, cords: theCords };
		}
	}
	// if row is odd
	else {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.LEFT_RIGHT_EDGE, queued: false, visited: false, cords: theCords };
		} else {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.EMPTY_SPACE, queued: false, visited: false, cords: theCords };
		}
	}
};

//Generates the react representation from the code representation of the matrix graph
const renderGraph = (graph: GraphType) => {
	return (
		<>
			{" "}
			{graph.map((row) => {
				return (
					<div className='graph-col' key={uuidv4()}>
						{row.map((item) => {
							return (
								<div className='graph-unit' key={uuidv4()}>
									<div className={item.type}>
										{/* {item.type === GraphUnitTypes.NODE || item.type === GraphUnitTypes.VISITED_NODE
											? item.cords[0] + " " + item.cords[1]
											: null} */}
									</div>
								</div>
							);
						})}
					</div>
				);
			})}{" "}
		</>
	);
};

//The actual functional compoenet that renders the graph as a whole with buttons
const Graph = () => {
	const [Graph, SetGraph] = useState(generateGraph(START_NODE_CORDS, FINISH_NODE_CORDS, GRAPH_HEIGHT, GRAPH_WIDTH));
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='graph_meta_container'>
			<div style={{ display: "flex" }} className='graph_container'>
				{renderGraph(Graph)}
			</div>
			<button onClick={() => depthFirstSearch(Graph, SetGraph)}>Click</button>
			<button
				onClick={() => {
					SetGraph(generateGraph(START_NODE_CORDS, FINISH_NODE_CORDS, GRAPH_HEIGHT, GRAPH_WIDTH));
				}}
			>
				Reset
			</button>
		</div>
	);
};

export default Graph;
