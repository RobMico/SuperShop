import { Column, HasMany, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import DeviceModel from "./DeviceModel";

interface BrandCreationAttributes {
    name: string;
    img?: string;
    description?: string;
}


@Table({ tableName: 'brand' })
export default class BrandModel extends Model<BrandModel, BrandCreationAttributes> {
    @Column({
        type: DataTypes.STRING, unique: true, allowNull: false, validate: {
            len: {
                args: [2, 50],
                msg: 'Name must contain between 2 and 50 characters.'
            },
            // not: {
            //     args: /[`<>{}\[\]\/]/,
            //     msg: 'Must be only letters',
            // }
        }
    })
    name: string;
    @Column({ type: DataTypes.STRING, defaultValue: 'noimage.jpg' })
    img: string;
    @Column({ type: DataTypes.TEXT, defaultValue: '' })
    description: string;

    @HasMany(()=>DeviceModel)
    devices:DeviceModel[];
}