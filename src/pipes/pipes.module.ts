import { NgModule } from '@angular/core';
import { SafeUrlPipe } from './safe-url/safe-url';
import { CDVPhotoLibraryPipe } from './cdvphotolibrary.pipe';
import { TimeDisposePipe } from './time-dispose/time-dispose';
import { MaxStringPipe } from './max-string/max-string';
import { EditPageGroupPipe } from './edit-page-group/edit-page-group';

@NgModule({
	declarations: [
		SafeUrlPipe,
		CDVPhotoLibraryPipe,
		TimeDisposePipe,
		MaxStringPipe,
		EditPageGroupPipe,
	],
	imports: [],
	exports: [
		SafeUrlPipe,
		CDVPhotoLibraryPipe,
		TimeDisposePipe,
		MaxStringPipe,
		EditPageGroupPipe,
	]
})
export class PipesModule { }
