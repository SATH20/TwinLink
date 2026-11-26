import 'reflect-metadata';
import { applyDecorators } from '@nestjs/common';

/**
 * A composed decorator must behave exactly like the decorators it is made of.
 * Before 12.6.2, `applyDecorators` dropped the index of a parameter decorator
 * at position 0 and ignored the descriptor returned by a method decorator.
 */
describe('applyDecorators composition', () => {
  it('forwards parameter indexes and keeps a method descriptor returned by a decorator', () => {
    const parameterCalls: Array<[object, string | symbol | undefined, number | undefined]> = [];
    const recordParameter = (
      target: object,
      propertyKey?: string | symbol,
      parameterIndex?: number,
    ): void => {
      parameterCalls.push([target, propertyKey, parameterIndex]);
    };

    class Sample {
      constructor(readonly value: string) {}
    }

    const composedParameter = applyDecorators(recordParameter as any);
    (composedParameter as any)(Sample, undefined, 0);

    expect(parameterCalls).toEqual([[Sample, undefined, 0]]);

    const wrap = (
      _target: object,
      _propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<() => string>,
    ): TypedPropertyDescriptor<() => string> => ({
      ...descriptor,
      value: () => 'composed',
    });

    class Subject {
      greet(): string {
        return 'original';
      }
    }

    const composedMethod = applyDecorators(wrap as any);
    const descriptor = Object.getOwnPropertyDescriptor(Subject.prototype, 'greet')!;
    const result = (composedMethod as any)(Subject.prototype, 'greet', descriptor);
    const effective = result ?? descriptor;

    expect((effective.value as () => string)()).toBe('composed');
  });
});
