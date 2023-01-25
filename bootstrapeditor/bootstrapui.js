import EditorUI from '@ckeditor/ckeditor5-core/src/editor/editorui';
import ElementReplacer from '@ckeditor/ckeditor5-utils/src/elementreplacer';
import EditorUIView from '@ckeditor/ckeditor5-ui/src/editorui/editoruiview';
import InlineEditableUIView from '@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview';

import AlignLeftIcon from '@ckeditor/ckeditor5-alignment/theme/icons/align-left.svg';
import AlignCenterIcon from '@ckeditor/ckeditor5-alignment/theme/icons/align-center.svg';
import AlignRightIcon from '@ckeditor/ckeditor5-alignment/theme/icons/align-right.svg';
import AlignJustifyIcon from '@ckeditor/ckeditor5-alignment/theme/icons/align-justify.svg';

import fullWidthIcon from '@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg';
import leftIcon from '@ckeditor/ckeditor5-core/theme/icons/object-left.svg';
import centerIcon from '@ckeditor/ckeditor5-core/theme/icons/object-center.svg';
import rightIcon from '@ckeditor/ckeditor5-core/theme/icons/object-right.svg';

export default class BootstrapUI extends EditorUI {
  constructor(editor) {
    super(editor);

    this._elementReplacer = new ElementReplacer();

    const view = this._view = new EditorUIView(editor.locale);

    view.element = $('.notes-editor');

    view.editable = new InlineEditableUIView(editor.locale, editor.editing.view);
  }

  get view() {
    return this._view;
  }

  init(replaceElement) {
    const editor = this.editor;
    const view = this.view;
    const editingView = editor.editing.view;

    const editingRoot = editingView.document.getRoot();

    view.editable.name = editingRoot.rootName;

    view.editable.render();

    const editableElement = view.editable.element;

    this._editableElements.set(view.editable.name, editableElement);
    this.focusTracker.add(editableElement);
    view.editable.bind('isFocused').to(this.focusTracker);

    editingView.attachDomRoot(editableElement);

    this._setupBootstrapToolbarButtons();
    this._setupBootstrapFontFamilyDropdown();
    this._setupBootstrapFontSizeDropdown();
    this._setupBootstrapFontColorDropdown();
    this._setupBootstrapAlignButtons();
    this._setupBootstrapIndentButtons();
    this._setupBootstrapBulletedListDropdown();
    this._setupBootstrapNumberedListDropdown();
    this._setupBootstrapIndentListDropdown();

    this._setupBootstrapAddImageButton();
    this._setupBootstrapImageStyleDropdown();
    this._setupBootstrapImageZIndexDropdown();
    //this._setupBootstrapHeadingDropdown();

    this._elementReplacer.replace(replaceElement, editableElement);

    this.fire('ready');
  }

  destrop() {
    this._elementReplacer.restore();
    this._view.editable.destroy();
    this._view.destroy();

    super.destroy();
  }

  _setupBootstrapToolbarButtons() {
    const editor = this.editor;
    this.view.toolbarButtons = {};

    ['bold', 'italic', 'underline'/*, 'undo', 'redo'*/].forEach(name => {
      this.view.toolbarButtons[name] = this.view.element.find(`#${name}`);
    });

    for (const name in this.view.toolbarButtons) {
      const command = editor.commands.get(name);
      const button = this.view.toolbarButtons[name];

      button.click(() => editor.execute(name));
      button.mousedown(evt => evt.preventDefault());

      const onValueChange = () => {
        button.toggleClass('active', command.value);
      };

      const onIsEnabledChange = () => {
        button.attr('disabled', () => !command.isEnabled);
      };

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      if (!new Set(['undo', 'redo']).has(name)) {
        command.on('change:value', onValueChange);
        onValueChange();
      }
    }
  }

  _setupBootstrapFontFamilyDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.font-family .dropdown-menu');
    const dropdownToggle = this.view.element.find('.font-family .dropdown-toggle');

