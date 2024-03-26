import { SoftDeleteModel } from 'mongoose-delete';
import { BaseRepository } from './base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Recently, RecentlyDocument } from '@/mongo-schemas/recently.schema';

export class RecentlyRepo extends BaseRepository<RecentlyDocument> {
    constructor(
        @InjectModel(Recently.name)
        recentlyModel: SoftDeleteModel<RecentlyDocument>,
    ) {
        super(recentlyModel);
    }
}
