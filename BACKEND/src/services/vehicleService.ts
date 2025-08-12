import { Vehicle } from "../entities/Vehicle"

export const vehicleCreateService = async (data: any, user: any) => {
    const { make, model, year, regNumber } = data;
    const newVehicle = new Vehicle();
    newVehicle.make = make;
    newVehicle.model = model;
    newVehicle.year = year;
    newVehicle.regNumber = regNumber;
    newVehicle.customer = user;
    return await newVehicle.save();

}

export const vehicleUpdateService = async (data: any, vehicle: any) => {
    const { make, model, year, regNumber } = data;

    if (make !== undefined) vehicle.make = make;
    if (model !== undefined) vehicle.model = model;
    if (year !== undefined) vehicle.year = year;
    if (regNumber !== undefined) vehicle.regNumber = regNumber;

    return vehicle.save();


}