    const fontFamilyCommand = editor.commands.get('fontFamily');

    editor.config.get('fontFamily.options').map(option => {
      const fontFamilyName = option.split(',')[0];
      const menuItem = $(`<li class="dropdown-item" style="font-family: ${option}">` + `${fontFamilyName}` + '</li>');
      menuItem.click(() => {
        editor.execute('fontFamily', {value: fontFamilyName});
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      const command = fontFamilyCommand;

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        const isActive = command.value == fontFamilyName || (!command.value && option == 'default');
        if (isActive) {
          dropdownToggle.children(':first').text(fontFamilyName);
        }
        
        menuItem.toggleClass('active', isActive);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  _setupBootstrapFontSizeDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.font-size .dropdown-menu');
    const dropdownToggle = this.view.element.find('.font-size .dropdown-toggle');

    const command = editor.commands.get('fontSize');
    editor.config.get('fontSize.options').map(option => {
      const menuItem = $(`<li class="dropdown-item">` + `${option}` + '</li>');
      menuItem.click(() => {
        editor.execute('fontSize', {value: option});
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        const isActive = command.value == option || (!command.value && option == 'default');
        if (isActive) {
          dropdownToggle.children(':first').text(option);
        }
        
        menuItem.toggleClass('active', isActive);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  _setupBootstrapFontColorDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.font-color .dropdown-menu');
    const dropdownToggle = this.view.element.find('.font-color .dropdown-toggle');

    const command = editor.commands.get('fontColor');
    const colorConfig = editor.config.get('fontColor.colors');
    colorConfig.splice(1, 0, {color: '#212529', label: 'default'});
    colorConfig.map(option => {
      const menuItem = $(
        `<li class="dropdown-item">
          <div class="color-content" style="background-color: ${option.color}">
          </div>
        </li>`
      );
      menuItem.click(() => {
        if (option.label == 'default') {
          editor.execute('fontColor');
        }
        else {
          editor.execute('fontColor', {value: option.color});
        }
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        const isActive = command.value == option.color
                        || (!command.value && option.label == 'default');
        if (isActive) {
          dropdownToggle.children(':first').css('background-color', option.color);
        }
        
        menuItem.toggleClass('active', isActive);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  _setupBootstrapAlignButtons() {
    const editor = this.editor;

    const command = editor.commands.get('alignment');

    const icons = {
      left: AlignLeftIcon,
      center: AlignCenterIcon,
      right: AlignRightIcon,
      justify: AlignJustifyIcon
    };

    ['left', 'center', 'right', 'justify'].forEach(name => {
      const button = this.view.element.find(`.btn-align-${name}`);
      //button.html(icons[name]);
      button.click(() => {
        editor.execute('alignment', {value: name});
      });
      button.mousedown(evt => evt.preventDefault());

      const onValueChange = () => {
        const isActive = command.value == name;
        button.toggleClass('active', isActive);
      };
      command.on('change:value', onValueChange);
      onValueChange();

      const onIsEnabledChange = () => {
        button.attr('disabled', () => !command.isEnabled);
      };

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();
    });
  }

  _setupBootstrapIndentButtons() {
    const editor = this.editor;

    ['indent', 'outdent'].forEach(name => {
      const button = this.view.element.find(`.${name}-btn`);
      //button.html(icons[name]);
      button.click(() => {
        editor.execute(`${name}`);
      });
      button.mousedown(evt => evt.preventDefault());

      const command = editor.commands.get(`${name}`);
      console.log('command', command);

      /*const onValueChange = () => {
        console.log('command value', command.value);
        button.toggleClass('active', command.value);
      };
      command.on('change:value', onValueChange);
      onValueChange();*/

      const onIsEnabledChange = () => {
        button.attr('disabled', () => !command.isEnabled);
        button.toggleClass('active', command.isEnabled);
      };

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();
    });
  }

  _setupBootstrapBulletedListDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.bulleted-list .dropdown-menu');
    const dropdownToggle = this.view.element.find('.bulleted-list .dropdown-toggle');

    const command = editor.commands.get('bulletedList');
    const options = ['bulleted'];
    options.map(option => {
      const menuItem = $(`<li class="dropdown-item"><i class="fas fa-list-ul"></i></li>`);
      menuItem.click(() => {
        editor.execute('bulletedList');
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        /*const isActive = command.value == option || (!command.value && option == 'default');
        if (isActive) {
          dropdownToggle.children(':first').text(option);
        }*/
        
        menuItem.toggleClass('active', command.value);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  _setupBootstrapNumberedListDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.numbered-list .dropdown-menu');
    const dropdownToggle = this.view.element.find('.numbered-list .dropdown-toggle');

    const command = editor.commands.get('numberedList');
    const options = ['numbered'];
    options.map(option => {
      const menuItem = $(`<li href="#" class="dropdown-item"><i class="fas fa-list-ol"></i></li>`);
      menuItem.click(() => {
        editor.execute('numberedList');
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        /*const isActive = command.value == option || (!command.value && option == 'default');
        if (isActive) {
          dropdownToggle.children(':first').text(option);
        }*/
        
        menuItem.toggleClass('active', command.value);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  _setupBootstrapIndentListDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.multilevel-list .dropdown-menu');
    const dropdownToggle = this.view.element.find('.multilevel-list .dropdown-toggle');

    const options = ['indent', 'outdent'];
    options.map(option => {
      const menuItem = $(
        `<li href="#" class="dropdown-item">
          <i class="fas fa-${option}"></i>
        </li>`
      );
      
      menuItem.click(() => {
        editor.execute(`${option}List`);
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      const command = editor.commands.get(`${option}List`);

      //command.on('change:value', onValueChange);
      //onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      //function onValueChange() {
        /*const isActive = command.value == option || (!command.value && option == 'default');
        if (isActive) {
          dropdownToggle.children(':first').text(option);
        }*/
        
        //menuItem.toggleClass('active', command.value);
      //}

      function onIsEnabledChange() {
        //dropdownToggle.attr('disabled', () => !command.isEnabled);
        menuItem.attr('disabled', () => !command.isEnabled);
        //menuItem.toggleClass('active', command.isEnabled);
      }
    });
  }

  _setupBootstrapAddImageButton() {
    const editor = this.editor;

    const command = editor.commands.get('imageInsert');
    const imageInput = this.view.element.find('.image-file');
    const button = this.view.element.find('.add-image');
    imageInput.change((event) => {
      console.log('files', event.target.files);
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file.type.match('image/*')) {
          const imageReader = new FileReader();
          imageReader.onload = (ev) => {
            const source = ev.target.result;
            editor.execute('imageInsert', {source: source});
            event.target.value = "";
          }
          imageReader.readAsDataURL(file);
        }
        else {
          console.log('not image');
        }
      }
    });

    const onValueChange = () => {
      //imageInput.toggleClass('active', command.value);
      //button.toggleClass('active', command.value);
    };
    command.on('change:value', onValueChange);
    onValueChange();

    const onIsEnabledChange = () => {
      imageInput.attr('disabled', () => !command.isEnabled);
      button.attr('disabled', () => !command.isEnabled);
    };

    command.on('change:isEnabled', onIsEnabledChange);
    onIsEnabledChange();
  }

  _setupBootstrapImageStyleDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.image-style .dropdown-menu');
    const dropdownToggle = this.view.element.find('.image-style .dropdown-toggle');

    const command = editor.commands.get('imageStyle');
    const imageStyles = [
      {
        name: 'full',
        title: 'Full size',
        icon: fullWidthIcon
      },
      {
        name: 'side',
        title: 'Side image',
        icon: rightIcon
      },
      {
        name: 'alignLeft',
        title: 'Left aligned',
        icon: leftIcon
      },
      {
        name: 'alignCenter',
        title: 'Mid Center',
        icon: centerIcon
      },
      {
        name: 'alignRight',
        title: 'Right aligned',
        icon: rightIcon
      },
      {
        name: 'absoluteImage',
        title: 'Absolute',
        icon: rightIcon
      }/*,
      {
        name: 'inlineImage',
        title: 'Inline',
        icon: rightIcon
      }*/
    ];
    dropdownToggle.children(':first').html(`${fullWidthIcon} <span>Full size</span>`);
    imageStyles.map(style => {
      const menuItem = $(`<li class="dropdown-item">${style.icon} <span>${style.title}</span></li>`);
      menuItem.click(() => {
        editor.execute('imageStyle', {value: style.name});
        editor.execute('imagePosition');
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        const isActive = command.value == style.name;
        if (isActive) {
          dropdownToggle.children(':first').html(`${style.icon} <span>${style.title}</span>`);
        }
        
        menuItem.toggleClass('active', isActive);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  _setupBootstrapImageZIndexDropdown() {
    const editor = this.editor;

    const dropdownMenu = this.view.element.find('.image-back-front .dropdown-menu');
    const dropdownToggle = this.view.element.find('.image-back-front .dropdown-toggle');

    const command = editor.commands.get('imageZIndex');
    const imageZIndexes = [
      {
        name: 'front',
        title: 'Above Text',
        icon: leftIcon
      },
      {
        name: 'back',
        title: 'Behind Text',
        icon: rightIcon
      }
    ];
    dropdownToggle.children(':first').html(`${leftIcon} <span>Above Text</span>`);
    imageZIndexes.map(zindex => {
      const menuItem = $(`<li class="dropdown-item">${zindex.icon} <span>${zindex.title}</span></li>`);
      menuItem.click(() => {
        editor.execute('imageZIndex', {value: zindex.name});
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);
      onIsEnabledChange();

      function onValueChange() {
        const isActive = command.value == zindex.name;
        if (isActive) {
          dropdownToggle.children(':first').html(`${zindex.icon} <span>${zindex.title}</span>`);
        }
        
        menuItem.toggleClass('active', isActive);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }

  /*_setupBootstrapHeadingDropdown() {
    const editor = this.editor;

    this.view.dropdownMenu = view.element.find('.dropdown-menu');
    this.view.dropdownToggle = view.element.find('.dropdown-toggle');
    const dropdownMenu = this.view.dropdownMenu;
    const dropdownToggle = this.view.dropdownToggle;

    const headingCommand = editor.commands.get('heading');
    const paragraphCommand = editor.commands.get('paragraph');

    editor.config.get('heading.options').map(option => {
      const isParagraph = option.model === 'paragraph';

      const menuItem = $(`<a href="#" class="dropdown-item heading_item_${option.model}">` + `${option.title}` + '</a>');
      menuItem.click(() => {
        const commandName = isParagraph ? 'paragraph' : 'heading';
        const commandValue = isParagraph ? undefined : {value: option.model};

        editor.execute(commandName, commandValue);
        editor.editing.view.focus();
      });

      dropdownMenu.append(menuItem);

      const command = isParagraph ? paragraphCommand : headingCommand;

      const onValueChange = isParagraph ? onValueChangeParagraph : onValueChangeHeading;
      command.on('change:value', onValueChange);
      onValueChange();

      command.on('change:isEnabled', onIsEnabledChange);

      onIsEnabledChange();

      function onValueChangeHeading() {
        const isActive = !isParagraph && command.value === option.model;
        if (isActive) {
          dropdownToggle.children(':first').text(option.title);
        }

        menuItem.toggleClass('active', isActive);
      }

      function onValueChangeParagraph() {
        if (command.value) {
          dropdownToggle.children(':first').text(option.title);
        }
        menuItem.toggleClass('active', command.value);
      }

      function onIsEnabledChange() {
        dropdownToggle.attr('disabled', () => !command.isEnabled);
      }
    });
  }*/
}