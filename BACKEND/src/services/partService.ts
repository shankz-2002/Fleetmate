import { PartUsed } from "../entities/PartUsed";
import { Bill } from "../entities/BIll";

export const partCreateService = async (data: any, bill: Bill) => {
    const { partName, quantity, cost } = data;

    const newPart = new PartUsed();
    newPart.partName = partName;
    newPart.quantity = quantity;
    newPart.cost = cost;
    newPart.bill = bill;
    newPart.manager = bill.manager;

    await newPart.save();

    // ✅ Recalculate total including all parts
    const parts = await PartUsed.find({
        where: { bill: { id: bill.id } },  // ✅ Correct
        select: ['cost', 'quantity'],
    }); const totalPartsCost = parts.reduce((sum, p) => sum + p.cost * p.quantity, 0);

    // ✅ Final updated bill total

    bill.totalAmount = totalPartsCost + bill.laborCharge + bill.taxes;
        console.log(bill.totalAmount);

    await bill.save();

    return newPart;
};
