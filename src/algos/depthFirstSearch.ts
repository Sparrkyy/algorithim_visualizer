import { GraphType, GraphUnitTypes, NodeCords } from "../types";
import {
  TimeoutChangeGraphUnitType,
  FindNodeType,
  findAdjancentNonQueuedNodes,
  displayShortestPathUsingPreviousNode,
} from "../functions/GraphFunctions";
import React from "react";

const TIME_TO_DELAY = 30;

const hasNodeNotBeenVisited = (
  Graph: GraphType,
  MarkingNodeCords: NodeCords
) => {
  const nodeInQuestion = Graph[MarkingNodeCords[0]][MarkingNodeCords[1]];
  if (!nodeInQuestion.visited) {
    return true;
  }
  return false;
};

export const deapthFirstSearch = (
  Graph: GraphType,
  SetGraph: React.Dispatch<React.SetStateAction<GraphType>>,
  endingProgramCallback: () => void
) => {
  const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
  const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
  const GraphWidth = Graph.length;
  const GraphHeight = Graph[0].length;

  //intialize the stack
  let Stack: NodeCords[] = [];
  Stack.push(StartNode.cords);

  //timer to help with calcuation
  let timer = 0;

  //while the stack isnt empty
  while (Stack.length !== 0) {
    const currentNode = Stack.shift();

    if (!currentNode)
      throw new Error("The stack was empty when that was already checked");
    TimeoutChangeGraphUnitType(
      currentNode[0],
      currentNode[1],
      SetGraph,
      GraphUnitTypes.VISITED_NODE,
      TIME_TO_DELAY,
      timer
    );
    const [Xcord, Ycord] = currentNode;
    Graph[Xcord][Ycord].visited = true;
    const neighbors = findAdjancentNonQueuedNodes(
      currentNode,
      Graph,
      GraphHeight,
      GraphWidth,
      hasNodeNotBeenVisited
    );
    neighbors.forEach(([X, Y]) => {
      Stack.unshift([X, Y]);
      Graph[X][Y].queued = true;
      Graph[X][Y].previous = currentNode;
    });
    if (
      neighbors.filter(([X, Y]) => Graph[X][Y].type === GraphUnitTypes.FINISH)
        .length > 0
    ) {
      break;
    }
  }

  displayShortestPathUsingPreviousNode(
    timer,
    TIME_TO_DELAY,
    Graph,
    SetGraph,
    FinishNode,
    StartNode,
    endingProgramCallback
  );
};
