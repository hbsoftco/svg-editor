import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fabric } from 'fabric';
import { RightClickMenuComponent } from './components/right-click-menu/right-click-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, RightClickMenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  canvas!: fabric.Canvas;

  backgrounds = [
    '/assets/svg/bg/11.svg',
    // '/assets/svg/bg/12.svg',
    '/assets/svg/bg/13.svg',
    '/assets/svg/bg/14.svg',
    '/assets/svg/bg/15.svg',
  ];

  ngAfterViewInit() {}

  fireRightClick(options: any) {
    console.log('Right click event fired!', options);
    // Add your custom right click handling logic here
  }

  showContextMenu(event: any) {
    console.log('hosssssseinam :(', event);
  }

  ngOnInit() {
    this.canvas = new fabric.Canvas('myCanvas');

    this.canvas.stopContextMenu = true;
    this.canvas.on('mouse:down:before', (e: fabric.IEvent<MouseEvent>) => {
      this.showContextMenu(e);
      this.onRightClick(e.e);

      // this.fireRightClick(e.e.preventDefault);
    });

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

  // showContextMenu(event: MouseEvent) {
  //   console.log('hossein');

  //   event.preventDefault();
  //   let contextMenu = document.getElementById('contextMenu');
  //   if (contextMenu) {
  //     contextMenu.style.top = `${event.clientY}px`;
  //     contextMenu.style.left = `${event.clientX}px`;
  //     contextMenu.classList.remove('hidden');
  //   }
  // }

  addLabel() {
    alert('clicked');
    if (this.canvas) {
      let text = new fabric.Text('Label', { left: 10, top: 10 });
      this.canvas.add(text);
    }
    let contextMenu = document.getElementById('contextMenu');
    if (contextMenu) {
      contextMenu.classList.add('hidden');
    }
  }

  mouseX = 0;
  mouseY = 0;
  isMenuVisible = false;

  onRightClick(event: MouseEvent) {
    console.log(event);

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.isMenuVisible = true;
  }

  onMenuItemSelected(action: string) {
    console.log('Menu item selected:', action);
    this.isMenuVisible = false; // Hide the menu after selection
  }
}
