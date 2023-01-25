/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * @module image/imagezindex/converters
 */

/**
 * Returns a converter for the `imageZIndex` attribute. It can be used for adding, changing and removing the attribute.
 *
 * @param {Object} zindexes An object containing available zindexes. See {@link module:image/imagezindex/imagezindexediting~ImageZIndexFormat}
 * for more details.
 * @returns {Function} A model-to-view attribute converter.
 */
export function modelToViewZIndexAttribute( zindexes ) {
	return ( evt, data, conversionApi ) => {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		// Check if there is class name associated with given value.
		const newZIndex = getZIndexByName( data.attributeNewValue, zindexes );
		const oldZIndex = getZIndexByName( data.attributeOldValue, zindexes );

		const viewElement = conversionApi.mapper.toViewElement( data.item );
		const viewWriter = conversionApi.writer;

		if ( oldZIndex ) {
			viewWriter.removeClass( oldZIndex.className, viewElement );
		}

		if ( newZIndex ) {
			viewWriter.addClass( newZIndex.className, viewElement );
		}
	};
}

/**
 * Returns a view-to-model converter converting image CSS classes to a proper value in the model.
 *
 * @param {Array.<module:image/imagezindex/imagezindexediting~ImageZIndexFormat>} zindexes The zindexes for which the converter is created.
 * @returns {Function} A view-to-model converter.
 */
export function viewToModelZIndexAttribute( zindexes ) {
	// Convert only non–default zindexes.
	const filteredZIndexes = zindexes.filter( zindex => !zindex.isDefault );

	return ( evt, data, conversionApi ) => {
		if ( !data.modelRange ) {
			return;
		}

		const viewFigureElement = data.viewItem;
		const modelImageElement = first( data.modelRange.getItems() );

		// Check if `imageZIndex` attribute is allowed for current element.
		if ( !conversionApi.schema.checkAttribute( modelImageElement, 'imageZIndex' ) ) {
			return;
		}

		// Convert zindex one by one.
		for ( const zindex of filteredZIndexes ) {
			// Try to consume class corresponding with zindex.
			if ( conversionApi.consumable.consume( viewFigureElement, { classes: zindex.className } ) ) {
				// And convert this zindex to model attribute.
				conversionApi.writer.setAttribute( 'imageZIndex', zindex.name, modelImageElement );
			}
		}
	};
}

// Returns the zindex with a given `name` from an array of zindexes.
//
// @param {String} name
// @param {Array.<module:image/imagezindex/imagezindexediting~ImageZIndexFormat> } zindexes
// @returns {module:image/imagezindex/imagezindexediting~ImageZIndexFormat|undefined}
function getZIndexByName( name, zindexes ) {
	for ( const zindex of zindexes ) {
		if ( zindex.name === name ) {
			return zindex;
		}
	}
}
