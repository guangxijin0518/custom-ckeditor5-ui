/**
 * @license Copyright (c) 2019, Daniel Smykowski. All rights reserved.
 */

/**
 * @module image/imageposition/imagepositioncommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '../image/utils';

/**
 * The image position command. It is used to apply different image positions.
 *
 * @extends module:core/command~Command
 */
export default class ImagePositionCommand extends Command {
	/**
	 * Creates an instance of the image position command. Each command instance is handling one position.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {Array.<module:image/imageposition/imagepositionediting~ImagePositionFormat>} positions The positions that this command supports.
	 */
	constructor( editor ) {
		super( editor );

		/**
		 * The name of the default position, if it is present. If there is no default position, it defaults to `false`.
		 *
		 * @readonly
		 * @type {Boolean|String}
		 */
		this.defaultPosition = false;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isImage( element );

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'imagePosition' ) ) {
			this.value = element.getAttribute( 'imagePosition' );
		} else {
			this.value = this.defaultPosition;
		}
	}

	/**
	 * Executes the command.
	 *
	 *		editor.execute( 'imagePosition', { value: 'side' } );
	 *
	 * @param {Object} options
	 * @param {String} options.value The name of the position (based on the
	 * {@link module:image/image~ImageConfig#positions `image.positions`} configuration option).
	 * @fires execute
	 */
	execute( options ) {
		const position = options;

		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			// Default position means that there is no `imagePosition` attribute in the model.
			// https://github.com/ckeditor/ckeditor5-image/issues/147
			if ( !position ) {
				writer.removeAttribute( 'imagePosition', imageElement );
			} else {
				writer.setAttribute( 'imagePosition', position, imageElement );
			}
		} );
	}
}
