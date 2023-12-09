import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  constructor(public storeService: StoreService, private backendService: BackendService) {}
  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  public isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    
    this.backendService.getChildren(
      this.currentPage, 
      () => {
        this.isLoading = false;
      }
    );
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
    this.backendService.getChildren(currentPage, () => {});
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
      }
    );
  }

  getChildrenPerPageCount() {
    return CHILDREN_PER_PAGE;
  }
}


