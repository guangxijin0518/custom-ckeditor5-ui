/**
 * @license Copyright (c) 2019, Daniel Smykowski. All rights reserved.
 */

/**
 * @module image/imagesize/imagesizecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '../image/utils';

/**
 * The image size command. It is used to apply different image sizes.
 *
 * @extends module:core/command~Command
 */
export default class ImageSizeCommand extends Command {
	/**
	 * Creates an instance of the image size command. Each command instance is handling one size.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {Array.<module:image/imagesize/imagesizeediting~ImageSizeFormat>} sizes The sizes that this command supports.
	 */
	constructor( editor ) {
		super( editor );

		/**
		 * The name of the default size, if it is present. If there is no default size, it defaults to `false`.
		 *
		 * @readonly
		 * @type {Boolean|String}
		 */
		this.defaultSize = false;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isImage( element );

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'imageSize' ) ) {
			this.value = element.getAttribute( 'imageSize' );
		} else {
			this.value = this.defaultSize;
		}
	}

	/**
	 * Executes the command.
	 *
	 *		editor.execute( 'imageSize', { value: 'side' } );
	 *
	 * @param {Object} options
	 * @param {String} options.value The name of the size (based on the
	 * {@link module:image/image~ImageConfig#sizes `image.sizes`} configuration option).
	 * @fires execute
	 */
	execute( options ) {
		const sizeValue = options.value;

		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			// Default size means that there is no `imageSize` attribute in the model.
			// https://github.com/ckeditor/ckeditor5-image/issues/147
			if ( !sizeValue ) {
				writer.removeAttribute( 'imageSize', imageElement );
			} else {
				writer.setAttribute( 'imageSize', sizeValue, imageElement );
			}
		} );
	}
}
