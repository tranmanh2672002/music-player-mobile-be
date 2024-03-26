import Joi from '../../plugins/joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../common/constants';

export const albumCreateSchema = Joi.object().keys({
    deviceId: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
    name: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
});

export const albumAddSongSchema = Joi.object().keys({
    youtubeId: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
});

export const albumRemoveSongSchema = Joi.object().keys({
    id: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
});
