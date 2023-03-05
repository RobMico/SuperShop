import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TokenUserData from '../dto/TokenUserDataDto';
import UserRegistrationDto from '../dto/Auth/UserRegistrationDto';
import UserModel from '../models/UserModel';

export default class Cryptor {
    static async encryptPassword(password: string): Promise<string> {
        const hashPassword = await bcrypt.hash(password, 5);
        return hashPassword;
    }
    static async comparePasswords(passwordClear: string, passwordHash: string): Promise<boolean> {
        let comparePassword = bcrypt.compareSync(passwordClear, passwordHash);
        return comparePassword;
    }
    static async generateToken(user: TokenUserData | UserModel): Promise<string> {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET_KEY, { expiresIn: '24h' });
        return token;
    }
}