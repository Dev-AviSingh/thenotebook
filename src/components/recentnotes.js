import {React, useContext} from "react";
import "./recentnotes.css"
import { NotesContext } from "../mainPage";


const RecentNotes = ({recentNoteIDs, activeNoteIDSetter}) => {
    let notes = useContext(NotesContext);

    if(notes !== null)
        return <div className = "recentNotesContainer">
            {
                recentNoteIDs?Array.from(
                    recentNoteIDs, (id) => {
                    if(!id) return <span></span>
                    const d = new Date(notes[id].lastedit);
                    
                    return (<div className="recentNote" key = {id} >
                        <span className="recentNoteTitle" onClick={() => activeNoteIDSetter(id)}>{notes[id].title}</span>
                        <span className = "lastEditedDate">{(Date.now() - notes[id].lastedit > 24 * 60 * 60)?d.toDateString():`  ${d.getHours()}:${d.getMinutes()}`}</span>
                    </div>);
                    }
                ):""        
            }

        </div>
    else
    return <div className = "recentNotesContainer">
        RecentNotes
    </div>  
}


export default RecentNotes;