import { HttpStatus } from '@nestjs/common';
import { request } from './setup';

describe('app.spec.ts - App Controller', () => {
  describe('GET /', () => {
    it('should respond with Hello World!', () => {
      return request.get('/').expect(HttpStatus.OK).expect('Hello World!');
    });
  });
});
