import CreateDeviceRawDto from "../dto/Admin/CreateDeviceRawDto";
import DeviceInfoDto from "../dto/Device/DeviceInfoDto";
import ApiError from "../error/ApiError";

export default class Validator {
    static ValidateDevicesArr(data: any): CreateDeviceRawDto[] {
        if (!Array.isArray(data)) {
            throw ApiError.validationError('data is not array');
        }

        return data.map(el=>new CreateDeviceRawDto(el));
    }
    static ValidateDeviceName(str: any): string {
        if (typeof str !== 'string' || str.length === 0) {
            throw ApiError.validationError('Incorrect device name');
        }

        return str;
    }
    static ValidateDynamicDevicesFilters(dynamic: any): (string | string[])[] {
        if (!Array.isArray(dynamic) || dynamic.length === 0) {
            return null;
        }

        for (const el1 of dynamic) {


            if (Array.isArray(el1)) {
                for (const el2 of el1) {
                    if (typeof el2 === 'string' && el2.length > 3 && el2.length < 100) {//a_a - min key value
                        continue;
                    }
                    return null;
                }
            }


            if (typeof el1 === 'string' && el1.length > 3 && el1.length < 100) {//a_a - min key value
                continue;
            }
            return null;
        }


        return dynamic;
    }
    static ValidateNumberArr(arr: any, require: boolean = false, objectName: string = null): number[] {
        if (!Array.isArray(arr)) {
            if (require) {
                throw ApiError.validationError(`Validation error, ${objectName} is not array`);
            }
            return null;
        }

        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'number' || Number.isNaN(arr[i])) {
                if (require) {
                    throw ApiError.validationError(`Validation error, ${objectName}, one of elements is not a number`);
                }
                return null;
            }
        }
        return arr;
    }
    static ValidateString(str: any, require: boolean = false, objectName: string = null): string {
        if (typeof str !== 'string' || str.length === 0) {
            if (require) {
                throw ApiError.validationError(`Validation error, ${objectName} is not valid`);
            }
            return null;
        }
        return str;
    }
    static isNumber(num: any, objectName: string = 'numPart'): number {
        try {
            num = Number(num);
            if (!Number.isNaN(num)) {
                return num;
            }
        } catch {
            throw ApiError.validationError(`Incorrect ${objectName}`);
        }
    }
    static ValidateDeviceInfo(info: any) {
        if (!Array.isArray(info)) {
            throw ApiError.validationError(`Validation error, info is not array`);
        }
        return info.map(el => new DeviceInfoDto(el));
    }
    static ValidateBoolean(bool: any, objectName: string = 'disabled'): boolean {
        if (typeof bool == "boolean") {
            return bool;
        }


        if (require) {
            throw ApiError.validationError(`Validation error, ${objectName} is not boolean`);
        }
        return null;
    }

    static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static nameRegex = /^[a-z][a-z '-.,]{0,31}$|^$/i;
    static passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    static ValidatePropsValues(values: any, objectName = 'values'): string[] {
        if (!Array.isArray(values)) {
            throw ApiError.validationError(`Validation error, ${objectName} is not array`);
        }

        for (const el of values) {
            if (typeof el !== 'string' || el.length == 0 || el.length > 100) {
                throw ApiError.validationError(`Validation error, ${objectName}, one of elements is incorrect`);
            }
        }
        return values;
    }
    static ValidateEmail(email: any, objectName = 'email'): string {
        if (email && typeof email === 'string') {
            if (this.emailRegex.test(email)) {
                return email;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidateUserName(name: any, objectName = 'name'): string {
        if (name && typeof name === 'string') {
            if (this.nameRegex.test(name)) {
                return name;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidatePassword(password: any, objectName = 'password'): string {
        if (password && typeof password === 'string') {
            if (this.passwordRegex.test(password)) {
                return password;
            }
        }
        throw ApiError.validationError(`Validation error, incorrect ${objectName}`);
    }
    static ValidatePositiveNumber(num: any, objectName = 'limit'): number {
        try {
            num = Number(num);
            if (!Number.isNaN(num) && num >= 0) {
                return num;
            }
        } catch {
            throw ApiError.validationError(`Incorrect ${objectName}`);
        }
    }
    static ValidateBrandTypeName(name: any, objectName = 'name'): string {
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