import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './service/employee.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{    //oninit - perform component setup logic, such as retrieving initial data, setting default values, or subscribing to observables.

  displayedColumns: string[] = [
  'id', 
  'firstName', 
  'lastName', 
  'email', 
  'dob', 
  'gender', 
  'education',
  'company',
  'experience',
  'package',
  'action'
];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _empService: EmployeeService){  }    //_ for dependency injections
  ngOnInit(): void {
    this.getEmployeeList();
  }

    openAddEditEmpForm(){
      const dialogRef = this._dialog.open(EmpAddEditComponent)
      dialogRef.afterClosed().subscribe({
        next:(val) =>{
          if(val){
            this.getEmployeeList();
          }
        }
      })
    }

    getEmployeeList(){
      this._empService.getEmployeeList().subscribe({
        next: (res) =>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err) =>{
          console.log(err);
        }
      })
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    deleteEmployee(id: number){
      this._empService.deleteEmployee(id).subscribe({
        next: (res) => {
          alert('Employee Deleted!')
          this.getEmployeeList();
        },
        error: console.log,
      })
    }

    openEditForm(data: any){
      this._dialog.open(EmpAddEditComponent, {
        data,
      });
    }
  }