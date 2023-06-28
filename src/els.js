const initialElements = {
    nodes: [
      {
        id: "1",
        type: "input",
        data: { label: "Node 1" },
        position: { x: 100, y: 50 }
      },
      {
        id: "2",
        data: { label: "Node 2" },
        position: { x: 150, y: 150 }
      },
      {
        id: "3",
        data: { label: "Node 3" },
        position: { x: 200, y: 250 }
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

export {
	initialElements
}