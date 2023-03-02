import TokenUserData from "../dto/TokenUserDataDto";
import UserLoginDto from "../dto/UserLoginDto";
import UserRegistrationDto from "../dto/UserRegistrationDto";
import ApiError from "../error/ApiError";
import { User } from "../models/models";
import Cryptor from "../utils/Crypror";


class AuthService {
    async recreateToken(userDto: TokenUserData): Promise<string> {
        const user = <any>await User.findOne({ where: { id: userDto.id } });
        const token = await Cryptor.generateToken(user);
        return token;
    }
    async login(userDto: UserLoginDto) {
        const user = <any>await User.findOne({ where: { email: userDto.email } });
        if (!user) {
            throw ApiError.badRequest('User not found');
        }
        const comparePasswd = await Cryptor.comparePasswords(userDto.password, user.password);
        if (!comparePasswd) {
            throw ApiError.badRequest('Incorrect password');
        }
        const token = await Cryptor.generateToken(user);
        return token;
    }
    async registration(userDto: UserRegistrationDto): Promise<string> {
        const candidate = await User.findOne({ where: { email: userDto.email } });
        if (candidate) {
            throw ApiError.badRequest('Such user already exists');
        }
        const passwordHash = Cryptor.encryptPassword(userDto.password);
        const user = <any>await User.create({ ...userDto, password: passwordHash });
        const token = await Cryptor.generateToken(user);
        return token;
    }

}

export default new AuthService();