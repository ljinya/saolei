function renderBoard(numRows, numCols, grid) {
    let boardEl = document.querySelector("#board");  //querySelector()选择接受一个css选择符，返回与该模式匹配的第一个元素。

    for (let i = 0; i < numRows; i++) {
        let trEl = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cellEl = document.createElement("div");
            cellEl.className = "cell";

            grid[i][j].cellEl = cellEl;

            cellEl.addEventListener("click", (e)=> {
                
                
                if (grid[i][j].count === -1) {
                    exploded(grid, i, j, numRows, numCols);
                    alert("游戏失败")
                    return;
                }

                else if (grid[i][j].count === 0 ) {
                    searchClearArea(grid, i, j, numRows, numCols);
                
                } else if (grid[i][j].count > 0) {
                    grid[i][j].clear = true;
                    cellEl.classList.add("clear");
                    grid[i][j].cellEl.innerText = grid[i][j].count;
                }

                checkAllClear(grid);
                
                if (checkAllClear(grid) == true){
                    alert("恭喜你，游戏通过");
                }

            });

    

            let tdEl = document.createElement("td");
            tdEl.append(cellEl);

            trEl.append(tdEl);
        }
        boardEl.append(trEl);
    }
}

const directions = [
    [-1, -1],  [-1, 0],  [-1, 1], // TL, TOP, TOP-RIGHT
    [0, -1],            [0, 1],
    [1, -1],   [1, 0],  [1, 1],
]
//生成随机数
function initialize(numRows, numCols, numMines) {
    let grid = new Array(numRows);
    for (let i = 0; i < numRows; i++) {
        grid[i] = new Array(numCols);
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = {
                clear: false,
                count: 0
            };
        }
    }

    let mines = [];
    for (let k = 0; k < numMines; k++) {
        let cellSn = Math.trunc(Math.random() * numRows * numCols);
        let row = Math.trunc(cellSn / numCols);
        let col = cellSn % numCols;

        console.log(cellSn, row, col);

        grid[row][col].count = -1;
        mines.push([row, col]);
    }

    // 计算有雷的周边为零的周边雷数
    for (let [row, col] of mines) {
        console.log("mine: ", row, col);
        for (let [drow, dcol] of directions) {
            let cellRow = row + drow;
            let cellCol = col + dcol;
            if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
                continue;
            }
            if (grid[cellRow][cellCol].count === 0) {
                console.log("target: ", cellRow, cellCol);

                let count = 0;
                for (let [arow, acol] of directions) {
                    let ambientRow = cellRow + arow;
                    let ambientCol = cellCol + acol;
                    if (ambientRow < 0 || ambientRow >= numRows || ambientCol < 0 || ambientCol >= numCols) {
                        continue;
                    }

                    if (grid[ambientRow][ambientCol].count === -1) {
                        console.log("danger!", ambientRow, ambientCol);
                        count += 1;
                    }
                }

                if (count > 0) {
                    grid[cellRow][cellCol].count = count;
                }
            }
        }

    }



    return grid;
}

function searchClearArea(grid, row, col, numRows, numCols) {
    let gridCell = grid[row][col];
    gridCell.clear = true;
    gridCell.cellEl.classList.add("clear");

    for (let [drow, dcol] of directions) {
        let cellRow = row + drow;
        let cellCol = col + dcol;
        console.log(cellRow, cellCol, numRows, numCols);
        if (cellRow < 0 || cellRow >= numRows || cellCol < 0 || cellCol >= numCols) {
            continue;
        }

        let gridCell = grid[cellRow][cellCol];

        console.log(cellRow, cellCol, gridCell);
        
        if (!gridCell.clear) {
            gridCell.clear = true;
            gridCell.cellEl.classList.add("clear");
            if (gridCell.count === 0) {
                searchClearArea(grid, cellRow, cellCol, numRows, numCols);
            } else if (gridCell.count > 0) {
                gridCell.cellEl.innerText = gridCell.count;
            } 
        }
    }
}

function exploded(grid, row, col, numRows, numCols) {
    grid[row][col].cellEl.classList.add("exploded");

    for (let cellRow = 0; cellRow < numRows; cellRow++) {
        for (let cellCol = 0; cellCol < numCols; cellCol++) {
            let cell =  grid[cellRow][cellCol];
            cell.clear = true;
            cell.cellEl.classList.add('clear');

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }
        }
    }
}

function checkAllClear(grid) {
    for (let row = 0; row < grid.length; row ++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col ++) {
            let cell = gridRow[col];
            if (cell.count !== -1 && !cell.clear) {
                return false;
            }
        }
    }

    for (let row = 0; row < grid.length; row ++) {
        let gridRow = grid[row];
        for (let col = 0; col < gridRow.length; col ++) {
            let cell = gridRow[col];

            if (cell.count === -1) {
                cell.cellEl.classList.add('landmine');
            }

            cell.cellEl.classList.add("success");
        }
    }

    return true;
}

//游戏简单，中级，高级模式  
let count = {
    num:0
};

let  easy= document.querySelector("#easy");
easy.addEventListener("click",()=> {
    if (count.num === 0) {
        let grid = initialize(9,9,10);
        renderBoard(9,9,grid);
        count.num+=1;
    }else{
        document.getElementById("board").innerHTML="";
        let grid = initialize(9,9,10);
        renderBoard(9,9,grid);
    }
});


let  normal= document.querySelector("#normal");
normal.addEventListener("click",()=> {
    if (count.num === 0) {
        let grid = initialize(16,16,40);
        renderBoard(16,16,grid);
        count.num+=1;
    }else{
        document.getElementById("board").innerHTML="";
        let grid = initialize(16,16,40);
        renderBoard(16,16,grid)
    }
});

let  difficult= document.querySelector("#difficult");
difficult.addEventListener("click",()=> {
    if (count.num === 0) {
        let grid = initialize(18,28,99);
        renderBoard(18,28,grid);
        count.num+=1;
    }else{
        document.getElementById("board").innerHTML="";
        let grid = initialize(18,28,99);
        renderBoard(18,28,grid)
    }
});
//游戏初始化
let restart = document.querySelector("#restart")
restart.addEventListener("click",()=>{
    location.reload()
});
