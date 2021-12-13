import { HTTPError, Options, Response } from 'got';

import { Injectable } from '../../decorators/_index';
const got = require('got'); // eslint-disable-line @typescript-eslint/no-var-requires

export declare type HttpContentType = 'application/json';

export interface HttpRequest {
  url: string;
  headers?: { [key: string]: any };
  query?: { [key: string]: any };
  body?: any;
  contentType?: HttpContentType;
}

const HTTP_SERVICE = {
  CONTENT_TYPES: {
    APP_JSON: 'application/json',
  },
};

@Injectable()
export class HttpService {
  private convertResponse(response: Response) {
    return response.headers['content-type'] === HTTP_SERVICE.CONTENT_TYPES.APP_JSON
      ? JSON.parse(String(response.body))
      : response.body;
  }

  private buildCommonOptions(httpRequest: HttpRequest) {
    return {
      url: this.buildUrlQueryParameters(httpRequest),
      headers: httpRequest.headers,
      body: httpRequest.body,
    };
  }

  private buildUrlQueryParameters(httpRequest: HttpRequest) {
    if (!httpRequest.query) {
      return httpRequest.url;
    }

    const parameters = new URLSearchParams();

    for (const [key, value] of Object.entries(httpRequest.query)) {
      parameters.append(key, value);
    }

    return `${httpRequest.url}?${parameters.toString()}`;
  }

  private request(options: Options) {
    return got(options)
      .then((data: Response) => {
        return this.convertResponse(data);
      })
      .catch((error) => {
        throw new HTTPError(error);
      });
  }

  get(httpRequest: HttpRequest) {
    const options: Options = {
      ...this.buildCommonOptions(httpRequest),
      method: 'GET',
    };

    return this.request(options);
  }

  post(httpRequest: HttpRequest) {
    const options: Options = {
      ...this.buildCommonOptions(httpRequest),
      method: 'POST',
    };

    return this.request(options);
  }

  delete(httpRequest: HttpRequest) {
    const options: Options = {
      ...this.buildCommonOptions(httpRequest),
      method: 'DELETE',
    };

    return this.request(options);
  }

  put(httpRequest: HttpRequest) {
    const options: Options = {
      ...this.buildCommonOptions(httpRequest),
      method: 'PUT',
    };

    return this.request(options);
  }

  patch(httpRequest: HttpRequest) {
    const options: Options = {
      ...this.buildCommonOptions(httpRequest),
      method: 'PATCH',
    };

    return this.request(options);
  }
}
