
import React, { useState, useCallback, useRef } from 'react';
import { ReactFlow, ReactFlowProvider, addEdge, useNodesState, useEdgesState, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Webhook, Zap, Play, Save } from 'lucide-react';
import { toast } from 'sonner';

const initialNodes = [
    { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'Trigger: New Lead' }, style: { background: '#fef3c7', border: '1px solid #d97706', width: 180 } },
];

const initialEdges = [];

const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 border-r bg-slate-50 p-4 h-full">
            <h3 className="font-semibold mb-4 text-sm text-slate-500 uppercase tracking-wider">Triggers</h3>
            <div className="space-y-2 mb-6">
                <div className="p-2 bg-white border rounded cursor-grab shadow-sm flex items-center gap-2 hover:border-blue-400" onDragStart={(event) => onDragStart(event, 'input', 'Trigger: New Lead')} draggable>
                    <Zap className="h-4 w-4 text-yellow-500" /> New Lead
                </div>
                <div className="p-2 bg-white border rounded cursor-grab shadow-sm flex items-center gap-2 hover:border-blue-400" onDragStart={(event) => onDragStart(event, 'input', 'Trigger: Reply Received')} draggable>
                    <Zap className="h-4 w-4 text-blue-500" /> Reply Received
                </div>
            </div>

            <h3 className="font-semibold mb-4 text-sm text-slate-500 uppercase tracking-wider">Actions</h3>
            <div className="space-y-2">
                <div className="p-2 bg-white border rounded cursor-grab shadow-sm flex items-center gap-2 hover:border-green-400" onDragStart={(event) => onDragStart(event, 'default', 'Action: Send Slack')} draggable>
                    <Webhook className="h-4 w-4 text-green-500" /> Send Slack Alert
                </div>
                <div className="p-2 bg-white border rounded cursor-grab shadow-sm flex items-center gap-2 hover:border-green-400" onDragStart={(event) => onDragStart(event, 'default', 'Action: Update HubSpot')} draggable>
                    <Webhook className="h-4 w-4 text-orange-500" /> Update HubSpot
                </div>
            </div>
        </aside>
    );
};

export const IntegrationBuilder = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [workflowName, setWorkflowName] = useState('New Workflow');

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: { label },
                style: { width: 180, background: type === 'input' ? '#fef3c7' : '#fff', border: '1px solid #e2e8f0' }
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    const handleSave = async () => {
        try {
            const flow = reactFlowInstance.toObject();
            toast.promise(
                fetch('/api/integrations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        name: workflowName,
                        trigger: nodes.find(n => n.type === 'input')?.data.label || 'manual',
                        nodes: flow.nodes,
                        edges: flow.edges,
                        isActive: true
                    })
                }),
                {
                    loading: 'Saving workflow...',
                    success: 'Workflow saved successfully!',
                    error: 'Failed to save workflow'
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleSimulate = async () => {
        try {
            const res = await fetch('/api/integrations/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ trigger: 'new_lead_test' })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Simulation complete! Check logs.");
                console.log(data.logs);
                alert(data.message + "\n\nLogs:\n" + data.logs.join("\n"));
            }
        } catch (error) {
            toast.error("Simulation failed");
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="border-b p-4 bg-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Label htmlFor="wf-name">Workflow Name:</Label>
                    <Input
                        id="wf-name"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        className="w-64"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSimulate}>
                        <Play className="h-4 w-4 mr-2" /> Simulate
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" /> Save Workflow
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <ReactFlowProvider>
                    <Sidebar />
                    <div className="flex-1 h-full bg-slate-50" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                        >
                            <Controls />
                            <Background color="#aaa" gap={16} />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
            </div>
        </div>
    );
};

export default IntegrationBuilder;
