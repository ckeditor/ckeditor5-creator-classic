/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import Model from '../../ui/model.js';
import Button from '../../ui/button/button.js';
import ButtonView from '../../ui/button/buttonview.js';

import Collection from '../../utils/collection.js';

import ListDropdown from '../../ui/dropdown/list/listdropdown.js';
import ListDropdownView from '../../ui/dropdown/list/listdropdownview.js';

/**
 * Immitates that some features were loaded and did their job.
 *
 * @param {ckeditor5.Editor} editor
 */
export function imitateFeatures( editor ) {
	const t = editor.t;

	const boldModel = new Model( {
		isEnabled: true,
		isOn: false,
		label: t( 'Bold' ),
		icon: 'bold',
		iconAlign: 'LEFT'
	} );

	// Note – most of the contents of this file is ignored, as it's a temporary file that will
	// be replaced with real features.

	/* istanbul ignore next */
	boldModel.on( 'execute', () => {
		/* global console */
		console.log( 'bold executed' );

		boldModel.isOn = !boldModel.isOn;
	} );

	editor.ui.featureComponents.add( 'bold', Button, ButtonView, boldModel );

	// -------------------------------------------------------------------------------------------

	/* istanbul ignore next */
	const italicModel = new Model( {
		isEnabled: true,
		isOn: false,
		label: t( 'Italic' ),
		icon: 'italic',
		iconAlign: 'LEFT'
	} );

	/* istanbul ignore next */
	italicModel.on( 'execute', () => {
		/* global console */
		console.log( 'italic executed' );

		italicModel.isOn = !italicModel.isOn;
	} );

	editor.ui.featureComponents.add( 'italic', Button, ButtonView, italicModel );

	window.boldModel = boldModel;
	window.italicModel = italicModel;

	// -------------------------------------------------------------------------------------------

	const fontCollection = new Collection( { idProperty: 'label' } );

	/* istanbul ignore next */
	[ 'Arial', 'Times New Roman', 'Comic Sans MS', 'Georgia', 'Trebuchet MS', 'Verdana' ]
		.sort()
		.forEach( font => {
			fontCollection.add( new Model( { label: font, style: `font-family: "${ font }"` } ) );
		} );

	/* istanbul ignore next */
	const fontListModel = new Model( {
		items: fontCollection
	} );

	/* istanbul ignore next */
	fontListModel.on( 'execute', ( evtInfo, itemModel ) => {
		/* global console */
		console.log( 'Font list item executed', itemModel );
	} );

	/* istanbul ignore next */
	const fontModel = new Model( {
		label: t( 'Font' ),
		isEnabled: true,
		isOn: false,
		content: fontListModel
	} );

	editor.ui.featureComponents.add( 'font', ListDropdown, ListDropdownView, fontModel );

	window.fontCollection = fontCollection;
	window.fontModel = fontModel;
	window.Model = Model;
}

export function imitateDestroyFeatures() {
	delete window.boldModel;
	delete window.italicModel;
	delete window.fontCollection;
	delete window.Model;
}
