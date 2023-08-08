import {React, useContext, useEffect, useState} from 'react';

import "./editor.css";
import { NotesContext } from '../mainPage';
import Draggable from 'react-draggable';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

let allowPasting = true;

const EditableElement = ({content, contentChangeHandler, deleteContentHandler, blockDeletion}) => {
    let [isBeingEdited, setIsBeingEdited] = useState(false);
    let [currentContent, setCurrentContent] = useState(content);
    let [newContent, setNewContent] = useState(currentContent);
    let [isContentHidden, setIsContentHidden] = useState(false);
    let [isMarkdownEnabled, setIsMarkdownEnabled] = useState(true);
    useEffect(() => {
        contentChangeHandler(currentContent);
        setIsBeingEdited(false);
    }, [currentContent]);
    allowPasting = !isBeingEdited;


    function filterContent(c){
        let filteredContent = c;
        let markerPos = filteredContent.indexOf("<x>");
        if(markerPos !== -1)
            filteredContent = filteredContent.substr(0, markerPos);
        return filteredContent;
    }
    function copyContentToClipboard() {
        let copied = filterContent(currentContent);
         // Copy the text inside the text field
        navigator.clipboard.writeText(copied);
      
        // Alert the copied text
        alert("Copied the text: " + copied);
    }
    function hideContent(){
        setIsContentHidden((content => !content));
    }
    let filteredContent = filterContent(content);

    if (isBeingEdited)
    return <div className = "editableDiv">
        <textarea type = "text" value = {newContent} onChange = {(e) => setNewContent(e.target.value)} />
        <button className = "editableDivButton" onClick = {() => setCurrentContent(newContent)}>✔</button>
        <button className = "editableDivButton" onClick = {() => setIsBeingEdited(false)}><b>X</b></button>
    </div>
    
    else
    return <div className = "editableDiv" style={{resize:isContentHidden?"horizontal":"both", height:isContentHidden?"20px":"auto", backgroundImage:`url(${(content.includes("data:image"))?filteredContent:""})`}}>
                <div className = "noteUpperBar">
                    <span className = "dragHandle">
                        Drag From Here
                    </span>
                    <div className = "minimiseButton">
                        <span className = "noteButton" onClick={copyContentToClipboard}>
                            <img alt='Copy Button' width = {12} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgGDbgP4WAYdBYwEAr8J/eFvyndpD9HygLGCgMiVELMMBoEBEEo0FEEBCdQYePBeSCgbeAYagAAG67rW/2TrMuAAAAAElFTkSuQmCC" />
                        </span>
                        &nbsp;&nbsp;
                        <span className = "noteButton" onClick={() => setIsMarkdownEnabled(v => !v)}>
                            <img alt='Copy Button' width = {12} src="data:image/png;base64,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" />
                        </span>
                        &nbsp;&nbsp;
                        <span className = "minimiseIcon prevent-select noteButton" onClick = {hideContent}>-</span>
                        &nbsp;&nbsp;
                        {
                            blockDeletion?<span></span>:<span className='noteButton' onClick ={deleteContentHandler}>
                            <img alt="delete" width={12} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABPHSURBVHhe7Z1/zCxVecdZ7xUx1VSov6pGWi0Woxj1H1rbGixpAjYV29RESSD6B0rAPzCCmmha079I/JW0aozGWEqTEmMrUgVBtFQiCkRAUUBRfhiCAiooELz3ern9fmbP83bu3nd3Z/bdOefs7veTPO+Zmd13z3POfJ9zzsycmRkdZjpz4MCBXaPRaH9aZf0YJS+WvVb2bNkpshr4guxnsktlt8rn29kIk2UwZikgrLTI8htkX5ftkdUOPuLrG5L7B5XFmB0hMY2wtHyM7HJZm/2y3yarhfAH39rgO73eQeUyZiHaIlJ6viwIAT7erNUNPoa/wfmT5TOmF23xKP2ILGgLbdVo+/6RyXIa04m2YBCSDFalx5hH9CjQBAlo2UGyDU9IqdmGJKBzZJz1oa7WQUSUgbJQpnPaQWIOxa3GBBLM7tFoRAv7Rq3+h+y3Ms76rFtdHZARJLtlb1KZL4qy86EZ4wBpIYFIHwzJDzxTqz+QPU32uGxde9oo20OyP1bZ74864EPjIdYkUR/vkBEctKZ96gjB0SqXNHzoCmWjjJSVMoM10cI9SKLVe/y+Vuk9nspmWZc6QpR8r5b6xG+si9ijjA/L6EV+6l7k/3GAJCSKZgqG0tO0+m8yWuMuV5zb3/uGjOFKqSvV+EJv8GfNWv8ynK46uDDqovnEGFrMtMjyDTKYvAq9HXG6lP85Mf1EcfAl+QTtax/TiLLekH7ioDrZZFwJQmJ4glpMrg+8QqshknnDqzjA/absBP3/Xn5Hy6XrlPERZTlcy1fJ/lQWvk6jXdZX6v9vjDpJ28wmIzE0wxCl75fBvpROIy4YPirjjBf/+0TSGghf8C35CPMuckaZ35/+t9Qw0dSEhLDV4muZlhPmDa9i2PLB9H/VBEcQPuEjjop5Q60o843NDwgte4Sx6UgEzdBD6StQR2JeaxufH9/+jZoIn/ARR0XXMgFDzSrLlZuNrwARdfD6lHL2Zt6xB5/fKrueDaLGU6LhEz7iKz7POqbg8zhzFXXhAEnpRqIWUsehW1MrXpfSecOKEN4l6WCYU6LVBQg+Jd8IikvGW+cGcpS9qQvqhjpqtpjNQzu/aSCU9hleBdUOr4LwDV9xuAMeZk2w0YUX0TrGveT0JrNazBii3CK7brxY5fAqCN/wFZ9h3jAretSok43uQbIUvtUKkV9VFZ6GEZy5ebkM8cxqNBAPs18/qP87T//3JC3XfsWZYRb3pX9Ay+fKogzTiDq4Sf9HzzrruyUg6JvAl3+zgr1uVLEMgndhaVOVyL9jZcGs4VX7sxelf18Z8HnsekPXch6b/r1K5F+jL9lgje7Sfzg5S6sVXTXbnqfkSNlrZFT6HlnpnoT8fyNj3hJGqzTLp/icSX2fSeurBL6/RdZlEmZ8ztwy7Ii0rSTkT499m+x/ZA9KY/cobZDG6On2a9tS/ZxVSb2Rk1vTE7T8O0o4Xfi3MuYpMYmuVuYJZhOpvU6YFPpV2edlF0t3j7KxrcFlsLQKIILlGON5ovwM2Ttlf8BnCSocw/laKh5/GG/3PVmxqjNd+w532Vc17i/8aft0l+xDsk9JgxxvLe3OyB0XXM40zhK1Wv5LLV8oew6fiRBSFMqYZRGNLUTg3ys7TVr8mrSI5rjQxfcWpm/LeRAEBw6k4GCS2xUygoPoxXkcxxwcZtmgqdAXWkNzaO8KtIgm0SYa1baFWfifI+PkxMe0eBbrgl4jItqYnLS193Fp8+y2TputPdlJD6I8m+D4Zy0THEQwTjg4TCnQHhpEi2ehzRQYC3cEC/2jMm5uyVR6klYvY1PzwQ4cMWaJtPV4srT65dDseHN3egtaGcXdd0drlYcbcNaKMeCOjmeMWTKhSa658TCKu0O7fNiVRUQdQfVuGcFBd+bgMLWBJtEmGkWr0LtD6PUPrd7jD7XKFU3ue97RGM+YAQlt7pUdK+3e2bcX6dvyx/d5yBjBQYQ6OEytoE00ilYXejBe5y8r8hR4zZVy5rxwcA59A8yY3IRGT0K7ScOdG/U+Ao8ffbWMtxTRfTlATO2gUbSKZtEuDBIg8d0/T+mqzkcym0doNbTbWfd9AiQObDi9Cz72MKtCaDW02/kgvZPI0/GHkub448ey58viPLMxtRNa/YnshXEcgqb5cBZ9BU5GnDIzZhVBu517D1ikB/DQyqwqvbXrIZIxM3CAGDMDB4gxM3CAGDMDB4gxM3CAGDMDB4gxM3CAGDMDB4gxM3CAmE1i7tyrSRYJkN6ZGFMJPBao13STvgHC96t7o6sxHXl41PPRP50CJE1152Z37u/93/FW9yRmZYgZvBfzR1rmGVmd9NunB4mu6bMpJYNeU4eNKQA9Bvcx7ZP9OxtE58a913gsbjIRF2j19PHWrSAh9VR4UxvxKNy3SbufTL1H52HWQgGSlnmMCu8AeS7rxlTKfbKzpdv/bOu3K71b/IkgOUrJC2QvkZ0g45Vm7kVMDXD4cKnsSun1kUWCY0cow9refmrMtkirC79xYEetPVGpJA70Wc4XocZ0o3mRTlo2xhhjjDHGGGOMMcYYs1lkueqdrpcYs1R8fcOYwuTqQbja3mdqvTHz4Ar54LdbDBogzIFRIfYrPV+rZ8gelC08L8YYwVT1I2WfkrbeExprPhmAoQMkXpr4Ga2+ebzVmKXwr9LWW0JjadvSGXrYEwdRkQ93ddEt2myLGhqC0NSgB+q5jgu+n1Lys9l2ahCaGpTIbCgiur+W0qHzM+tPaCg0tdI9SBzjHJFSY5ZFaGrQ4+hcLfpgZxnMxpJFU7kCJB425yufZqeEhrI8wHDoAOGsA9wku1tGfrHNmL6gHTSEltAUDKqnQQNkNGqeoaVk9Gut/ny8tSqo3LDSvVvbF6wk1EUtvmzHz9FU0tbqHqRPFKCmK+iMX9nxlD+Mg73YnhPyI9+2L1gJX9hX5EtdtH3Bj9y+zKLREtpCY82WgaDwuciZ1ywQABWMPz+WXSe7VhbTYNjOd3IQgUG+98rwBWM5ty8EAGIjX+qCOsEX6gg/sFqCBF+yMGhGExH+WEpLwg5GAF+SnSh7mXw8XvYnWubhd6fJ7pTxnaGFGb5cLztF9tLky/Esp218xneGFia/jxb2yM6SHUudJF+Ok1FXt8hqCZJGSxMjlNVEhWAHk55LtAjmZpWASZPwycaxhNaJ4q1uWstHyW6RQfzPsok6uCJl26D1g3wBvsMXxVD1FmX8gex5KdtpvnxaBqX2YeR7bvKn0daQZOuqxN6Uloj4GMp8Sy3OW9mgyt0ta1ogjGXZ4Vr+pT7+a1n8z7L9jZ7jp7K/YYPyfeI2vsRpTL7Dd4foSShbaOAs5X2P8j1cxqsutvPl7bIfyXL0atsR+yK0NDg5AyQ4qFXKRJTzn/ijHd7MAEUAzVaRBLEXMSi9U5s+Mf5kMCGcr3z2JF/2kX/aHr7sS58x7OF2gSGIsl2sfL6ayr5XtlVmLYcvfMbQpqlDseyGowvZtZMjQKJQh6c0d8WSHz48IIuX/8w6vghxXJLSZYIvUec8WBlmBWB8Ft/lf4eov3jnyyxfYkr5lTJO29OLlNiXEFoaPGByBEgU6o6UDj5unAJl7XP19UkpHYo+vz+0Lw+ltAsPy7INcSYI7YSWBg/QHAESrRKt9yMyoj53yxP0yXdoH2e11pP0+e4i9HlSPyLNPtQR7A/yRUMxEhi6XrIESFQm3WKO/Ex/amo45oGG1nKIRbSXrlyz+qCh6DkG11POHoSuOSLfmEVBQ3Essj49yGg0YvoE0xfAPYnpS2jm2qQlWP0ehPPonM9Pq3el1AFi+hKaaTSUrhGtfoAkoiBZbnIxa01oKEsjmytAgsHHjGbtyaqh3AESzzQyZlGyaih3gMSUBvckpi+hmdBQFnIHyKMpNWZRsmood4Dkzs+sH1k1lFuwcYHHp3lNX0IzoaEs5AqQKNz9MpYppIPEdKWtGTQEWfSTNUBGo9ENSm5jWThATFdCK7clDcFaBUjDgQPNPc5Zu0izVuxKGspG1gBJUwMGn8Nv1hZeu5Z15JG7ByE/P+ndLMoRSUPZyJIZUU/BlNJ7XD3e6mMQ05nQytVoKGlp7Y5BIq+bU+oAMV0JrYR2suk2Z4BEIeMBBJ5uYroSWgntZGtccwbIJO5BTFeKaaVEgMRZLPcgpiuhlexnQEsMsf5bxrKvppsutLWCdiCbbkr0IDykbLAXv5u1Bc30ecDdUigRIL6SbhYlu3ZKBAh59nmSnzGAZrLrNWeGMW7k0ZG/GC8a0xk0g3Zg/Y5B0tX0XUqZrnzNeKvnZZm5hEauQTtJQ2t9kA6l8jWrSxHNlBJqthbArA1FNFMqQHyQbvpSRDOlAoT3ABrThyKaKRUgn0upMV0pohkfg5hVYaOOQYxZCUoFSLxIxz2JmUdopMjLl3IHSBT2dhmTzzgz4SAx00AbaAStoBnIqpdSAfId2T3jRQeImUpoA62gGVjrAAna75kzZh5oZSOGWAGtgHsO05VieikVINxC6dexma6glSK3aGcNkDSjl2ca7dHq5eOt7knMVEIbl6OZpJ2seinRg0SePkg38whthFay67VEgEShY4jlp5uYaYQ2sr7Ztk2JAIlCR97uQcw0QhuhleyNackeJG6fdA9iphHayH6rbVAyQP4rpfHMI2PaoIm4VhZa2YgACfxsLNOVYlopGSAeWpmuFNNKyQDxbbemK8W0UvIY5D7Zz8aLxkwFjaAVWP9jkHQ1PZ6P9d3xVj8fyxxCaOK7aCVpZmMO0qOgRWZompWi6M11JY9BwD2HmUdRjZQOkHilljHTKKqRUgESp+0uTakx0wiNFDnVW7oHifuMjZlGUY14iGVqZyOHWMasBKUDZG9KjZlGUY2UCpA4dfcVGW8O8oxe0wYtoAm0gUagyOneGnqQ/eNFYw4BbWxkDxJ4Rq+ZR1GNlA4Q8vd0EzMNtFFUo6UD5FHZXeNFH4OYLUILaAONFKNIgKQZvbuVMsa8arzV87LMFqGFq9BI0srGTVaMAscQy8cjJggtFJ3JCyUDJCrBPYeZRmijWONZ+hgEjkipj0FMEFoIbRSjhiHWlSmtIVhNHYQWQhsbOcSKQt+SUgeICUILoY2NDJAgZmsWqwRTHaGF4rO93WobM4MaAiTmYnGmwr2IQQNx1qr4PL2SAdIEw2g0ulHJTSwLB4gJDdyUtAHFdFEsQLgyKqKl+E1KjQkaTaCRUlfRoZZjkGIXgky1VKGJWgLEL/Q0k1ShidIBEq3ET1LqYxATGghNFO1JagmQL6bUAWJCA6GJjQ6QIMcLPfntPr8/9I7pU/dD76e+9TJk3cRve4jVIseMXs6p93lT0dD3Qvf5/Zp8oQ5zXJ+oYpZ3LQGSY7rJ78qePV6c2QLGZy9I6TLht6OMR6e0iy/xXf531vcXJcraxRfqkLociqifKl6wVDpAojKuSymVsuwgYcfS6nHzzbvYIHa3rsFsoW28gyJ6mfjusgUZLeN7U0q+h+yHiW3x3WW3qlG2pqyUnTpotrRIdRWC5bvUJfW07LqBKDeP/NlsUsWTPlX2oAweT+kyid8kPbnJXGh5V9vSZrZ/WAbc7jkE8btnpyxn+XK2DIb25cMpy1m+nCxr1+Wyid98SHZkynOIIFwNovBKny77lQyGqHho79hTGwcm0PanyP6FL4mhBAntMp4nO+SAlG3ps2CoeoEoK2V/SnLhILT9VFm7Docgfhct/F7Kt2iAFM2cwjONQByl1TtkjG2HGmcDQ5Town8k4/3bnG8nz1fJ6F3wpf29oYihJGW9V/YF2ffYIF4qO0X2HFn7e0MSZf6l7DLZNTLyfL7s72R/JIMh6yb2/a9kL5Q2fhEa4cMSDF3pM2kFyDO0erfsyWyWDekXv49N28mcoTlkHD4gs/KryRcCg/0y9L7h9x+THS1tPFA6QIZuJbvCAVm0nkNXBjuAcrPDEQQHm3HqkrxzChLIbztf2FbCF+pgO1+osyGDA2Lfo4UqDtKLBkjqPXjmETsg95R3yo4gODuDsTy0AKaxnS+l9g11UMqX2PdMded4pNjzsIKiAZKICvDLdExQzW3YNQRIULwyTDVUo4WaAoSu3BioRgs1BcjnU1rqOMCUJ/Z9aKE4NQXIfSk1phot1HSQzulEqCloTV5i34cWih+LFB/OtC8EafmHSo6RxXl3sznEPr9dengRG9raKEVxEVIBIvz4dkqrOYthshH7vNEAmigdHFBLKx092WdT6gP1zeVzKa1CA1U4EV2pYLIir916mszDrM0h9vX3pIPj2BCaYLkkVQgwBQc3KzGL86PjrR5mbRAECDS9R9JCFfu/mqFMu8XQ8s1KmPLN2QxfQFxvYh/frP3/Mja0tVCaaoYwVAgtR1r9h5Sy7p5kvYlG+h/5gwZqCQ6oaoyviuHONiqIK6lnjrc2LYyDZD3haSpo8H3sc+37ePNxNVR3tkiV1PhEKyK4y+51shijVhXQZmHa+/MrspO0v5nerqSe3gOqE9xEBf297AIZfmLcwGNWG/Zh7E/27WtTcFRx3WOS6gIEqKjUmuyTvVmbzpDtkXEDD5XoYddq0d5n7EP25RnsWxmPGiI4olepiuqGWG0IEiXNs6q0zMPNPiH7Kz5LtMerPttVF9P2DUOqM7VP79A+JVj2a7naxq7qAAlUkQRJU+FafrWS82R/IRvyCX9meXB962rZB7Qfv86G9j6tmZUIEFCFNsNBVWrTFWv9WUp4TM8JbJa9UcYT/0x5ODt1kYye4SrZZdpvzRT2yf1YN4cd9n/32PrL4S1YVwAAAABJRU5ErkJggg=="/>
                            </span>
                        }
                    </div>  
                </div>
                <pre style={{display:isContentHidden?"none":"inherit"}} className = "preContentEditableDiv" onDoubleClick={() => setIsBeingEdited(true)}>
                    {
                        (content.includes("data:image"))?<img alt="Couldn't Load" src = {filteredContent} />:
                            isMarkdownEnabled?<ReactMarkdown>{filteredContent}</ReactMarkdown>:filteredContent
                    }
                </pre>
        </div>
}


