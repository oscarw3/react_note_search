import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setAllNotes(notes);
        setFilteredNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
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
    let keyword = event.target.value;
    const notesWithKeyword = allNotes.filter(({nodeId, content, createdAt}) => {
      return content.includes(keyword);
    });
    setFilteredNotes(notesWithKeyword);
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <input className="pb-3 mt-4 mb-3 border-bottom" type="text" placeholder="Search for notes.." onChange={(e)=>searchNotes(e)}></input>
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
