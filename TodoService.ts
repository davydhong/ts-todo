interface Todo {
  id: number;
  name: string;
  state: TodoState;
}

enum TodoState {
  Active = 1,
  Complete = 2
}

interface ITodoService {
  add(todo: Todo): Todo;
  add(todo: string): Todo;
  clearCompleted(): void;
  getById(todoId: number): Todo;
  gettoggle();
  _find;
}

class TodoService {
  private static _lastId = 0;

  private static generateTodoId() {
    return (TodoService._lastId += 1);
  }

  static clone<T>(src: T): T {
    var clone = JSON.stringify(src);
    return JSON.parse(clone);
  }

  private todos: Todo[] = [];

  constructor(todos) {
    var _this = this;

    this.todos = [];

    if (todos) {
      todos.forEach(todo => {
        _this.add(todo);
      });
    }
  }

  // Accepts a todo name or todo object
  add(todo: Todo): Todo;
  add(todo: string): Todo;
  add(input): Todo {
    var todo = {
      id: TodoService.generateTodoId(),
      name: null,
      state: TodoState.Active
    };

    if (typeof input === 'string') {
      todo.name = input;
    } else if (typeof input.name === 'string') {
      todo.name = input.name;
    } else {
      throw 'Invalid Todo name!';
    }

    this.todos.push(todo);

    return todo;
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(x => x.state == TodoState.Active);
  }

  getAll(): Todo[] {
    return TodoService.clone(this.todos);
  }

  getById(todoId: number): Todo {
    var todo = this._find(todoId);
    return TodoService.clone<Todo>(todo);
  }

  toggle(todoId: number): void {
    var todo = this._find(todoId);

    if (!todo) return;

    switch (todo.state) {
      case TodoState.Active:
        todo.state = TodoState.Complete;
        break;
      case TodoState.Complete:
        todo.state = TodoState.Active;
        break;
    }
  }

  _find(todoId: number): Todo {
    var filtered = this.todos.filter(x => x.id == todoId);

    if (filtered.length) {
      return filtered[0];
    }

    return null;
  }
}
