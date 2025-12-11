
import { useState, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MessageSquare, Clock, Send, Linkedin } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const initialNodes = [
    {
        id: '1',
        position: { x: 250, y: 0 },
        data: { label: 'Start Campaign' },
        type: 'input',
        style: { background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' }
    },
];

const SequenceBuilder = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges],
    );

    const addNode = (type: string, label: string, icon: any) => {
        const id = `${type}-${Date.now()}`;
        const newNode = {
            id,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: { label: <div className="flex items-center gap-2">{icon} {label}</div> },
            style: {
                background: 'white',
                border: '1px solid #777',
                borderRadius: '8px',
                padding: '10px',
                minWidth: '150px'
            }
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/campaigns/save-sequence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges, name: 'My Multi-Channel Sequence' })
            });
            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Sequence Saved",
                    description: "Your multi-channel workflow is ready!",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Could not save sequence.",
                    variant: "destructive"
                });
            }
        } catch (e) {
            toast({
                title: "Error",
                description: "Network error saving sequence.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-[600px] w-full border rounded-lg bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white flex gap-4">
                <Button variant="outline" onClick={() => addNode('email', 'Send Email', <Mail className="w-4 h-4" />)}>
                    <Mail className="mr-2 w-4 h-4" /> Add Email
                </Button>
                <Button variant="outline" onClick={() => addNode('linkedin', 'LinkedIn Msg', <Linkedin className="w-4 h-4 text-blue-600" />)}>
                    <Linkedin className="mr-2 w-4 h-4" /> Add LinkedIn
                </Button>
                <Button variant="outline" onClick={() => addNode('wait', 'Wait 2 Days', <Clock className="w-4 h-4" />)}>
                    <Clock className="mr-2 w-4 h-4" /> Add Wait
                </Button>
                <Button className="ml-auto" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="animate-spin mr-2">⏳</span> : <Send className="mr-2 w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Sequence'}
                </Button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default SequenceBuilder;
