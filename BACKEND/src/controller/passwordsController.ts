import { ResetToken } from "../entities/ResetToken";
import { User } from "../entities/User";
import crypto from 'crypto';
import { sendResetEmail } from "../services/resetService";
import bcrypt from "bcrypt";

export const forgotPassword = async (req: any, res: any) => {
    try {
        const { email } = req.body;
        const found = await User.findOne({ where: { email } });
        if (!found) {
            return res.status(404).json({ msg: "user not found" });
        }

        await ResetToken.delete({ user: { id: found.id } });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        const newReset = new ResetToken();

        newReset.token = token;
        newReset.expiresAt = expiresAt;
        newReset.user = found;

        await newReset.save();
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;


        await sendResetEmail(found.email, resetLink);

        res.status(200).json({ msg: 'Reset link sent to email' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error",
            error: error instanceof Error ? error.message : error
        });
    }
}

export const resetPassword = async (req: any, res: any) => {
    try {
        const { token, newPassword } = req.body;

        const reset = await ResetToken.findOne({ where: { token }, relations: ['user'] });
        if (!reset) {
            return res.status(400).json({ msg: 'Invalid or expired token' });

        }
        if (reset.expiresAt < new Date()) {
            return res.status(400).json({ msg: 'Token expired' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        reset.user.password = hashed;
        await reset.user.save();
        await ResetToken.delete({ id: reset.id });

        return res.status(200).json({
            msg: 'Password reset successful',
            reset
        });


    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ msg: 'Something went wrong. Please try again later.' });
    }

}