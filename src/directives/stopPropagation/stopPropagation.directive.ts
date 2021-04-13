import { Directive, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';


@Directive({
    selector: '[click.stop]'
})
export class StopPropagationDirective {

    @Output("click.stop") stopPropEvent = new EventEmitter();
    unsubscribe: () => void;

    constructor(
        private _renderer: Renderer2,
        private _element: ElementRef,
    ) {
    }

    ngOnInit() {
        this.unsubscribe = this._renderer.listen(
            this._element.nativeElement, 'click', event => {
                event.stopPropagation();
                this.stopPropEvent.emit(event);
            });
    }

    ngOnDestroy() {
        this.unsubscribe();
    }


}