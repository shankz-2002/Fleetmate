import { CustomerProfile } from "../entities/CustomerProfile";
import { MechanicProfile } from "../entities/MechanicProfile";
import { User } from "../entities/User";
import { customerUpdate, mechanincUpdate } from "../services/profileService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/jwt";

export const userRegister = async (req: any, res: any) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ msg: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = User.create({ name, email, password: hashedPassword, role });
        await user.save();

        return res.status(201).json({ msg: "User registered successfully", user });
    } catch (error: any) {
        console.error("Register error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};


export const userLogin = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = createToken(user);

        return res.status(200).json({
            msg: "Login successful",
            accessToken: token,
            role: { id: user.id, role: user.role, name: user.name }
        });
    } catch (error: any) {
        console.error("Login error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};
export const userView = async (req: any, res: any) => {
    try {
        const id = req.user.id;

        let found;

        if (req.user.role === 'customer') {
            found = await CustomerProfile.findOne({ where: { user: { id } } });
        } else if (req.user.role === 'mechanic') {
            found = await MechanicProfile.findOne({ where: { user: { id } } });
        } else {
            return res.status(400).json({ msg: "Invalid role" });
        }

        if (!found) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        return res.status(200).json(found);
    } catch (error) {
        console.error("Error in userView:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};




export const userUpdate = async (req: any, res: any) => {
    try {
        const id = req.user.id;

        if (req.user.role === 'customer') {
            const profile = await CustomerProfile.findOne({ where: { user: { id } } });
            if (!profile) {
                return res.status(404).json({ msg: "Customer profile not found" });
            }

            const updated = await customerUpdate(req.body, profile);
            return res.status(200).json({ found: updated });
        }

        if (req.user.role === 'mechanic') {
            const profile = await MechanicProfile.findOne({ where: { user: { id } } });
            if (!profile) {
                return res.status(404).json({ msg: "Mechanic profile not found" });
            }

            const updated = await mechanincUpdate(req.body, profile);
            return res.status(200).json({ found: updated });
        }

        return res.status(403).json({ msg: "Unauthorized role" });

    } catch (error: any) {
        console.error("User update error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export const userDelete = async (req: any, res: any) => {
    try {
        const id = req.user.id;

        if (req.user.role === 'customer') {
            const found = await CustomerProfile.findOne({ where: { user: { id } }, relations: ['user'] });
            if (!found) {
                return res.status(404).json({ msg: "Customer Profile not found" });
            }
            await found.remove();
            return res.status(200).json({ msg: "Customer Profile deleted successfully" });
        }

        if (req.user.role === 'mechanic') {
            const found = await MechanicProfile.findOne({ where: { user: { id } }, relations: ['user'] });
            if (!found) {
                return res.status(404).json({ msg: "Mechanic Profile not found" });
            }
            await found.remove();
            return res.status(200).json({ msg: "Mechanic Profile deleted successfully" });
        }

        return res.status(403).json({ msg: "Unauthorized role" });

    } catch (error: any) {
        console.error("User delete error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};
