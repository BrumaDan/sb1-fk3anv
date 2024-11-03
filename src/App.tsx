import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  ConnectionMode,
  ReactFlowProvider,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useOrgStore } from './store';
import EmployeeNode from './components/EmployeeNode';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';

const nodeTypes = {
  employee: EmployeeNode,
};

function Flow() {
  const { nodes, edges, updateNodePosition, addEdge, removeEdge, loadOrgData } = useOrgStore();
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  useEffect(() => {
    loadOrgData();
  }, [loadOrgData]);

  const onNodesChange = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        if (change.type === 'position' && change.position) {
          updateNodePosition(change.id, change.position);
        }
      });
    },
    [updateNodePosition]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addEdge({
          id: `e${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
        });
      }
    },
    [addEdge]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const isConfirmed = window.confirm('Do you want to remove this connection?');
      if (isConfirmed) {
        removeEdge(edge.id);
      }
    },
    [removeEdge]
  );

  return (
    <div className="w-screen h-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'straight',
          style: { 
            stroke: '#475569', 
            strokeWidth: 2,
          },
          animated: false,
        }}
        fitView
      >
        <Background />
        <Controls className="!bottom-24 !left-8" />
        <Toolbar
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFit={() => fitView()}
        />
      </ReactFlow>
      <Sidebar />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;