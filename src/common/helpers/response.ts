import { Injectable } from '@nestjs/common';
import { HttpStatus } from '../constants';
import * as dotenv from 'dotenv';
dotenv.config();

const { VERSION: version = '1.0.0' } = process.env;

const DEFAULT_SUCCESS_MESSAGE = 'success';

export interface IErrorResponse {
    key: string;
    errorCode: number;
    message: string;
}

export class SuccessResponse {
    constructor(data = {}) {
        return {
            code: HttpStatus.OK,
            message: DEFAULT_SUCCESS_MESSAGE,
            data,
            version,
        };
    }
}
export class ErrorResponse {
    constructor(
        code = HttpStatus.INTERNAL_SERVER_ERROR,
        message = '',
        errors: IErrorResponse[] = [],
    ) {
        return {
            code,
            message,
            errors,
            version,
        };
    }
}

@Injectable()
export class ApiResponse<T> {
    public code: number;

    public message: string;

    public data: T;

    public errors: IErrorResponse[];
}

class GitlabServiceResponse {
    success: boolean;
    data: any;
    error: IErrorResponse | null;
    constructor({ success, data, error }) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}

export class GitlabServiceSuccessResponse<T> extends GitlabServiceResponse {
    constructor(data = {} as T) {
        super({ success: true, data, error: null });
    }
}

export class GitlabServiceErrorResponse extends GitlabServiceResponse {
    constructor(error: IErrorResponse) {
        super({ success: false, data: null, error });
    }
}
