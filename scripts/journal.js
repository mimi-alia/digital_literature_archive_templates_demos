
/********************************************** **********************************************/
//                                            WORKFLOW    
/********************************************** **********************************************/



// 1. asynch iife function fetches json data and passes the hjson to addEntries

// 2. addEntries takes that JSON and breaks it down to each object, passing each individual 
// object and that object's index to createSection

//makeMinMaxButtons makes buttons to minimize and open sections (or moreso all children besides the div holding the button and div)

// minMaxElement is the functionaility that opens and closes sections(again, all children of the section that are not the div containing the date and button elements)

// 3. createSection creates a section element and adds a data-id and id of the index, then 
// passes the JSON entry to createElement to create elements from each entry in the object. 
//It then adds each individual element as children to the secion element, and passes that section element with children to the DOM

//4. createElement takes a single object inside of the JSON and creates elements based on the entry's key name (paragraph, list, h2, etc). It returns an array of the newly created elements

//5. addSectionToDOM adds section elements with their children to the DOM



/********************************************** **********************************************/
//                                            END    
/********************************************** **********************************************/

// import entries from entries.json;

const elements = ["date", "title", "entry", "reads", "watches", "listens", "showerthoughts", "other"];

const diary = document.querySelector("#diary");


function minMaxElement(button, el){
    const buttonOptions = [">[max]", "-[min]"];
    
    let currentChoice = buttonOptions[1]
    button.innerText = currentChoice;

    let children  =[];

    // el.parentNode.childNodes.forEach(child => {
    //     children.push(child)
    // })


    button.addEventListener("click", () => {
        // take all children except the div containg the date and button elements
        el.parentNode.childNodes.forEach(child => {
            if (child.nodeName.toLowerCase() != "div"){
                    children.push(child)
                }
        })
        console.log(children)

        //minimize the siblings within this div's parent node ?? or all but first child
        if (currentChoice === buttonOptions[1]){

            currentChoice = buttonOptions[0];
            button.innerText = currentChoice;

            for (let child in children) {
                // el.parentNode.removeChild(`${children[child].nodeName.toLowerCase()}`)
                el.parentNode.removeChild(children[child])
            }


        } else {
            
            currentChoice = buttonOptions[1];
            button.innerText = currentChoice;

            for (let child in children) {
                el.parentNode.appendChild(children[child])
            }
        }
        
        
    })
}


function makeMinMaxButtons(el, indexValue){
    const button = document.createElement("button");

    minMaxElement(button, el);

    const span = el.firstChild;
    
    button.setAttribute("id", `${span.nodeName}-button-${indexValue}`.toLowerCase());
    button.setAttribute("data-id", indexValue);

    el.insertBefore(button, span); 

    
}


function createElements(entry){
    const dateELements = ["date"];
    const titleElements = ["title"];
    const parElements = ["entry"]
    const listElements = ["reads", "watches", "listens", "showerthoughts", "other"]

    let entryElements = [];
    
    //for each key and value in the entry object
    Object.entries(entry).forEach((k) => {

        //if the elements categories include the key of each entry. create the respective element
        if (dateELements.includes(k[0])){ //change to date later
            let div = document.createElement("div");
            let span = document.createElement("span");
            span.innerHTML = k[1]; //add the value to the element
            const className = dateELements[dateELements.indexOf(k[0])];
            span.setAttribute("class", className);
            div.appendChild(span)
            entryElements.push(div);

        } else if (titleElements.includes(k[0])){
            let title = document.createElement("h2");
            title.innerHTML = k[1];
            const className = titleElements[titleElements.indexOf(k[0])];
            title.setAttribute("class", className);
            entryElements.push(title);
            
        } else if (parElements.includes(k[0])){
            let par = document.createElement("p");
            par.innerHTML = k[1];
            const className = parElements[parElements.indexOf(k[0])];
            par.setAttribute("class", className);
            entryElements.push(par);

        } else if (listElements.includes(k[0])){

            let list = document.createElement("ul");
                const className = listElements[listElements.indexOf(k[0])];
                list.setAttribute("class", className);

            if (typeof k[1] == "object"){

                //iterate over each item in the lsit
                list.innerHTML = k[0] + ":"
                const dataID = listElements[listElements.indexOf(k[0])];
                list.setAttribute("data-id", dataID)
                entryElements.push(list)

                let listItems = k[1];
                listItems.forEach((item) =>{
                    let listItem = document.createElement("li");
                    listItem.innerText = item;
                    list.appendChild(listItem);
                })
            } else {
                list.innerHTML = "" + k[0] + " : " + k[1];
            }

            entryElements.push(list)
        }
    })

    return entryElements;

}

function addSectionToDom(section){
    diary.appendChild(section);

}


function createSection(index, entry){
    const entrySection = document.createElement("section")
    entrySection.setAttribute("id", `section-${index}`)
    entrySection.setAttribute("data-id", index);

    const entryElements = createElements(entry);

    entryElements.forEach(el => {
        if(el.firstChild.className === "date"){
            makeMinMaxButtons(el, index);
        }
        entrySection.appendChild(el);
    })
    addSectionToDom(entrySection);
}


function addEntries(entries){
    entries.forEach(entry => {
        createSection(entries.indexOf(entry), entry);
    })
}



//Grab data from entries.json and send it to the addEntries functions
(async () => {
  const requestURL =
    "../assets/journal.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const entries = await response.json();

  addEntries(entries.entries);
    

})() 


