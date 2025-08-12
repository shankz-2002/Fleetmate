import { Appointment } from "../entities/Appointment";
import { User } from "../entities/User";
import { addMechanicService, findMechanic } from "../services/managerService";

export const addMechanic = async (req: any, res: any) => {
    try {
        const appointId = Number(req.params.id);

        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: "You are not authorized to assign mechanic" });
        }

        const appoint = await Appointment.findOne({ where: { id: appointId } });
        if (!appoint) {
            return res.status(404).json({ msg: "Appointment not found" });
        }

        const mechanicId = Number(req.body.mechanicId);

        const result = await addMechanicService(mechanicId, appoint, req.user);

        return res.status(200).json({
            msg: "Mechanic assigned successfully",
            result
        });

    } catch (error: any) {
        console.error("Assign mechanic error:", error);
        return res.status(500).json({ msg: error.message || "Server error" });
    }
};


export const viewMechanic = async (req: any, res: any) => {
    const managerId = req.user.id
    try {
        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: "You are not Authorized to view this " });
        }
        const found = await User.findOne({ where: { id: managerId } });
        if (!found) {
            return res.status(404).json({ msg: "Manager not found" });
        }
        const result = await findMechanic();
        res.status(200).json({
            result
        })
    } catch (error: any) {
        console.error("View mechanic error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });

    }

}


export const viewAppointment = async (req: any, res: any) => {
    try {
        if (req.user?.role === 'manager' || req.user.role === 'admin') {

            const appointments = await Appointment.find({
                relations: ['vehicle', 'customer', 'mechanic', 'mechanic.user'],
                order: { appointmentDate: 'DESC' },
            });

            if (appointments.length === 0) {
                return res.status(404).json({ msg: 'No appointments found' });
            }

            const formatted = appointments.map(app => ({
                id: app.id,
                appointmentDate: app.appointmentDate,
                status: app.status,
                remarks: app.remarks,
                vehicle: app.vehicle,
                customer: app.customer,
                mechanic: app.mechanic
                    ? {
                        id: app.mechanic.user.id,
                        name: app.mechanic.user.name,
                        isEngaged: app.mechanic.isEngaged

                    }
                    : null
            }));

            return res.status(200).json({
                msg: 'Appointments retrieved successfully',
                result: formatted
            });
        }
        return res.status(403).json({ msg: "you are not authorized" })
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        return res.status(500).json({
            msg: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


export const cancelAppointment = async (req: any, res: any) => {
    try {
        const appointId = Number(req.params.id);
        const found = await Appointment.findOne({ where: { id: appointId } });
        if (!found) {
            return res.status(404).json({ msg: "Appointment not found" })
        }
        found.status = 'cancelled';
        await found.save();
        return res.status(200).json({ msg: "Appointment cancelled successfully" });



    } catch (error) {
        console.error("Cancel appointment error:", error);
        return res.status(500).json({ msg: "Internal server error" });

    }

}


export const personalAppointment = async (req: any, res: any) => {
    try {
        const managerId = req.user.id;

        const appoint = await Appointment.find({
            where: {
                assignedBy: { id: managerId },
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
};

