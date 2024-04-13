import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fabric } from 'fabric';
import { RightClickMenuComponent } from './components/right-click-menu/right-click-menu.component';
import { LabelModalComponent } from './components/label-modal/label-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgFor,
    RightClickMenuComponent,
    CommonModule,
    LabelModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  canvas!: fabric.Canvas;

  activeObject: any;
  originalPos: { left: number; top: number } | null = null;

  mouseX = 0;
  mouseY = 0;
  isMenuVisible = false;
  selectedLabel: fabric.Object | null = null;

  isModalVisible = false;

  dialog = {
    fill: '',
    backgroundColor: '',
    text: '',
  };

  backgrounds = [
    '/assets/svg/bg/11.svg',
    // '/assets/svg/bg/12.svg',
    '/assets/svg/bg/13.svg',
    '/assets/svg/bg/14.svg',
    '/assets/svg/bg/15.svg',
  ];

  ngAfterViewInit() {}

  fireRightClick(options: any) {
    // console.log('Right click event fired!', options);
    // Add your custom right click handling logic here
  }

  showContextMenu(event: any) {}

  ngOnInit() {
    this.canvas = new fabric.Canvas('myCanvas');

    this.handleCustomMenu();
    this.zoomCanvas();
    this.enableDragAndDrop();
  }

  enableDragAndDrop() {
    this.canvas.on('mouse:down', (e: fabric.IEvent<MouseEvent>) => {
      if (e.e.target) {
        this.activeObject = e.e.target;
        this.originalPos = {
          left: this.activeObject.left || 0,
          top: this.activeObject.top || 0,
        };
      }
    });

    this.canvas.on('mouse:move', (e: fabric.IEvent<MouseEvent>) => {
      if (this.activeObject && e.pointer) {
        let width = this.activeObject.width ? this.activeObject.width : 0;
        let height = this.activeObject.height ? this.activeObject.height : 0;
        this.activeObject.left = e.pointer.x - width / 2;
        this.activeObject.top = e.pointer.y - height / 2;
        this.canvas.renderAll();
      }
    });

    this.canvas.on('mouse:up', (e: fabric.IEvent<MouseEvent>) => {
      if (this.activeObject && this.originalPos) {
        if (
          this.activeObject.left === this.originalPos.left &&
          this.activeObject.top === this.originalPos.top
        ) {
          this.activeObject = null;
        } else {
          // Trigger your logic here for the drop event
          console.log(
            'Dropped at ',
            this.activeObject.left,
            this.activeObject.top
          );
          this.activeObject = null;
        }
      }
    });
  }

  handleCustomMenu() {
    // Deactive default right click
    this.canvas.stopContextMenu = true;
    this.canvas.on('mouse:down:before', (e: fabric.IEvent<MouseEvent>) => {
      if (e.e.button === 2) {
        this.showContextMenu(e);
        this.onRightClick(e.e);
      }
    });
  }

  zoomCanvas() {
    // Zoom in/out with mouse wheel
    this.canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Change cursor on mouse over/out
    this.canvas.on('mouse:over', (e) => {
      if (e.target) {
        this.canvas.defaultCursor = 'pointer';
      }
    });

    this.canvas.on('mouse:out', (e) => {
      if (e.target) {
        this.canvas.defaultCursor = 'default';
      }
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

  onLabelDoubleClick(label: fabric.Text) {
    this.isModalVisible = true;
    this.dialog.fill = label.fill as string;
    this.dialog.text = label.text as string;
    this.dialog.backgroundColor = label.backgroundColor as string;

    this.selectedLabel = label;
  }

  async addLabel(x: number, y: number) {
    // Prompt the user for the label text and background color
    let labelText = prompt('Enter the label text:');

    if (labelText && this.canvas) {
      let text = new fabric.Text(labelText, {
        left: x,
        top: y,
        backgroundColor: '#b6b6b6',
        padding: 4,
        cornerStyle: 'circle',
      });
      text.on('mousedblclick', () => this.onLabelDoubleClick(text));
      this.canvas.add(text);
    }
  }

  editLabel(label: fabric.Object) {
    this.onLabelDoubleClick(label as fabric.Text);
  }

  onRightClick(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.isMenuVisible = true;

    // Get the active object (the one you right-clicked on)
    let activeObject = this.canvas.getActiveObject();

    // If the active object is a Text (label), store it
    if (activeObject && activeObject.type === 'text') {
      this.selectedLabel = activeObject;
    }
  }

  onMenuItemSelected(action: string) {
    if (action === 'addLabel') {
      this.addLabel(this.mouseX, this.mouseY);
    } else if (action === 'editLabel' && this.selectedLabel) {
      this.editLabel(this.selectedLabel);
    } else if (action === 'deleteLabel' && this.selectedLabel) {
      this.deleteLabel(this.selectedLabel as fabric.Text);
    }

    this.isMenuVisible = false;
  }

  deleteLabel(label: fabric.Text) {
    this.canvas.remove(label);
    this.selectedLabel = null;
  }

  onSaveChanges(changes: {
    color: string;
    backgroundColor: string;
    text: string;
  }) {
    console.log(changes);
    console.log(this.selectedLabel);

    if (this.selectedLabel) {
      let textLabel = this.selectedLabel as fabric.Text;
      textLabel.set({
        text: changes.text,
        fill: changes.color,
        backgroundColor: changes.backgroundColor,
      });

      this.canvas.renderAll();

      this.isModalVisible = false;
    }
  }

  onDelete() {
    if (this.selectedLabel) {
      this.canvas.remove(this.selectedLabel);
      this.selectedLabel = null;
    }
    this.isModalVisible = false;
  }

  onCancel() {
    this.isModalVisible = false;
  }
}
