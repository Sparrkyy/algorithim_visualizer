import React, { FC, useState } from "react";
import { breadthFirstSearch } from "../algos/breadthFirstSearch";
import { deapthFirstSearch } from "../algos/depthFirstSearch";
import { GraphType, GraphUnit, GraphUnitTypes, AlgoTypes, graphTypes } from "../types";
import { FindNodeType } from "../functions/GraphFunctions";
import { generateGraph } from "../components/Graph";
import "../css/OptionsBar.css";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { useEffect } from "react";

interface OptionsBarContent {
	Graph: GraphUnit[][];
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>;
	GRAPH_HEIGHT: number;
	GRAPH_WIDTH: number;
	setGraphHeight: React.Dispatch<React.SetStateAction<number>>;
	setGraphWidth: React.Dispatch<React.SetStateAction<number>>;
	setGraphType: React.Dispatch<React.SetStateAction<graphTypes>>;
	graphType: graphTypes;
}

const runAlgorithim = (
	algoToRun: AlgoTypes,
	Graph: GraphUnit[][],
	setGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	GRAPH_HEIGHT: number,
	GRAPH_WIDTH: number,
	endingProgramCallback: () => void,
	DELAY_TIME: number
) => {
	//resetTheGraph(Graph, setGraph, GRAPH_HEIGHT, GRAPH_WIDTH);
	switch (algoToRun) {
		case AlgoTypes.BFS:
			breadthFirstSearch(Graph, setGraph, endingProgramCallback, DELAY_TIME);
			break;
		case AlgoTypes.DFS:
			deapthFirstSearch(Graph, setGraph, endingProgramCallback, DELAY_TIME);
			break;
	}
};

const resetTheGraph = (
	Graph: GraphUnit[][],
	SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
	GRAPH_HEIGHT: number,
	GRAPH_WIDTH: number,
	setGraphWidth: React.Dispatch<React.SetStateAction<number>>
) => {
	const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
	const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
	SetGraph(generateGraph(StartNode.cords, FinishNode.cords, GRAPH_HEIGHT, GRAPH_WIDTH));
	const dup = GRAPH_WIDTH;
	setGraphWidth(dup);
};

const OptionsBar: FC<OptionsBarContent> = ({
	Graph,
	SetGraph,
	GRAPH_HEIGHT,
	GRAPH_WIDTH,
	setGraphHeight,
	setGraphWidth,
	setGraphType,
	graphType,
}) => {
	const [currentAlgo, setCurrentAlgo] = useState(AlgoTypes.BFS);
	const [DELAY_TIME, setDelayTime] = useState(60);
	const [isAlgoRunning, setIsAlgoRunning] = useState(false);
	const [graphSize, setGraphSize] = useState(21);

	useEffect(() => {
		setGraphHeight(graphSize as number);
		setGraphWidth((graphSize as number) * 2 + 1);
	});

	const setAlgoRunningToFalse = () => {
		setIsAlgoRunning(false);
	};

	return (
		<div className='tool-bar'>
			<FormControl style={{ width: "180px" }}>
				<InputLabel>Graph Size</InputLabel>
				<Select
					labelId='graph-selector-helper-label'
					id='graph-selector-helper'
					value={graphSize}
					onChange={(e) => {
						setGraphSize(e.target.value as number);
						setGraphHeight(e.target.value as number);
						setGraphWidth((e.target.value as number) * 2 + 1);
					}}
				>
					<MenuItem value={3}>Very Small</MenuItem>
					<MenuItem value={11}>Small</MenuItem>
					<MenuItem value={21}>Medium</MenuItem>
					<MenuItem value={27}>Large</MenuItem>
					<MenuItem value={37}>Extra Large</MenuItem>
					<MenuItem value={57}>Extra Extra Large</MenuItem>
				</Select>
				<FormHelperText>The amount of nodes</FormHelperText>
			</FormControl>
			<FormControl style={{ width: "180px" }}>
				<InputLabel>Algorithim Type</InputLabel>
				<Select
					labelId='algorithim-selector-helper-label'
					id='algorithim-selector-helper'
					value={currentAlgo}
					onChange={(e) => {
						setCurrentAlgo(e.target.value as AlgoTypes);
					}}
				>
					{Object.entries(AlgoTypes).map((item) => {
						return (
							<MenuItem value={item[1]} key={item[1]}>
								{item[1]}
							</MenuItem>
						);
					})}
				</Select>
				<FormHelperText>The Algorithim to run</FormHelperText>
			</FormControl>
			<FormControl style={{ width: "180px" }}>
				<InputLabel>Algorithim Speed</InputLabel>
				<Select
					labelId='algorithim-speed-selector-helper-label'
					id='algorithim-speed-selector-helper'
					value={DELAY_TIME}
					onChange={(e) => {
						setDelayTime(e.target.value as number);
					}}
				>
					<MenuItem value={300}>Slow</MenuItem>
					<MenuItem value={60}>Medium</MenuItem>
					<MenuItem value={20}>Fast</MenuItem>
				</Select>
				<FormHelperText>The speed it runs</FormHelperText>
			</FormControl>
			<FormControl style={{ width: "180px" }}>
				<InputLabel>Graph Type</InputLabel>
				<Select
					labelId='graph-selector-helper-label'
					id='graph-selector-helper'
					value={graphType}
					onChange={(e) => {
						setGraphType(e.target.value as graphTypes);
					}}
				>
					{Object.entries(graphTypes).map((item) => {
						return <MenuItem value={item[1]}>{item[1]}</MenuItem>;
					})}
				</Select>
				<FormHelperText>The amount of nodes</FormHelperText>
			</FormControl>
			<Button
				variant='contained'
				color='primary'
				disabled={isAlgoRunning}
				onClick={() => {
					if (!isAlgoRunning) {
						runAlgorithim(currentAlgo, Graph, SetGraph, GRAPH_HEIGHT, GRAPH_WIDTH, setAlgoRunningToFalse, DELAY_TIME);
						setIsAlgoRunning(true);
					}
				}}
			>
				Run Algorithim
			</Button>
			<Button
				variant='contained'
				color='secondary'
				disabled={isAlgoRunning}
				onClick={() => {
					if (!isAlgoRunning) {
						resetTheGraph(Graph, SetGraph, GRAPH_HEIGHT, GRAPH_WIDTH, setGraphWidth);
					}
				}}
			>
				Reset
			</Button>
		</div>
	);
};

export default OptionsBar;
