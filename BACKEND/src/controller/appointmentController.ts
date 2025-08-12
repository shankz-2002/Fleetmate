import { Appointment } from "../entities/Appointment";
import { Vehicle } from "../entities/Vehicle";
import { appointmentCreateService } from "../services/appointmentService";

export const appointmentCreate = async (req: any, res: any) => {
    try {
        const { userId } = req.user;
        const vehicleId = Number(req.params.id);

        const found = await Vehicle.findOne({
            where: {
                id: vehicleId,
                customer: { id: userId },
            },
            relations: ["customer"],
        });

        if (!found) {
            return res.status(404).json({ msg: "Vehicle not found " });
        }

        if (found.customer.role !== "customer") {
            return res.status(403).json({ msg: "Only customers can create appointments" });
        }

        if (req.user.id !== found.customer.id) {
            return res.status(403).json({ msg: "You are not the owner of the vehicle" })
        }

        const result = await appointmentCreateService(req.body, found);

        return res.status(201).json({
            msg: "Appointment created successfully",
            result,
        });
    } catch (error: any) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({
            msg: "Failed to create appointment",
            error: error.message || "Internal Server Error",
        });
    }
};




export const appointmentView = async (req: any, res: any) => {
    try {
        const userId = req.user.id;

        const appointments = await Appointment.find({
            where: { customer: { id: userId } },
            relations: ["vehicle", "customer"],
            order: { appointmentDate: "DESC" }
        });

        return res.status(200).json({
            msg: "Appointments retrieved",
            result: appointments,
        });
    } catch (error: any) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({
            msg: "Failed to fetch appointments",
            error: error.message || "Internal Server Error",
        });
    }
};
