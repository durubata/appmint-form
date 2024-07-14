import React from "react";
import MDEditor from "@uiw/react-md-editor"

export const MarkdownElement = (props: { path, name }) => {
  const prop: any = {}

  const handleUpdate = (emoji: any) => {
  };

  return (
    <div >
      <MDEditor onChange={handleUpdate} textareaProps={{ placeholder: "Please enter Markdown text" }}
        height={600}
        value={'# Mermaid\n'}
      />
    </div>
  );
};
