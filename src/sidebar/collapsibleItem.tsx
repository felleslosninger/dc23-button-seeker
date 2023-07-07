import React, { useEffect, useState } from "react";
import { CollapsibleItemElementInterface, CollapsibleItemTypeInterface, ElementObject } from "./interfaces";
import { ToggleButton, CollapsibleArrowButton } from "./buttons";
import { MessageSender } from "../messageObjects/messageSender";
import { ElementAttributes } from "./elementAttributes";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const messageSender = new MessageSender();

export const CollapsibleItemType: React.FC<CollapsibleItemTypeInterface> = ({ type }) => {
  const [currentHighlighted, setCurrentHighlighted] = useState<ElementObject | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAllHighlighted, setIsAllHighlighted] = useState(false);

  const toggleCheck = () => {
    setIsAllHighlighted(!isAllHighlighted);
    console.log("Setter allhighlighted til " + isAllHighlighted);
    console.log("allhightlighted: " + isAllHighlighted);
    setCurrentHighlighted(null);
    highlightAll();
  };
  
  const highlightAll = () => {
    messageSender.highlightAllWithType(type, isAllHighlighted);
  };
  return (
    <div className='collapsible-item'>
      <div className='collapsible-item-parent'>
        <div className={`item-header ${isExpanded ? 'pressed' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
          <CollapsibleArrowButton isExpanded={isExpanded} />
          <div className="buttons-text">
            {type.name}
          </div>
          <ToggleButton isChecked={isAllHighlighted} onToggle={toggleCheck} text="Highlight All" />
          <div className="total-buttons">
            <p>{type.nodes.length}</p>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="collapsible-item-children">
          {type.nodes.map((item, index) => (
            <CollapsibleItemElement
              type={type}
              key={index}
              thisElement={item}
              highlightedElement={currentHighlighted}
              setHighlightedElement={setCurrentHighlighted}
              isAllHighlighted={isAllHighlighted}

              setIsAllHighlighted={setIsAllHighlighted}>
              <ElementAttributes
                attributes={item.attributes}
                title={item.title}
                htmlString={item.htmlString}
                selector={item.selector} />
              <SyntaxHighlighter language="html" style={vs}>
                {item.htmlString}
              </SyntaxHighlighter>
            </CollapsibleItemElement>
          ))}
        </div>
      )}
    </div>
  );
};

export const CollapsibleItemElement: React.FC<CollapsibleItemElementInterface> = ({
  type,
  thisElement,
  children,
  highlightedElement,
  isAllHighlighted,
  setHighlightedElement,
  setIsAllHighlighted,
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");

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
      messageSender.unhighlightAllAndHighlightSingleMessage(thisElement, type);
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
    <div className="collapsible-item-child">
      <div className="collapsible-item">
        <div className={`item-header ${isExpanded ? 'pressed' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex-item">
            <CollapsibleArrowButton isExpanded={isExpanded} />
            <div className="buttons-text">
              {thisElement.title}
            </div>
          </div>
          <ToggleButton isChecked={isHighlighted || isAllHighlighted} onToggle={toggleCheck} text="Jump to" />
        </div>
        <div className="content-data">
          {isExpanded && children}
          <div className="comment-box">
            <textarea
              className="textarea"
              name="comment"
              form="usrform"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            >
              Enter text here...
            </textarea>
          </div>
          <button onClick={() => console.log(textareaValue)}>Store Text</button>
        </div>
      </div>
    </div>
  );
};
