import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit{
  constructor(private formbuilder: FormBuilder, public storeService: StoreService, public backendService: BackendService) {
  }
  public addChildForm: any;
  @Input() currentPage!: number;
  public showChildAddedAlert: boolean = false;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      kindergardenId: ['', Validators.required],
      birthDate: [null, Validators.required]
    })
  }

  onSubmit() {
    if(this.addChildForm.valid) {
      console.log(this.currentPage);
      this.backendService.addChildData(this.addChildForm.value, this.currentPage, () => {
        this.showChildAddedAlert = true;
        setTimeout(() => {this.hideChildAddedAlert()}, 3000);
      });
    }
  }

  hideChildAddedAlert() {
    this.showChildAddedAlert = false;
  }

  getErrorMessage(component: string) {
    var field = this.addChildForm.get(component);

    if (field.hasError('required')) {
      return 'Die Eingabe darf nicht leer sein.';
    }

    if (field.hasError('minlength')) {
      return 'Bitte eine gültige Eingabe tätigen.';
    }

    if (field.hasError('maxlength')) {
      return 'Die Eingabe überschreitet die maximale Länge.';
    }

    return '';
  }
}
