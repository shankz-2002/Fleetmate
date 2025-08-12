import { Appointment } from "../entities/Appointment";
import { MechanicProfile } from "../entities/MechanicProfile";

export const updateStatus = async (req: any, res: any) => {
    try {
        const appointId = Number(req.params.id);
        const { status } = req.body;

        if (req.user.role !== 'mechanic') {
            return res.status(403).json({ msg: "Only mechanics can update appointment status" });
        }

        const mechanicProfile = await MechanicProfile.findOne({
            where: { user: { id: req.user.id } },
            relations: ["user"] // important if needed
        });

        if (!mechanicProfile) {
            return res.status(404).json({ msg: "Mechanic profile not found" });
        }

        const appointment = await Appointment.findOne({
            where: { id: appointId },
            relations: ["mechanic"]
        });

        if (!appointment) {
            return res.status(404).json({ msg: "Appointment not found" });
        }

        if (appointment.mechanic?.id !== mechanicProfile.id) {
            return res.status(403).json({ msg: "You are not authorized to update this appointment" });
        }

        const allowedStatuses = ["in-progress", "completed", "cancelled"];
        if (!allowedStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        appointment.status = status.toLowerCase();
        await appointment.save();

        if (status.toLowerCase() === "completed") {
            mechanicProfile.isEngaged = false;
            await mechanicProfile.save();
        }

        return res.status(200).json({ msg: "Appointment status updated", appointment });

    } catch (error: any) {
        console.error("Status update error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};


export const viewTask = async (req: any, res: any) => {
    try {
        const mechanicId = req.user.id;

        const appoint = await Appointment.find({ where: { mechanic: { user: { id: mechanicId } } }, relations: ["mechanic", "mechanic.user", "vehicle"] })
        if (!appoint) {
            return res.status(404).json({ msg: "No task for you" })
        }
        return res.status(200).json({ appoint })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });

    }

}



export const viewMechanicAppointment = async (req: any, res: any) => {
    try {
        const mechanicId = req.user.id;

        const found = await Appointment.find({
            where: { mechanic: { user: { id: mechanicId } } },
            relations: ["vehicle", "customer", "bill"]  // Add more relations if needed
        });


        if (!found) {
            return res.status(404).json({ msg:"appointment not found forthis mechanic" });
        }

        return res.status(200).json({ appointments: found });

    } catch (error) {
        console.error("Error fetching mechanic appointments:", error);
        return res.status(500).json({ msg: "Internal server error." });
    }
};
