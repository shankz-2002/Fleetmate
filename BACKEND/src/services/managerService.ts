import { MechanicProfile } from "../entities/MechanicProfile";
import { Appointment } from "../entities/Appointment";
import { User } from "../entities/User";

export const addMechanicService = async (mechanicId: number, appoint: Appointment, manager: User) => {

    const availableMechanics = await MechanicProfile.find({ where: { isEngaged: false } });

    if (availableMechanics.length === 0) {
        appoint.status = "Cancelled";
        await appoint.save();
        throw new Error("No available mechanics. Appointment has been cancelled.");
    }

    const mechanic = await MechanicProfile.findOne({ where: { user: { id: mechanicId } }, relations: ['user'] });
    if (!mechanic) {
        throw new Error("Mechanic not found");
    }
    if (mechanic.isEngaged) {
        throw new Error("Mechanic is already engaged");
    }

    appoint.mechanic = mechanic;
    appoint.assignedBy = manager;
    appoint.status = "In Progress";
    await appoint.save();

    mechanic.isEngaged = true;
    await mechanic.save();

    return appoint;
}

export const findMechanic = async () => {
    const availableMechanics = await MechanicProfile.find({ where: { isEngaged: false }, relations: ['user'] });

    const mechanicDetail = availableMechanics.map((profile) => ({
        name: profile.user.name,
        skills: profile.skills,
        yearsOfExperience: profile.yearsOfExperience,
        id:profile.user.id
    }))
    return mechanicDetail;
}
