import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { MaterialModule } from './material.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { HttpClientModule } from '@angular/common/http';
// videogular2
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';


@NgModule({
  providers: [
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    DirectivesModule,
    HttpClientModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  declarations: [

  ],
  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    DirectivesModule,
    HttpClientModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  entryComponents: [

  ],
})
export class SharedModule { }
