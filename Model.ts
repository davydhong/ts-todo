// NOTE: create a variable without creating a reference to the variable
// => use declare keyword

export interface Todo {
  id: number;
  name: string;
  state: TodoState;
}

export enum TodoState {
  Active = 1,
  Complete = 2
}
