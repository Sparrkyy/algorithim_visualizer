import React from "react";
import { FC, useRef, useState } from "react";
import OptionsBar from "./OptionsBar";
import GraphComponent, { generateGraph } from "./Graph";
import { NodeCords, GraphUnitTypes, graphTypes } from "../types";
import { useEffect } from "react";
import "../css/Dashboard.css";

const START_NODE_CORDS: NodeCords = [0, 0];
const FINISH_NODE_CORDS: NodeCords = [6, 6];

const Dashboard: FC = () => {
	const startNodeRef = useRef(START_NODE_CORDS);
	const finishNodeRef = useRef(FINISH_NODE_CORDS);
	const nodeDiameter = useRef(21);
	const [graphHeight, setGraphHeight] = useState(21);
	const [graphWidth, setGraphWidth] = useState(43);
	const [graph, setGraph] = useState(
		generateGraph(startNodeRef.current, finishNodeRef.current, graphHeight, graphWidth)
	);
	const [graphType, setGraphType] = useState(graphTypes.NORMAL);

	useEffect(() => {
		const graphWidthPixels = 1000;
		nodeDiameter.current = graphWidthPixels / graphWidth;
		setGraph(generateGraph(startNodeRef.current, finishNodeRef.current, graphHeight, graphWidth));
	}, [graphWidth, graphHeight]);

	useEffect(() => {
		switch (graphType) {
			case graphTypes.NORMAL:
				setGraph(generateGraph(startNodeRef.current, finishNodeRef.current, graphHeight, graphWidth));
				break;
			case graphTypes.HOLES:
				setGraph((prev) => {
					const dup = [...prev];
					dup.forEach((row, ix) => {
						row.forEach((node, iy) => {
							if (dup[ix][iy].type === GraphUnitTypes.FINISH) {
							} else if (dup[ix][iy].type === GraphUnitTypes.START) {
							} else if (iy % 6 === 0 && ix % 6 === 0) {
								dup[ix][iy].type = GraphUnitTypes.EMPTY_SPACE;
								if (ix + 1 < dup.length) {
									dup[ix + 1][iy].type = GraphUnitTypes.EMPTY_SPACE;
								}
								if (ix - 1 > 0) {
									dup[ix - 1][iy].type = GraphUnitTypes.EMPTY_SPACE;
								}
								if (iy + 1 < dup[0].length) {
									dup[ix][iy + 1].type = GraphUnitTypes.EMPTY_SPACE;
								}
								if (iy - 1 > 0) {
									dup[ix][iy - 1].type = GraphUnitTypes.EMPTY_SPACE;
								}
							}
						});
					});
					return dup;
				});
				break;
		}
	}, [graphType, graphHeight, graphWidth]);

	return (
		<div className='dashboard_container'>
			<div className='title-container'>
				<img src='/algorithm-visualizer/apple-touch-icon.png' alt='Website Logo' width={50} height={50} />
				<h1>Pathfinding Visualizer</h1>
				<img src='/algorithm-visualizer/apple-touch-icon.png' alt='Website Logo' width={50} height={50} />
			</div>
			<GraphComponent graph={graph} setGraph={setGraph} nodeDiameter={nodeDiameter} />
			<OptionsBar
				Graph={graph}
				SetGraph={setGraph}
				GRAPH_HEIGHT={graphHeight}
				GRAPH_WIDTH={graphWidth}
				setGraphHeight={setGraphHeight}
				setGraphWidth={setGraphWidth}
				setGraphType={setGraphType}
				graphType={graphType}
			/>
		</div>
	);
};

export default Dashboard;
