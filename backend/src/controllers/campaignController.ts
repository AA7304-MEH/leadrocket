
import { Request, Response } from 'express';

export const cloneCampaign = async (req: Request, res: Response) => {
    try {
        const { campaignId, newName } = req.body;

        // Mock Logic
        // 1. Find campaign by ID
        // 2. Create copy with new Name
        // 3. Return new campaign

        await new Promise(resolve => setTimeout(resolve, 500));

        res.json({
            success: true,
            message: 'Campaign cloned successfully',
            campaign: {
                id: 'new-id-123',
                name: newName || 'Cloned Campaign',
                status: 'draft'
            }
        });
    } catch (error) {
        console.error('Clone error:', error);
        res.status(500).json({ success: false, message: 'Failed to clone campaign' });
    }
};

export const saveSequence = async (req: Request, res: Response) => {
    try {
        const { nodes, edges, name } = req.body;

        // Mock saving logic
        // In a real app, this would save to the Campaign model in MongoDB
        console.log('Saving sequence:', { nodes: nodes.length, edges: edges.length });

        await new Promise(resolve => setTimeout(resolve, 800));

        res.json({
            success: true,
            message: 'Sequence saved successfully',
            data: {
                id: 'seq-' + Date.now(),
                name: name || 'New Sequence',
                nodesCount: nodes.length
            }
        });
    } catch (error) {
        console.error('Save sequence error:', error);
        res.status(500).json({ success: false, message: 'Failed to save sequence' });
    }
};
