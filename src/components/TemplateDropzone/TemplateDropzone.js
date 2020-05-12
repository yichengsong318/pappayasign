import React, { Component } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import TemplateDataVar from 'variables/templatedata'
import './TemplateDropzone.css'

class TemplateDropzone extends Component {
  constructor(props) {
    super(props)
    this.state = { hightlight: false }
    this.fileInputRef = React.createRef()

    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  openFileDialog() {
    if (this.props.disabled) return
    this.fileInputRef.current.click()
  }

  onFilesAdded(evt) {
    if (this.props.disabled) return
    const files = evt.target.files
    var _secretKey = 'some-unique-key'
    var userid = ''
    var email = ''

    var modal = document.querySelectorAll('.modal')
    var closeBtn = document.getElementById('close-btn')

    var simpleCrypto = new SimpleCrypto(_secretKey)

    //console.log(files[0]);

    var reader = new FileReader()
    reader.readAsDataURL(files[0])

    reader.onload = function () {
      TemplateDataVar.TemplateDataURI = files[0]
      TemplateDataVar.TemplateDataPath = reader.result
      TemplateDataVar.TemplateDocName = files[0].name
      //console.log(TemplateDataVar);

      var url = '#/admin/templaterecipients'
      window.location.hash = url
      //$('<a href="'+url+'" target="blank"></a>')[0].click();
    }

    reader.onerror = function () {
      //console.log(reader.error);
      alert('Error Opening File')
    }
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
  }

  onDragOver(evt) {
    evt.preventDefault()

    if (this.props.disabled) return

    this.setState({ hightlight: true })
  }

  onDragLeave() {
    this.setState({ hightlight: false })
  }

  onDrop(event) {
    event.preventDefault()

    if (this.props.disabled) return

    const files = event.dataTransfer.files
    //console.log(files[0]);
    var modal = document.querySelectorAll('.modal')
    var closeBtn = document.getElementById('close-btn')

    var reader = new FileReader()
    reader.readAsDataURL(files[0])

    reader.onload = function () {
      TemplateDataVar.TemplateDataURI = files[0]
      TemplateDataVar.TemplateDataPath = reader.result
      TemplateDataVar.TemplateDocName = files[0].name
      //console.log(TemplateDataVar);
      modal[0].style.display = 'block'

      var url = '#/admin/templaterecipients'
      window.location.hash = url
      //$('<a href="'+url+'" target="blank"></a>')[0].click();
    }

    reader.onerror = function () {
      //console.log(reader.error);
      alert('Error Opening File')
    }
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
    if (this.props.onFilesAdded) {
      const array = this.fileListToArray(files)
      this.props.onFilesAdded(array)
    }
    this.setState({ hightlight: false })
  }

  fileListToArray(list) {
    const array = []
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  render() {
    return (
      <div
        className={`Dropzone ${this.state.hightlight ? 'Highlight' : ''}`}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        onClick={this.openFileDialog}
        style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
      >
        <div className="modal">
          <div className="modal-content">
            <div>
              <p>please wait while we fetch the document for you.</p>
              <div className="lds-dual-ring"></div>
            </div>

            <button id="close-btn" className="close-btn">
              {' '}
              OK
            </button>
          </div>
        </div>
        <input
          ref={this.fileInputRef}
          className="FileInput"
          type="file"
          accept="application/pdf"
          onChange={this.onFilesAdded}
        />
        <img alt="upload" className="Icon" src={require('./note_add.png')} />
        <span id="mainspan" className="txt">
          Drop documents here to get started.
        </span>
      </div>
    )
  }
}

export default TemplateDropzone
