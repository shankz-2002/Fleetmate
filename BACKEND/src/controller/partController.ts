import { Bill } from "../entities/BIll";
import { PartUsed } from "../entities/PartUsed";
import { partCreateService } from "../services/partService";

export const partCreate = async (req: any, res: any) => {
    try {
        const billId = Number(req.params.id);
        const bill = await Bill.findOne({ where: { id: billId }, relations: ['manager'] });
        if (!bill) {
            return res.status(404).json({ msg: "Bill not Found" })
        };
        if (
            req.user.role !== 'admin' &&
            (req.user.role !== 'manager' || req.user.id !== bill.manager.id)
        ) {
            return res.status(403).json({ msg: "not authorized to create part" });
        }
        const result = await partCreateService(req.body, bill);

        if (result) {
            return res.status(201).json({
                msg: "Part created successfully",
                result,
            });
        }

        return res.status(400).json({ msg: "Part creation failed" });

    } catch (error: any) {
        console.error("Part creation error:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });

    }

}


export const partDelete = async (req: any, res: any) => {
    try {
        const partId = Number(req.params.id);

        const part = await PartUsed.findOne({
            where: { id: partId },
            relations: ['bill'], // We need to access the related bill
        });

        if (!part) {
            return res.status(404).json({ message: "Part not found" });
        }

        const bill = part.bill;

        // Delete the part
        await part.remove();

        // Recalculate total
        const parts = await PartUsed.find({
            where: { bill: { id: bill.id } },
            select: ['cost', 'quantity'],
        });

        const totalPartsCost = parts.reduce((sum, p) => sum + p.cost * p.quantity, 0);

        bill.totalAmount = totalPartsCost + bill.laborCharge + bill.taxes;
        await bill.save();

        return res.status(200).json({
            message: "Part deleted and bill total updated",
            updatedTotalAmount: bill.totalAmount,
        });
    } catch (error) {
        console.error("Error deleting part:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
