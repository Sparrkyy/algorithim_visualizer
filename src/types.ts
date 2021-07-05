

export type NodeCords = [ row: number, col: number]


export enum GraphUnitTypes {
    START = "start-node",
    FINISH = "finish-node", 
    NODE = "normal-node", 
    LEFTRIGHTEDGE = "left-right-edge", 
    UPDOWNEDGE = "up-down-edge",
    EMPTYSPACE = "empty-space",
    VISITEDNODE = "visited-node"
}

export type GraphUnit = {
    type: GraphUnitTypes;
    visited: boolean;
}

export type GraphType = GraphUnit[][]