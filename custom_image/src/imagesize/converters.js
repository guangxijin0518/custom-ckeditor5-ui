/**
 * @license Copyright (c) 2019, Daniel Smykowski. All rights reserved.
 */

import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * @module image/imagesize/converters
 */

/**
 * Returns a converter for the `imageSize` attribute. It can be used for adding, changing and removing the attribute.
 *
 * @returns {Function} A model-to-view attribute converter.
 */
export function modelToViewSizeAttribute() {
	return ( evt, data, conversionApi ) => {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const viewElement = conversionApi.mapper.toViewElement( data.item );
		const viewWriter = conversionApi.writer;

		viewWriter.setStyle('width', data.attributeNewValue, viewElement);
	};
}

/**
 * Returns a view-to-model converter converting image CSS classes to a proper value in the model.
 *
 * @returns {Function} A view-to-model converter.
 */
export function viewToModelSizeAttribute() {

	return ( evt, data, conversionApi ) => {
		if ( !data.modelRange ) {
			return;
		}

		const viewFigureElement = data.viewItem;
		const modelImageElement = first( data.modelRange.getItems() );

		// Check if `imageSize` attribute is allowed for current element.
		if ( !conversionApi.schema.checkAttribute( modelImageElement, 'imageSize' ) ) {
			return;
		}

		if ( conversionApi.consumable.consume( viewFigureElement, { styles: 'width' } ) ) {
			// And convert this size to model attribute.
			conversionApi.writer.setAttribute(
				'imageSize',
				viewFigureElement.getStyle('width'),
				modelImageElement
			);
		}
	};
}