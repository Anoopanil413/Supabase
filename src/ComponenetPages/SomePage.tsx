// App.jsx / App.tsx

import { MultiRootEditor, Bold, Essentials, Italic, Paragraph } from 'ckeditor5';
import { useMultiRootEditor } from '@ckeditor/ckeditor5-react';

import 'ckeditor5/ckeditor5.css';

const SomeApp = () => {
    const editorProps = {
        editor: MultiRootEditor,
        data: {
            intro: '<h1>React multi-root editor</h1>',
            content: '<h1>Hello from CKEditor&nbsp;5 multi-root!</h1>'
        },
        config: {
            plugins: [ Essentials, Bold, Italic, Paragraph ],
            toolbar: {
                items: [ 'undo', 'redo', '|', 'bold', 'italic' ]
            },
        }
    };

    const {
        toolbarElement,
        editableElements,

    } = useMultiRootEditor( editorProps );

    return (
        <div className="App">
            <h2>Using CKEditor&nbsp;5 multi-root editor in React</h2>

            { toolbarElement }

            { editableElements }
        </div>
    );
}

export default SomeApp;
