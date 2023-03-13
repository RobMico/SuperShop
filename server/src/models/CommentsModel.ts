import { BelongsTo, Column, ForeignKey, Table, Model } from "sequelize-typescript";
import { DataTypes, Op } from 'sequelize';
import UserModel from "./UserModel";
import RatingModel from "./RatingModel";

interface CommentsCreationAttributes {
    comment: string;
    userName: string;
    userId: number;
    rateId: number;
}


@Table({ tableName: 'comment' })
export default class CommentsModel extends Model<CommentsModel, CommentsCreationAttributes> {
    @Column({
        type: DataTypes.STRING, allowNull: true, validate: {
            len: {
                args: [5, 50000],
                msg: 'Comment must contain between 5 and 50000 characters'
            }
        }
    })
    comment: string;
    @Column({ type: DataTypes.STRING, allowNull: false })
    userName: string;

    @ForeignKey(() => UserModel)
    @Column({ type: DataTypes.INTEGER, allowNull: true})
    userId: number;

    @BelongsTo(() => UserModel)
    user: UserModel;

    @ForeignKey(() => RatingModel)
    @Column({ type: DataTypes.INTEGER, allowNull: true })
    rateId: number;

    @BelongsTo(() => RatingModel)
    rate: UserModel;
}