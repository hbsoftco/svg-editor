import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-actions-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './actions-modal.component.html',
  styleUrl: './actions-modal.component.scss',
})
export class ActionsModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<boolean>();

  tab: string = 'chartConfig';

  private root!: am5.Root;

  // Add properties to hold the data and color inputs
  data: any[] = [];
  color: string = '#000000';

  category: string = '';
  value!: number;

  addData() {
    this.data.push({
      category: this.category,
      value1: parseInt(String(this.value)),
    });
    this.category = '';
    this.value = 0;

    console.log(this.data);
  }

  closeModal() {
    this.close.emit(false);
  }

  createChart() {
    // Dispose of the previous chart if it exists
    if (this.root) {
      this.root.dispose();
    }

    // Create the chart with the data and color
    this.root = am5.Root.new('chartdiv');
    console.log(this.root);

    this.root.setThemes([am5themes_Animated.new(this.root)]);
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panY: false,
        layout: this.root.verticalLayout,
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        renderer: am5xy.AxisRendererX.new(this.root, {}),
        categoryField: 'category',
      })
    );
    xAxis.data.setAll(this.data);

    let series = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value1',
        categoryXField: 'category',
      })
    );
    series.columns.template.setAll({ fill: am5.color(this.color) });
    series.data.setAll(this.data);
  }
}
