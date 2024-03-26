import { RecentlyRepo } from '@/repositories/recently.repo';
import { SongRepo } from '@/repositories/song.repo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from 'src/common/services/winston.service';
import { MODULE_NAME, RECENTLY_MUSIC_LIMIT } from '../recently.constant';

@Injectable()
export class RecentlyService {
    constructor(
        private readonly configService: ConfigService,
        private readonly songRepo: SongRepo,
        private readonly recentlyRepo: RecentlyRepo,
    ) {}
    private readonly logger = createWinstonLogger(
        MODULE_NAME,
        this.configService,
    );

    async checkExisted(id: string) {
        try {
            const data = await this.recentlyRepo.existedByFields({
                deviceId: id,
            });
            return data;
        } catch (error) {
            this.logger.error('Error checkExisted in recently service', error);
            throw error;
        }
    }

    async getDetail(id: string) {
        try {
            const song = await this.recentlyRepo
                .findOne({ deviceId: id })
                .populate('songIds')
                .lean();
            return song;
        } catch (error) {
            this.logger.error('Error getDetail in recently service', error);
            throw error;
        }
    }

    async getByDeviceId(id: string) {
        try {
            const song = await this.recentlyRepo
                .findOne({ deviceId: id })
                .lean();
            return song;
        } catch (error) {
            this.logger.error('Error getByDeviceId in recently service', error);
            throw error;
        }
    }

    async create(deviceId: string) {
        try {
            const song = await this.recentlyRepo.create({
                deviceId,
                songIds: [],
            });
            return song;
        } catch (error) {
            this.logger.error('Error create in recently service', error);
            throw error;
        }
    }

    async updateSongs(deviceId: string, songIds: string[]) {
        try {
            const song = await this.recentlyRepo.findOneAndUpdate(
                { deviceId },
                {
                    $set: {
                        songIds: songIds.slice(0, RECENTLY_MUSIC_LIMIT),
                    },
                },
            );

            return song;
        } catch (error) {
            this.logger.error('Error addSong in recently service', error);
            throw error;
        }
    }

    async delete(id: string) {
        try {
            await this.songRepo.delete({ _id: id });
            return id;
        } catch (error) {
            this.logger.error('Error delete in recently service', error);
            throw error;
        }
    }
}
