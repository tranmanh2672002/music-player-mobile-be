import { SoftDeleteModel } from 'mongoose-delete';
import { BaseRepository } from './base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '@/mongo-schemas/album.schema';

export class AlbumRepo extends BaseRepository<AlbumDocument> {
    constructor(
        @InjectModel(Album.name)
        playlistModel: SoftDeleteModel<AlbumDocument>,
    ) {
        super(playlistModel);
    }
}
