import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';

export default class AddNote extends React.Component {
  static defaultProps = {
    history: {
      goBack: () => {}
    },
    match: {
      params: {}
    }
  }
  
  static contextType = ApiContext;
  
  handleSubmit = (e) => {
    e.preventDefault();
    const { name, modified, folderId, content } = e.target
    const newNote = {
      name: name.value,
      folderId: folderId.value,
      modified: "2018-03-01T00:00:00.000Z",
      content: content.value
    }
    fetch(`${config.API_ENDPOINT}/notes`)
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.props.history.push("/");
  }
  getFolders = () => {
    const { folders } = this.context;
    return folders.map(folder => {
      return (
        <option value={folder.id}>{folder.name}</option>
      )
    })
  }

  handleChange = (e) => {
    console.log(e.target.value);
  }

  render() {
    console.log(this.getFolders());
    return (
      <form className="add-note" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="name">Note Name: </label><br/>
        <input type="text" name="name" id="note-name"/><br/>
        <label htmlFor="folderId">Select Folder: </label><br/>
        <textarea name="content"></textarea><br/>
        <select name="folderId" id="folderId" onChange={e => this.handleChange(e)}>
          {this.getFolders()}
        </select><br/>
        <button type="submit">Submit Note</button>
        <button type="button" onClick={e => this.handleCancel(e)}>Cancel</button>
      </form>
    );
  }
}