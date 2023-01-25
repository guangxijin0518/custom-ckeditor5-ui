/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagesize/imagesizeediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageSizeCommand from './imagesizecommand';
import { viewToModelSizeAttribute, modelToViewSizeAttribute } from './converters';
import CustomMouseObserver from '../../../observers/custommouseobserver';

/**
 * The image size engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:image/imagesize/imagesizecommand~ImageSizeCommand ImageSizeCommand}.
 *
 * @extends {module:core/plugin~Plugin}
 */
export default class ImageSizeEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageSizeEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Allow imagesize attribute in image.
		// We could call it 'size' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
		schema.extend( 'image', { allowAttributes: 'imageSize' } );

		// Converters for imageSize attribute from model to view.
		const modelToViewConverter = modelToViewSizeAttribute();
		editing.downcastDispatcher.on( 'attribute:imageSize:image', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:imageSize:image', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:figure', viewToModelSizeAttribute(), { priority: 'low' } );

		// Register imageSize command.
		editor.commands.add( 'imageSize', new ImageSizeCommand( editor ) );

		editing.view.addObserver( CustomMouseObserver );

		let sizeStarted = false;
		let sizedElement = null;
		let computedSize = 0;

		this.editor.editing.view.document.on('mousedown', (evt, data) => {
			if (data.domEvent.buttons == 1 && $(data.domTarget).is('figure')) {
				sizeStarted = true;
				sizedElement = data.domTarget;
				computedSize = sizedElement.offsetWidth;
			}
		});

		this.editor.editing.view.document.on('mousemove', (evt, data) => {
			if (sizeStarted && sizedElement != null) {
				computedSize += data.domEvent.movementX;
				const viewedSize = computedSize < 50 ? 50 : computedSize;
				editor.execute('imageSize', {value: viewedSize + 'px'});
			}
		});

		this.editor.editing.view.document.on('mouseleave', (evt, data) => {
			if (sizeStarted) {
				sizeStarted = false;
				sizedElement = null
			}
		});

		this.editor.editing.view.document.on('mouseup', (evt, data) => {
			if (sizeStarted) {
				sizeStarted = false;
				sizedElement = null
			}
		});
	}
}

/**
 * The image size format descriptor.
 *
 *		A string that represents the width of figure element
 *
 */
