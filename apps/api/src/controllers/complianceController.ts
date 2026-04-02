
import { Request, Response, NextFunction } from 'express';
import { ComplianceService } from '../services/complianceService';
import { AuthRequest } from '../middleware/auth';

export const auditContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, error: 'Content is required' });
        }

        const result = ComplianceService.analyzeContent(content);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
