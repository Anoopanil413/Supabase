import React, { useState, useRef, useEffect } from 'react';
import ReactQuill,{Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import EmbedBlot from "parchment"

const Embed = Quill.import("blots/embed");

class MentionBlot extends Embed {
  static blotName = "mention";
  static tagName = "span";

  static create(value: any) {
    let node = super.create();
    node.setAttribute("class", "mention");
    node.setAttribute("data-id", value.id); // Store mention id or value
    node.textContent = `@${value.value}`; // Set the mention text
    node.contentEditable = "false";
    return node;
  }

  static formats(node: any) {
    return node.getAttribute("data-id");
  }

  format(name: any, value: any) {
    if (name === "mention" && value) {
      this.domNode.setAttribute("data-id", value.id);
      this.domNode.textContent = `@${value.value}`;
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(MentionBlot, true);



const TextEditor = () => {
  const [value, setValue] = useState('');
  const [mentionTerm, setMentionTerm] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
const[currentPos,setCurrentPos] = useState(undefined)
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const mentionData = [
    { id: 1, value: 'John Doe' },
    { id: 2, value: 'Jane Smith' },
    { id: 3, value: 'Alice Johnson' },
    { id: 4, value: 'Bob Williams' },
  ];

  useEffect(() => {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();

    const handleTextChange = (delta:any, oldDelta:any, source:any) => {
      if (source !== 'user') return;

      const currentPosition = quill.getSelection()?.index;
      if (currentPosition === undefined) return;
      const textBeforeCursor = quill.getText(0, currentPosition);

      const mentionMatch = textBeforeCursor.match(/[@#](\w*)$/);

      if (mentionMatch) {
        const mentionTerm = mentionMatch[1];
        setMentionTerm(mentionTerm);
        setShowMentions(true);
        console.log("quill",'inserted')


        const mentionCharPosition = currentPosition - mentionTerm.length - 1;
        const mentionCharBounds = quill.getBounds(mentionCharPosition);
        setMentionPosition({
          top: mentionCharBounds.top + mentionCharBounds.height,
          left: mentionCharBounds.left,
        });
        setCurrentPos(currentPosition)
      } else {
        setShowMentions(false);
      }
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, []);

  const filteredMentions = mentionData.filter(
    (item) => item.value.toLowerCase().includes(mentionTerm.toLowerCase())
  );

  const insertMention = (mention:any) => {
      if(!quillRef.current)return
      const quill = quillRef.current.getEditor();
      const currentPosition = quill.getSelection()?.index;
      console.log("insertMention",quill,currentPos)
    if (currentPos === undefined) return;

    const textBeforeCursor = quill.getText(0, currentPos);
    const mentionMatch = textBeforeCursor.match(/[@#](\w*)$/);

    if (mentionMatch) {
      const startIndex = currentPos - mentionMatch[0].length;
      quill.deleteText(startIndex, mentionMatch[0].length);
      quill.insertText(startIndex, `${mentionMatch[0][0]}${mention.value} `, {
        'mention': mention.id,
        'color': '#0366d6',
      });
      quill.setSelection(startIndex + mention.value.length + 2);
    }

    setShowMentions(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
      />
      {showMentions && filteredMentions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: mentionPosition.top,
            left: mentionPosition.left,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          {filteredMentions.map((mention) => (
            <div
              key={mention.id}
              onClick={() => insertMention(mention)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
              }}
              
            >
              {mention.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextEditor;