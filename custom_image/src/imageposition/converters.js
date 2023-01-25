/**
 * @license Copyright (c) 2019, Daniel Smykowski. All rights reserved.
 */

import first from '@ckeditor/ckeditor5-utils/src/first';

/**
 * @module image/imageposition/converters
 */

/**
 * Returns a converter for the `imagePosition` attribute. It can be used for adding, changing and removing the attribute.
 *
 * @returns {Function} A model-to-view attribute converter.
 */
export function modelToViewPositionAttribute() {
	return ( evt, data, conversionApi ) => {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const viewElement = conversionApi.mapper.toViewElement( data.item );
		const viewWriter = conversionApi.writer;
		
		if (data.attributeNewValue) {
			viewWriter.setStyle('left', data.attributeNewValue.left, viewElement);
			viewWriter.setStyle('top', data.attributeNewValue.top, viewElement);
		}
		else {
			viewWriter.removeStyle('left', viewElement);
			viewWriter.removeStyle('top', viewElement);
		}
	};
}

/**
 * Returns a view-to-model converter converting image CSS classes to a proper value in the model.
 *
 * @returns {Function} A view-to-model converter.
 */
export function viewToModelPositionAttribute() {

	return ( evt, data, conversionApi ) => {
		if ( !data.modelRange ) {
			return;
		}

		const viewFigureElement = data.viewItem;
		const modelImageElement = first( data.modelRange.getItems() );

		// Check if `imagePosition` attribute is allowed for current element.
		if ( !conversionApi.schema.checkAttribute( modelImageElement, 'imagePosition' ) ) {
			return;
		}

		if ( conversionApi.consumable.consume( viewFigureElement, { styles: ['left', 'top'] } ) ) {
			// And convert this position to model attribute.
			const position = {
				left: viewFigureElement.getStyle('left'),
				top: viewFigureElement.getStyle('top')
			};
			conversionApi.writer.setAttribute( 'imagePosition', position, modelImageElement );
		}
	};
}