import { Component, OnInit } from '@angular/core';
import { tableData, tableHeads } from './tydy-table.data';
import { Keys, TableDataModel, TableHeadsModel } from './table.model';
import * as _ from 'lodash';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe } from '@angular/common';


const CSV_OPTIONS = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  title: 'Table Data',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

const MAX_PAGE = 5;
const MIN_PAGE = 1;
const RECORDS_PER_PAGE: number = 20;

@Component({
  selector: 'app-tydy-table',
  templateUrl: './tydy-table.component.html',
  styleUrls: ['./tydy-table.component.scss']
})
export class TydyTableComponent implements OnInit {

  private _tableData: TableDataModel[] = tableData;
  public _tableHeads: TableHeadsModel[] = tableHeads;
  public _viewData: TableDataModel[] = this._tableData.slice(0, 20);
  public checked: boolean = false;
  public pageNo: number = 1;
  public pageMax: number = MAX_PAGE;
  public _columnData: any = {};
  public filterColumn: string | undefined = '';
  private selectedKeys: Map<string, boolean> = new Map<string,boolean>();
  private tableState: { sortKey: string, sortOrder: string, filterKey: string, filterValues: any[] } =
    {
      sortKey: '', sortOrder: '', filterKey: '', filterValues: []
    };

  private csvExporter = new ExportToCsv(CSV_OPTIONS);
  private datePipe = new DatePipe('en-us');

  constructor() { }

  ngOnInit(): void {
    this.resetColumnData();
    this.collectColumnData();
    this._tableHeads.forEach((head) => {
      if (head.isActive) {
        this.selectedKeys.set(head.key,true);
      }
    })
  }

  private paginate() {
    this._viewData = this._tableData.slice((this.pageNo - 1) * 20, this.pageNo * RECORDS_PER_PAGE);
  }

  private getTime(date: string) {
    return new Date(date).getTime();
  }

  public selectedColumns(isActive: boolean, key: string) {
    console.log(isActive, key);
    if (!isActive) {
      this.selectedKeys.set(key,false)
    } else {
      this.selectedKeys.set(key,true);
    }

  }

  public incPageNo() {
    if (this.pageNo < this.pageMax) {
      this.pageNo++;
      this.paginate()
    }
  }

  public decPageNo() {
    if (this.pageNo > MIN_PAGE) {
      this.pageNo--;
      this.paginate();
    }
  }

  public sort(key: string, order: string) {
    let data = _.cloneDeep(this._tableData);
    data.sort((current: any, next: any) => {
      if (key === 'dob') {
        return order === 'asc' ? this.getTime(current[key]) - this.getTime(next[key]) :
          this.getTime(next[key]) - this.getTime(current[key]);
      }

      if (key === 'mobile') {
        return order === 'asc' ? current[key] - next[key] : next[key] - current[key];
      }

      let currentElem = current[key].toLowerCase();
      let nextElem = next[key].toLowerCase();
      if (order === 'asc') {

        if (currentElem < nextElem) {
          return -1;
        }
        if (currentElem > nextElem) {
          return 1;
        }

        // names must be equal
        return 0;
      } else {
        if (currentElem > nextElem) {
          return -1;
        }
        if (currentElem < nextElem) {
          return 1;
        }

        // names must be equal
        return 0;
      }

    })
    this._tableData = data;
    this.pageNo = 1;
    this.paginate();
  }

  public filter({ key, values }: { key: string, values: any[] }) {
    this.tableState.filterValues = values;
    this.tableState.filterKey = key;
    this.pageNo = 1;
    this._tableData = tableData.filter((data) => {
      return values.includes(data[key]);
    });
    this.pageMax = Math.ceil(this._tableData.length / 20);
    this.paginate();
    this.filterColumn = undefined;
  }

  public collectColumnData() {
    tableData.forEach((value) => {
      Object.keys(value).forEach((key) => {
        if (!this._columnData[key].includes(value[key])) {
          this._columnData[key].push(value[key]);
        }
      })
    })
  }

  public resetColumnData() {
    Object.keys(this._viewData[0]).forEach((key) => {
      this._columnData[key] = [];
    });
  }

  public toggleFilter(key: string) {
    this.filterColumn === key ? (this.filterColumn = undefined) : this.filterColumn = key;
  }

  public downloadCsv() {
    // only download filteredData for which heads are available and download whole data
    let downloadData:any[] = [];
    this._tableData.forEach((data) => {
      let row: any = {}
      Object.keys(data).forEach((key) => {
        if (this.selectedKeys.get(key)) {
          key === 'dob' ? (row[key] = this.datePipe.transform(data[key], 'dd MM YYYY') ):
            (row[key] = data[key]);
        }
      })
      downloadData.push(row)
    });
    this.csvExporter.generateCsv(downloadData);
  }

}
