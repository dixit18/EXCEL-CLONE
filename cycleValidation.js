//Storage -> 2D array (Basic needed)
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        // why array -> more than one child relation(dependancy)
        row.push([]);
    }
    graphComponentMatrix.push(row);
}
// True -> cycle, false -> not cyclic
function isGraphCyclic(graphComponentMatrix) {
    // dependancy -> visited ,dfsvisited
    let visited = [];//node visit trace
    let dfsVisited = []; //stack visit trace

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);

    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                //found cycle so return immediatly, no need to expolre more path
                if (response == true) return [i, j];
            }

        }
    }

    return null;
}
// start -> vis(True) dfsvis(True)
// End -> dfsvis(false)
// if vis[i][j] -> true ->already explore path go back no use to explore again
// cycle detection condition -> if (vis[i][j]==true && dfsvis[i][j] ==true)-> cycl
// return -> true/false
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsvisited) {
    visited[srcr][srcc] = true;
    dfsvisited[srcr][srcc] = true;


    // A1 -> [[0,1],[1,0]]

    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsvisited);
            if (response === true) return true;//found cycle so return immediatly, no need to expolre more path
        }
        else if (visited[nbrr][nbrc] === true && dfsvisited[nbrr][nbrc] === true) {
            //found cycle so return immediatly, no need to expolre more path
            return true;

        }
    }
    dfsvisited[srcr][srcc] = false;
    return false;
}