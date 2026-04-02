
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get all workflows
export const getWorkflows = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const workflows = await prisma.workflow.findMany({
            where: { userId: req.user.id }
        });
        res.status(200).json({ success: true, data: workflows });
    } catch (error) {
        next(error);
    }
};

// Create/Update workflow
export const saveWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, trigger, nodes, edges, isActive } = req.body;

        const workflow = await prisma.workflow.create({
            data: {
                userId: req.user.id,
                name,
                trigger,
                nodes: nodes || [],
                edges: edges || [],
                isActive: isActive || false
            }
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
