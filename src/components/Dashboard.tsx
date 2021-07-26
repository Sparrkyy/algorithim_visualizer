import React from "react";
import { FC, useRef, useState } from "react";
import OptionsBar from "./OptionsBar";
import GraphComponent, { generateGraph } from "./Graph";
import { NodeCords } from "../types";

const START_NODE_CORDS: NodeCords = [0, 0];
const FINISH_NODE_CORDS: NodeCords = [6, 6];

const Dashboard: FC = () => {
	const startNodeRef = useRef(START_NODE_CORDS);
	const finishNodeRef = useRef(FINISH_NODE_CORDS);
	const [graphHeight, setGraphHeight] = useState(27);
	const [graphWidth, setGraphWidth] = useState(37);
	const [graph, setGraph] = useState(
		generateGraph(startNodeRef.current, finishNodeRef.current, graphHeight, graphWidth)
	);
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
			<GraphComponent graph={graph} setGraph={setGraph} />
			<OptionsBar
				Graph={graph}
				SetGraph={setGraph}
				GRAPH_HEIGHT={graphHeight}
				GRAPH_WIDTH={graphWidth}
				setGraphHeight={setGraphHeight}
				setGraphWidth={setGraphWidth}
			/>
		</div>
	);
};

export default Dashboard;
