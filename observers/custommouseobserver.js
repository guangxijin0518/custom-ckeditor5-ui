import DomEventObserver from '@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver';
import EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo';

/**
 * Clipboard events observer.
 *
 * Fires the following events:
 *
 * * {@link module:engine/view/document~Document#event:mousemove}
 * * {@link module:engine/view/document~Document#event:mouseup}
 *
 * Note that this observer is not available by default (it is not added by the engine).
 * To make it available it needs to be added to {@link module:engine/view/document~Document} by
 * the {@link module:engine/view/view~View#addObserver `View#addObserver()`} method. You can also load the
 * {@link module:clipboard/clipboard~Clipboard} plugin which adds this observer automatically (because it uses it).
 *
 * @extends module:engine/view/observer/domeventobserver~DomEventObserver
 */
export default class CustomMouseObserver extends DomEventObserver {
  constructor( view ) {
		super( view );

		this.domEventType = ['mousedown', 'mousemove', 'mouseup', 'mouseleave', 'dragstart'];
	}

	onDomEvent( domEvent ) {
		this.fire( domEvent.type, domEvent );
	}
}
