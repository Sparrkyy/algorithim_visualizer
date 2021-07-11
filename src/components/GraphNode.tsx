import { GraphType, GraphUnit, GraphUnitTypes, NodeCords } from "../types";
import { FindNodeType } from "../functions/GraphFunctions";
import { FC, useState } from "react";

interface GraphNodeContents {
	GraphNode: GraphUnit;
	setGraph: React.Dispatch<React.SetStateAction<GraphType>>;
	Graph: GraphType;
}

const GraphNode: FC<GraphNodeContents> = ({ GraphNode, setGraph, Graph }) => {
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
		>
			<div className={GraphNode.type}>
				{/* {item.type === GraphUnitTypes.NODE || item.type === GraphUnitTypes.VISITED_NODE
											? item.cords[0] + " " + item.cords[1]
											: null} */}
			</div>
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
					</div>
				)}
		</div>
	);
};

export default GraphNode;
