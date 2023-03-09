import ApiError from "../../error/ApiError";
import Validator from "../../utils/Validator";

class DeviceProp {
    name: string;
    value: string;
    constructor(prop: any) {
        this.name = Validator.ValidateString(prop.name, true, 'prop name');
        if (this.name.length > 100) {
            throw ApiError.validationError('prop name length more then 100');
        }
        this.value = Validator.ValidateString(prop.value, true, 'prop value');
        if (this.value.length > 100) {
            throw ApiError.validationError('prop value length more then 100');
        }
    }
}

export default class CreateDeviceRawDto {
    brand: string;
    title: string;
    imgs: string[];
    price: number;
    props: DeviceProp[];
    transformImg(fileHolders: string[]) {
        let concated = this.imgs.join(';');

        fileHolders.forEach((holder, index) => {
            concated = concated.replace(new RegExp(holder, 'g'), `%${index}:`);
        });

        return concated;
    }

    constructor(data: any) {
        this.brand = Validator.ValidateString(data.brand, true, 'brand');
        this.title = Validator.ValidateString(data.title, true, 'title');

        if (!data.imgs || !Array.isArray(data.imgs)) {
            throw ApiError.validationError('imgs is not array');
        }
        this.imgs = data.imgs.map(img => Validator.ValidateString(img, true, 'img'));

        this.price = Validator.ValidatePositiveNumber(data.price);

        if (!data.props || !Array.isArray(data.props)) {
            throw ApiError.validationError('props is not array');
        }
        this.props = data.props.map(prop => new DeviceProp(prop));
    }
}