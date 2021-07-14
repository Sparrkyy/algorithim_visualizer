import { GraphType, GraphUnitTypes, NodeCords } from "../types";
import {
  TimeoutChangeGraphUnitType,
  FindNodeType,
  findAdjancentNonQueuedNodes,
  displayShortestPathUsingPreviousNode,
  hasNodeNotBeenQueued,
} from "../functions/GraphFunctions";

const TIMER_BETWEEN_RENDERS = 30;

export const breadthFirstSearch = (
  Graph: GraphType,
  SetGraph: React.Dispatch<React.SetStateAction<GraphType>>
) => {
  const StartNode = FindNodeType(Graph, GraphUnitTypes.START);
  const FinishNode = FindNodeType(Graph, GraphUnitTypes.FINISH);
  const GraphWidth = Graph.length;
  const GraphHeight = Graph[0].length;

  let queue: NodeCords[] = [];
  queue.push(StartNode.cords);

  //timer to help with calcuation
  let timer = 0;

  while (Graph[FinishNode.cords[0]][FinishNode.cords[1]].queued !== true) {
    //Grabs first node in the list
    const currentNode = queue.shift();
    if (currentNode) {
      const [currentNodeCordX, currentNodeCordY] = currentNode;
      Graph[currentNodeCordX][currentNodeCordY].queued = true;
      //Chaning the state of a node
      const [Xcord, Ycord] = currentNode;
      timer = TimeoutChangeGraphUnitType(
        Xcord,
        Ycord,
        SetGraph,
        GraphUnitTypes.VISITED_NODE,
        TIMER_BETWEEN_RENDERS,
        timer
      );
    }

    if (!currentNode) {
      console.log("there was nothing let in the queue");
      break;
    }
    //Gets neighbors and sets all visited to true for them to avoid putting them in the queue twice
    const AllNeighbors = findAdjancentNonQueuedNodes(
      currentNode,
      Graph,
      GraphHeight,
      GraphWidth,
      hasNodeNotBeenQueued
    );
    AllNeighbors.forEach((item) => {
      queue.push(item);
      const [Xcord, Ycord] = item;
      Graph[Xcord][Ycord].queued = true;
      Graph[Xcord][Ycord].previous = currentNode;
    });
  }

  displayShortestPathUsingPreviousNode(
    timer,
    TIMER_BETWEEN_RENDERS,
    Graph,
    SetGraph,
    FinishNode,
    StartNode
  );
};
