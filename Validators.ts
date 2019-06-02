import { Todo, TodoState } from './Model';

// NOTE: class decorator
@validatable
export class ValidatableTodo implements Todo {
  id: number;

  // NOTE: param decorator
  @required
  @regex(`^[a-zA-Z ]*$`)
  name: string;

  state: TodoState;
}

export interface ValidatableTodo extends IValidatable {}

export interface IValidatable {
  validate(): IValidationResult[];
}

export interface IValidationResult {
  isValid: boolean;
  message: string;
  property?: string;
}

export interface IValidator {
  (instance: Object): IValidationResult;
}

export function validate(): IValidationResult[] {
  let validators: IValidator[] = [].concat(this._validators),
    errors: IValidationResult[] = [];

  for (let validator of validators) {
    let result = validator(this);

    if (!result.isValid) {
      errors.push(result);
    }
  }

  return errors;
}

export function validatable(target: Function) {
  target.prototype.validate = validate;
}

// NOTE: param decorator
export function required(target: Object, propertyName: string) {
  let validatable = <{ _validators: IValidator[] }>target,
    validators = validatable._validators || (validatable._validators = []);

  validators.push(function(instance) {
    let propertyValue = instance[propertyName],
      isValid = propertyValue != undefined;

    if (typeof propertyValue === 'string') {
      isValid = propertyValue && propertyValue.length > 0;
    }

    return {
      isValid,
      message: `${propertyName} is required`,
      property: propertyName
    };
  });
}

// NOTE: decorator factory
export function regex(pattern: string) {
  let expression = new RegExp(pattern);

  return function regex(target: Object, propertyName: string) {
    let validatable = <{ _validators: IValidator[] }>target,
      validators = validatable._validators || (validatable._validators = []);

    validators.push(function(instance) {
      let propertyValue = instance[propertyName],
        isValid = expression.test(propertyValue);

      return {
        isValid,
        message: `${propertyName} does not match ${expression}`,
        property: propertyName
      };
    });
  };
}
