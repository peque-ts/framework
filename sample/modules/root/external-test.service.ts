import { Injectable } from '../../../src/decorators/_index';
import { HttpService } from '../../../src/services/_index';

@Injectable()
export class ExternalTestService {
  constructor(private readonly httpService: HttpService) {
  }

  async getExternalCall() {
    const httpTest = await this.httpService.get({
      query: {
        param1: 'externaTest',
        param2: 12345
      },
      url: 'https://httpbin.org/get',
    });
    return { test: 'hello world', result: httpTest };
  }

  getTest() {
    return 'waffle';
  }
}
