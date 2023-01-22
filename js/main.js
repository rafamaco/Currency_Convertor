/** 
* @name: Currency Convertors
* @class: Software Development Diploma program. 
* @author: Rafael Magalhaes da Conceicao
*/ 

//The api url is, of course, never going to change so we make it a const
//The codes[] and values[] are declared up here and filled later so that the whole document has access to them
//On another note, we're luck JS doesn't require a defined size on array initialization 
const api_url = "https://api.exchangerate-api.com/v4/latest/USD";
let codes = [];
let values = [];


//The setTimemout function delays a specified function for a designated peroid of time, while allowing the rest of
//the javascript to run at the same time - this is an example of an asynchronus technique.
//Here, we eill use it do delay the display of the image
setTimeout(loadImage, 10000);

//now we call the getText fucntion which grabs all the values from the api
getText(api_url);
//And we add event listeners for the convert and reset buttons on the page
document.getElementById("send").addEventListener("click", displayResults);
document.getElementById("clear").addEventListener("click", resetForm);

//The loadImage function creates and appends a image to the index.html file
//It simply appends it to the end of the page
function loadImage() {
    document.getElementById("img").innerHTML = "<img src='img/currencies.jpg' width='100%'>";
}

//The getText function grabs the information from the API, parses and splits it, and then populates selection boxes on the page
async function getText(url) {
    //grab the file from the API
    let file = await fetch(url);
    //Convert the contents of that file into a string
    let contents = await file.text();
    //Search that string for the useful parts, the rates
    let index = contents.search("rates");
    //Slicing the start of the document off so we have only the information we need
    contents = contents.slice(index+8);
    //Now we can cut this up at the commas to get the important information
    let arr = contents.split(",");
    //Once split, we loop through every entry in the array, and split it into a country code and a currency value as a float.
    for(let i = 0; i < arr.length; i++ ) {
        codes[i] = arr[i].substring(1,4);
        values[i] = parseFloat(arr[i].substring(6,));
    }
    //now we create a select element
    let boxOne = document.getElementById("fromRate");
    let boxTwo = document.getElementById("toRate");
    //and cycle through all elements in codes[]
    codes.forEach((element, index) => {
        //create an option for each
        //For some reason, we had to make two option objects here in order to populate the two select boxes, I'm really not sure why
        let codeOption = document.createElement('option');
        let codeOptionTwo = document.createElement('option');
        //populate the option with where it is in the list and it's value
        codeOption.value = index;
        codeOptionTwo.value = index;
        codeOption.textContent = element;
        codeOptionTwo.textContent = element;
        //and finally add it to our select box
        boxOne.appendChild(codeOption);
        boxTwo.appendChild(codeOptionTwo);
    });
} // The advantage of searching the document this way and populating our arrays is that if the API ever gets a new field or removes one,
  // We don't have to worry about finding specific places and changing this code, almost ever. Aside from very substantial changes to the API
  // Layout, this code should run forever. It should also be noted that this code also only works *because* this API has specific formatting
  // Should that formatting ever change, we'd have to go back in here and figure out where to split and read the file again

function displayResults() {
    //Take the input value from the form on the page and parse it into a float
    //To get an accurate value, we don't round it to 2 decimals quite yet
    let text = document.getElementById("amount").value;
    let value = parseFloat(text);
    if(isNaN(value)){     //Determine if the entered value was, in fact, a number
        console.log("value is NaN!")
        document.getElementById("result").value = "Not a valid number";
        document.getElementById("amount").value = null;
    } else if(value<0){   //Determine if the entered value was not negative (a zero-value shouldn't mess up our math)
        console.log("Value is negative!");
        document.getElementById("result").value = "Not a valid number";
        document.getElementById("amount").value = null;
    } else {  //Otherwise we have a good value, so we grab the currency codes used from the boxes, or more specifically the *index* of those codes,
                //As they are the same indexes as the values matching those codes in the values[] array
       let codeTwo = document.getElementById("fromRate").selectedIndex;
       let codeOne = document.getElementById("toRate").selectedIndex; //When swapping this from my code to here, I swapped these values by accident, here they've been swapped around
       //Then we grab the rates of both using those indexes in the values[] array
       let rateOne = values[codeOne];
       let rateTwo = values[codeTwo];
       //We can technically convert between any currency but it's based on the USD value always being one,
       //so we must determine if they are trying to convert from USD first. If not, we must convert our
       //initial value to USD before we continue
       if(codeOne == 0){ // the first position is always USD

       } else {
        //convert back to USD
         value = value / rateOne;                               
       }
       //now do the actual conversion
       value = value*rateTwo;
       //Then round to 2 decimal places
       value = value.toFixed(2);
       //And place it into the sum text line on the page
       document.getElementById("result").value = value;
    }
}


// Enable EventListener to check the inputs
const btn = document.querySelector("#send");
btn.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = document.querySelector("#amount");
  value = amount.value;

  const toRate = document.querySelector("#toRate");
  toCurrency = toRate.value;

  checkInputs()
});

// Checks the amount entered to change class
function checkInputs() {
  let sum = 0;
  let amountValue = amount.value.trim()
  
  if (amountValue <= 0) {
    formError(amount, 'The amount must be a positive number!') // Changes to error class
  }
  else {
    formSuccess(amount) // Changes to success class
    sum = 2;
  }
  if (sum === 2) {
    displayResults()
  }
}

// Changes to error class
function formError(input, message) {
    let formControl = input.parentElement;
    let small = formControl.querySelector('small')
    small.innerText = message
    formControl.className = 'form-control error' 
  }
  
  // Changes to sucess class
  function formSuccess(input) {
    let formControl = input.parentElement;
    formControl.className = 'form-control success' // change to sucess class
  }



//Clears all entered data on the form and resets both option boxes to USD
function resetForm() {
    document.getElementById("fromRate").selectedIndex = 0;
    document.getElementById("toRate").selectedIndex = 0;
    document.getElementById("result").value = "";
    document.getElementById("amount").value = "";
    formControl = amount.parentElement;
    formControl.className = 'form-control clear' // change to clear class
    sum = 0;
}