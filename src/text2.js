import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  useReactFlow
} from "reactflow";
import useUndoable from "use-undoable";
import 'reactflow/dist/style.css';

let nodeId = 4;

function App() {
  const initialElements = {
    nodes: [
      {
        id: "1",
        type: "input",
        data: { label: "First Node" },
        position: { x: 100, y: 50 }
      },
      {
        id: "2",
        data: { label: "Second Node" },
        position: { x: 150, y: 150 }
      },
      {
        id: "3",
        data: { label: "Third Node" },
        position: { x: 200, y: 250 }
      },
      {
        id: "4",
        data: { label: "Fourth Node" },
        position: { x: 450, y: 50 }
      }
    ],
    edges: [
      {
        id: "edge1",
        source: "1",
        target: "2"
      },
      {
        id: "edge2",
        source: "2",
        target: "3"
      }
    ]
  };

  
  const [undoing, setUndoing] = useState(false);
  const [nodes, setNodes] = useState(initialElements.nodes);
  const [edges, setEdges] = useState(initialElements.edges);

  const [
    elements,
    setElements,
    { past, undo, canUndo, redo, canRedo }
  ] = useUndoable(initialElements, {
    behavior: "destroyFuture"
  });

  const onNodesChange = useCallback(
    (changes) => {
      if (changes[0].type === "remove") {
        console.log("node remove");
        setElements({ nodes: applyNodeChanges(changes, nodes), edges: edges });
      }
      console.log("Nodes added")
      setNodes((ns) => applyNodeChanges(changes, ns));
    },
    [setElements, nodes, edges]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      if (changes[0].type === "remove") {
        console.log("edge remove");
        setElements({ nodes: nodes, edges: applyEdgeChanges(changes, edges) });
      }
      setEdges((es) => applyEdgeChanges(changes, es));
    },
    [setElements, nodes, edges]
  );

  const onConnect = useCallback(
    (connection) => {
      console.log("edge add");
      setEdges((eds) => addEdge(connection, eds));
      setElements({ nodes: nodes, edges: addEdge(connection, edges) });
    },
    [setElements, nodes, edges]
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

  const onNodeNewPosition = () => {
    // a node has been dragged, so it changed its position
    // record the new state in the history
    console.log("new position");
    setElements({ nodes: nodes, edges: edges });
  };

 

  useEffect(() => {
    // update the real states from our helper states
    // i've not found a better way to sync them back after undo() and redo()
    // since the calls are not synchronous otherwise we could have synced
    // them in the onUndo and onRedo functions
    if (undoing) {
      setNodes(elements.nodes);
      setEdges(elements.edges);
      setUndoing(false);
    }
  }, [elements, undoing]);

  function onUndo() {
    //setUndoing(true);
    undo();
  }

  function onRedo() {
   // setUndoing(true);
    redo();
  }

  function debug() {
    console.log(past);
    console.log(elements);
    console.log({ nodes: nodes, edges: edges });
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button onClick={() => debug()}>debug</button>
      <button onClick={() => onUndo()} disabled={!canUndo}>
        undo
      </button>
      <button onClick={() => onRedo()} disabled={!canRedo}>
        redo
      </button>
      <button onClick={onClick}>
        Add
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
