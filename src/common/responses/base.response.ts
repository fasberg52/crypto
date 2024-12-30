import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  ResponseError,
  ResponseInterface,
  ResponseMessage,
} from './interface.response';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@ApiExtraModels()
export class BaseResponse implements ResponseInterface<any> {
  @ApiProperty()
  success: boolean = true;

  result: any;

  pagination: Pagination;

  error: ResponseError;

  @ApiProperty()
  snackbar: ResponseMessage;

  static getApiDoc(): ApiResponseOptions {
    return {
      description: this.name,
      type: this,
    };
  }
}

@ApiExtraModels()
export class Pagination {
  static set(props?: Partial<Pagination>) {
    const pagination = new Pagination();
    Object.assign(pagination, props);
    return pagination;
  }

  @ApiProperty()
  total: number;
}

@ApiExtraModels()
export class MessageResponse extends BaseResponse {
  constructor(message: string) {
    super();
    this.snackbar = {
      type: 'success',
      message: message,
    };
  }
}
@ApiExtraModels()
export class SuccessResponse extends BaseResponse {
  constructor() {
    super();
    this.success = true;
  }
}
