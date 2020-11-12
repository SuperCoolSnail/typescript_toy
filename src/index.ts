
// normally I'm really against classes doing side effects like this like changing 
// canvas state, adding event listeners, etc. since even if we expose some public 
// api from this class, it'll change some state that the user might not expect. 
// if this happens, the consumer of this api might just want to do one thing, 
// but suddenly this thing starts drawing on the canvas. then the consumer of 
// this api has to read the source of this class to understand what's going on.
// implementation details are leaking out of the class which is VERY undesirable 
// behaviour.
// one of the main reason behind structuring your code to be OOP is the concept 
// of encapsulation which in this case would go out the window.

class DrawingApp {

    private canvas : HTMLCanvasElement;
    private context : CanvasRenderingContext2D;

    private x : number;
    private y : number;
    private previousX : number;
    private previousY : number;
    private isMouseDown : boolean;

    constructor( canvas:HTMLCanvasElement ) {
        const context = canvas.getContext("2d");
        // canvas.addEventListener("mousedown", () => {
        //     this.isMouseDown = true;
        // })
        // canvas.addEventListener("mouseup", () => {
        //     this.isMouseDown = false;
        // })
        canvas.addEventListener("mousemove", (e) => {

            // check for mouse down or up button

            // there's a reason for doing it like this instead of adding an 
            // event listener for "mousedown" 

            // imagine the following scenario:
            // 1. you click down on the canvas
            // 2. you drag your mouse outside of the canvas
            // 3. you release the mouse button outside of the canvas
            // 4. you move the mouse back into the canvas area
            // will it keep drawing?
            // if we did this by adding event listeners to mousedown and mouseup, yes
            // but with this method, no

            if (e.buttons >= 1) {
                this.isMouseDown = true;
            };
            if (e.buttons === 0) {
                this.isMouseDown = false;
            };

            this.previousX = this.x;
            this.previousY = this.y;
            this.x = e.clientX;
            this.y = e.clientY;

            this.checkAndDraw();
        })

        this.canvas = canvas;
        this.context = context;
        this.x = 0;
        this.previousX = 0;
        this.previousY = 0;
        this.context.strokeStyle = "#000000";
        this.isMouseDown = false;
    }

    // private putPoint(x:number, y:number) {
    //     this.context.fillStyle = "#000000";
    //     this.context.fillRect (x, y, 1, 1);
    // }

    private checkAndDraw() {
        if (this.isMouseDown == true) {
            // console.log(this.previousX, this.previousY);
            this.context.beginPath();
            this.context.moveTo(this.previousX, this.previousY);
            this.context.lineTo(this.x, this.y);
            this.context.stroke();
        };
    }

    public clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

const main = () => {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    let d = new DrawingApp(canvas);

    const btn = document.getElementById("clear")
    btn.style.backgroundColor = "#92ccff";
    btn.style.padding = "10px";
    btn.style.width = "60px";
    btn.addEventListener("mouseup", () => {
        d.clear();
    });
}

window.onload = main;
