import * as React from 'react';
import 'chart.js';
import { Doughnut, Line, Pie, Bar, HorizontalBar, Radar, Polar } from 'react-chartjs-2';
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardLocation,
  DocumentCardPreview,
  IDocumentCardPreviewProps
} from 'office-ui-fabric-react/lib/DocumentCard';
import { IModernChartsProps } from './IModernChartsProps';
var ColorScheme = require('color-scheme');

export default class ModernCharts extends React.Component<IModernChartsProps, {}> {

  public render(): JSX.Element {
    console.log("Props obtained : ",this.props);
      var scheme = new ColorScheme;
      scheme.from_hue(this.props.chartHue).scheme('analogic').variation('pastel');
      let colors: Array<string> = scheme.colors();
      let finalColors : Array<string> = []
      colors.forEach((color:string) => {
          color = "#"+color;
          finalColors.push(color);
      });
    let data = {
      labels: this.props.labelValues,
      datasets: [
        {
          label: this.props.dataColumn,
          data: this.props.dataValues,
          backgroundColor:finalColors
        }
      ]
  }
    
      let options = {
        title:{
            display:true,
            text:this.props.title,
            fontSize:25
        },
		legend: {
		  display: true,
		  layout: {
			padding: 5
		  },
		  position: 'bottom',
		  labels: {
			fontColor: 'rgba(100, 100, 100, 1.0)'
		  }
		}
	  };

      const chart = 
      <div style={{width:this.props.chartWidth,height:this.props.chartHeight}}>
              <div className='chartCard'>
                {this.chart(data, options, this.props.chartType)}
              </div>
              <DocumentCardTitle title={this.props.title} />
              <div>{this.props.description}</div> 
    </div>

    return (
      <div className={'chartjs' + ' ms-Grid'}>
        <div style={{width:this.props.chartWidth,height:this.props.chartHeight}}>
          {chart}
        </div>
      </div>
    );

  }

  public chart(data: Object, options: Object, type: string) {
    var tChart: any;
    switch (type) {
      case 'Doughnut':
        tChart = <Doughnut data={data} options={options} />;
        return tChart;
      case 'Line':
        debugger;
        return  <Line data={data} options={options} legend={{ display: false }} />;
      case 'Pie':
        tChart = <Pie data={data} options={options} />;
        return tChart;
      case 'Bar':
        tChart = <Bar data={data} options={options} legend={{ display: false }} />;
        return tChart;
      case 'Horizontal Bar':
        tChart = <HorizontalBar data={data} options={options} legend={{ display: false }} />;
        return tChart;
      case 'Radar':
        tChart = <Radar data={data} options={options} legend={{ display: false }} />;
        return tChart;
      case 'Polar':
        tChart = <Polar data={data} options={options} />;
        return tChart;
      default:
        tChart = <Line data={data} options={options} />;
        return tChart;
    }
  }
}