import React, { Component } from 'react';
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from "../ValidationError/ValidationError"
import './AddNote.css';
import PropTypes from 'prop-types';

export default class AddNote extends Component {
    static contextType = ApiContext;

    state = {
        name: {
            value: "",
            touched: false
        },
        content: {
            value: "",
            touched: false
        },
        folderId: {
            value: "",
            touched: false
        }
    }

    getFolders = (e) => {
        const { folders } = this.context;
        if (!folders || folders.length === 0) {
            return <p>No folders found... Make a folder first</p>
        }
        const folderOptions = folders.map(folder => {
            return <option key={folder.id} value={folder.id}>{folder.name}</option>
        });
        return <select name="folderId" id="folderId" onChange={e => this.updateFolderId(e.target.value)}>
            <option value="" disabled selected>Select a Folder...</option>
            {folderOptions}
        </select>
    }

    updateName(name) {
        this.setState({
            name:{value: name, touched: true}
        });
    }

    updateContent(content) {
        this.setState({
            content:{value: content, touched: true}
        });
    }
    updateFolderId(id) {
        this.setState({
            folderId:{ value: id, touched: true }
        });
    }

    validateName() {
        const name = this.state.name
        if (name.value.length === 0) {
            return "Name is required";
        }
    }
    validateContent() {
        const content = this.state.content
        if (content.value.length === 0) {
            return "Content is required";
        }
    }
    validateFolders() {
        return !this.state.folderId.touched;
    }

    handleSubmit = e => {
        e.preventDefault()
        const { name, content, folderId } = this.state
        const modified = new Date();
        const note = { name: name.value, content: content.value, folderId: folderId.value, modified}
        console.log(note);
        fetch(`${config.API_ENDPOINT}/notes/`, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then((data) => {
                this.context.addNote(data)
                this.props.history.push("/")
            })
            .catch(error => {
                console.error({ error })
            })
    }

    render() {
        const nameError = this.validateName();
        const contentError = this.validateContent();
        this.getFolders();
        return (
            <div className="note-form">
                <h2>Add New Note</h2>
                <form className="newNote" onSubmit={e => this.handleSubmit(e)}>
                    <label htmlFor="note-name">Note Name</label>
                    <input
                        type="text"
                        className="note-name"
                        id="name"
                        name="name"
                        onChange={e => this.updateName(e.target.value)}
                    />
                    {this.state.name.touched && <ValidationError message={nameError} />}
                    <label htmlFor="note-content">Note Content</label>
                    <input
                        type="text"
                        className="note-content"
                        name="content"
                        onChange={e => this.updateContent(e.target.value)}
                    />
                    {this.state.name.touched && <ValidationError message={contentError} />}
                    <label>Folder: </label>
                    {this.getFolders()}
                    <button 
                        type="submit" 
                        value="submit"
                        disabled={
                            this.validateName() ||
                            this.validateContent() ||
                            this.validateFolders()
                        }
                        >Submit</button>
                </form>
            </div>
        )
    }
}