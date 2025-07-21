"use client";

import React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // استایل پیش‌فرض

interface CustomEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({ value, onChange }) => {
  return (
    <SunEditor
      setContents={value} // مقدار اولیه
      onChange={onChange} // هنگام تغییر مقدار
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["bold", "italic", "underline", "strike"],
          ["fontSize", "fontColor", "hiliteColor"],
          ["align", "list", "table"],
          ["link", "image", "video"],
          ["fullScreen", "showBlocks", "codeView"],
        ],
        height: "300px",
      }}
    />
  );
};

export default CustomEditor;
