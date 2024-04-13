import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-app';

  ngOnInit() {
    const canvas = new fabric.Canvas('myCanvas');

    let rectangle = new fabric.Rect({
      left: 10,
      top: 10,
      fill: 'red',
      width: 60,
      height: 70,
    });

    canvas.add(rectangle);
  }
}
