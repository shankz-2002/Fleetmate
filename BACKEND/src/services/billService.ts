import { Bill } from "../entities/BIll";
import { PartUsed } from "../entities/PartUsed";

export const billCreateService = async (data: any, appoint: any, manager: any) => {
    const { laborCharge, taxes } = data;

    const newBill = new Bill();
    newBill.laborCharge = laborCharge;
    newBill.taxes = taxes;
    newBill.totalAmount = laborCharge + taxes;

    newBill.appointment = appoint;
    newBill.manager = manager;
    newBill.user = appoint.customer;

    return await newBill.save();
};


export const billUpdateService = async (data: any, bill: any) => {
    const { laborCharge, taxes } = data;

    if (laborCharge !== undefined) bill.laborCharge = laborCharge;
    if (taxes !== undefined) bill.taxes = taxes;

    // Recalculate totalAmount = sum of all parts + laborCharge + taxes
    const parts = await PartUsed.find({ where: { bill: { id: bill.id } } });
    const partsTotal = parts.reduce((sum, p) => sum + p.cost * p.quantity, 0);

    bill.totalAmount = partsTotal + (bill.laborCharge || 0) + (bill.taxes || 0);

    return await bill.save();
}
