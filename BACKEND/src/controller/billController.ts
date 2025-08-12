import { Appointment } from "../entities/Appointment";
import { Bill } from "../entities/BIll";
import { PartUsed } from "../entities/PartUsed";
import { User } from "../entities/User";
import { billCreateService, billUpdateService } from "../services/billService";

export const billCreate = async (req: any, res: any) => {
    try {
        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Not authorized to create bill" });
        }

        const appointId = Number(req.params.id);
        const userId = req.user.id;

        const { laborCharge, taxes } = req.body

        const [userFound, appFound] = await Promise.all([
            User.findOne({ where: { id: userId } }),
            Appointment.findOne({
                where: { id: appointId },
                relations: ["customer", "mechanic", "assignedBy"]
            })
        ]);

        if (!userFound) return res.status(404).json({ msg: "Manager not found" });
        if (!appFound) return res.status(404).json({ msg: "Appointment not found" });
        if (!appFound.mechanic) return res.status(409).json({ msg: "No mechanic is assigned" });
        if (appFound.assignedBy?.id !== userId) return res.status(403).json({ msg: "Not your assigned appointment" });
        if (appFound.status !== 'completed') return res.status(409).json({ msg: "Appointment not finished, bill cannot be created" });

        const parsedLabor = Number(laborCharge);
        const parsedTaxes = Number(taxes);

        if (isNaN(parsedLabor) || isNaN(parsedTaxes)) {
            return res.status(400).json({ msg: "Invalid input. Labor charge and taxes must be numbers." });
        }

        const result = await billCreateService(
            { laborCharge: parsedLabor, taxes: parsedTaxes },
            appFound,
            userFound
        );
        return res.status(201).json({
            msg: "Bill created successfully",
            result
        });

    } catch (error: any) {
        console.error("Bill create error:", error);
        return res.status(500).json({
            msg: "Server error",
            error: error.message || error
        });
    }
};



export const billDelete = async (req: any, res: any) => {
    try {
        const id = Number(req.params.id);
        const found = await Bill.findOne({ where: { id }, relations: ["manager"] });

        if (!found) {
            return res.status(404).json({ msg: "Bill not found" });
        }

        if (req.user.id !== found.manager.id || req.user.role !== 'admin') {
            return res.status(403).json({ msg: "You are not authorized to delete this bill" });
        }

        await found.remove();
        return res.status(200).json({ msg: "Bill deleted successfully" });

    } catch (error: any) {
        console.error("Bill delete error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};




export const billUpdate = async (req: any, res: any) => {
    try {
        const billId = Number(req.params.id);
        const found = await Bill.findOne({
            where: { id: billId },
            relations: ["parts"],
        });

        if (!found) {
            return res.status(404).json({ msg: "Bill not found" });
        }

        const updatedBill = await billUpdateService(req.body, found);

        // Handle parts update
        if (Array.isArray(req.body.parts)) {
            // Delete old parts
            await PartUsed.delete({ bill: { id: billId } });

            // Create new parts
            const newParts = req.body.parts.map((part: any) => {
                const newPart = new PartUsed();
                newPart.partName = part.partName;
                newPart.quantity = part.quantity;
                newPart.cost = part.cost;
                newPart.bill = found;
                return newPart;
            });

            await PartUsed.save(newParts);

            // Recalculate totalAmount
            const partsTotal = newParts.reduce(
                (sum: any, part: any) => sum + part.quantity * part.cost,
                0
            );
            found.totalAmount = partsTotal + found.laborCharge + found.taxes;
            await found.save();
        }

        return res.status(200).json({ msg: "Bill updated successfully", result: found });
    } catch (error) {
        console.error("Error updating bill:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};



export const billView = async (req: any, res: any) => {
    try {
        const userId = req.user.id;

        const bills = await Bill.find({
            where: {
                user: { id: userId },
            },
            relations: ["user", "appointment", "parts", "manager", "appointment.vehicle"],
        });

        if (!bills || bills.length === 0) {
            return res.status(404).json({ msg: "No bills found for this user." });
        }

        return res.status(200).json({ bills });

    } catch (error) {
        console.error("Error fetching bills:", error);
        return res.status(500).json({ msg: "Server error while fetching bills." });
    }
};
