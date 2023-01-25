import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import InsertImage from './insert-image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import SimpleBox from './simplebox/simplebox';
import Placeholder from './placeholder/placeholder';

import './custom.css';

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic, Image, InsertImage, ImageCaption, SimpleBox, Placeholder ],
        toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList', 'simpleBox', 'insertImage', '|', 'placeholder' ],
        placeholderConfig: {
          types: ['date', 'color', 'first name', 'surname']
        }
    } )
    .then( editor => {
      console.log('Editor was initialized', editor);
      CKEditorInspector.attach( editor );
      window.editor = editor;
    })
    .catch(error => {
        console.error( error.stack );
    });