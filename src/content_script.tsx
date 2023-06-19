chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message: any, sender:any, sendResponse:any) {
  if (message.action === "getButtons") {
    const buttons = Array.from(document.querySelectorAll("[role='button'], button, a, input[type='button'], input[type='submit'], span[role='button']"));
    sendResponse({ buttons });
  } else if (message.action === "highlightButtons") {
    const color = message.color;
    const buttons = Array.from(document.querySelectorAll("[role='button'], button, a, input[type='button'], input[type='submit'], span[role='button']")) as HTMLElement[];
    buttons.forEach((button) => {
      button.style.cssText += `border: 5px solid ${color} !important;`;
    });
    sendResponse({ message: "Buttons highlighted" });
  } else if(message.color){
    document.body.style.cssText += `background-color: ${message.color} !important;`;
    sendResponse({ message: "Background changed" });
  } else {
    sendResponse({ message: "Unknown action" });
  }
}

