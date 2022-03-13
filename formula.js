
for(let i=0;i< rows;i++){
    for(let j=0;j <cols;j++){
        let cell =  document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e)=>{
            let address = addressBar.value;
            let [activeCell, cellProp] = activecell(address);
            let enteredData = activeCell.innerText;

            if(enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            // if data modifies remove p-c relation, formula empty ,update children with new hardcoded value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
           

        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula){

        // if change in formula, break old p-c relation, evalute new formula add new p-c relation
        let address = addressBar.value;
        let [cell, cellProp] = activecell(address);
        if(inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);
        addChildToGraphComponent(inputFormula, address);
        // check formula is cyclic or not then evalute
        // True -> cycle, false -> not cyclic
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
            // alert("Your formula is cyclic");
           let response = confirm("Your Formula is cyclic. do you want to trace your Path?");
           while(response === true){
            //    keep on tracking color until user is satisfied
          await  isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);//I want to complete full iteration of color tracking so i will attach wait here also
            response = confirm("Your Formula is cyclic. do you want to trace your Path?");


           }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evallutedValue = evaluteFormula(inputFormula);
    
        // to update ui and cellprop in db
        setCellUIAndCellProp(evallutedValue, inputFormula, address);
        addChildToParent(inputFormula);
        console.log(sheetDB);

        updateChildrenCells(address)
    }
})
function removeChildFromGraphComponent(formula, childAddress){
    let [crid, ccid]  = decodeRIDCIDFromAddress(childAddress)
    let encodedFormula = formula.split(" ");
  
    for(let i=0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=98){
           let [prid, pcid] =  decodeRIDCIDFromAddress(encodedFormula[i]);
       
          graphComponentMatrix[prid][pcid].pop();
        }
    }

}


function addChildToGraphComponent(formula, childAddress){
  let [crid, ccid]  = decodeRIDCIDFromAddress(childAddress)
  let encodedFormula = formula.split(" ");

  for(let i=0;i < encodedFormula.length;i++){
      let asciiValue = encodedFormula[i].charCodeAt(0);
      if(asciiValue >=65 && asciiValue <=98){
         let [prid, pcid] =  decodeRIDCIDFromAddress(encodedFormula[i]);
        // B1 =A1 +10
        // rid-> i, cid ->j
        graphComponentMatrix[prid][pcid].push([crid, ccid]);
      }
  }

}

function updateChildrenCells(parentAddress){
    let [parentcell, parentCellProp] = activecell(parentAddress);
    let children = parentCellProp.children;

    for(let i=0;i < children.length;i++){
        let childAddress = children[i];
        let [childCell, childCellProp] = activecell(childAddress);
        let childFormula = childCellProp.formula;

        let evalutedValue = evaluteFormula(childFormula);
        setCellUIAndCellProp(evalutedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [parentcell, parentCellProp] = activecell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);

        }
    }
}

function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i < encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [parentcell, parentCellProp] = activecell(encodedFormula[i]);
           let idx = parentCellProp.children.indexOf(childAddress);
           parentCellProp.children.splice(idx, 1);

        }
    }

}

function evaluteFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i=0;i< encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <=90){
           let [cell, cellProp] = activecell(encodedFormula[i]);
           encodedFormula[i] = cellProp.value;
        }

    }
    let decodedeFormula = encodedFormula.join(" ");
    return eval(decodedeFormula);
}
function setCellUIAndCellProp(evallutedValue, formula, address){
    
    // activecell function is the same as the getCellUiAndcellProp
  let [cell, cellProp] = activecell(address);
   // UI update
    cell.innerText = evallutedValue;
    // DB Update
    cellProp.value = evallutedValue;
    cellProp.formula = formula;
}