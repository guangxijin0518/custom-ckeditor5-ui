/**
 * @module image/imagezindex/utils
 */

import log from '@ckeditor/ckeditor5-utils/src/log';

import frontIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import backIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';

const defaultZIndexes = {
	// This option is equal to the situation when no zindex is applied.
	front: {
		name: 'front',
		title: 'Above Text',
		icon: frontIcon,
		isDefault: true
	},

	// This represents a side image.
	back: {
		name: 'back',
		title: 'Behind Text',
		icon: backIcon,
		className: 'image-zindex-back'
	}
};

const defaultIcons = {
	front: frontIcon,
	back: backIcon
};

/**
 * Returns a {@link module:image/image~ImageConfig#zindexes} array with items normalized in the
 * {@link module:image/imagezindex/imagezindexediting~ImageZIndexFormat} format and a complete `icon` markup for each zindex.
 *
 * @returns {Array.<module:image/imagezindex/imagezindexediting~ImageZIndexFormat>}
 */
export function normalizeImageZIndexes( configuredZIndexes = [] ) {
	return configuredZIndexes.map( _normalizeZIndex );
}

// Normalizes an image zindex provided in the {@link module:image/image~ImageConfig#zindexes}
// and returns it in a {@link module:image/imagezindex/imagezindexediting~ImageZIndexFormat}.
//
// @param {Object} zindex
// @returns {@link module:image/imagezindex/imagezindexediting~ImageZIndexFormat}
function _normalizeZIndex( zindex ) {
	// Just the name of the zindex has been passed.
	if ( typeof zindex == 'string' ) {
		const zindexName = zindex;

		// If it's one of the defaults, just use it.
		if ( defaultZIndexes[ zindexName ] ) {
			// Clone the zindex to avoid overriding defaults.
			zindex = Object.assign( {}, defaultZIndexes[ zindexName ] );
		}
		// If it's just a name but none of the defaults, warn because probably it's a mistake.
		else {
			log.warn(
				'image-zindex-not-found: There is no such image zindex of given name.',
				{ name: zindexName }
			);

			// Normalize the zindex anyway to prevent errors.
			zindex = {
				name: zindexName
			};
		}
	}
	// If an object zindex has been passed and if the name matches one of the defaults,
	// extend it with defaults – the user wants to customize a default zindex.
	// Note: Don't override the user–defined zindex object, clone it instead.
	else if ( defaultZIndexes[ zindex.name ] ) {
		const defaultZIndex = defaultZIndexes[ zindex.name ];
		const extendedZIndex = Object.assign( {}, zindex );

		for ( const prop in defaultZIndex ) {
			if ( !zindex.hasOwnProperty( prop ) ) {
				extendedZIndex[ prop ] = defaultZIndex[ prop ];
			}
		}

		zindex = extendedZIndex;
	}

	// If an icon is defined as a string and correspond with a name
	// in default icons, use the default icon provided by the plugin.
	if ( typeof zindex.icon == 'string' && defaultIcons[ zindex.icon ] ) {
		zindex.icon = defaultIcons[ zindex.icon ];
	}

	return zindex;
}
