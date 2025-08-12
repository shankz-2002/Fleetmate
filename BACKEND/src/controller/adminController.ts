import { Appointment } from "../entities/Appointment";
import { User, Role } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { updatUserService } from "../services/adminService";

export const viewUser = async (req: any, res: any) => {

    try {
        if (req.user.role !== 'admin') {
            return res.status(409).json({ msg: "only admin can view this page" });
        }

        const customer = await User.find({ where: { role: Role.USER }, relations: ['customerProfile'] });
        const manager = await User.find({ where: { role: Role.MANAGER } });
        const mechanic = await User.find({ where: { role: Role.MECHANIC }, relations: ['mechanicProfile'] });
        return res.status(200).json({
            customer,
            manager,
            mechanic
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });

    }

}

export const deleteUser = async (req: any, res: any) => {
    try {
        const userId = Number(req.params.id);
        if (req.user.role !== 'admin') {
            return res.status(409).json({ msg: "only admin has that power" });
        }
        const found = await User.findOne({ where: { id: userId } });
        if (!found) {
            return res.status(404).json({ msg: "user not found" });
        }
        await found?.remove();
        return res.status(200).json({ msg: "User deleted successfully" });


    } catch (error) {

        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }

}

export const updateUser = async (req: any, res: any) => {
    try {
        const userId = Number(req.params.id);

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Only admin can update users" });
        }

        const found = await User.findOne({ where: { id: userId } });
        if (!found) {
            return res.status(404).json({ msg: "User not found" });
        }

        const updatedUser = await updatUserService(req.body, found);

        return res.status(200).json({
            msg: "User updated successfully",
            user: updatedUser
        });

    } catch (error: any) {
        console.error("Update user error:", error);
        return res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};



export const viewAllVehicles = async (req: any, res: any) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ msg: "You are not authorized" });
        }

        const found = await Vehicle.find({
            relations: ['customer']
        });

        if (found.length === 0) {
            return res.status(404).json({ msg: "No vehicles found" });
        }

        return res.status(200).json(found);

    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export const viewAllBill = async (req: any, res: any) => {

    try {

        const appoint = await Appointment.find({
            where: {
                status: "completed"
            },
            relations: [
                "assignedBy",
                "vehicle",
                "mechanic",
                "mechanic.user",
                "bill",
                "bill.parts"
            ]
        });

        if (!appoint || appoint.length === 0) {
            return res.status(404).json({ msg: "No appointments found" });
        }

        return res.status(200).json({ appoint });

    } catch (error) {
        console.error("Error fetching personal appointments:", error);
        return res.status(500).json({ msg: "Server error" });
    }

}