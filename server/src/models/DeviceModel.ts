import { BelongsTo, Column, ForeignKey, HasMany, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import BasketModel from "./BasketModel";
import DeviceInfoModel from "./DeviceInfoModel";
import TypesModel from "./TypeModel";
import BrandModel from "./BrandModel";
import RatingModel from "./RatingModel";

interface DeviceCreationAttributes {
    name: string;
    price: number;
    disabled?: boolean;
    avaliable?: boolean;
    typeId:number;
    brandId:number;
}

@Table({ tableName: 'device' })
export default class DeviceModel extends Model<DeviceModel, DeviceCreationAttributes> {
    @Column({
        type: DataTypes.STRING, unique: true, allowNull: false, validate: {
            len: {
                args: [3, 150],
                msg: 'Name must contain between 5 and 50 characters.'
            },
            not: {
                args: /[`<>]/,
                msg: 'Must be only letters',
            }
        }
    })
    name: string;

    @Column({
        type: DataTypes.DECIMAL, allowNull: false, validate: {
            custom: (el) => {
                if (el < 0) { throw { message: 'Price must be above zero', path: 'price', type: 'Validation error' } }
            }
        }
    })
    price: number;

    @Column({ type: DataTypes.STRING, allowNull: false })
    img: string;

    @Column({ type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 })
    rate: number;

    @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
    ratecount: number;

    @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
    disabled: boolean;

    @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true })
    avaliable: boolean;

    @HasMany(()=>BasketModel)
    basket:BasketModel[];

    @HasMany(()=>DeviceInfoModel)
    info:DeviceInfoModel[];

    @HasMany(()=>RatingModel)
    rates:RatingModel[];

    @ForeignKey(()=>TypesModel)
    @Column({type: DataTypes.INTEGER})
    typeId:number;

    @BelongsTo(()=>TypesModel)
    type:TypesModel;

    @ForeignKey(()=>BrandModel)
    @Column({type: DataTypes.INTEGER})
    brandId:number;

    @BelongsTo(()=>BrandModel)
    brand:BrandModel;
}
