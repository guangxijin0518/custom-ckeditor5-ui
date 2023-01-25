// Basic classes to create an editor.
import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

// Interfaces to extend the basic Editor API.
import DataApiMixin from '@ckeditor/ckeditor5-core/src/editor/utils/dataapimixin';
import ElementApiMixin from '@ckeditor/ckeditor5-core/src/editor/utils/elementapimixin';

// Helper function for adding interfaces to the Editor class.
import mix from '@ckeditor/ckeditor5-utils/src/mix';

// Helper function that gets the data from an HTML element that the Editor is attached to.
import getDataFromElement from '@ckeditor/ckeditor5-utils/src/dom/getdatafromelement';

import Clipboard from "@ckeditor/ckeditor5-clipboard/src/clipboard";
import Enter from "@ckeditor/ckeditor5-enter/src/enter";
import Typing from "@ckeditor/ckeditor5-typing/src/typing";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import BoldEditing from "@ckeditor/ckeditor5-basic-styles/src/bold/boldediting";
import ItalicEditing from "@ckeditor/ckeditor5-basic-styles/src/italic/italicediting";
import UnderlineEditing from "@ckeditor/ckeditor5-basic-styles/src/underline/underlineediting";
import HeadingEditing from '@ckeditor/ckeditor5-heading/src/headingediting';
import UndoEditing from '@ckeditor/ckeditor5-undo/src/undoediting';
import FontFamilyEditing from '@ckeditor/ckeditor5-font/src/fontfamily/fontfamilyediting';
import FontSizeEditing from '@ckeditor/ckeditor5-font/src/fontsize/fontsizeediting';
import FontColorEditing from '@ckeditor/ckeditor5-font/src/fontcolor/fontcolorediting';
import AlignmentEditing from '@ckeditor/ckeditor5-alignment/src/alignmentediting';
import ListEditing from '@ckeditor/ckeditor5-list/src/listediting';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import PendingActions from '@ckeditor/ckeditor5-core/src/pendingactions';
import IndentEditing from '@ckeditor/ckeditor5-indent/src/indentediting';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';

import BootStrapEditUI from './bootstrapui';

import ImageEditing from '../custom_image/src/image/imageediting';
import ImageStyleEditing from '../custom_image/src/imagestyle/imagestyleediting'
import ImageCaptionEditing from '../custom_image/src/imagecaption/imagecaptionediting';
import ImageZIndexEditing from '../custom_image/src/imagezindex/imagezindexediting';
import ImageSizeEditing from '../custom_image/src/imagesize/imagesizeediting';
import ImagePositionEditing from '../custom_image/src/imageposition/imagepositionediting';

import '../custom_image/theme/image.css';
import '../custom_image/theme/imagecaption.css';
import '../custom_image/theme/imagestyle.css';
import '../custom_image/theme/imagezindex.css';

export default class BootStrapEditor extends Editor {
  constructor(element) {
    super({
      plugins: [
        Clipboard, Enter, Typing, PasteFromOffice, UndoEditing,
        Paragraph, BoldEditing, ItalicEditing, UnderlineEditing, HeadingEditing,
        FontFamilyEditing, FontSizeEditing, FontColorEditing,
        AlignmentEditing, IndentEditing, IndentBlock, ListEditing,
        ImageEditing, ImageStyleEditing, ImageCaptionEditing,
        ImageZIndexEditing, ImageSizeEditing, ImagePositionEditing,
        Widget, PendingActions
      ],
      fontSize: {
        options: [8, 9, 10, 11, 12, 14, 'default', 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
      },
      image: {
        styles: [
          'full', 'side', 'alignLeft', 'alignCenter',
          'alignRight', 'absoluteImage', 'inlineImage'
        ],
        zindexes: ['front', 'back']
      }
    });

    this.sourceElement = element;

    this.data.processor = new HtmlDataProcessor();

    this.model.document.createRoot();

    this.ui = new BootStrapEditUI(this);

    //attachToForm(this);
  }

  destroy() {
    this.updateSourceElement();
    this.ui.destroy();
    return super.destroy();
  }

  static create(element) {
    return new Promise(resolve => {
      const editor = new this(element);
      resolve(
        editor.initPlugins()
          .then(() => editor.ui.init(element))
          .then(() => editor.data.init(getDataFromElement(element)))
          .then(() => editor.fire('ready'))
          .then(() => editor)
      );
    });
  }
}

mix(BootStrapEditor, DataApiMixin);
mix(BootStrapEditor, ElementApiMixin);