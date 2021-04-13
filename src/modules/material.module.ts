import { NgModule } from '@angular/core';
/** Autocomplete */
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
/** Checkbox */
// import { MatCheckboxModule } from '@angular/material/checkbox';
/** Datepicke */
// import { MatDatepickerModule } from '@angular/material/datepicker';
/** FormField */
// import { MatFormFieldModule } from '@angular/material/form-field';
/** Input */
// import { MatInputModule } from '@angular/material/input';
/** Radio */
// import { MatRadioModule } from '@angular/material/radio';
/** Select */
// import { MatSelectModule } from '@angular/material/select';
/** Slider */
// import { MatSliderModule } from '@angular/material/slider';
/** SlideToggle */
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
/** Menu */
import { MatMenuModule } from '@angular/material/menu';
/** Sidenav */
// import { MatSidenavModule } from '@angular/material/sidenav';
/** Toolbar */
// import { MatToolbarModule } from '@angular/material/toolbar';
/** Card */
// import { MatCardModule } from '@angular/material/card';
/** Divider */
// import { MatDividerModule } from '@angular/material/divider';
/** Expansion */
// import { MatExpansionModule } from '@angular/material/expansion';
/** GridList */
// import { MatGridListModule } from '@angular/material/grid-list';
/** List */
// import { MatListModule } from '@angular/material/list';
/** Stepper */
// import { MatStepperModule } from '@angular/material/stepper';
/** Tabs */
import { MatTabsModule } from '@angular/material/tabs';
/** Tree */
// import { MatTreeModule } from '@angular/material/tree';
/** Button */
// import { MatButtonModule } from '@angular/material/button';
/** ButtonToggle */
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
/** Badge */
// import { MatBadgeModule } from '@angular/material/badge';
/** Chips */
// import { MatChipsModule } from '@angular/material/chips';
/** Icon */
import { MatIconModule } from '@angular/material/icon';
/** Progress */
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
/** ProgressBa */
// import { MatProgressBarModule } from '@angular/material/progress-bar';
/** BottomSheet */
// import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
/** Dialog */
// import { MatDialogModule } from '@angular/material/dialog';
/** SnackBar */
// import { MatSnackBarModule } from '@angular/material/snack-bar';
/** Tooltip */
// import { MatTooltipModule } from '@angular/material/tooltip';
/** Paginator */
// import { MatPaginatorModule } from '@angular/material/paginator';
/** Sort */
// import { MatSortModule } from '@angular/material/sort';
/** Table */
// import { MatTableModule } from '@angular/material/table';

// import {
//   MAT_PLACEHOLDER_GLOBAL_OPTIONS, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter,
//   DateAdapter, MAT_DATE_LOCALE
// } from "@angular/material";

// import { Md2DatepickerModule, MdNativeDateModule } from "md2";


// const MY_DATE_FORMATS = {
//   parse: {
//     //dateInput: { year: 'numeric', month: 'short', day: 'numeric' }
//     dateInput: 'YYYY-MM-DD'
//   },
//   display: {
//     // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
//     dateInput: 'input',
//     //dateInput: 'YYYY-MM-DD',
//     monthYearLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
//     //monthYearLabel: 'YYYY',
//     dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
//     //dateA11yLabel: 'YYYY/MM/DD',
//     monthYearA11yLabel: { year: 'numeric', month: 'numeric' },
//     //monthYearA11yLabel: 'YYYY MMM',
//   }
// };

// export class MyDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     if (displayFormat === "input") {
//       const day = date.getDate();
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       return year + '-' + this._to2digit(month) + '-' + this._to2digit(day);
//     } else {
//       return date.toDateString();
//     }
//   }

//   private _to2digit(n: number) {
//     return ('00' + n).slice(-2);
//   }
// }


@NgModule({
  providers: [
    /*全局定义 input 的显示格式:  auto, always, never*/
    // { provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'auto' } },
    // MatDialogConfig,
    // { provide: DateAdapter, useClass: MyDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }
  ],
  imports: [
    // MatButtonModule,
    // MatCheckboxModule,
    // MatFormFieldModule,
    // MatCardModule,
    MatIconModule,
    // MatSidenavModule,
    // MatToolbarModule,
    // MatListModule,
    // MatInputModule,
    // MatProgressSpinnerModule,
    // MatDialogModule,
    // MatSnackBarModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    // MatRadioModule,
    // MatSelectModule,
    // MatAutocompleteModule,
    // MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    // MatGridListModule,
    // MatStepperModule,
    // Md2DatepickerModule,
    // MdNativeDateModule,
  ],
  exports: [
    // MatButtonModule,
    // MatCheckboxModule,
    // MatFormFieldModule,
    // MatCardModule,
    MatIconModule,
    // MatSidenavModule,
    // MatToolbarModule,
    // MatListModule,
    // MatInputModule,
    // MatProgressSpinnerModule,
    // MatDialogModule,
    // MatSnackBarModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSlideToggleModule,
    // MatRadioModule,
    // MatSelectModule,
    // MatAutocompleteModule,
    // MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    // MatGridListModule,
    // MatStepperModule,
    // Md2DatepickerModule,
    // MdNativeDateModule,
  ]
})
export class MaterialModule { }
