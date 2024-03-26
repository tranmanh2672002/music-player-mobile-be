import Joi from '../../plugins/joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../common/constants';

export const recentlyCreateSchema = Joi.object().keys({
    id: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
});
