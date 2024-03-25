import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoCollection } from 'src/common/constants';
import { Document } from 'mongoose';
import { MongoBaseSchema } from './base.schema';
import MongooseDelete from 'mongoose-delete';

export type AlbumDocument = Album & Document;

@Schema({
    timestamps: true,
    collection: MongoCollection.ALBUMS,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Album extends MongoBaseSchema {
    @Prop({
        required: true,
        type: String,
    })
    name: string;
    @Prop({
        required: true,
        type: String,
    })
    deviceId: string;
    @Prop({
        required: true,
        type: [String],
        default: [],
    })
    songIds: string[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

AlbumSchema.plugin(MongooseDelete, {
    deletedBy: true,
    deletedByType: String,
    overrideMethods: 'all',
});
