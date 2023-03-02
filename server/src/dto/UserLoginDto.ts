import Validator from "../utils/Validator"

export default class UserLoginDto {
    email: string
    password: string
    constructor(body: any) {
        this.email = Validator.ValidateEmail(body.email);
        this.password = Validator.ValidatePassword(body.password);
    }
}