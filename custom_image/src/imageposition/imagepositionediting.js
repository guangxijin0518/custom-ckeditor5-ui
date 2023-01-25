/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageposition/imagepositionediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePositionCommand from './imagepositioncommand';
import { viewToModelPositionAttribute, modelToViewPositionAttribute } from './converters';
import CustomMouseObserver from '../../../observers/custommouseobserver';

/**
 * The image position engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:image/imageposition/imagepositioncommand~ImagePositionCommand ImagePositionCommand}.
 *
 * @extends {module:core/plugin~Plugin}
 */
export default class ImagePositionEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePositionEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Allow imageposition attribute in image.
		// We could call it 'position' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
		schema.extend( 'image', { allowAttributes: 'imagePosition' } );

		// Converters for imagePosition attribute from model to view.
		const modelToViewConverter = modelToViewPositionAttribute();
		editing.downcastDispatcher.on( 'attribute:imagePosition:image', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:imagePosition:image', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:figure', viewToModelPositionAttribute(), { priority: 'low' } );

		// Register imagePosition command.
		editor.commands.add( 'imagePosition', new ImagePositionCommand( editor ) );

		editing.view.addObserver( CustomMouseObserver );

		let positionStarted = false;
		let positionedElement = null;
		let computedLeft = 0, computedTop = 0;

		this.editor.editing.view.document.on('mousedown', (evt, data) => {
			if (data.domEvent.buttons == 1
				&& $(data.domTarget).is('img')
				&& $(data.domTarget).parent().is('.image-style-absolute')
			) {
				positionStarted = true;
				positionedElement = $(data.domTarget).parent().get(0);
				computedLeft = positionedElement.offsetLeft;
				computedTop = positionedElement.offsetTop;
			}
		});

		this.editor.editing.view.document.on('mousemove', (evt, data) => {
			if (positionStarted && positionedElement != null) {
				computedLeft += data.domEvent.movementX;
				computedTop += data.domEvent.movementY;
				editor.execute('imagePosition', {left: computedLeft + 'px', top: computedTop + 'px'});
			}
		});

		this.editor.editing.view.document.on('mouseleave', (evt, data) => {
			if (positionStarted) {
				positionStarted = false;
				positionedElement = null
			}
		});

		this.editor.editing.view.document.on('mouseup', (evt, data) => {
			if (positionStarted) {
				positionStarted = false;
				positionedElement = null;
			}
		});

		this.editor.editing.view.document.on('drop', (evt, data) => {
			console.log('drop');
			console.log('drop evt', evt);
			console.log('drop data', data);
		});
		this.editor.editing.view.document.on('dragstart', (evt, data) => {
			console.log('drag');
			console.log('drag evt', evt);
			console.log('drag data', data);
		});
	}
}

/**
 * The image position format descriptor.
 *
 *		A string that represents the width of figure element
 *
 */
