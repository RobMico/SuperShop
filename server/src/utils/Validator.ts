import ApiError from "../error/ApiError";

export default class Validator {
    
    static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static nameRegex = /^[a-z][a-z '-.,]{0,31}$|^$/i;
    static passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    static ValidatePropsValues(values: any, objectName='values'): string[] {
        if(!Array.isArray(values))
        {
            throw ApiError.validationError(`Validation error, ${objectName} is not array`);
        }

        for(const el of values)
        {
            if(typeof el!== 'string'||el.length==0||el.length>100)
            {
                throw ApiError.validationError(`Validation error, ${objectName}, one of elements is incorrect`);
            }
        }
        return values;
    }
    static ValidateEmail(email: any, objectName='email'): string {
        if (email && typeof email === 'string') {
            if (this.emailRegex.test(email)) {
                return email;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidateUserName(name: any, objectName='name'): string {
        if (name && typeof name === 'string') {
            if (this.nameRegex.test(name)) {
                return name;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidatePassword(password: any, objectName='password'): string {
        if (password && typeof password === 'string') {
            if (this.passwordRegex.test(password)) {
                return password;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidatePositiveNumber(num: any, objectName='limit'): number {
        try {
            num = Number(num);
            if (!Number.isNaN(num) && num >= 0) {
                return num;
            }
        } catch {
            throw ApiError.validationError(`Incorrect ${objectName}`);
        }
    }
    static ValidateBrandTypeName(name: any, objectName='name'): string {
        if (name && typeof name === 'string') {
            if (name.length >= 2 && name.length < 50) {
                return name;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidateDescription(description: any, require: boolean = false): string {
        if (!description) {
            if (!require) {
                return null;
            }
            throw ApiError.validationError('Validation error, undefined description');
        }
        if (typeof description === 'string') {
            if (description.length >= 2 && description.length < 500) {
                return description;
            }
        }
        throw ApiError.validationError('Validation error, incorrect descrioption');
    }
}