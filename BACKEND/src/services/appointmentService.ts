import { Appointment } from "../entities/Appointment";

export const appointmentCreateService=async (data:any,vehicle:any) => {
    const {appointmentDate,remarks}=data;

    const newAppointment=new Appointment();
    newAppointment.appointmentDate=appointmentDate;
    newAppointment.remarks=remarks;
    newAppointment.customer=vehicle.customer;
    newAppointment.vehicle=vehicle
    return await newAppointment.save();

    
}