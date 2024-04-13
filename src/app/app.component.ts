import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  canvas!: fabric.Canvas;

  backgrounds = [
    '/assets/svg/bg/11.svg',
    '/assets/svg/bg/12.svg',
    '/assets/svg/bg/13.svg',
    '/assets/svg/bg/14.svg',
    '/assets/svg/bg/15.svg',
  ];

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

  setBackground(imageUrl: string) {
    if (this.canvas) {
      fabric.Image.fromURL(imageUrl, (img) => {
        if (
          img &&
          img.width &&
          img.height &&
          this.canvas.width &&
          this.canvas.height
        ) {
          this.canvas.setBackgroundImage(
            img,
            this.canvas.renderAll.bind(this.canvas),
            {
              scaleX: this.canvas.width / img.width,
              scaleY: this.canvas.height / img.height,
            }
          );
        } else {
          console.log('Image or canvas dimensions are not initialized');
        }
      });
    } else {
      console.log('Canvas is not initialized');
    }
  }

  toggleFreeDrawing(event: Event) {
    let target = event.target as HTMLInputElement;
    if (this.canvas) {
      this.canvas.isDrawingMode = target.checked;
    }
  }

  changeDrawingColor(event: Event) {
    let target = event.target as HTMLInputElement;
    if (this.canvas) {
      this.canvas.freeDrawingBrush.color = target.value;
    }
  }

  changeBrushSize(event: Event) {
    let target = event.target as HTMLInputElement;
    if (this.canvas) {
      this.canvas.freeDrawingBrush.width = parseInt(target.value, 10);
    }
  }

  clearCanvas() {
    if (this.canvas) {
      this.canvas.clear();
    }
  }
}
