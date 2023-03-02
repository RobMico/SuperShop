import { BelongsTo, Column, ForeignKey, HasMany, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import CommentsModel from "./CommentsModel";
import UserModel from "./UserModel";
import DeviceModel from "./DeviceModel";

interface RatingCreationAttributes {
    rate: number;
    comment: string;
    userName: string;
}


@Table({ tableName: 'rating' })
export default class RatingModel extends Model<RatingModel, RatingCreationAttributes> {
    @Column({
        type: DataTypes.DECIMAL, allowNull: false, validate: {
            min: 0,
            max: 5
        }
    })
    rate: number;
    @Column({
        type: DataTypes.STRING, allowNull: true, validate: {
            len: {
                args: [0, 50000],
                msg: 'Comment can not be more than 50000 characters'
            },
            // not: {
            //     args: /[`<>{}\[\]\/]/,
            //     msg: 'Must be only letters',
            // }
        }
    })
    comment: string;
    @Column({
        type: DataTypes.STRING, allowNull: false
    })
    userName: string;

    @HasMany(()=>CommentsModel)
    comments:CommentsModel[];
    
    @ForeignKey(()=>UserModel)
    @Column({type: DataTypes.INTEGER})
    userId:number;

    @BelongsTo(()=>UserModel)
    user:UserModel;

    @ForeignKey(()=>DeviceModel)
    @Column({type: DataTypes.INTEGER})
    deviceId:number;

    @BelongsTo(()=>DeviceModel)
    device:DeviceModel;
}