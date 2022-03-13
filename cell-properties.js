// Storage
let sheetDB =[];

for(let i= 0;i < rows;i++){
    let sheetRow =[];
    for(let j =0;j <cols;j++){
        let cellProp ={
            bold : false,
            italic : false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            BGColor: "#000000",//just for indication purpose
            value:"",
            formula:"",
            children: [],

        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// selector for all properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];
// let addressBar = document.querySelector(".address-bar");
let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";


// Application of two way binding
// attach property Listeners
bold.addEventListener("click", (e)=>{
    let address = addressBar.value;
  let [cell, cellProp] =  activecell(address);

//   Modification

    cellProp.bold =!cellProp.bold;//Data change
    cell.style.fontWeight = cellProp.bold? "bold" : "normal";//Ui change
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;

})

italic.addEventListener("click", (e)=>{
    let address = addressBar.value;
  let [cell, cellProp] =  activecell(address);

//   Modification

    cellProp.italic =!cellProp.italic;//Data change
    cell.style.fontStyle = cellProp.bold? "italic" : "normal";//Ui change
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;

})
underline.addEventListener("click", (e)=>{
    let address = addressBar.value;
  let [cell, cellProp] =  activecell(address);

//   Modification

    cellProp.underline =!cellProp.underline;//Data change
    cell.style.textDecoration = cellProp.underline? "underline" : "none";//Ui change
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;

})

fontSize.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] =  activecell(address);

    cellProp.fontSize = fontSize.value;//Data change
    cell.style.fontSize = cellProp.fontSize+ "px";
    fontSize.value = cellProp.fontSize;



})
fontFamily.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] =  activecell(address);

    cellProp.fontFamily = fontFamily.value;//Data change
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;



})
fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = activecell(address);

    cellProp.fontColor = fontColor.value;//Data change
    cell.style.color= cellProp.fontColor;
    fontColor.value = cellProp.fontColor;

})

BGcolor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = activecell(address);

    cellProp.BGcolor = BGcolor.value;//Data change
    cell.style.backgroundColor= cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;

})

alignment.forEach((alignmentElem)=>{
    alignmentElem.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell, cellProp] = activecell(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;//data change
        cell.style.textAlign = cellProp.alignment;//UI


        switch(alignValue){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
     
    })
})

let allCells = document.querySelectorAll(".cell");
for(let i=0;i< allCells.length;i++){
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
    // work
cell.addEventListener("click", (e)=>{
    let address = addressBar.value;
  let [rid, cid] =  decodeRIDCIDFromAddress(address);
  let cellProp = sheetDB[rid][cid];

    // apply cell properties
    cell.style.fontWeight = cellProp.bold? "bold" : "normal";//Ui change
    cell.style.fontStyle = cellProp.bold? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize+ "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color= cellProp.fontColor;
    cell.style.backgroundColor= cellProp.BGcolor === "#000000"? "transperent": cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;
  
    // Apply  properties ui container
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.BGcolor;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    switch(cellProp.alignment){
        case "left":
            leftAlign.style.backgroundColor = activeColorProp;
            centerAlign.style.backgroundColor = inactiveColorProp;
            rightAlign.style.backgroundColor = inactiveColorProp;
            break;
        case "center":
            leftAlign.style.backgroundColor = inactiveColorProp;
            centerAlign.style.backgroundColor = activeColorProp;
            rightAlign.style.backgroundColor = inactiveColorProp;
            break;
        case "right":
            leftAlign.style.backgroundColor = inactiveColorProp;
            centerAlign.style.backgroundColor = inactiveColorProp;
            rightAlign.style.backgroundColor = activeColorProp;
            break;
    }
    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.value = cellProp.value;

})
}

function activecell(address){   
let [rid, cid] = decodeRIDCIDFromAddress(address);
// Access cell and storage object
let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
let cellProp = sheetDB[rid][cid];
return [cell, cellProp]

}

function decodeRIDCIDFromAddress(address){
    // address -> "A1"
    let rid = Number(address.slice(1))-1;//"1"
    let cid = Number(address.charCodeAt(0)) - 65;//"A"->65
    return [rid,cid];


}
