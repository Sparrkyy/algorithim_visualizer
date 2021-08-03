import { GraphType, GraphUnit, GraphUnitTypes } from "../types";
import { FindNodeType } from "../functions/GraphFunctions";
import { FC, useState } from "react";
import { memo } from "react";

interface GraphNodeContents {
	GraphNode: GraphUnit;
	setGraph: React.Dispatch<React.SetStateAction<GraphType>>;
	Graph: GraphType;
	nodeDiameter: number;
}

const GraphNode: FC<GraphNodeContents> = memo(({ GraphNode, setGraph, nodeDiameter }) => {
	const [menuOpen, setMenu] = useState(false);
	const handleClick = () => {
		setMenu(!menuOpen);
	};

	const setFinishNode = () => {
		setGraph((prevGraph) => {
			const currentStartNode = FindNodeType(prevGraph, GraphUnitTypes.FINISH);
			currentStartNode.type = GraphUnitTypes.NODE;
			const dup = [...prevGraph];
			const [X, Y] = GraphNode.cords;
			prevGraph[X][Y].type = GraphUnitTypes.FINISH;
			return dup;
		});
		setMenu(false);
	};

	const setStartNode = () => {
		setGraph((prevGraph) => {
			const currentStartNode = FindNodeType(prevGraph, GraphUnitTypes.START);
			currentStartNode.type = GraphUnitTypes.NODE;
			const dup = [...prevGraph];
			const [X, Y] = GraphNode.cords;
			prevGraph[X][Y].type = GraphUnitTypes.START;
			return dup;
		});
		setMenu(false);
	};

	return (
		<div
			className='graph-unit'
			onClick={() => {
				handleClick();
			}}
			style={{ height: nodeDiameter + "px", width: nodeDiameter + "px" }}
		>
			<div className={GraphNode.type}></div>
			{menuOpen &&
				GraphNode.type !== GraphUnitTypes.EMPTY_SPACE &&
				GraphNode.type !== GraphUnitTypes.LEFT_RIGHT_EDGE &&
				GraphNode.type !== GraphUnitTypes.UP_DOWN_EDGE && (
					<div className='node-selection-menu'>
						<div
							className='node-selection-menu-option'
							onClick={() => {
								setStartNode();
							}}
						>
							Set Start Node
						</div>
						<div
							className='node-selection-menu-option'
							onClick={() => {
								setFinishNode();
							}}
						>
							Set Finish Node
						</div>

						<div className='node-selection-menu-option'>
							<h4>{JSON.stringify(GraphNode.cords)}</h4>
						</div>
					</div>
				)}
		</div>
	);
});

export default GraphNode;
