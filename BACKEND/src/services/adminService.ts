export const updatUserService = async (data: any, user: any) => {
    const { name, email, role } = data;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    return await user.save();
}