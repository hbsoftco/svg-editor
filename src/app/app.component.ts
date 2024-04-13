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
  canvas!: fabric.Canvas;

  ngOnInit() {
    this.canvas = new fabric.Canvas('myCanvas');
  }

  handleFileInput(event: Event) {
    let target = event.target as HTMLInputElement;
    let files = target.files;
    if (files && files.length > 0) {
      let file = files.item(0);
      if (file) {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          if (typeof fileReader.result === 'string') {
            this.loadSVG(fileReader.result);
          }
        };
        fileReader.readAsText(file);
      } else {
        console.log('No file selected');
      }
    }
  }

  loadSVG(svgString?: string) {
    if (svgString) {
      fabric.loadSVGFromString(svgString, (objects, options) => {
        let obj = fabric.util.groupSVGElements(objects, options);
        this.canvas.add(obj).renderAll();
      });
    } else {
      console.log('No SVG string provided');
    }
  }
}
