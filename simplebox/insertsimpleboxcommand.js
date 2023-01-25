import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertSimpleBoxCommand extends Command {
  execute() {
    this.editor.model.change(writer => {
      this.editor.model.insertContent(createSimpleBox(writer));
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'simpleBox');

    this.isEnabled = allowedIn !== null;
  }
}

function createSimpleBox(writer) {
  const simpleBox = writer.createElement('simpleBox');
  const simpleBoxTitle = writer.createElement('simpleBoxTitle');
  const simpleBoxDescription = writer.createElement('simpleBoxDescription');

  writer.append(simpleBoxTitle, simpleBox);
  writer.append(simpleBoxDescription, simpleBox);
  writer.append(writer.createElement('paragraph'), simpleBoxDescription);

  return simpleBox;
}