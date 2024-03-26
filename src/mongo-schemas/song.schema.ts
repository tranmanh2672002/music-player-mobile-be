import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { MongoCollection } from 'src/common/constants';
import { MongoBaseSchema } from './base.schema';

export type SongDocument = Song & Document;

@Schema({
    _id: false,
})
export class Thumbnail {
    @Prop({
        required: true,
        type: String,
    })
    url: string;

    @Prop({
        required: true,
        type: Number,
    })
    width: number;

    @Prop({
        required: true,
        type: Number,
    })
    height: number;
}
export const ThumbnailSchema = SchemaFactory.createForClass(Thumbnail);

@Schema({
    timestamps: true,
    collection: MongoCollection.SONGS,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Song extends MongoBaseSchema {
    @Prop({
        required: true,
        type: String,
    })
    name: string;

    @Prop({
        required: true,
        type: String,
    })
    youtubeId: string;

    @Prop({
        required: true,
        type: [ThumbnailSchema],
    })
    thumbnails: Thumbnail[];

    @Prop({
        required: true,
        type: String,
    })
    artist: string;

    @Prop({
        required: true,
        type: Number,
    })
    duration: number;
}
export const SongSchema = SchemaFactory.createForClass(Song);

SongSchema.plugin(MongooseDelete, {
    deletedBy: true,
    deletedByType: String,
    overrideMethods: 'all',
});
