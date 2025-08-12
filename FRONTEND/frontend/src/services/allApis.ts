import commonAPI from "./commonApi"
const baseUrl = 'http://localhost:5000'

export const registerUser = async (formData: any) => {
    return commonAPI('post', `${baseUrl}/user/register`, formData);
}

export const loginUser = async (formData: any) => {
    return commonAPI('post', `${baseUrl}/user/login`, formData)
}
export const forgotPassword = async (email: string) => {
    return commonAPI('post', `${baseUrl}/user/api/auth/forgot-password`, { email });
};
export const getCustomerProfile = async () => {
    return commonAPI('get', `${baseUrl}/user/view`);
}
export const createCustomerProfile = async (data: any) => {
    return commonAPI('post', `${baseUrl}/user/customerprofile`, data);

}
export const updateCustomerProfile = async (data: any) => {
    return commonAPI('put', `${baseUrl}/user/update`, data);

}
export const deleteCustomerProfile = async () => {
    return commonAPI('delete', `${baseUrl}/user/delete`);

}
export const getMechanicProfile = async () => {
    return commonAPI('get', `${baseUrl}/user/view`);
}
export const createMechanicProfile = async (data: any) => {
    return commonAPI('post', `${baseUrl}/user/mechanicprofile`, data);

}
export const updateMechanicProfile = async (data: any) => {
    return commonAPI('put', `${baseUrl}/user/update`, data);


}
export const deleteMechanicProfile = async () => {
    return commonAPI('delete', `${baseUrl}/user/delete`);

}
export const getAppointments = async () => {
    return commonAPI('get', `${baseUrl}/appointment/viewCustomer`)

}

export const getVehicles = async () => {
    return commonAPI('get', `${baseUrl}/vehicle/view`);
}

export const createVehicle = async (vehicleData: any) => {
    const response = await commonAPI('post', `${baseUrl}/vehicle/create`, vehicleData);
    return response.data.result;

};

export const deleteVehicle = async (id: any) => {
    return commonAPI('delete', `${baseUrl}/vehicle/delete/${id}`)

}

export const appointmentCreate = async (id: number, data: { appointmentDate: string; remarks?: string }) => {
    return commonAPI('post', `${baseUrl}/appointment/create/${id}`, data);

}
export const getAppointmentsManager = async () => {
    return commonAPI('get', `${baseUrl}/manager/viewAppointment`);

}

export const findMechanic = async () => {
    return commonAPI('get', `${baseUrl}/manager/viewmechanic`);

}

export const assignMechanicToAppointment = async (appointmentId: number, mechanicId: number) => {
    return commonAPI('post', `${baseUrl}/manager/addmechanic/${appointmentId}`, { mechanicId });

}

export const cancelAppointment = async (id: number) => {
    return commonAPI('post', `${baseUrl}/manager/cancelAppointment/${id}`);
}


export const getMechanicTasks = async () => {
    return commonAPI('get', `${baseUrl}/mechanic/viewTask`);
}


export const updateAppointmentStatus = async (id: number, status: string) => {
    return commonAPI('post', `${baseUrl}/mechanic/status/${id}`, { status })

}


export const personalAppointmentsManager = async () => {
    return commonAPI('get', `${baseUrl}/manager/viewPersonalAppointment`)

}


export const createBill = async (appointmentId: number, data: any) => {
    return commonAPI("post", `${baseUrl}/bill/create/${appointmentId}`, data);
};

export const createPart = async (data: any, billId: number) => {
    return commonAPI("post", `${baseUrl}/part/create/${billId}`, data);
};

export const updateBill = async (billId: number, data: any) => {
    return commonAPI("put", `${baseUrl}/bill/update/${billId}`, data);
};

export const deletePart = async (partId: number) => {
    return commonAPI("delete", `${baseUrl}/part/delete/${partId}`);

}


export const customerBill = async () => {
    return commonAPI('get', `${baseUrl}/bill/view`);

}



export const getMechanicAppointment = async () => {
    return commonAPI('get', `${baseUrl}/mechanic/viewAppointment`);
}


export const getUsersAdmin = async () => {
    return commonAPI('get', `${baseUrl}/admin/viewuser`);

}


export const deleteUsers = async (id: number) => {
    return commonAPI('delete', `${baseUrl}/admin/delete/${id}`)
}


export const createUsers = async (data: any) => {
    return commonAPI('post', `${baseUrl}/user/register`, data);

}


export const updateUsers = async (data: any, id: number) => {
    return commonAPI('put', `${baseUrl}/admin/update/${id}`, data);

}



export const getallVehicles = async () => {
    return commonAPI('get', `${baseUrl}/admin/viewallvehicle`);

}



export const allBills = async () => {
    return commonAPI('get', `${baseUrl}/admin/viewbill`);

}

export const analysis = async () => {
    return commonAPI('get', `${baseUrl}/analysis/view`);

}



export const resetPassword = async (token: any, newPassword: any) => {
    return commonAPI('post', `${baseUrl}/user/api/auth/reset-password`, { token, newPassword });
}


