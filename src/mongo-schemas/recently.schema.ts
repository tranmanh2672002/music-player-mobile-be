import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoCollection } from 'src/common/constants';
import { Document, SchemaTypes, Types } from 'mongoose';
import { MongoBaseSchema } from './base.schema';
import MongooseDelete from 'mongoose-delete';
import { Song } from './song.schema';

export type RecentlyDocument = Recently & Document;

@Schema({
    timestamps: true,
    collection: MongoCollection.RECENTLY,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Recently extends MongoBaseSchema {
    @Prop({
        required: true,
        type: String,
    })
    deviceId: string;
    @Prop({
        required: true,
        type: [SchemaTypes.ObjectId],
        ref: Song.name,
        default: [],
    })
    songIds: Types.ObjectId[];
}

export const RecentlySchema = SchemaFactory.createForClass(Recently);

RecentlySchema.plugin(MongooseDelete, {
    deletedBy: true,
    deletedByType: String,
    overrideMethods: 'all',
});
