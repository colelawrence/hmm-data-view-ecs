import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import { createValueLens } from "./createValueLens";
import { convert, ident } from "./helpers";
import { ValueRetriever, u32, u16 } from "./ValueRetriever";

// initialize the studio so the editing tools will show up on the screen
studio.initialize();

// create a project
const proj = getProject(
  // the ID of the project is "My first project"
  "First project"
);

// create a sheet
const sheet = proj.sheet(
  // Our sheet is identified as "Scene"
  "Scene"
);

// create an object
const obj = sheet.object(
  // The object's key is "Fist object"
  "First object",
  // These are the object's default values (and as we'll later learn, its props types)
  {
    // we pick our first props's name to be "foo". It's default value is 0.
    // Theatre will determine that the type of this prop is a number
    foo: 0,
    // Second prop is a boolean called "bar", and it defaults to true.
    bar: true,
    // Last prop is a string
    baz: "A string",
  }
);

// Calls the callback every time the values change
const unsubscribe = obj.onValuesChange(function callback(newValue) {
  console.group("changes"); // prints a number
  console.log(newValue); // prints a number
  // console.log(newValue.foo) // prints a number
  // console.log(newValue.bar) // prints a boolean
  // console.log(newValue.baz) // prints a string
  console.groupEnd(); // prints a number
});

// stop listening to changes after 5 seconds:
setTimeout(unsubscribe, 5000);

// assuming we have an html element with #box as its ID
const divs = Array.from(
  document.getElementsByClassName("box")
) as HTMLDivElement[];
obj.onValuesChange((newValue) => {
  // obj.foo will now set the horizontal position of the div
  for (let i = 0; i < divs.length; i++) {
    divs[i].style.left = newValue.foo + "px";
  }
});

// shared array buffer
/** IDK */
const MEMORY_SIZE = 1024;
const buffer = new ArrayBuffer(MEMORY_SIZE);

/**
 * The DataView view provides a low-level interface for reading
 * and writing multiple number types in a binary ArrayBuffer,
 * without having to care about the platform's endianness.
 */
const dv = new DataView(buffer);

const rgbLens = createValueLens({
  r: u16,
  g: u16,
  b: u16,
});

rgbLens.write(dv, 0, 12, {
  r: 100,
  g: 200,
  b: 400,
});

console.log(rgbLens.read(dv, 0));
