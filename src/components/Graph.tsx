import React from "react";
import { basicGraph } from "../graphs/basicGraph";
import { v4 as uuidv4 } from "uuid";
import "../css/Graph.css";
import { useRef } from "react";
import { useState } from "react";
import { GraphType, NodeCords, GraphUnitTypes } from "../types";
import { depthFirstSearch } from "../algos/breadthFirstSearch";

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
		throw new Error("The start node coordinate is not valid");
	}
	//setting the finish node
	const [finishXcord, finishYCord] = finishNode;
	if (retGraph[finishXcord][finishYCord].type === GraphUnitTypes.NODE) {
		retGraph[finishXcord][finishYCord].type = GraphUnitTypes.FINISH;
	} else {
		throw new Error("The finish node coordinate is not valid");
	}

	return retGraph;
};

const generateGraphNode = (row: number, col: number) => {
	//if row is even
	if (row % 2 === 0) {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.NODE, visited: false, cords: theCords };
		} else {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.UPDOWNEDGE, visited: false, cords: theCords };
		}
	}
	// if row is odd
	else {
		if (col % 2 === 0) {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.LEFTRIGHTEDGE, visited: false, cords: theCords };
		} else {
			const theCords: NodeCords = [row, col];
			return { type: GraphUnitTypes.EMPTYSPACE, visited: false, cords: theCords };
		}
	}
};

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
										{item.type === GraphUnitTypes.NODE || item.type === GraphUnitTypes.VISITEDNODE
											? item.cords[0] + " " + item.cords[1]
											: null}
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

const visitOneNode = (
	nodeCords: NodeCords,
	Graph: React.MutableRefObject<GraphType>,
	renderBool: boolean,
	rerender: React.Dispatch<React.SetStateAction<boolean>>
) => {
	const [Xcord, Ycord] = nodeCords;
	//Graph.current[Xcord][Ycord] = { type: GraphUnitTypes.VISITEDNODE, visited: true };
	rerender(!renderBool);
};

const Graph = () => {
	// const Graph = useRef(generateGraph([2, 0], [24, 24], 49, 49));
	// const [renderBool, rerender] = useState(true);

	const [Graph, SetGraph] = useState(generateGraph([0, 6], [12, 20], 17, 21));
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className='graph_meta_container'>
			<div style={{ display: "flex" }} className='graph_container'>
				{renderGraph(Graph)}
			</div>
			<button onClick={() => depthFirstSearch(Graph, SetGraph)}>Click</button>
			<button
				onClick={() => {
					SetGraph(generateGraph([0, 6], [12, 20], 17, 21));
				}}
			>
				Reset
			</button>
		</div>
	);
};

export default Graph;
