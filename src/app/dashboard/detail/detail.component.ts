import { Component } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  constructor(public storeService: StoreService, private backendService: BackendService) {}
  public displayedColumns: string[] = ['id', 'name', 'address', 'betreiber', 'image'];

  ngOnInit(): void {
    this.backendService.getKindergardens();
  }
}
