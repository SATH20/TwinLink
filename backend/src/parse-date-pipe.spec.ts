import 'reflect-metadata';
import { BadRequestException, ParseDatePipe } from '@nestjs/common';

/**
 * Guards the stricter ParseDatePipe validation that shipped in
 * @nestjs/common 12.6.3: a day past the end of its month is rejected
 * instead of being rolled into the next month by `new Date()`.
 *
 * The pipe is created directly so the test exercises the library behaviour
 * without booting the Nest application.
 */
describe('ParseDatePipe month-end validation', () => {
  const pipe = new ParseDatePipe();

  it.each(['2/30', '4/31', '2/29', 'Thu 2024 Sept 31'])(
    'rejects %s because its day is past the end of the month',
    (value) => {
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    },
  );

  it.each(['2/28', '2024-02-28', 'Feb 28 2024'])(
    'still accepts the valid date %s',
    (value) => {
      expect(pipe.transform(value)).toEqual(new Date(value));
    },
  );
});
