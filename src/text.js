import logo from './logo.svg';
import './App.css';
import React, { useCallback,  useEffect, useState } from 'react';
//import ReactFlow, { useNodesState, useEdgesState, addEdge}   from 'react-flow-renderer';
import ReactFlow, { ReactFlowProvider,addEdge,applyEdgeChanges, 
  applyNodeChanges ,useReactFlow,useNodesState, useEdgesState,
   useStore, Controls, Background } 
  from 'reactflow';
import 'reactflow/dist/style.css';

import useUndoable from "use-undoable";

import defaultNodes from './nodes.js';
import defaultEdges from './edges.js';
import { initialElements } from './els';

import './button.css';

const connectionLineStyle = { stroke: 'white' };
const edgeOptions = {
  animated: true,
  style: {
    stroke: 'white',
  },
};
let lastAction = {
  createNode:false,
  createEdge:false
}

let nodeId = 2;

// function UnDo({undo, redo, reset}){
//   const UnDoButton = useCallback(() => undo());
// }



function Flow() {
  //const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  //console.log([nodes, setNodes, onNodesChange])
  //const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  //const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
 
  
  const UnDoButton = useCallback(() => {undo();
    Print();});
  const ReDoButton = useCallback(() => {redo();
    Print();});

    const Print = () =>
    {
        console.log("past");     
        console.log(past);
        console.log("present");
        console.log(present);
        console.log("future");
        console.log(future);
      
    };
  const [elements, setElements,
     { undo, redo, reset,past,present,future}] = useUndoable({
		nodes: initialElements,
		edges: [],
    behavior: "destroyFuture"
	});
  //console.log([elements, setElements, { undo, redo, reset }])

  useEffect(() => {
		console.log(elements);
	}, [elements]);

  const triggerUpdate = useCallback(
		(t, v) => {
			// To prevent a mismatch of state updates,
			// we'll use the value passed into this
			// function instead of the state directly.
			setElements(e => ({
				nodes: t === 'nodes' ? v : e.nodes,
				edges: t === 'edges' ? v : e.edges,
			}));
		},
		[setElements]
	);
 

  const onNodesChange = useCallback(
		(changes) => {
      console.log("HI EMAE")
      let ignore = ["select", "position", "dimensions"].includes(
        changes[0].type
      );
			triggerUpdate('nodes', applyNodeChanges(changes, elements.nodes));
      // console.log(future);
		},
		[triggerUpdate, elements.nodes]
	);


	const onEdgesChange = useCallback(
		(changes) => {
      let ignore = ["select"].includes(changes[0].type);
			triggerUpdate('edges', applyEdgeChanges(changes, elements.edges));
		},
		[triggerUpdate, elements.edges]
	);

	const onConnect = useCallback(
		(connection) => {
			triggerUpdate('edges', addEdge(connection, elements.edges));
      Print();
		},
		[triggerUpdate, elements.edges]
	);


  const reactFlowInstance = useReactFlow();
  const onClick = useCallback(() => {
    const id = `${++nodeId}`;

    const newNode = {
      id,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label: `Node ${id}`,
      },
    };  
    reactFlowInstance.addNodes(newNode);
  }, []);
  

  //const nodesLength = useStore();
 // console.log(nodesLength);
//  const initialState = 0
//  const [yourState, setYourState, { undo, redo }] = useUndoable(initialState)
//  console.log([yourState, setYourState, { undo, redo }])
  const unDo = useCallback(() => {
  //   let idNodes = reactFlowInstance.getNodes();
  //  // let theLast = idNodes.length
  //  let theLast = 1; 
  //   console.log(idNodes);
  //  if (`${lastAction.createNode}}`){
  //   //reactFlowInstance.dele

  //   setNodes(nds => {nds.filter(node => node.id !== theLast)
  //   console.log(nds);
  //   });
  //   console.log("entered");
  //  }


  }, []); 
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        // nodes={defaultNodes}
        // edges={edges}
        nodes={elements?.nodes}
				edges={elements?.edges}

				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}

				deleteKeyCode={8}
				zoomOnScroll={true}
				panOnScroll
        fitView

        snapToGrid={true}
        snapGrid={[10, 10]}

        // onNodeDragStop={(ev, node) =>
        //   setElements((els) =>
        //     els.map((e) => {
        //       if (e.id === node.id) {
        //         let n = {
        //           ...elements.filter((e) => e.id === node.id)[0],
        //           position: node.position
        //         };

        //         return n;
        //       }

        //       return e;
        //     })
        //   )
        // }
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // // onConnect={onConnect}
        // defaultNodes={defaultNodes}
        // defaultEdges={defaultEdges}
        // defaultEdgeOptions={edgeOptions}
        // fitView
        // style={{
        //   backgroundColor: '#D3D2E5',
        // }}
        // connectionLineStyle={connectionLineStyle}

      >
        <Background />
        <Controls />
      </ReactFlow>
      
      <button onClick={onClick} className="btn-add" >
        add node
      </button>
      <button onClick={UnDoButton} className="btn-undo">
        UNDO
      </button>
      <button onClick={ReDoButton} className="btn-redo">
        REDO
      </button>
   </div>
  );
}

export default function(){
  return (
    <ReactFlowProvider>
    <Flow />
    </ReactFlowProvider>
  )
};
