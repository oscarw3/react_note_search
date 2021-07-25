import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { trackPromise } from 'react-promise-tracker';
import "./Home.css";

export default function Home() {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [allNotes, setAllNotes] = useState([]);
  const [findKeyword, setFindKeyword] = useState([]);
  const [replaceKeyword, setReplaceKeyword] = useState([]);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        await resetNotes();
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return  trackPromise(API.get("notes", "/notes"));
  }

  // reset notes and keywords to all notes, and remove any previously used keywords to filter
  async function resetNotes() {
    setFindKeyword('');
    setReplaceKeyword('');
    const notes = await loadNotes();
    setAllNotes(notes);
    setFilteredNotes(notes);
  }

  function renderNotesList(notes) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info btn-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function searchNotes(event) {
    // https://medium.com/crobyer/search-filter-with-react-js-88986c644ed5
    const currKeyword = event.target.value;
    setFindKeyword(currKeyword);

    if (!currKeyword) {
      setFilteredNotes(allNotes);
      return;
    } 

    const notesWithKeyword = allNotes.filter(({noteId, content, createdAt}) => {
      return content.includes(currKeyword);
    });
    setFilteredNotes(notesWithKeyword);
  }

  function setReplace(event) {
    const currKeyword = event.target.value;
    setReplaceKeyword(currKeyword);
  }

  // replace notes that contain findKeyword with the replaceKeyword
  async function replace() {
    await Promise.all(filteredNotes.map(async (note) => {
      try {
        await API.put("notes", `/notes/${note.noteId}`, {
          body: {
            content: note.content.replace(findKeyword, replaceKeyword),
            attachment: note.attachment,
          }
        });
        // console.log(`updated note ${note.noteId} with findKeyword: ${findKeyword} and replaceKeyword: ${replaceKeyword}`);
      } catch (e) {
        onError(e);
      }
    }));
    await resetNotes();
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <input className="pb-3 mt-4 mb-3 border-bottom" value={findKeyword} type="text" placeholder="Search for notes.." onChange={(e)=>searchNotes(e)}></input>
        <input className="pb-3 mt-4 mb-3 border-bottom" value={replaceKeyword} type="text" placeholder="Replace" onChange={(e)=>setReplace(e)}></input>
        <input type="button" value="Replace" disabled={!findKeyword || !replaceKeyword} onClick={()=>replace()}></input>
        <ListGroup>{!isLoading && renderNotesList(filteredNotes)}</ListGroup>
      </div>
    );
  }
  
  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
