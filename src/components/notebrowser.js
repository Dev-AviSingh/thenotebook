import {React, useContext, useState} from "react";
import "./notebrowser.css"
import { NotesContext } from "../mainPage";


const NoteDisplay = ({top, children, activeNoteIDSetter, pushNoteHorizontally, pushNoteVertically, createNewChild, deleteNoteHandler}) => {
    let [showChildren, setShowChildren] = useState(false);

    return <li key = {top.id}>
                <div className = "noteDisplay">
                    <div className = "positionControlButton" onClick={(() => setShowChildren(sc => !sc))}>
                        {(showChildren)?"v":">"}
                    </div>
                    &nbsp;
                    <div onClick={() => activeNoteIDSetter(top.id)} className ="noteDisplayTitle">
                    {top.title}
                    </div>
                    
                    <div className = "positionControls">
                        <div className = "positionControlButton left"   onClick={() => pushNoteHorizontally(top.id, -1)}>↰</div>
                            <div className = "positionControlButton up"   onClick={() => pushNoteVertically(top.id, -1)}>&#9650;</div>
                            <div className = "positionControlButton down" onClick={() => pushNoteVertically (top.id, 1)}>&#9660;</div>

                        <div className = "positionControlButton right"   onClick={() => pushNoteHorizontally(top.id, 1)}>↳</div>
                        <div className="newSiblingNoteButton" onClick = {() => createNewChild(top.id)}>+</div>
                        <img alt="delete" width={12} onClick={() => deleteNoteHandler(top.id)} src="data:image/png;base64,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"/>
                    </div>
                </div>
                
                <ul style={{display:(showChildren)?"block":"none"}}>
                {children}
                </ul>

            </li>
}

const getRecursiveList = (top, notes, activeNoteIDSetter, pushNoteVertically, pushNoteHorizontally, createNewChild, deleteNoteHandler) => {
    let internalList = [];
    if(top["childrenIDs"]){
        internalList = Array.from(top["childrenIDs"], (id) => getRecursiveList(notes[id], notes, activeNoteIDSetter, pushNoteVertically, pushNoteHorizontally, createNewChild, deleteNoteHandler));
    }else{
        console.log(top)
    }

    return <NoteDisplay key = {top.id} top = {top} 
                activeNoteIDSetter ={activeNoteIDSetter} 
                pushNoteHorizontally = {pushNoteHorizontally} 
                pushNoteVertically = {pushNoteVertically} 
                createNewChild = {createNewChild}
                deleteNoteHandler={deleteNoteHandler}>
                    {internalList}
        </NoteDisplay>
 
}


const NoteBrowser = ({activeNoteIDSetter, pushNoteVertically, pushNoteHorizontally, createNewChild ,deleteNoteHandler}) =>{
    const notes = useContext(NotesContext);
    let roots = [];

    if(!notes){
        return <div className = "noteBrowser">

        </div>
    }

    for(let k of Object.keys(notes)){
        if(notes[k].parentID === null){
            roots.push(k)
        }
    }
    let lists = [];
    for(let root of roots){
        let list = getRecursiveList(notes[root], notes, activeNoteIDSetter, pushNoteVertically, pushNoteHorizontally, createNewChild, deleteNoteHandler);
        lists.push(list);
    }

    return <div className = "noteBrowser">
        <ul className = "rootNoteList">

            {lists}

        </ul>
    </div>
}

export default NoteBrowser;