/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imagezindex/imagezindexcommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { isImage } from '../image/utils';

/**
 * The image zindex command. It is used to apply different image zindexes.
 *
 * @extends module:core/command~Command
 */
export default class ImageZIndexCommand extends Command {
	/**
	 * Creates an instance of the image zindex command. Each command instance is handling one zindex.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {Array.<module:image/imagezindex/imagezindexediting~ImageZIndexFormat>} zindexes The zindexes that this command supports.
	 */
	constructor( editor, zindexes ) {
		super( editor );

		/**
		 * The name of the default zindex, if it is present. If there is no default zindex, it defaults to `false`.
		 *
		 * @readonly
		 * @type {Boolean|String}
		 */
		this.defaultZIndex = false;

		/**
		 * A zindex handled by this command.
		 *
		 * @readonly
		 * @member {Array.<module:image/imagezindex/imagezindexediting~ImageZIndexFormat>} #zindexes
		 */
		this.zindexes = zindexes.reduce( ( zindexes, zindex ) => {
			zindexes[ zindex.name ] = zindex;

			if ( zindex.isDefault ) {
				this.defaultZIndex = zindex.name;
			}

			return zindexes;
		}, {} );
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = (isImage(element) && element.hasAttribute('imageStyle') && element.getAttribute('imageStyle') == 'absoluteImage');

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'imageZIndex' ) ) {
			const attributeValue = element.getAttribute( 'imageZIndex' );
			this.value = this.zindexes[ attributeValue ] ? attributeValue : false;
		} else {
			this.value = this.defaultZIndex;
		}
	}

	/**
	 * Executes the command.
	 *
	 *		editor.execute( 'imageZIndex', { value: 'front' } );
	 *
	 * @param {Object} options
	 * @param {String} options.value The name of the zindex (based on the
	 * {@link module:image/image~ImageConfig#zindexes `image.zindexes`} configuration option).
	 * @fires execute
	 */
	execute( options ) {
		const zindexName = options.value;

		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			// Default zindex means that there is no `imageZIndex` attribute in the model.
			// https://github.com/ckeditor/ckeditor5-image/issues/147
			if ( this.zindexes[ zindexName ].isDefault ) {
				writer.removeAttribute( 'imageZIndex', imageElement );
			} else {
				writer.setAttribute( 'imageZIndex', zindexName, imageElement );
			}
		} );
	}
}
