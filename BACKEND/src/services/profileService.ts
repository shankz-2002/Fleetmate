import { CustomerProfile } from "../entities/CustomerProfile";
import { MechanicProfile } from "../entities/MechanicProfile";

export const createCustomerProfile = async (
    { phone, address, profileImage }: any,
    user: any
) => {
    const newProfile = new CustomerProfile();
    newProfile.phone = phone;
    newProfile.address = address;
    newProfile.profileImage = profileImage;
    newProfile.user = user;

    return await newProfile.save();

}

export const createMechanicProfile = async ({ phone, address, profileImage, skills, yearsOfExperience, isEngaged }: any, user: any) => {
    const newProfile = new MechanicProfile();
    newProfile.phone = phone;
    newProfile.address = address;
    newProfile.profileImage = profileImage;
    newProfile.skills = skills;
    newProfile.yearsOfExperience = yearsOfExperience;
    newProfile.isEngaged = isEngaged;
    newProfile.user = user

    return await newProfile.save();

}

export const customerUpdate = async (data: any, profile: CustomerProfile) => {
    const { phone, address, profileImage } = data;

    if (phone !== undefined) profile.phone = phone;
    if (address !== undefined) profile.address = address;
    if (profileImage !== undefined) profile.profileImage = profileImage;

    return await profile.save();
};


export const mechanincUpdate = async (data: any, user: any) => {
    const { phone, address, profileImage, skills, yearsOfExperience } = data;

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (skills !== undefined) user.skills = skills;
    if (yearsOfExperience !== undefined) user.yearsOfExperience = yearsOfExperience;

    return await user.save();
};