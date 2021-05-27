import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchListComponent implements OnInit, OnChanges {

  @Input() dataList: any[] = [];
  @Input() isElemTypeDate: boolean = false;
  @Input() key: string = '';
  @Output() onFilter = new EventEmitter<{ key: string, values: any[] }>();


  public selectAll: boolean = true;
  public dataObjList: { isActive: boolean, value: any }[] = [];
  public viewList: { isActive: boolean, value: any }[] = [];
  public selectItems: any[] = [];
  public searchText = '';

  private datePipe = new DatePipe('en-us');

 
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataObjList = [];
    this.dataList.forEach((data: any) => {
      this.dataObjList.push({ isActive: true, value: data })
    })
    this.viewList = _.cloneDeep(this.dataObjList);
    this.selectItems = _.cloneDeep(this.dataList);
    this.selectAll = true;
  }

  onSearchTextChange() {
    this.viewList = this.dataObjList.filter(data => {
      if (this.isElemTypeDate) {
        return String(this.datePipe.transform(data.value, 'dd MM YYYY')).search(this.searchText) >= 0;
      }
      return String(data.value).search(this.searchText) >= 0;
    })
  }

  public onElementCheck(event: any) {
    let index = this.dataObjList.findIndex((data)=>data.value === event.dataElem.value);
    if (!event.event.checked) {
      this.selectAll = false;
      index = this.selectItems.indexOf(event.dataElem.value);
      if (index >= 0) {
        this.selectItems.splice(index, 1);
      }
      this.dataObjList[index].isActive = false;
    } else {
      this.selectItems.push(event.dataElem.value)
      // make select all true when all items are selected
      this.selectItems.length === this.dataObjList.length? this.selectAll = true: _.noop();
      this.dataObjList[index].isActive = true;
    }

  }

  public onSelectChange(event: any) {
    this.viewList.forEach(data => data.isActive = event.checked)
    this.dataObjList.forEach(data=>data.isActive = event.checked)
    if (!event.checked) {
      this.selectItems = [];
      return;
    }
    this.selectItems = _.cloneDeep(this.dataList);
  }

  public filter() {
    this.onFilter.emit({ key: this.key, values: this.selectItems })
  }

}
