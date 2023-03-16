import { Op } from "sequelize";
import ApiError from "../../error/ApiError";
import Validator from "../../utils/Validator";
import SelectorDto from "../SelectorDto";

class GetAllDevicesDto extends SelectorDto {
    typeId: number;
    nameIncludes: string;
    minPrice: number;
    maxPrice: number;
    brands: number[];
    sortBy: string;
    sortOrder: boolean = true;
    result_key: string;
    dynamic: (string[] | string)[];
    deviceIds: number[];

    constructor(body: any) {
        super(body);
        if (body.typeId) {
            this.typeId = Validator.ValidatePositiveNumber(body.typeId);
            if (body.filters) {
                if (typeof body.filters === 'string') {
                    try {
                        body.filters = JSON.parse(body.filters);
                    } catch {
                        throw ApiError.validationError('body.filters parsing error')
                    }
                }

                this.nameIncludes = Validator.ValidateString(body.filters.nameSubstr);
                this.minPrice = Validator.ValidatePositiveNumber(body.filters.minPrice);
                this.maxPrice = Validator.ValidatePositiveNumber(body.filters.maxPrice);
                this.brands = Validator.ValidateNumberArr(body.filters.brands);
                if (body.filters.sortBy && typeof body.filters.sortBy === 'string') {
                    if (body.filters.sortBy === 'rating') {
                        this.sortBy = 'rate';
                    }
                    else if (body.filters.sortBy === 'reviews') {
                        this.sortBy = 'ratecount';
                    }
                    else if (body.filters.sortBy === 'price') {
                        this.sortBy = 'price';
                    }
                }


                this.dynamic = Validator.ValidateDynamicDevicesFilters(body.filters.dynamic);
                if (body.filters.sortOrder !== undefined) {
                    this.sortOrder = Validator.ValidateBoolean(body.filters.sortOrder, 'sortOrder');
                }
                this.result_key = Validator.ValidateString(body.filters.result_key);
            }
        }
    }

    getFilters() {
        const and = Op.and;
        const resultObject = {};
        resultObject[and] = [{ disabled: false }];
        if (this.typeId) {
            resultObject[and].push({ typeId: this.typeId });
        }
        if (this.nameIncludes) {
            resultObject[and].push({ name: { [Op.substring]: this.nameIncludes } });
        }

        if (this.minPrice && this.maxPrice) {
            resultObject[and].push({ price: { [Op.between]: [this.minPrice, this.maxPrice] } });
        }
        else {
            this.minPrice && resultObject[and].push({ price: { [Op.gte]: this.minPrice } });
            this.maxPrice && resultObject[and].push({ price: { [Op.lte]: this.maxPrice } });
        }

        if (this.brands) {
            resultObject[and].push({ brandId: { [Op.in]: this.brands } });
        }

        if (this.deviceIds) {
            resultObject[and].push({ id: { [Op.in]: this.deviceIds } });
        }

        return resultObject;
    }
    getOrder() {
        const resultObject: ([string, string])[] = [['avaliable', 'desc']];

        if (this.sortBy) {
            resultObject.push([this.sortBy, this.sortOrder ? 'desc' : 'asc']);
        }

        return resultObject;
    }
}

export default GetAllDevicesDto;