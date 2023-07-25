// Import the necessary classes and interfaces for the tests
// Note: Please adjust the paths according to your project structure
import { WebsiteScanner } from "../../htmlParser/websiteScanner";
import { ElementSelector, ButtonSelector, ImageSelector, LinkSelector, MenuItems, Headings } from "../../htmlParser/elementSelector";
import { ElementType, ElementObject } from "../../sidebar/interfaces";
//import { divElementObject, headingElementObject, menuItemElementObject, imageElementObject, linkElementObject, buttonElementObject} from "../testData/htmlTestData";

// See end of file for test data

jest.mock('chrome', () => ({
  tabs: {
    query: (queryInfo: any, callback: any) => {
      const fakeTabs = [{ url: "https://example.com" }];
      callback(fakeTabs);
    }
  }
}));

jest.mock('../../htmlParser/webUtils', () => ({
  WebUtils: {
    toType: jest.fn().mockReturnValue({
      name: 'Buttons',
      nodes: [ 
        buttonElementObject,
      ],
      selector: 'ButtonSelector',
    }),
    generateSelector: jest.fn().mockReturnValue('MockSelector'),
    getAttributes: jest.fn().mockReturnValue([{ name: 'mockAttr', value: 'mockValue' }]),
    getTitle: jest.fn().mockReturnValue('MockTitle'),
  },
}));



describe('WebsiteScanner', () => {
  let websiteScanner: WebsiteScanner;
  
  beforeEach(() => {
    websiteScanner = new WebsiteScanner();
    });

  test('scanPage returns an array of ElementType with non-empty nodes', () => {
      const scanResult = websiteScanner.scanPage();
    
      // Check if all ElementType have non-empty nodes
      for (const result of scanResult) {
        expect(result.nodes.length).toBeGreaterThan(0);
      }
    });

    test('scanPage returns an empty array of ElementType when nothing is detected', () => {
      websiteScanner = new WebsiteScanner();
      console.log(websiteScanner.scanPage());
    
      // Define the expected results as an object
      const expectedResult: { [key: string]: ElementType } = {[
        buttonsResult,
        buttonsResult,
        buttonsResult,
        buttonsResult,
        buttonsResult ]
      };
      const scanResult = websiteScanner.scanPage();
      expect(scanResult).toEqual(Object.values(expectedResult));
  });
  

  test('getWebsiteURL calls the callback not to be called when active tab URL is not available', () => {
    const callback = jest.fn();
  
    // Mock chrome.tabs.query to return no active tab
    global.chrome.tabs.query = jest.fn().mockImplementation((_, cb) => cb([]));
  
    websiteScanner.getWebsiteURL(callback);
  
    expect(callback).not.toHaveBeenCalled();
  });
  
  test('getWebsiteURL calls the callback with the website URL when active tab URL is available', () => {
    const url = "https://example.com";
    const callback = jest.fn();
  
    // Mock chrome.tabs.query to return a fake active tab with the URL
    const fakeTabs = [{ url }];
    global.chrome.tabs.query = jest.fn().mockImplementation((_, cb) => cb(fakeTabs));
  
    websiteScanner.getWebsiteURL(callback);
  
    expect(callback).toHaveBeenCalledWith(url);
  });

  test('scanPage returns correct ElementObject instances for each ElementType', () => {
    const scanResult = websiteScanner.scanPage();
  
    // Define the different ElementTypes to test
    const elementTypesToTest = ['Buttons', 'Images', 'Links', 'Headings', 'MenuItems'];
  
    for (const elementType of elementTypesToTest) {
      const elementTypeResult = scanResult.find((result) => result.name === elementType);
      const elementTypeNodes = elementTypeResult?.nodes ?? [];
  
      // Ensure that the returned nodes are not empty for this ElementType
      expect(elementTypeNodes.length).toBeGreaterThan(0);
  
      // Check the structure of each ElementObject instance for this ElementType
      for (const element of elementTypeNodes) {
        expect(element.title).toBeDefined();
        expect(element.htmlString).toBeDefined();
        expect(element.selector).toBeDefined();
        expect(element.result).toBeDefined();
        expect(element.attributes).toBeDefined();
        expect(element.isCommentVisible).toBeDefined();
        console.log(element);
      }
    }
  });

});

