import 'reflect-metadata';
import { BadRequestException } from '@nestjs/common';
import { IsString } from 'class-validator';
import { createValidationPipe } from './common/pipes/validation.pipe';
describe('@nestjs/common v12 upgrade', () => {
  it('keeps the global pipe strict while exposing the v12 errorCode option', async () => {
    class SampleDto {
      @IsString()
      name!: string;
    }
    await expect(
      createValidationPipe().transform(
        { name: 'synthetic', extra: 'nope' },
        { type: 'body', metatype: SampleDto },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    const exception = new BadRequestException('Invalid payload', {
      errorCode: 'INVALID_PAYLOAD',
    } as any);
    expect(exception.getResponse()).toEqual(
      expect.objectContaining({ statusCode: 400, errorCode: 'INVALID_PAYLOAD' }),
    );
  });
});
