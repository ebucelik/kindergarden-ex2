import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { MAT_SORT_DEFAULT_OPTIONS, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChildResponse } from 'src/app/shared/interfaces/Child';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {

  constructor(public storeService: StoreService, private backendService: BackendService) {
    this.dataSource = new MatTableDataSource(storeService.children);
    this.sort = new MatSort();
  }
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public isLoading: boolean = false;
  public displayedColumns: string[] = ['name', 'kindergarden', 'address', 'age', 'birthdate', 'registrationDate', 'cancelRegistration'];
  public filter: string = "";
  public dataSource: MatTableDataSource<ChildResponse>;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.isLoading = true;
    
    this.backendService.getChildren(
      this.currentPage, 
      () => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.storeService.children);
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
        age--;
    }
    return age;
  }

  selectPage(event: PageEvent) {
    let currentPage = (event.pageIndex-1) + event.pageSize;
    console.log(currentPage);
    this.selectPageEvent.emit(currentPage)
    this.backendService.getChildren(currentPage, () => {
      this.dataSource = new MatTableDataSource(this.storeService.children);
      this.dataSource.sort = this.sort;
    });
  }

  public returnAllPages() {
    let res = [];
    const pageCount = Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public cancelRegistration(childId: string) {
    this.isLoading = true;

    this.backendService.deleteChildData(
      childId, 
      this.currentPage,
      () => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.storeService.children);
        this.dataSource.sort = this.sort;
      }
    );
  }

  getChildrenPerPageCount() {
    return CHILDREN_PER_PAGE;
  }
}