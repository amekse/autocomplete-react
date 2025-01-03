import React from "react";
import "./autocomplete.styles.css";

function Highlighter({searchText, sugObj, handleSuggestSelected}: {searchText:string, sugObj: {uuid:string, suggestion:string}, handleSuggestSelected: (uuid:string) => void}) {
    
    const highlightPieces = (suggestionText:string, searchText:string) => {
        let children = [];
        let textPiece = '';
        let j=0;
        for(let i=0; i<suggestionText.length; i++) {
            if(suggestionText[i] === searchText[j]) {
                if (j === 0) {
                    children.push(textPiece);
                    textPiece = ''
                }
                textPiece += suggestionText[i];
                j++;
                if (j === searchText.length) {
                    children.push(textPiece);
                    textPiece = '';
                }
            } else {
                textPiece += suggestionText[i];

                if(i === suggestionText.length-1) {
                    children.push(textPiece);
                }
            }
        }
        return children;
    }

    const HightlightDecoration = ({suggestionText, searchText}:{suggestionText:string, searchText:string}) => {
        let textPieces = highlightPieces(suggestionText, searchText);

        if (searchText.trim() === "") {
            return <span className="autocomplete-suggestion-highlight-history">{suggestionText}</span>
        } else {
            return (
                <>
                    {
                        textPieces.map(
                            piece =>
                                piece === searchText ? <span className="autocomplete-suggestion-highlight-match">{piece}</span> : piece
                        )
                    }
                </>
            )
        }
    }

    return <span key={sugObj.uuid} id={sugObj.uuid} onClick={_ => handleSuggestSelected(sugObj.uuid)} className="autocomplete-suggestion-item"><HightlightDecoration suggestionText={sugObj.suggestion} searchText={searchText} /></span>
}

export default Highlighter;