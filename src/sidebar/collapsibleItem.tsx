import React, { useContext, useEffect, useState, useRef } from "react";
import { CollapsibleItemElementInterface, CollapsibleItemTypeInterface, ElementObject, JsonDataFormat, ExtendedElementObject } from "./interfaces";
import { ToggleButton, RadioButtonGroup } from "./buttons";
import { MessageSender } from "../messageObjects/messageSender";
import { ElementAttributes } from "./elementAttributes";
import { MyContext } from "./resultItemsContext";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IsCheckedStatus from "./isCheckedStatus";

const messageSender = new MessageSender();


export const CollapsibleItemType: React.FC<CollapsibleItemTypeInterface> = ({ elementType, url }) => {
  const [currentHighlighted, setCurrentHighlighted] = useState<ElementObject | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAllHighlighted, setIsAllHighlighted] = useState(false);
  const [commentBoxValue, setCommentBoxValue] = useState<string[]>(elementType.nodes.map(node => node.result.comment || ""));
  const [typeElements, setTypeElements] = useState<ElementObject[]>(elementType.nodes);
  const context = useContext(MyContext);
  //const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);



  if (context === null) {
    // handle the case where the context is null
    return null;
  }
  const { jsonData, setJsonData } = context;

  // jsonData.forEach(string => {
  //   console.log('jsondata name: ' + string.name)
  // })

  const toggleCheck = () => {
    setIsAllHighlighted(!isAllHighlighted);
    setCurrentHighlighted(null);
    highlightAll();
  };

  const updateJson = (elementObject: ElementObject, index: number, url: string) => {
    let newNodes = typeElements;  // copy the array
    newNodes[index] = elementObject;  // replace the element
    newNodes[index].result.url = url;
    setTypeElements(newNodes);  // update the state
    let jsonData: JsonDataFormat[] = newNodes.map(node => node.result).flat();
    setJsonData(jsonData);
  };

  const storeText = (index: number, newText: string) => {
    elementType.nodes[index].result.comment = newText;
    updateJson(elementType.nodes[index], index, url);
  };

  const handleTextareaChange = (index: number, newText: string) => {
    setCommentBoxValue((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = newText;
      return newValues;
    });

    // Clear the previous timeout, if any
    if (typingTimeoutRef.current !== null) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to execute storeText after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      storeText(index, newText);
      toast.success(`'${newText}' lagret `, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        closeButton: false,
        transition: Slide,
        toastId: "the-toasht",
        icon: false
      })
    }, 3000) as any; // Cast the setTimeout return value to any
  };

  const highlightAll = () => {
    messageSender.highlightAllWithType(elementType, isAllHighlighted);
  };

  const handleOptionChange = (option: string, index: number) => {
    let outcome = "";

    if (option === "Yes") {
      outcome =
        "Knapp er kopla til ein ledetekst i koden. Ledeteksten identifiserer knappen.";
    } else if (option === "No") {
      outcome =
        "Knapp er kopla til ein ledetekst i koden. Ledeteksten identifiserer ikkje knappen.";
    } else if (option === "The element is not a button") {
      outcome = "Testelementet er ikkje ein knapp.";
    }

    elementType.nodes[index].result.correctText = option;
    elementType.nodes[index].result.outcome = outcome;
    updateJson(elementType.nodes[index], index, url);
  };



  const openCommentSection = (currentIndex: number) => {
    elementType.nodes[currentIndex].isCommentVisible = true;
  };



  return (
    <div className='collapsible-item'>
      <div className='collapsible-item-parent'>
        <div className={`item-header row ${isExpanded ? 'pressed' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>

          <div className={"col-4"}>
            <div className="buttons-text">
              <br /> {elementType.name}
            </div>
          </div>

          <div className={"col-4"}>
            <div className="total-buttons">
              <br /> {elementType.nodes.length}
            </div>
          </div>

          <div className={"col-4"}>
            <div className="float-right">
              <ToggleButton isChecked={isAllHighlighted} onToggle={toggleCheck} text="Highlight All" />
            </div>
          </div>

        </div>
        {isExpanded && (
          <div className="collapsible-item-children">
            {elementType.nodes.map((elementObject, index) => {
              return (
                <CollapsibleItemElement
                  elementType={elementType}
                  key={index}
                  thisElement={elementObject}
                  highlightedElement={currentHighlighted}
                  setHighlightedElement={setCurrentHighlighted}
                  isAllHighlighted={isAllHighlighted}
                  setIsAllHighlighted={setIsAllHighlighted}
                >
                  <ElementAttributes
                    attributes={elementObject.attributes}
                    title={elementObject.title}
                    htmlString={elementObject.htmlString}
                    selector={elementObject.selector}
                    result={elementObject.result}
                    isCommentVisible={false} />

                  <RadioButtonGroup onOptionChange={(value) => {
                    handleOptionChange(value, index);
                    openCommentSection(index);
                  }} presetOption={elementType.nodes[index].result.correctText} index={index} />

                  <div>
                    {elementType.nodes[index].isCommentVisible && (
                      <div className="comment-box">
                        <textarea
                          className="textarea"
                          name="comment"
                          form="usrform"
                          value={commentBoxValue[index]}
                          onChange={(e) => handleTextareaChange(index, e.target.value)}
                          onBlur={() => {
                            // Execute storeText when the textarea loses focus
                            storeText(index, commentBoxValue[index]);
                          }}
                        >
                          Enter text here...
                        </textarea>
                      </div>
                    )}

                  </div>
                </CollapsibleItemElement>
              );
            })}
            <ToastContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export const CollapsibleItemElement: React.FC<CollapsibleItemElementInterface> = ({
  elementType,
  thisElement,
  children,
  highlightedElement,
  isAllHighlighted,
  setHighlightedElement,
  setIsAllHighlighted,
}) => {

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);


  useEffect(() => {
    setIsHighlighted((thisElement === highlightedElement) || isAllHighlighted);
  }, [highlightedElement, isAllHighlighted]);


  const toggleCheck = () => {
    //If we press the currently highlighted element, unhighlight it
    if (highlightedElement === thisElement) {
      setHighlightedElement(null);
      messageSender.highlightSingleMessage(thisElement, true);
      //} else if (isAllHighlighted && highlightedElement === null) {
    } else if (isAllHighlighted) {
      setIsAllHighlighted(false);
      messageSender.unhighlightAllAndHighlightSingleMessage(thisElement, elementType);
      //unhighlightAllAndHighligthSingle( );
      setHighlightedElement(thisElement);
    } else if (highlightedElement) {
      //Another element is highlighted, unhighlight it and highlight the new one
      messageSender.highlightAndRemovePreviousMessage(thisElement, highlightedElement);
      setHighlightedElement(thisElement);//Kan kanskje fjerne denne
    } else {
      //No element is highlighted, highlight the new one
      setHighlightedElement(thisElement);
      messageSender.highlightSingleMessage(thisElement, false);
    }
  };

  return (
    <div data-testid="collapsible-type" className=" collapsible-item-child">
      <div className="collapsible-item">
        <div className={`item-header ${isExpanded ? 'pressed' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
          <div className="row">
            <div className="col-4">
              <br /> {thisElement.title}
            </div>
            <div className="col-4">
              <br />
              <IsCheckedStatus text={thisElement.result.correctText}></IsCheckedStatus>
            </div>
            <div className={"col-4"}>
              <div className={"float-right"}>
                <ToggleButton isChecked={isHighlighted || isAllHighlighted} onToggle={toggleCheck} text="Jump to" />
              </div>
            </div>
          </div>

        </div>
        <div className={"row"}>
          <div className={"col-12"}>
            <div className="content-data">
              {isExpanded && children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
