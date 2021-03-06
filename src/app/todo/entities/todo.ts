import { UUID } from 'angular2-uuid';

export class Todo {
    public readonly id: string;
    public isDone: boolean;
    public lastEditDate: Date;

    constructor(
        public text: string
    ) {
        this.id = UUID.UUID();
        this.isDone = false;
        this.lastEditDate = new Date();
    }
}
