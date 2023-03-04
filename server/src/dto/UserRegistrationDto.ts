import Validator from "../utils/Validator"

export default class UserRegistrationDto {
    email: string
    name: string
    password: string
    constructor(body: any) {
        this.email = Validator.ValidateEmail(body.email);
        this.name = Validator.ValidateUserName(body.name);
        this.password = Validator.ValidatePassword(body.password);
    }
}