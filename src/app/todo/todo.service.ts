import { Injectable } from '@angular/core';
import { Todo } from './entities/todo';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    public todoList: Todo[] = null;
    public todosAmount: Subject<number> = new Subject<number>();

    constructor() {}

    public getTodoList(): Todo[] {
        const todos: string = localStorage.getItem('todos');

        if (todos) {
            this.todoList = this.parseTodos(todos);
        } else {
            this.todoList = [];
        }
        this.updateTodosAmount();

        return this.todoList;
    }

    public saveTodo(text: string): void {
        if (text.trim().length) {
            this.todoList.unshift(new Todo(text));
            this.saveTodosToLocalStorage();
            this.updateTodosAmount();
        }
    }

    public getTodo(id: string): Todo {
        return this.todoList.find((el: Todo) => el.id === id);
    }

    public updateTodo(id: string, text: string): void {
        if (!text.trim().length) {
            return;
        }

        const todo: Todo = this.getTodo(id);

        todo.text = text;
        todo.lastEditDate = new Date();

        this.saveTodosToLocalStorage();
    }

    public deleteTodo(todo: Todo): void {
        this.todoList.splice(this.todoList.indexOf(todo), 1);
        this.saveTodosToLocalStorage();
        this.updateTodosAmount();
    }

    public deleteDone(): void {
        this.todoList = this.todoList.filter((todo: Todo) => !todo.isDone);
        this.saveTodosToLocalStorage();
        this.updateTodosAmount();
    }

    public keepSorted(todoList: Todo[]): Todo[] {
        if (!todoList) {
            return [];
        }

        return todoList.sort((a: Todo, b: Todo) => {
            return b.lastEditDate.getTime() - a.lastEditDate.getTime();
        }).sort((a: Todo, b: Todo) => {
            return +a.isDone - +b.isDone;
        });
    }

    public getTodosAmount(): Observable<number> {
        return this.todosAmount.asObservable();
    }

    public toggleDone(todo: Todo): void {
        todo.isDone = !todo.isDone;
        this.saveTodosToLocalStorage();
    }

    private updateTodosAmount(): void {
        this.todosAmount.next(this.todoList.length);
    }

    private saveTodosToLocalStorage(): void {
        localStorage.setItem('todos', JSON.stringify(this.todoList));
    }

    private parseTodos(todos: string): Todo[] {
        const res: Todo[] = JSON.parse(todos);
        for (const todo of res) {
            todo.lastEditDate = new Date(todo.lastEditDate);
        }

        return res;
    }
}
