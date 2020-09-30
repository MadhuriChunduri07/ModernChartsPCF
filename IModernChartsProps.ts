import { IInputs } from "./ReactModernChart/generated/ManifestTypes";

export interface IModernChartsProps {
    description: string;
    title: string;
    chartType:string;
    chartWidth:number;
    chartHeight:number;
    chartHue:number;
    chartOperation :string;
    dataValues: Array<number>;
    labelValues: Array<string>;
    dataColumn:string;
    labelsColumn:string;
    //context:ComponentFramework.Context<IInputs>;
  }
 