/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module editor-classic/classiceditorui
 */

import ComponentFactory from '@ckeditor/ckeditor5-ui/src/componentfactory';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/contextualballoon';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';
import enableToolbarKeyboardFocus from '@ckeditor/ckeditor5-ui/src/toolbar/enabletoolbarkeyboardfocus';

/**
 * The classic editor UI class.
 *
 * @implements module:core/editor/editorui~EditorUI
 */
export default class ClassicEditorUI {
	/**
	 * Creates an instance of the editor UI class.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {module:ui/editorui/editoruiview~EditorUIView} view View of the ui.
	 */
	constructor( editor, view ) {
		/**
		 * @inheritDoc
		 */
		this.editor = editor;

		/**
		 * @inheritDoc
		 */
		this.view = view;

		/**
		 * @inheritDoc
		 */
		this.componentFactory = new ComponentFactory( editor );

		/**
		 * @inheritDoc
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * Common balloon panel for each plugin which needs to be displayed
		 * as a contextual balloon panel.
		 *
		 * @member {module:ui/contextualballoon~ContextualBalloon} #balloon
		 */
		this.balloon = new ContextualBalloon( editor );
		this.balloon.view = new BalloonPanelView( editor.locale );
		view.body.add( this.balloon.view );
		this.focusTracker.add( this.balloon.view.element );

		// Set–up the view.
		view.set( 'width', editor.config.get( 'ui.width' ) );
		view.set( 'height', editor.config.get( 'ui.height' ) );

		// Set–up the toolbar.
		view.toolbar.bind( 'isActive' ).to( this.focusTracker, 'isFocused' );
		view.toolbar.limiterElement = view.element;

		// Setup the editable.
		const editingRoot = editor.editing.createRoot( 'div' );
		view.editable.bind( 'isReadOnly' ).to( editingRoot );
		view.editable.bind( 'isFocused' ).to( editor.editing.view );
		view.editable.name = editingRoot.rootName;
		this.focusTracker.add( view.editableElement );
	}

	/**
	 * Initializes the UI.
	 *
	 * @returns {Promise} A Promise resolved when the initialization process is finished.
	 */
	init() {
		const editor = this.editor;

		return this.view.init()
			.then( () => {
				return this.view.toolbar.fillFromConfig( editor.config.get( 'toolbar' ), this.componentFactory );
			} )
			.then( () => {
				enableToolbarKeyboardFocus( {
					origin: editor.editing.view,
					originFocusTracker: this.focusTracker,
					originKeystrokeHandler: editor.keystrokes,
					toolbar: this.view.toolbar
				} );
			} );
	}

	/**
	 * Destroys the UI.
	 *
	 * @returns {Promise} A Promise resolved when the destruction process is finished.
	 */
	destroy() {
		return this.view.destroy();
	}
}
