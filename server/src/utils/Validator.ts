import ApiError from "../error/ApiError";

export default class Validator {
    static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static nameRegex = /^[a-z][a-z '-.,]{0,31}$|^$/i;
    static passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    static ValidateEmail(email: any): string {
        if (email && typeof email === 'string') {
            if (this.emailRegex.test(email)) {
                return email;
            }
        }
        throw ApiError.validationError('Validation error, incorrect email');
    }
    static ValidateName(name: any): string {
        if (name && typeof name === 'string') {
            if (this.nameRegex.test(name)) {
                return name;
            }
        }
        throw ApiError.validationError('Validation error, incorrect name');
    }
    static ValidatePassword(password: any): string {
        if (password && typeof password === 'string') {
            if (this.passwordRegex.test(password)) {
                return password;
            }
        }
        throw ApiError.validationError('Validation error, incorrect password');
    }
    static ValidatePositiveNumber(num: any): number {
        try {
            num = Number(num);
            if (!Number.isNaN(num) && num >= 0) {
                return num;
            }
        } catch {
            throw ApiError.validationError('Incorrect limit');
        }
    }
}