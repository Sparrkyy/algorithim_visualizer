import React, { FC, useState } from "react";
import { breadthFirstSearch } from "../algos/breadthFirstSearch";
import { deapthFirstSearch } from "../algos/depthFirstSearch";
import { GraphType, GraphUnit, GraphUnitTypes, AlgoTypes } from "../types";
import { FindNodeType } from "../functions/GraphFunctions";
import { generateGraph } from "../components/Graph";
import DropdownSelector from "./DropdownSelector";
import "../css/Toolbar.css";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button"

interface OptionsBarContent {
  Graph: GraphUnit[][];
  SetGraph: React.Dispatch<React.SetStateAction<GraphType>>;
  GRAPH_HEIGHT: number;
  GRAPH_WIDTH: number;
}

const runAlgorithim = (
  algoToRun: AlgoTypes,
  Graph: GraphUnit[][],
  setGraph: React.Dispatch<React.SetStateAction<GraphType>>,
  GRAPH_HEIGHT: number,
  GRAPH_WIDTH: number,
  endingProgramCallback: () => void
) => {
  resetTheGraph(Graph, setGraph, GRAPH_HEIGHT, GRAPH_WIDTH);
  switch (algoToRun) {
    case AlgoTypes.BFS:
      breadthFirstSearch(Graph, setGraph, endingProgramCallback);
      break;
    case AlgoTypes.DFS:
      deapthFirstSearch(Graph, setGraph, endingProgramCallback);
      break;
  }
};

const resetTheGraph = (
  Graph: GraphUnit[][],
  SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
  GRAPH_HEIGHT: number,
  GRAPH_WIDTH: number
) => {
  const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
  const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
  SetGraph(
    generateGraph(StartNode.cords, FinishNode.cords, GRAPH_HEIGHT, GRAPH_WIDTH)
  );
};

const OptionsBar: FC<OptionsBarContent> = ({
  Graph,
  SetGraph,
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
}) => {
  const [currentAlgo, setCurrentAlgo] = useState(AlgoTypes.BFS);
  const [isAlgoRunning, setIsAlgoRunning] = useState(false);

  const setAlgoRunningToFalse = () => {
    setIsAlgoRunning(false);
  };

  return (
    <div className="tool-bar">
      <FormControl>
        <InputLabel>Algorithim Type</InputLabel>
        <Select labelId="algorithim-selector-helper-label" id="algorithim-selector-helper" value={currentAlgo} onChange={(e)=>{ setCurrentAlgo(e.target.value as AlgoTypes)}} >
         {Object.entries(AlgoTypes).map((item)=>{
           return <MenuItem value={item[1]}>{item[1]}</MenuItem>
         })} 
        </Select>
         <FormHelperText>The Algorithim to run</FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        disabled={isAlgoRunning}
        onClick={() => {
          if (!isAlgoRunning) {
            runAlgorithim(
              currentAlgo,
              Graph,
              SetGraph,
              GRAPH_HEIGHT,
              GRAPH_WIDTH,
              setAlgoRunningToFalse
            );
            setIsAlgoRunning(true);
          }
        }}
      >
        Run Algorithim
      </Button>
      <Button
      variant="contained"
      color="secondary"
      disabled={isAlgoRunning}
        onClick={() => {
          if (!isAlgoRunning){

          resetTheGraph(Graph, SetGraph, GRAPH_HEIGHT, GRAPH_WIDTH);
          }
        }}
      >
        Reset
      </Button>
    </div>
  );
};

export default OptionsBar;
