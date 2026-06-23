import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface EditorProps {
  value: string;
  onChange: (html: string, delta: unknown) => void;
  placeholder?: string;
  paperColor?: string;
}

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
];

const LetterEditor: React.FC<EditorProps> = ({ value, onChange, placeholder, paperColor = '#ffffff' }) => {
  return (
    <div className="letter-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(content, _delta, _source, editor) => {
          onChange(content, editor.getContents());
        }}
        modules={{ toolbar: toolbarOptions }}
        placeholder={placeholder}
      />
      <style>{`
        .letter-editor-wrapper .ql-container {
          background-color: ${paperColor};
          min-height: 300px;
          font-size: 15px;
          line-height: 1.7;
          font-family: 'Readex Pro', sans-serif;
        }
        .letter-editor-wrapper .ql-editor {
          min-height: 300px;
          color: #1a1a1a;
        }
        .letter-editor-wrapper .ql-toolbar {
          background-color: #1F242C;
          border-color: rgba(255,255,255,0.1);
          border-radius: 0;
        }
        .letter-editor-wrapper .ql-toolbar .ql-formats button {
          color: #EAEAEA;
        }
        .letter-editor-wrapper .ql-toolbar .ql-formats button:hover {
          color: #32FCC7;
        }
        .letter-editor-wrapper .ql-toolbar .ql-formats .ql-active {
          color: #32FCC7;
        }
        .letter-editor-wrapper .ql-container {
          border-color: rgba(255,255,255,0.1);
          border-radius: 0;
        }
        .letter-editor-wrapper .ql-picker {
          color: #EAEAEA;
        }
        .letter-editor-wrapper .ql-picker-options {
          background-color: #1F242C;
          border-color: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default LetterEditor;
