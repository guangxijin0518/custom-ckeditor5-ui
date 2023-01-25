import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class SimpleBoxUI extends Plugin {
  init() {
    console.log('SimpleBoxUI#init() got called');

    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('simpleBox', locale => {
      const command = editor.commands.get('insertSimpleBox');

      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t('Simple Box'),
        withText: true,
        tooltip: true
      });

      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      this.listenTo(buttonView, 'execute', () => editor.execute('insertSimpleBox'));

      return buttonView;
    });
  }
}