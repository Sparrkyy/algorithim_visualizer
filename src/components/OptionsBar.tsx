import React, { FC, useState } from "react";
import { breadthFirstSearch } from "../algos/breadthFirstSearch";
import { deapthFirstSearch } from "../algos/depthFirstSearch";
import { GraphType, GraphUnit, GraphUnitTypes, AlgoTypes } from "../types";
import { FindNodeType } from "../functions/GraphFunctions";
import { generateGraph } from "../components/Graph";
import DropdownSelector from "./DropdownSelector";
import "../css/Toolbar.css";

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
  GRAPH_WIDTH: number
) => {
  resetTheGraph(Graph, setGraph, GRAPH_HEIGHT, GRAPH_WIDTH);
  switch (algoToRun) {
    case AlgoTypes.BFS:
      breadthFirstSearch(Graph, setGraph);
      break;
    case AlgoTypes.DFS:
      deapthFirstSearch(Graph, setGraph);
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

  return (
    <div className="tool-bar">
      <DropdownSelector
        currentSelection={currentAlgo}
        setCurrentSelection={setCurrentAlgo}
      />
      <button
        onClick={() =>
          runAlgorithim(currentAlgo, Graph, SetGraph, GRAPH_HEIGHT, GRAPH_WIDTH)
        }
      >
        Run Algorithim
      </button>
      <button
        onClick={() => {
          resetTheGraph(Graph, SetGraph, GRAPH_HEIGHT, GRAPH_WIDTH);
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default OptionsBar;
