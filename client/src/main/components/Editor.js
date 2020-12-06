import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default class Editor extends Component {
  onChangeContent = (event, editor) => {
    const data = editor.getData()
    this.props.onChange(data)
  }

  render() {
    return (
      <CKEditor
        editor={ClassicEditor}
        data={this.props.data}
        config={{
          toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', '|', 'undo', 'redo']
        }}
        onChange={this.onChangeContent}
      />
    )
  }
}
