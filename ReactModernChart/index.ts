import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import { IModernChartsProps } from '../IModernChartsProps';
import ChartOptions from '../ChartOptions';
import ReactDOM = require("react-dom");
import React = require("react");
import ModernCharts from "../ModernCharts";
import { title } from "process";

export class ReactModernChart implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private notifyOutputChanged: () => void;
	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _description:string = '';
	private _title: string = '';
	private _dataValues : Array<number> = [];
	private _labelsData : Array<string>=[];
	private _chartType : string = 'doughnut';
	private _chartHeight : number;
	private _chartWidth : number;
	private _chartHue : number;
	private _chartOperation : string;
	private _dataColumn : string;
	private _labelsColumn : string;

	private properties:IModernChartsProps = {
		description:this._description,
		title:this._title,
		chartType : this._chartType,
		chartWidth : this._chartWidth,
		chartHeight : this._chartHeight,
		dataColumn : this._dataColumn,
		labelsColumn : this._labelsColumn,
		labelValues : this._labelsData,
		dataValues : this._dataValues,
		chartHue : this._chartHue,
		chartOperation : this._chartOperation
	}

	constructor()
	{

	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;
		this._context = context;
		//this.properties.context = this._context;
		//this._dataset = context.parameters.sampleDataSet;
		this.notifyOutputChanged = notifyOutputChanged;
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this.properties.title = context.parameters.chartTitle.formatted || '';
		this.properties.description = context.parameters.chartDescription.formatted || '';
		this.properties.chartType = context.parameters.ChartType.raw;
		this.properties.chartOperation = context.parameters.ChartOperation.raw || 'Sum';
		this.properties.chartWidth = context.parameters.chartWidth.raw || 500;
		this.properties.chartHeight = context.parameters.chartHeight.raw || 800;
		this.properties.chartHue = context.parameters.chartHue.raw || 35;
		this.properties.dataColumn = context.parameters.dataColumn.formatted || context.parameters.sampleDataSet.columns[0].name;
		this.properties.labelsColumn = context.parameters.labelsColumn.formatted || context.parameters.sampleDataSet.columns[1].name;
		if (!context.parameters.sampleDataSet.loading) {
			let dataSet = context.parameters.sampleDataSet;
			this.properties.labelValues = this.getUnique(dataSet,this.properties.labelsColumn);
			let dataValues = this.getValues(dataSet,this.properties.labelValues,this.properties.labelsColumn,this.properties.dataColumn);
			this.properties.dataValues = this.calculateData(dataValues,this.properties.chartOperation);
			console.log("Dataset : ",dataSet.columns);
			console.log("Unique columns : ",this.properties.labelValues);
			console.log("Data Values : ",dataValues);
			console.log("Calculated Data : ",this.properties.dataValues);
		}
		ReactDOM.render(
			React.createElement(ModernCharts, this.properties),
			this._container
		);
	}

	private defaultOptions: Object = {
		legend: {
		  display: false,
		  layout: {
			padding: 10
		  },
		  position: 'bottom',
		  labels: {
			fontColor: 'rgba(100, 100, 100, 1.0)'
		  }
		}
	  };

	  private calculateData(dataValues : Array<Array<any>>, operation : string): Array<number> {
		var values: Array<number> = [];
		switch (operation) {
		  case 'Sum':
			dataValues.forEach((vals, i) => {
			  values[i] = 0;
			  vals.forEach((val) => {
				values[i] += parseFloat(val);
			  });
			});
			break;
		  case 'Average':
			dataValues.forEach((vals, i) => {
			  values[i] = 0;
			  vals.forEach((val) => {
				values[i] += parseFloat(val);
			  });
			  if (values[i] != 0) {
				values[i] = values[i] / vals.length;
			  }
			});
			break;
		  case 'Count':
			dataValues.forEach((vals) => {
			  values.push(vals.length);
			});
			break;
		  default:
			values = [100, 250, 90, 300];
			break;
		}
		return values;
	  }

	  private getUnique(dataset:ComponentFramework.PropertyTypes.DataSet,labelsColumn:string): Array<string> {
		const chLabels: any = { unique: [] };
		dataset.sortedRecordIds.forEach((recordId:any) => {
		let itemValue = dataset.records[recordId].getFormattedValue(labelsColumn)
		  if (chLabels['unique'].indexOf(itemValue) == -1 && itemValue != null && itemValue!= "") {
			chLabels['unique'].push(itemValue);
		  }
		});
		return chLabels['unique'];
	  }
	
	  private getValues(dataSet: ComponentFramework.PropertyTypes.DataSet, unique: Array<string>, labelsColumn : string, dataColumn : string): Array<Array<any>> {
		const values: any = {};
		const vals: Array<Array<any>> = [[]];
		unique.forEach((col, i) => {
		  values[col] = [];
		  vals[i] = [];
		  dataSet.sortedRecordIds.forEach((recordId:any, _i) => {
			if (dataSet.records[recordId].getFormattedValue(labelsColumn) == col) {
			  vals[i].push(dataSet.records[recordId].getFormattedValue(dataColumn));
			}
		  });
		});
		return vals;
	  }
	
	public getOutputs(): IOutputs
	{
		return {};
	}

	
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

}