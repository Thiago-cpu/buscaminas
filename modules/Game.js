import {Cell} from "./Cell.js"
class Game{
    constructor({rows=20, columns=20, mines=36, $timer, $points}){
        this.cellSize = 25;
        this.width = this.cellSize * columns
        this.height = this.cellSize * rows
        this.rows = rows
        this.columns = columns
        this.cells = []
        this.mines = []
        this.cantMines = mines
        this.cnv;
        this.$timer = $timer;
        this.timerInterval;
        this.$points = $points;
    }


    startGame = (cellSelected) =>{
        let time = 1
        this.timerInterval = setInterval(()=>{
            this.$timer.innerText = time++
        }, 1000);
        this.insertMines(cellSelected)
        
    }
    gameOver = () =>{
        clearInterval(this.timerInterval)
        this.cnv.mouseReleased(()=>{})
    }
    restart = () =>{
        this.cells = []
        this.mines = []
        this.cnv.mouseReleased(this.mouseReleased)
        this.generateCells()
    }

    createCanvas(){
        this.cnv = createCanvas(this.width, this.height);
        this.cnv.parent("canvasContainer");
        this.cnv.mouseReleased(this.mouseReleased)
    }

    /**
     * generates all the cells and show them graphically
    */
    generateCells(){
        for(let row = 0; row<this.rows; row++){
            this.cells[row] = []
            for(let column = 0; column<this.columns; column++){
                this.cells[row][column] = new Cell({column, row, height: this.cellSize, width: this.cellSize})
                this.cells[row][column].showBlocked()
            }
        }
    }

    /**
     * generates all the mines
     * @param {Cell} cellSelected - the first cell clicked is required because we don't want the first cell clicked to be a mine
    */

    insertMines(cellSelected){
        for(let mine = 0; mine<this.cantMines; mine++){
            this.mines[mine] = this.generateMine(cellSelected)
        }
        this.generateNumbers()
    }

    /**
     * assign the 💣 value to a random cell 
     * @param {Cell} cellSelected - a cell object
     * @return {[Number]} returns an array with the position of the new Mine
    */
    generateMine = (cellSelected) => {
        let newMine = cellSelected
        while(newMine === cellSelected || newMine.value === "💣"){
            let randomRow = Math.floor(Math.random()*this.rows)
            let randomCol = Math.floor(Math.random()*this.columns)
            newMine = this.cells[randomRow][randomCol]
        }
        newMine.value = "💣"
        return newMine
    }

    /**
     * assign the values of the cells around the mines
     * 
    */
    generateNumbers(){
        for(let mine = 0; mine<this.cantMines; mine ++){
            let minePosition = this.mines[mine].position
            this.getCellsAroundAndDoInEachCell(minePosition, this.countMinesAround)
        }
        // this.displayGrid()
    }

    /**
     * count the mines around the cell delivered as a param and assign them to the value property
     * @param {Cell} cell - a Cell object
     */
    countMinesAround = (cell) =>{
        if(cell.value === "💣") return
        let minesAround = 0
        const aroundMineCounter = (cell) =>{
            if(cell.value === "💣") minesAround++
        }
        if(cell.value === 0 && cell.value != "💣"){
            this.getCellsAroundAndDoInEachCell(cell.position, aroundMineCounter)
            cell.value = minesAround
        }    
    }

    /**
     * get all the cells around and executes a function in each cell around the position
     * @param {[Number]} position - The position of the the cell e.g. position = [row, column].
     * @param {Function} fn - function thats executed in each cell around the position, receive as a param one cell around
     * @return {[Cell]} returns an array with the cells around of the position
     */
    getCellsAroundAndDoInEachCell(position, fn){
        const positionsToMove = [-1,0,1]
        const cellsAround = []
        positionsToMove.forEach(pos =>{
            positionsToMove.forEach(pos2=>{
                if(pos === 0 && pos2 === 0) return;
                if (this.cells[position[0]+pos] && this.cells[position[0]+pos][position[1]+pos2]){
                    const cellAround = this.cells[position[0]+pos][position[1]+pos2]
                    cellsAround.push(cellAround)
                    fn(cellAround)
                }
            })
        })
        return cellsAround
    }

    /**
     * handle the mousereleased event
     */
    mouseReleased = (e) =>{
        const row = Math.floor(mouseY / this.cellSize)
        const column = Math.floor(mouseX / this.cellSize)
        let cellSelected = this.cells[row][column] 
        if(mouseButton === "left" && !cellSelected.isFlagged){
            if(this.mines[0] === undefined) this.startGame(cellSelected)
            if(cellSelected.value === 0) this.displayArroundAllZeros(cellSelected)
            if(cellSelected.value === "💣") this.gameOver()
        }
        cellSelected.click()
    }

    /**
     * get all the cells around and executes a function in each cell around the position
     * @param {[Number]} position - The position of the the cell e.g. position = [row, column].
     * @param {Function} fn - function thats executed in each cell around the position, receive as a param one cell around
     * @return {[Cell]} returns an array with the cells around of the position
     */
    displayArroundAllZeros = (cellSelected) =>{
        const zerosCell = [cellSelected]
        const showValueAround = (cell) =>{
            if(cell.value === 0 && !cell.showed) zerosCell.push(cell)
            cell.showValue()
        }
        for(let cell of zerosCell){
            this.getCellsAroundAndDoInEachCell(cell.position, showValueAround)
        }
    }
    /**
     * displays a table-type log of the grid values ​​in the console
     */
    displayTableGrid = () =>{
        const arr = []
        this.cells.forEach(row =>{
            let arr2 = [];
            row.forEach(cell =>{
                arr2.push(cell.value)
            })
            arr.push(arr2)
        })
    }

    /**
     * display all the grid visually
     */
    displayGrid = () =>{
        this.cells.forEach(row =>{
            row.forEach(cell => {cell.click()})
        })
    }
}

export { Game }