const buttonsResult = {
  name: 'Buttons',
  nodes:  [{                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    title: 'Buttons',
    htmlString: '<button>Click me</button>',
    selector: '.button-class',
    attributes: [ { name: 'type', value: 'button' } ],
    isCommentVisible: false,
    result: {
      testID: 'button-test-id',
      name: 'ButtonElement',
      htmlString: '<button>Click me</button>',
      correctText: 'Click me',
      comment: 'This is a button element',
      checked: false,
      url: 'https://example.com/button',
      chromeVersion: '94.0.4606.81',
      chromeExtensionVersion: '1.2.3',
      outcome: 'success'
    }
  }] as ElementObject[],
  selector: "ButtonSelector",
}

const divElementObject = {
  title: "Example Title",
  htmlString: "<div>Example HTML</div>",
  selector: ".example-selector",
  result: {
    name: "Example Name",
    correctText: "Example Correct Text",
    htmlString: "<div>Example Result HTML</div>",
    comment: "",
    checked: false,
    url: "example.com",
    testID: "example-test-id",
    chromeVersion: "",
    chromeExtensionVersion: "",
    outcome: "Example outcome",
  },
  attributes: [],
  isCommentVisible: false
};

const buttonElementObject = {
title: 'Button',
htmlString: '<button>Click me</button>',
selector: '.button-class',
attributes: [{ name: 'type', value: 'button' }],
isCommentVisible: false,
result: {
  testID: 'button-test-id',
  name: 'ButtonElement',
  htmlString: '<button>Click me</button>',
  correctText: 'Click me',
  comment: 'This is a button element',
  checked: false,
  url: 'https://example.com/button',
  chromeVersion: '94.0.4606.81',
  chromeExtensionVersion: '1.2.3',
  outcome: 'success',
},
};


const imageElementObject = {
title: 'Image',
htmlString: '<img src="image.jpg" alt="Mock Image">',
selector: '.image-class',
attributes: [{ name: 'width', value: '200' }, { name: 'height', value: '150' }],
isCommentVisible: false,
result: {
  testID: 'image-test-id',
  name: 'ImageElement',
  htmlString: '<img src="image.jpg" alt="Mock Image">',
  correctText: '',
  comment: 'This is an image element',
  checked: false,
  url: 'https://example.com/image',
  chromeVersion: '94.0.4606.81',
  chromeExtensionVersion: '1.2.3',
  outcome: 'success',
},
};

const linkElementObject = {
title: 'Link',
htmlString: '<a href="https://example.com">Click here</a>',
selector: '.link-class',
attributes: [{ name: 'target', value: '_blank' }],
isCommentVisible: false,
result: {
  testID: 'link-test-id',
  name: 'LinkElement',
  htmlString: '<a href="https://example.com">Click here</a>',
  correctText: 'Click here',
  comment: 'This is a link element',
  checked: false,
  url: 'https://example.com/link',
  chromeVersion: '94.0.4606.81',
  chromeExtensionVersion: '1.2.3',
  outcome: 'success',
},
};

const headingElementObject = {
title: 'Heading',
htmlString: '<h1>Heading 1</h1>',
selector: '.heading-class',
attributes: [{ name: 'role', value: 'heading' }],
isCommentVisible: false,
result: {
  testID: 'heading-test-id',
  name: 'HeadingElement',
  htmlString: '<h1>Heading 1</h1>',
  correctText: 'Heading 1',
  comment: 'This is a heading element',
  checked: false,
  url: 'https://example.com/heading',
  chromeVersion: '94.0.4606.81',
  chromeExtensionVersion: '1.2.3',
  outcome: 'success',
},
};

const menuItemElementObject = {
title: 'MenuItem',
htmlString: '<li>Menu Item 1</li>',
selector: '.menu-item-class',
attributes: [{ name: 'data-id', value: 'menu-1' }],
isCommentVisible: false,
result: {
  testID: 'menu-item-test-id',
  name: 'MenuItemElement',
  htmlString: '<li>Menu Item 1</li>',
  correctText: 'Menu Item 1',
  comment: 'This is a menu item element',
  checked: false,
  url: 'https://example.com/menu-item',
  chromeVersion: '94.0.4606.81',
  chromeExtensionVersion: '1.2.3',
  outcome: 'success',
},
};

const elementObjectList : ElementObject[] = [divElementObject, headingElementObject, menuItemElementObject, imageElementObject, linkElementObject, buttonElementObject];
