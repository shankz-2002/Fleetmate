import { CustomerProfile } from "../entities/CustomerProfile";
import { MechanicProfile } from "../entities/MechanicProfile";
import { User } from "../entities/User";
import { createCustomerProfile, createMechanicProfile } from "../services/profileService";

export const customerProfile = async (req: any, res: any) => {
    try {
        const { role, id } = req.user;

        if (role !== 'customer') {
            return res.status(403).json({ msg: 'Only customers can create customer profiles' });
        }

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const existing = await CustomerProfile.findOne({ where: { user: { id: user.id } } });
        if (existing) {
            return res.status(409).json({ msg: 'Customer profile already exists' });
        }

        // ✅ Extract only the allowed fields
        const { phone, address, profileImage } = req.body;

        if (!phone || !address || !profileImage) {
            return res.status(400).json({ msg: "Missing required customer profile fields" });
        }

        const result = await createCustomerProfile({ phone, address, profileImage }, user);
        return res.status(201).json({ found: result });

    } catch (error: any) {
        console.error('Profile creation error:', error);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

export const mechanicProfile = async (req: any, res: any) => {
    try {
        const { role, id } = req.user;

        if (role !== 'mechanic') {
            return res.status(403).json({ msg: 'Only mechanics can create mechanic profiles' });
        }

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const existing = await MechanicProfile.findOne({
            where: { user: { id: user.id } }
        });

        if (existing) {
            return res.status(409).json({ msg: 'Mechanic profile already exists' });
        }

        const { phone, address, profileImage, skills, yearsOfExperience } = req.body;

        if (
            !phone ||
            !address ||
            !profileImage ||
            !Array.isArray(skills) ||
            typeof yearsOfExperience !== 'number'
        ) {
            return res.status(400).json({ msg: 'Missing or invalid mechanic profile fields' });
        }

        const result = await createMechanicProfile(
            { phone, address, profileImage, skills, yearsOfExperience },
            user
        );

        return res.status(201).json({ msg: 'Mechanic profile created', result });
    } catch (error: any) {
        console.error('Mechanic profile creation error:', error);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};