const Editor = ({activeNoteID, noteChangeHandler}) => {
    const notes = useContext(NotesContext);
    const activeNote = notes?notes[activeNoteID]:null;

    let [content, setContent] = useState(activeNote?activeNote.content:"");
    let [title, setTitle] = useState(activeNote?activeNote.title:"");

    useEffect(() => {
        if(activeNoteID)
        noteChangeHandler(activeNoteID, title, content);
    }, [content, title]);

    function contentChangeHandler(pos, newContent){
        let newContents = [...content];
        newContents.splice(pos, 1, newContent);
        
        setContent(newContents);
    }

    function pasted(e){
        if (!allowPasting) return;
        const str = e.clipboardData.getData("text");
        if(str !== ""){
            contentChangeHandler(content.length, str);
        }
    }
    function positionChangeHandler(contentPos, event, posData){
        let nc = content[contentPos];

        let markerPos = nc.indexOf("<x>");
        if(markerPos !== -1)
            nc = nc.substr(0, markerPos)

        contentChangeHandler(contentPos, nc+`<x>${posData.x}</x><y>${posData.y}</y>`)
    }
    function deleteContentAtPos(pos){
        let newContents = [...content];
        newContents.splice(pos, 1);
        
        setContent(newContents);
    }
    async function processFilesForContent(files){
        for(let file of files){
            let reader = new FileReader();
            reader.onload = (e) => {
                if(e.target.result.includes("data:image"))
                    contentChangeHandler(content.length, e.target.result);
                else if(e.target.result.includes("data:text"))
                    contentChangeHandler(content.length, atob(e.target.result.substr(e.target.result.indexOf("base64,") + "base64,".length)));
                else
                    console.log(e.target.result);
            }
            reader.readAsDataURL(file);
        }
    }
    function handleDrop(e){
        e.preventDefault();
        if(e.dataTransfer.files.length !== 0){
            processFilesForContent(e.dataTransfer.files);
        }
    }

    function getCoords(data){
        let xMarker = data.indexOf("<x>");
        let yMarker = data.indexOf("<y>");
        if(xMarker === -1 || yMarker === -1)
            return [0, 0];
        let x = parseInt(data.substring(data.indexOf("<x>")+3, data.indexOf("</x>")));
        let y = parseInt(data.substring(data.indexOf("<y>")+3, data.indexOf("</y>")));

        return [x, y];
    }
    if (activeNote !== null && activeNoteID){
        let contentElements = [];
        for(let i = 0; i < content.length;i++){
            let [x, y] = getCoords(content[i]);
            if(x === 0 && y === 0)
                y = 200;
            contentElements.unshift(
                <Draggable key={btoa(content[i])} defaultPosition={{x:x, y:y}} handle = ".dragHandle" key={i} onStop={(e, posData) => positionChangeHandler(i, e, posData)}>
                    <div className = "noteContent">
                        <EditableElement content = {content[i]} deleteContentHandler={() => deleteContentAtPos(i)} contentChangeHandler={(c) => contentChangeHandler(i, c)}></EditableElement>
                    </div>
                </Draggable>
            );
        }

        return <div className = "editor" onPaste={pasted} onDragOver = {e => e.preventDefault()} onDrop = {handleDrop} tabIndex="0">
            <Draggable handle = ".dragHandle" >
                <div className = "noteTitle">
                    <EditableElement key={"Title"} blockDeletion={true} content = {title} contentChangeHandler={setTitle}></EditableElement>
                </div>
            </Draggable>

            {contentElements}
            
            <div className = "contentAdditionBox">
                <div className = "addNewTextButton" onClick={e => contentChangeHandler(content.length, "New Content")}>
                    T
                </div>
                <div id = "addNewImageButton">
                    <img  width={15} height={15} src = "data:image/png;base64,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"></img>   
                    <input className='addNewFilesInput' type='file' onChange={(e) => processFilesForContent(e.target.files)}/>
                </div>
            </div>
        </div>
    }

    else{ 
        return <div className="editor noContent">
                    No active note. 
                    <br/>
                    You can create one by pressing on the + button on the bottom right of the page.
                    <br/>
                    Or
                    <br/>
                    You can select one of your notes from the right hand side. 
            </div>
    }
}

export default Editor;