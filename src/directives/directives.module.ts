import { NgModule } from '@angular/core';
// import { SharedModule } from '../modules/shared.module';
import { OfflineDirective } from './offline/offline';
import { StopPropagationDirective } from './stopPropagation/stopPropagation.directive';
import { DebugToggleDirective } from './debug-toggle/debug-toggle';
import { IsOverflowDirective } from './is-overflow/is-overflow';
import { IsOverflow2Directive } from './is-overflow2/is-overflow2';
import { ScrollPositionDirective } from './scroll-position/scroll-position';
import { IsShowDirective } from './is-show/is-show';

@NgModule({
	declarations: [
		OfflineDirective,
		StopPropagationDirective,
		DebugToggleDirective,
		IsOverflowDirective,
		IsOverflow2Directive,
		ScrollPositionDirective,
		IsShowDirective,
	],
	imports: [
		// SharedModule,
	],
	exports: [
		OfflineDirective,
		StopPropagationDirective,
		DebugToggleDirective,
		IsOverflowDirective,
		IsOverflow2Directive,
		ScrollPositionDirective,
		IsShowDirective,
	]
})
export class DirectivesModule { }
