
import { Request, Response, NextFunction } from 'express';
import Workflow from '../models/Workflow';
import { AuthRequest } from '../middleware/auth';

// Get all workflows
export const getWorkflows = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workflows = await Workflow.find({ user: req.user.id });
        res.status(200).json({ success: true, data: workflows });
    } catch (error) {
        next(error);
    }
};

// Create/Update workflow
export const saveWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, trigger, nodes, edges, isActive } = req.body;

        // Simple create for now, ignoring update/id logic for brevity unless provided
        const workflow = await Workflow.create({
            user: req.user.id,
            name,
            trigger,
            nodes,
            edges,
            isActive
        });

        res.status(201).json({ success: true, data: workflow });
    } catch (error) {
        next(error);
    }
};

// Test/Simulate Workflow
export const simulateWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Mock execution
        const { trigger } = req.body;
        res.status(200).json({
            success: true,
            message: `Workflow simulated for trigger: ${trigger}. Steps executed successfully.`,
            logs: [
                `[${new Date().toISOString()}] Trigger '${trigger}' fired.`,
                `[${new Date().toISOString()}] Data fetched from LeadRockets.`,
                `[${new Date().toISOString()}] Action 'Send Slack Message' executed.`,
                `[${new Date().toISOString()}] Successfully completed.`
            ]
        });
    } catch (error) {
        next(error);
    }
};
