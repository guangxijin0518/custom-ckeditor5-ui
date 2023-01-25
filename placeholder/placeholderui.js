import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import {
  addListToDropdown,
  createDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';

export default class PlaceholderUI extends Plugin {
  init() {
    console.log('PlaceholderUI#init() got called');
    const editor = this.editor;
    const t = editor.t;
    const placeholderNames = editor.config.get('placeholderConfig.types');

    editor.ui.componentFactory.add('placeholder', locale => {
      const dropdownView = createDropdown(locale);
      addListToDropdown(dropdownView, getDropdowItemsDefinition(placeholderNames));

      dropdownView.buttonView.set({
        label: t('Placeholder'),
        tooltip: true,
        withText: true
      });

      this.listenTo(dropdownView, 'execute', evt => {
        editor.execute('placeholder', {value: evt.source.commandParam});
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }
}

function getDropdowItemsDefinition(placeholderNames) {
  const itemDefinitions = new Collection();
  for (const name of placeholderNames) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: name,
        label: name,
        withText: true
      })
    };

    itemDefinitions.add(definition);
  }
  return itemDefinitions;
}