import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  ReactFlowProvider
} from "reactflow";
import useUndoable from "use-undoable";
import 'reactflow/dist/style.css';
import { initialElements } from './els';

 function App() {
  

  const [
    elements,
    setElements,
    { past, undo, canUndo, redo, canRedo }
  ] = useUndoable(initialElements, {
    behavior: "destroyFuture"
  });
  let nodeId = 3;


  const triggerUpdate = useCallback(
    (t, v, ignore = false) => {
      //console.log("trigger " + t);
      //console.log(ignore);
      setElements(
        (e) => ({
          nodes: t === "nodes" ? v : e.nodes,
          edges: t === "edges" ? v : e.edges
        }),
        "destroyFuture",
        ignore
      );
    },
    [setElements]
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


  const onNodesChange = useCallback(
    (changes) => {
      // don't save these changes in the history
      let ignore = ["select", "position", "dimensions"].includes(
        changes[0].type
      );
      //console.log(ignore);
      triggerUpdate("nodes", applyNodeChanges(changes, elements.nodes)
      ,ignore);
    },
    [triggerUpdate, elements.nodes]
  );

  useEffect(() => {
		console.log("UseEffect");
	});

  const onEdgesChange = useCallback(
    (changes) => {
      // don't save these changes in the history
      let ignore = ["select"].includes(changes[0].type);
      console.log("change edges");
      triggerUpdate("edges", applyEdgeChanges(changes, elements.edges), ignore);
    },
    [triggerUpdate, elements.edges]
  );

  const onConnect = useCallback(
    (connection) => {
      triggerUpdate("edges", addEdge(connection, elements.edges));
    },
    [triggerUpdate, elements.edges]
  );

  const onNodesDelete = (nodes) => {
    console.log("delete nodes");
    //console.log(edges);
  };

  const onEdgesDelete = (edges) => {
    console.log("delete edges");
    //console.log(edges);
    //console.log(elements.edges);
  };

  const onNodeNewPosition = () => {
    console.log("new position");
    //console.log(elements.nodes);
    //setElements({ nodes: elements.nodes, edges: elements.edges });
  };


  function debug() {
    console.log(past);
    console.log(elements);
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button onClick={() => debug()}>debug</button>
      <button onClick={() => undo()} disabled={!canUndo}>
        undo
      </button>
      <button onClick={() => redo()} disabled={!canRedo}>
        redo
      </button>
      <button onClick={onClick}>
        Add
      </button>
      <ReactFlow
        nodes={elements?.nodes}
        edges={elements?.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onNodeDragStop={onNodeNewPosition}
        snapToGrid={true}
        snapGrid={[10, 10]}
        
      ></ReactFlow>
    </div>
  );
}
function FlowWithProvider(props) {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
