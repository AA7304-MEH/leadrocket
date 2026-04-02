
import { Request, Response, NextFunction } from 'express';
import { CoachingService } from '../services/coachingService';
import { AuthRequest } from '../middleware/auth';

export const getTeamStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const stats = CoachingService.getTeamStats(req.user.id);
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

export const getCoachingTips = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tips = CoachingService.getCoachingTips(req.user.id);
        res.status(200).json({
            success: true,
            data: tips
        });
    } catch (error) {
        next(error);
    }
};
