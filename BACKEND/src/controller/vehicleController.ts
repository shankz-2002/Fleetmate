import { User } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { vehicleCreateService, vehicleUpdateService } from "../services/vehicleService";

export const vehicleCreate = async (req: any, res: any) => {
    try {
        const { id } = req.user
        const found = await User.findOne({ where: { id } });
        if (!found) {
            return res.status(404).json({ msg: "User not Found" })
        }
        if (req.user.role === 'customer' || req.user.role === 'admin') {
            const result = await vehicleCreateService(req.body, found);
            return res.status(200).json({
                msg: "Vehicle Created Successfully",
                result
            })
        }
        return res.status(403).json({ msg: "Unauthorized: Only customers or admins can create vehicles" });
    } catch (error) {
        console.error("Vehicle create error:", error);
        return res.status(500).json({ msg: "Server error", error });

    }

}

export const vehicleUpdate = async (req: any, res: any) => {
    try {
        const vehicleId = Number(req.params.id);

        const found = await Vehicle.findOne({
            where: { id: vehicleId },
            relations: ['customer']
        });

        if (!found) {
            return res.status(404).json({ msg: "Vehicle  not Found" })
        }
        if (found?.customer.id !== req.user.id) {
            return res.status(409).json({ msg: "You are not the owner of the vehicle " })
        }
        const result = await vehicleUpdateService(req.body, found);
        if (result) {
            res.status(200).json({
                msg: "vehilce updated successfuly",
                result
            })
        }

    } catch (error) {
        console.error("Vehicle  update  error:", error);
        return res.status(500).json({ msg: "Server error", error });

    }
}
export const vehicleDelete = async (req: any, res: any) => {
    try {
        const vehicleId = Number(req.params.id);
        const found = await Vehicle.findOne({ where: { id: vehicleId }, relations: ["customer"] });
        if (!found) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }
        if (req.user.id !== found.customer.id) {
            return res.status(404).json({ msg: "You are not the Owner Of the Vehicle" })
        }
        await found.remove();
        res.status(200).json({ msg: "Vehicle deleted successfully" })
    } catch (error: any) {
        console.error("Vehicle delete error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });

    }
}

export const vehicleView = async (req: any, res: any) => {
    const userId = req.user.id;

    try {
        const vehicles = await Vehicle.find({
            where: { customer: { id: userId } },
            relations: ["customer"],
        });

        return res.status(200).json(vehicles); 
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return res.status(500).json({ message: "Error fetching vehicles" });
    }
};
