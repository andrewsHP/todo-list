import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo/todo.service';
import { WeatherService } from '../weather/weather.service';
import { MenuItem } from './menu';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    public readonly TODO_TITLE = 'Tasks';
    public readonly WEATHER_TITLE = 'Weather';

    public items: MenuItem[];

    constructor(
        private todoService: TodoService,
        private weatherService: WeatherService
    ) {}

    ngOnInit(): void {
        this.items = [
            { label: this.TODO_TITLE, routerLink: '/todo' },
            { label: this.WEATHER_TITLE, routerLink: '/weather' }
        ];

        this.getTodosAmount();
        this.getCurrentTemperature();
    }

    private getTodosAmount(): void {
        this.todoService.todosAmount.subscribe((amount: number) => {
            this.items.find((item: MenuItem) => {
                return item.label.includes(this.TODO_TITLE);
            }).generatedLabelPart = amount;
        });
    }

    private getCurrentTemperature(): void {
        this.weatherService
            .getCurrentTemperature()
            .subscribe((temperature: number) => {
                this.items.find((item: MenuItem) => {
                    return item.label.includes(this.WEATHER_TITLE);
                }).generatedLabelPart = `${temperature}\u2103`;
            });
    }
}
