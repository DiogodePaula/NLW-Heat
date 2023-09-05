import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string
}

export function ensureAuthenticate(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({
            errorCode: "token.invalid",
        });
    }

    // o token vira no seguinte formato "Bearer 32185646313545311854", mas 
    // só importa os numeros, precisamos desestruturar
    // [0] Bearer
    // [1] 32185646313545311854
    const [, token] = authToken.split(" ")

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
        req.user_id = sub;

        return next();
    } catch (error) {
        return res.status(401).json({ errorCode: "token.expired" });
    }
}
