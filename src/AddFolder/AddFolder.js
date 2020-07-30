import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config';

export default class AddFolder extends React.Component {
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
    const { name } = e.target;
    const newFolder = {
      name: name.value
    };
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      body: JSON.stringify(newFolder),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error
          });
        }
        return res.json()
      })
      .then(data => {
        this.context.addFolder(data);
        this.props.history.push('/');
      })
      .catch(err => {
        console.log(err);
      })
    
    //this.context.addFolder({id: "folder", name: "Name"});
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.props.history.push("/");
  }
  
  render() {
    console.log(this.context);
    return (
      <form className="add-folder" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="name">Folder Name</label>
        <input type="text" name="name" id="name"/>
        <button type="submit">Submit Folder</button>
        <button type="button" onClick={e => this.handleCancel(e)}>Cancel</button>
      </form>
    );
  }
}