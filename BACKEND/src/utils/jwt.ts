import jwt from 'jsonwebtoken'
export const createToken = (found: any) => {
    const {name,email,role,id}=found;
    const user={name,email,role,id}
    return jwt.sign(user,"accessToken",{expiresIn:'1d'});

}