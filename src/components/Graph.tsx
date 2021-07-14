//import { v4 as uuidv4 } from "uuid";
import "../css/Graph.css";
import { useState } from "react";
import { GraphType, NodeCords, GraphUnitTypes } from "../types";
import { breadthFirstSearch } from "../algos/breadthFirstSearch";
import { deapthFirstSearch } from "../algos/depthFirstSearch";
import { FindNodeType } from "../functions/GraphFunctions";
import { useRef } from "react";
import GraphNode from "./GraphNode";

const START_NODE_CORDS: NodeCords = [6, 6];
const FINISH_NODE_CORDS: NodeCords = [20, 34];
const GRAPH_HEIGHT: number = 23;
const GRAPH_WIDTH: number = 51;

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
			return { type: GraphUnitTypes.LEFT_RIGHT_EDGE, queued: false, visited: false, cords: theCords };
		}
	}
	// if row is odd
	else {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.UP_DOWN_EDGE, queued: false, visited: false, cords: theCords };
		} else {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.EMPTY_SPACE, queued: false, visited: false, cords: theCords };
		}
	}
};

//Generates the react representation from the code representation of the matrix graph
const renderGraph = (graph: GraphType, setGraph: React.Dispatch<React.SetStateAction<GraphType>>) => {
	return (
		<>
			{" "}
			{graph.map((row, i) => {
				return (
					<div className='graph-col' key={i}>
						{row.map((item, j) => {
							return <GraphNode GraphNode={item} setGraph={setGraph} Graph={graph} key={i + j} />;
						})}
					</div>
				);
			})}{" "}
		</>
	);
};

//The actual functional compoenet that renders the graph as a whole with buttons
const Graph = () => {
	const startNodeRef = useRef(START_NODE_CORDS);
	const finishNodeRef = useRef(FINISH_NODE_CORDS);
	const [Graph, SetGraph] = useState(
		generateGraph(startNodeRef.current, finishNodeRef.current, GRAPH_HEIGHT, GRAPH_WIDTH)
	);

	return (
		<div
			style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
			className='graph_meta_container'
		>
			<div style={{}} className='graph_container'>
				{renderGraph(Graph, SetGraph)}
			</div>

			<button
				onClick={() => {
					breadthFirstSearch(Graph, SetGraph);
				}}
			>
				Breadth First Search
			</button>
			<button
				onClick={() => {
					deapthFirstSearch(Graph, SetGraph);
				}}
			>
				Depth First Search
			</button>

			<button
				onClick={() => {
					const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
					const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
					SetGraph(generateGraph(StartNode.cords, FinishNode.cords, GRAPH_HEIGHT, GRAPH_WIDTH));
				}}
			>
				Reset
			</button>
		</div>
	);
};

export default Graph;
