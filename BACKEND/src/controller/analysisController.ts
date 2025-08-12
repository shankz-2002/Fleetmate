import { User, Role } from "../entities/User";
import { Vehicle } from "../entities/Vehicle";
import { Appointment } from "../entities/Appointment";
import { MoreThanOrEqual } from "typeorm";
import { Bill } from "../entities/BIll";


export const getSystemAnalytics = async (req: any, res: any) => {
    try {
        if (req.user.role !== 'manager' && req.user.role !== "admin") {
            return res.status(403).json({ msg: "Not authorized" });
        }

        // 1. User counts by role
        const users = await User.find();
        const userCounts = {
            admin: 0,
            manager: 0,
            mechanic: 0,
            customer: 0,
        };
        users.forEach((u) => {
            if (u.role === Role.ADMIN) userCounts.admin++;
            else if (u.role === Role.MANAGER) userCounts.manager++;
            else if (u.role === Role.MECHANIC) userCounts.mechanic++;
            else if (u.role === Role.USER) userCounts.customer++;
        });

        // 2. Vehicles added last 6 months, grouped by YYYY-MM
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // 6 months range including this month

        const vehicles = await Vehicle.find({
            where: {
                createdAt: MoreThanOrEqual(sixMonthsAgo),
            },
        });

        // Group vehicles by month (YYYY-MM)
        const vehiclesByMonthMap: Record<string, number> = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7);
            vehiclesByMonthMap[key] = 0;
        }
        vehicles.forEach((v) => {
            const month = v.createdAt.toISOString().slice(0, 7);
            if (vehiclesByMonthMap[month] !== undefined) {
                vehiclesByMonthMap[month]++;
            }
        });
        // Convert map to array and sort ascending by month
        const vehiclesByMonth = Object.entries(vehiclesByMonthMap)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => (a.month > b.month ? 1 : -1));

        // 3. Appointments count by status
        const appointments = await Appointment.find();
        const appointmentsByStatusMap: Record<string, number> = {};
        appointments.forEach((a) => {
            appointmentsByStatusMap[a.status] = (appointmentsByStatusMap[a.status] || 0) + 1;
        });
        const appointmentsByStatus = Object.entries(appointmentsByStatusMap).map(
            ([status, count]) => ({ status, count })
        );

        // 4. Revenue by month last 6 months
        const bills = await Bill.find({
            where: {
                createdAt: MoreThanOrEqual(sixMonthsAgo),
            },
        });
        const revenueByMonthMap: Record<string, number> = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7);
            revenueByMonthMap[key] = 0;
        }
        bills.forEach((bill) => {
            const month = bill.createdAt.toISOString().slice(0, 7);
            if (revenueByMonthMap[month] !== undefined) {
                revenueByMonthMap[month] += Number(bill.totalAmount) || 0;
            }
        });
        const revenueByMonth = Object.entries(revenueByMonthMap)
            .map(([month, totalRevenue]) => ({ month, totalRevenue }))
            .sort((a, b) => (a.month > b.month ? 1 : -1));

        return res.status(200).json({
            userCounts: Object.entries(userCounts).map(([role, count]) => ({ role, count })),
            vehiclesByMonth,
            appointmentsByStatus,
            revenueByMonth,
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return res.status(500).json({ msg: "Server error" });
    }
};
