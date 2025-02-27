import { prisma } from "../utils/prismaClient"
import { Request, Response, NextFunction } from "express";

const utilsController = {

    totalVisionInferences: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const count = await prisma.inference.count()
            return res.status(200).json(count)
        } catch (error) {
            next(error)
        }
    },

    totalVisionImages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const count = (await prisma.inference.findMany())
                .map(inf => inf.num_images)
                .reduce((x, y) => x + y)
            return res.status(200).json(count)
        } catch (error) {
            next(error)
        }
    },

    totalVisionInferencesByModel: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const results = await prisma.inference.groupBy({
                by: ['ml_model', 'quantization', 'uses_gpu', 'uses_nnapi'],
                _count: {
                    _all: true,
                },
            });
    
            const objResult = results.reduce((acc, result) => {
                const quantization = result.quantization || 'UNKNOWN';
                
                // Determine the compute type based on flags
                let computeType = 'CPU'; // Default to CPU
                if (result.uses_gpu) {
                    computeType = 'GPU';
                } else if (result.uses_nnapi) {
                    computeType = 'NNAPI';
                }
    
                const key = `${result.ml_model} - ${quantization} - ${computeType}`;
                acc[key] = result._count._all;
                return acc;
            }, {} as { [key: string]: number });
    
            return res.status(200).json(objResult);
    
        } catch (error) {
            next(error);
        }
    }
}

export default utilsController