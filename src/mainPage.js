import "./index.css"
import {v4 as uuidv4} from 'uuid';
import Editor from "./components/editor";
import RecentNotes from "./components/recentnotes";
import NoteBrowser from "./components/notebrowser";
import { useState, createContext, useEffect} from "react";

let noteFormat = {
    "id":"null",
    "title": "Title",
    "content": "Content",
    "parentID": null,
    "childrenIDs": [],
    "lastedit":0,
    "creation":0,
    "deletion":0
}
/*
let contentStructure = [text, imgbase64, text, text .....]
*/
const newNote = (id, title, content, parentID, childrenIDs) => {
    let n = {...noteFormat};
    n["id"] = id;
    n["title"] = title;
    n["content"] = content;
    n["parentID"] = parentID;
    n["childrenIDs"] = childrenIDs;
    return n;
}

const TitleBar = () => {
    return <div className = "titleBar">
        <span style = {{fontWeight: "bold"}}>THE</span> Notebook
    </div>
}


export const NotesContext = createContext();
const MainPage = () => {
    // notes will be a hashmap of note id --> noteobject.
    let n = JSON.parse(localStorage.getItem("notes"));

    let [notes, setNotes] = useState(n);
    let [activeNoteID, setActiveNoteID] = useState();
    let [recentNoteIDs, setRecentNoteIDs] = useState([]);

    useEffect(() => {
        if (recentNoteIDs && activeNoteID)
        setRecentNoteIDs([activeNoteID, ...recentNoteIDs.filter((el) => el !== activeNoteID)]);
        else
        setRecentNoteIDs([activeNoteID,]); 
    }, [activeNoteID]);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes])

    function changeActiveNote(id){
        setActiveNoteID(id);
    }

    function noteChangeHandler(id, title, content, newParentID = null, newChildren = []){
        let newNotes  = {...notes};

        try{
            newNotes[id]["title"] = title;
            newNotes[id]["content"] = content;
            newNotes[id]["lastedit"] = Date.now();
            if(newParentID)
                newNotes[id]["parentID"] = newParentID;
            if(newChildren.length !== 0)
                newNotes[id]["childrenIDs"] = [...newNotes[id]["childrenIDs"], ...newChildren];   
        }catch(err){
            console.error(err);
            console.debug(newNotes);
            console.debug(id);
        }
        setNotes(newNotes);
    }

    function pushNoteVertically(id, dir){
        let newNotes = {...notes};
        // Is a root
        if(newNotes[id].parentID === null)
            return;
        
        let parentID = newNotes[id].parentID;
        let pos = newNotes[parentID].childrenIDs.indexOf(id);

        if(pos+dir >= newNotes[parentID].childrenIDs.length || pos+dir < 0)
            return;
        newNotes[parentID].childrenIDs.splice(pos, 1)
        newNotes[parentID].childrenIDs.splice(pos+dir, 0, id)
        setNotes(newNotes);

    }
    function pushNoteHorizontally(id, dir){
        let newNotes = {...notes};
        if(newNotes[id].parentID === null)
            return;
        
        let parentID = newNotes[id].parentID;
        let pos = newNotes[parentID].childrenIDs.indexOf(id);
        let grandParent = newNotes[parentID].parentID;

        if(dir === -1){
            if(grandParent === null) return;
            newNotes[parentID].childrenIDs.splice(pos, 1);
            newNotes[grandParent].childrenIDs.splice(pos+dir, 0, id);
            newNotes[id].parentID = grandParent;

        }else{
            // If the only child or the last child, then can't become a sub child of next.
            if(newNotes[parentID].childrenIDs.length < 2 || pos === newNotes[parentID].childrenIDs.length-1)
                return;
            let newParent = newNotes[parentID].childrenIDs[pos+1];
            newNotes[parentID].childrenIDs.splice(pos, 1);
            newNotes[newParent].childrenIDs.unshift(id);
            newNotes[id].parentID = newParent;
        }
        setNotes(newNotes);

    }

    function createNewChild(parentID){
        let note = newNote(uuidv4(), "Enter title here", ["Content", ], parentID, []);
        let newNotes = {...notes};
        newNotes[note.id] = note;
        if(parentID !== null)
            newNotes[parentID].childrenIDs.push(note.id);
        setNotes(newNotes);
    }
    function deleteNoteHandler(noteID){
        let newNotes = {...notes};
        let parentID = newNotes[noteID].parentID;
        
        if(parentID !== null){
            let pos = newNotes[parentID].childrenIDs.indexOf(noteID);
            newNotes[parentID].childrenIDs.splice(pos, 1);
        }
        // Gotta do a recursive call to delete all children
        for(let c of newNotes[noteID].childrenIDs){
            delete newNotes[c];
        }
        delete newNotes[noteID];
        setNotes(newNotes);
    }

    function createNewRoot(){
        createNewChild(null)
    }
    return <div className="mainPage ">
        <div className="addNewNoteButton prevent-select" onClick = {createNewRoot}>
            +
        </div>
        <TitleBar />
            <NotesContext.Provider value = {notes}>
                <div className = "editorSpace">
                    <Editor key = {activeNoteID} activeNoteID = {activeNoteID} noteChangeHandler={ noteChangeHandler}/>
                </div>
                <div className = "sideBar">
                        <RecentNotes recentNoteIDs = {recentNoteIDs}  activeNoteIDSetter = {setActiveNoteID}/>
                        <NoteBrowser createNewChild = {createNewChild} deleteNoteHandler = {deleteNoteHandler} pushNoteVertically = {pushNoteVertically} pushNoteHorizontally = {pushNoteHorizontally} activeNoteIDSetter = {changeActiveNote} noteChangeHandler = {noteChangeHandler}/>
                </div>
            </NotesContext.Provider>

    </div>
}

export default MainPage;