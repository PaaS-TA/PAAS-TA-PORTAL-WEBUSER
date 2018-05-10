export class Utils {
  static requireNonNull(val: any) {
    if (val === undefined || val === null)
      throw Error("Value must not be null");

    return val;
  }

  static requireNull(val: any) {
    if (val !== undefined && val !== null)
      throw NullError("Value must be null");

    return val;
  }

  static requireDefined(val: any) {
    if (val === undefined)
      throw Error("Value must be defined");

    return val;
  }

  static requireTrue(val: boolean) {
    if (!val)
      throw Error("Expression or value must be true");

    return val;
  }

  static requireFalse(val: boolean) {
    if (val)
      throw Error("Expression or value must be false");

    return val;
  }

  static contains(val: any, key: string): boolean {
    if (typeof(val) !== 'object')
      throw Error('Value must be Object type or Class');

    return val.hasOwnProperty(key);
  }
}

interface NullError extends Error { }
interface NullErrorConstructor {
  new(message?: string): RangeError;
  (message?: string): RangeError;
  readonly prototype: RangeError;
}
declare const NullError: NullErrorConstructor;

interface InvalidArgumentError extends Error { }
interface InvalidArgumentErrorConstructor {
  new(message?: string): InvalidArgumentError;
  (message?: string): InvalidArgumentError;
  readonly prototype: InvalidArgumentError;
}
declare const InvalidArgumentError: InvalidArgumentErrorConstructor;

interface InvalidParametersError extends Error { }
interface InvalidParametersErrorConstructor {
  new(message?: string): InvalidParametersError;
  (message?: string): InvalidParametersError;
  readonly prototype: InvalidParametersError;
}
declare const InvalidParametersError: InvalidParametersErrorConstructor;
