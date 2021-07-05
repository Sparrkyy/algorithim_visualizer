import {GraphType, GraphUnitTypes, NodeCords, GraphUnit } from "../types"

export const depthFirstSearch = ( Graph: React.MutableRefObject<GraphType>, renderBool: boolean, rerender: React.Dispatch<React.SetStateAction<boolean>>) =>{
    let timer = 1
    Graph.current.forEach((col)=>{
        col.forEach((node)=>{
            DelayedNodeVisiting(node, renderBool, rerender, timer * 100)
            timer = timer + 1

        })
    })
    
}

const DelayedNodeVisiting = (GraphUnit: GraphUnit, renderBool: boolean, rerender: React.Dispatch<React.SetStateAction<boolean>>, timeout: number) =>{
    setTimeout(()=>{
        GraphUnit.type = GraphUnitTypes.VISITEDNODE
        rerender(!renderBool)
        console.log("node changed")
    }, timeout)

}

const visitOneNode = (nodeCords: NodeCords, Graph: React.MutableRefObject<GraphType>, renderBool: boolean, rerender: React.Dispatch<React.SetStateAction<boolean>>) =>{
    const [Xcord, Ycord] = nodeCords
    Graph.current[Xcord][Ycord] = { type: GraphUnitTypes.VISITEDNODE, visited: true}
    rerender(!renderBool)
}