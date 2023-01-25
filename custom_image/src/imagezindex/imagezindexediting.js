/**
 * @module image/imagezindex/imagezindexediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageZIndexCommand from './imagezindexcommand';
import { viewToModelZIndexAttribute, modelToViewZIndexAttribute } from './converters';
import { normalizeImageZIndexes } from './utils';

/**
 * The image zindex engine plugin. It sets the default configuration, creates converters and registers
 * {@link module:image/imagezindex/imagezindexcommand~ImageZIndexCommand ImageZIndexCommand}.
 *
 * @extends {module:core/plugin~Plugin}
 */
export default class ImageZIndexEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageZIndexEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Define default configuration.
		editor.config.define( 'image.zindexes', [ 'front', 'back' ] );

		// Get configuration.
		const zindexes = normalizeImageZIndexes( editor.config.get( 'image.zindexes' ) );

		// Allow imageZIndex attribute in image.
		// We could call it 'zindex' but https://github.com/ckeditor/ckeditor5-engine/issues/559.
		schema.extend( 'image', { allowAttributes: 'imageZIndex' } );

		// Converters for imageZIndex attribute from model to view.
		const modelToViewConverter = modelToViewZIndexAttribute( zindexes );
		editing.downcastDispatcher.on( 'attribute:imageZIndex:image', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:imageZIndex:image', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:figure', viewToModelZIndexAttribute( zindexes ), { priority: 'low' } );

		// Register imageZIndex command.
		editor.commands.add( 'imageZIndex', new ImageZIndexCommand( editor, zindexes ) );
	}
}

/**
 * The image zindex format descriptor.
 *
 *		import frontIcon from 'path/to/icon.svg';
 *
 *		const imageZIndexFormat = {
 *			name: 'front',
 *			icon: frontIcon,
 *			title: 'Above Text',
 *			className: 'image-zindex-front'
 *		}
 *
 * @typedef {Object} module:image/imagezindex/imagezindexediting~ImageZIndexFormat
 *
 * @property {String} name The unique name of the zindex. It will be used to:
 *
 * * Store the chosen zindex in the model by setting the `imageZIndex` attribute of the `<image>` element.
 * * As a value of the {@link module:image/imagezindex/imagezindexcommand~ImagezindexCommand#execute `imageZIndex` command},
 * * when registering a button for each of the zindexes (`'imageZIndex:{name}'`) in the
 * {@link module:ui/componentfactory~ComponentFactory UI components factory} (this functionality is provided by the
 * {@link module:image/imagezindex/imagezindexui~ImageZIndexUI} plugin).
 *
 * @property {Boolean} [isDefault] When set, the zindex will be used as the default one.
 * A default zindex does not apply any CSS class to the view element.
 *
 * @property {String} icon One of the following to be used when creating the zindex's button:
 *
 * * An SVG icon source (as an XML string).
 * * One of {@link module:image/imagezindex/utils~defaultIcons} to use a default icon provided by the plugin.
 *
 * @property {String} title The zindex's title.
 *
 * @property {String} className The CSS class used to represent the zindex in the view.
 */
