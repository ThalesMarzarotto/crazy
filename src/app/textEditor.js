import { text } from "./content"
// import * as worker from "./webworker"





// line array =
//     0 -> height
//     y -> y position
//     split = null, but if exists, the margin-left, rigth, will be taken from here 

//     margin-left/paragraph start 
//     margin Rigth 
//     reference to the content: line start, colum start, line end, column end
//     style accumulator


let newLine = false 
let w1;
let w; 
let mouseDown = false 
let startY = 0
let prevMove = 0 
let firstRenderLine = 0 
let tmpPrevMov = 0 

let prevFirstRenderLine= []

let pageWidth= Math.ceil(21*37.7952755906 )
let pageHeight =Math.ceil(29.7*37.7952755906 )

const controlersMap = 
    { 
        b: "bold ", 
        b0: "", 
        i: "italic ", 
        i0: "", 
        f1: "Arial ", 
        f2: "Arial ", 

    }



export default class Editor {
        constructor(window, document, renderer, devicePixelRatio) {
            this.window = window, 
            this.document = document,
            this.renderer = renderer
            this.devicePixelRatio = devicePixelRatio
            this.ctx = this.renderer.getContext("2d")
            this.underline = false 
            this.strikethrough = false 

            this.lines = Array(100000).fill(0)
            
            this.lines[0] =  [
                0, 0, 0, 0, 0, 0,0,0,0, []
            ] 

        }


        resize( height, width){
            this.renderer.height = height * this.devicePixelRatio
            this.renderer.width = (width -15) * this.devicePixelRatio
            this.renderer.style.height = height + "px"
            this.renderer.style.width = (width -15)+ "px"
        }

//8.27 in x 11.69 in
// 21cm 29.7 cm 
        init() {
           this.startY = 0 
           this.moveY = 0 
            this.resize(pageHeight, pageWidth)
            
            this.scrollBarControler = this.document.getElementById("scrollBarControler")
            console.log(this.scrollBarControler);
            
          
            this.window.addEventListener("beforeunload", this.handleUnload)
            this.scrollBarControler.addEventListener("mousedown", this.scrollMouseDown)
            this.document.addEventListener("mousemove", this.handleMouseMove.bind(this))
            this.document.addEventListener("mouseup", this.handleMouseUp)
            //the event listener 
            this.window.addEventListener("resize", ()=>{
                this.lines = [ [
                    0, 0, 0, 0, 0, 0,0,0,0, []
                ] ] 
                // this.resize(this.window.innerHeight, this.window.innerWidth)
                this.render()
            })
         
            this.window.addEventListener("mousedown", ()=>{
          
                this.handleMouseDown()

                
            })
          

        this.diacritics  = [ false,false,false,false] //bold, italic, underline and strikethrough
        this.font =  " 20px Arial"
        // example of filing text inside
        this._font = ""
          
        this.render()


        }
         
  
        render() {

            // let availableHeight = this.height
            // let availableWidth = this.width
            let startX, startY = 0
            this.ctx.textBaseline = 'bottom'; // important!
            this.ctx.fillStyle = "white";
            this.ctx.clearRect(0,0,pageWidth, pageHeight)
            this.ctx.fillRect(0,0,pageWidth, pageHeight)
            this.ctx.font = "20px Cambria"

            this.ctx.lineWidth = 10 
            this.ctx.fillStyle = "black"    
            let x = 10
            let y = 20
            let maxHeight = 0 
               let lineCount = 0 
            let skiprender= false 
            this.lines[lineCount] =             [
                0, y, firstRenderLine, 0, 0, 0,0,0,0, []
            ]

            let boldcache = []

            console.log(firstRenderLine, "render");
            
            let tStr = true // create a 'render' token for this optimization
            let tEnd = false // the strategy uses a tStr or "token start" to begin the count and a tEnd or token end to count for the last of it; 
            let tIStr =0 // tI stands for token index 
            let tIEnd = 0
            let par = false 
            let Token = false
            let bOF=0 

            let k =0 
            let j =0 
            while (true) {
              

                if(text[k] === "\\") {
                    j = k
                    
                    
                    while (true) {
                        let chr = text[j]   //    console.log(chr);                        
                         if(chr.charCodeAt(0) === 32 || chr.charCodeAt(0)=== 10){
                            break        
                         }
 
                         j+=1 
 
                     }
                     
                let ctroller = (text.substring(k, j));
              
                //need to process the data a little bit
                let ctrollers = ctroller.split("\\"
                )
                console.log(ctrollers);
                
                if(ctrollers[ctrollers.length-1]=== "uc1"){
                    bOF = j+2
                    break
                }




                }

              
                k+=1
            
            
            }
              
            console.log(bOF);
            
                


            // so we know the first chr is  going to be a /
            for (let i = bOF; i < text.length; i++) {
                let chr = text[i];
            



               if (chr === "\\"){
                    let j = i 
                  
                    if(Token) {
                        tIEnd = i
                        tEnd = true
                        Token = false
                    } 

                    while (true) {
                       let chr = text[j]
                    //    console.log(chr);
                       
                        if(chr.charCodeAt(0) === 32 || chr.charCodeAt(0)=== 10){
                           break        
                        }

                        j+=1 

                    }
                      let ctroller = (text.substring(i, j));

                    //need to process the data a little bit
                    let ctrollers = ctroller.split("\\"
                    )
                                      
                      this._font = ""
                  
                    
                    if(ctrollers[1] === "pard") {
                        // rendering not messed up 
                        // we are going to alter paragrph metrics 
                    } 
                    if (ctrollers[ctrollers.length-1] === "par") {
                        newLine = true
                    }else {
                      
                        // we are going to alter text metrics // font, color, whatever.....
                    ctrollers.forEach((itm) => {
                        if(itm.length>=2) {
                            if (itm.substring(0,2) === "fs") {
                                let fZ = itm.substring(2, itm.length)
                          
                            this._font = this._font + fZ + "px"
                                
                            }
                            switch(itm) {
                                case "strike":
                                    this.strikethrough =true 
                                break
                                case "ul":
                                    this.underline =true
                                break                                
                                case "strike0":
                                    this.strikethrough =false  
                                break
                                case "ul0":
                                    this.underline =false 
                                break
                                
                            }
                            if (controlersMap[itm]!== undefined) {
                                this._font = this._font + controlersMap[itm]
 
                            }
                          
                            
                            // else if (itm.substring(0,2) === "cf") {
                            //     let cN = itm.substring(2, itm.length)
                            //     console.log(cN);
                                
                            // }
                            // else if (itm.substring(0,1) === "f") {  
                            //      let fF  = itm.substring(1, itm.length )
                            //      console.log(fF);
                                 
                            // }
                        }                        
                    })

                    }
                    

                    this.ctx.font = this._font  
                    this.ctx.font = this._font + this.font
                  
                    //return of sentence || new line
                    
                        
             
                  
                    
                     i = j
                     
                     
                     
                    
                     
                 } else  {
                              
                    if(!Token){
                      Token = true
                      tIStr = i
                      tStr = true
                    //   console.log("it is not a blank token");
                    }
                   
                   

                
                    
                 }
 
                 

                 if(tEnd === false &&  tStr === false && newLine === true)  {
                    if(newLine) {
                        x =10
                        y+= maxHeight+2;
                        newLine = false
                    }
                    

                 }

           
                
                // console.log(chr.charCodeAt(0), chr);
                    // we are going to start the process of rendering some thing
                    if(tStr && tEnd) {

                        // console.log(tIStr, tIEnd);
                        
                        tStr = false
                        tEnd = false
                        let renderText = text.substring(tIStr, tIEnd)
                    
                        
                        // console.log(this.ctx.measureText(renderText),renderText);
                         let metrics = this.ctx.measureText(renderText)

                       
                        // create an algorithm for batching large same formatting 

                        if(Math.ceil(metrics.actualBoundingBoxAscent)>maxHeight) { 
                            maxHeight = Math.ceil(metrics.actualBoundingBoxAscent)
                        }
                       
                          if ((Math.ceil(metrics.width)+x)>=(pageWidth -20)){
                         
                            
                        
                          
            
                            // while (true) {
                            // "A Width binary search"

                           // }
                            let anc =0
                            let lo = 0
                            let hi = renderText.length-1
                            let batch = []
                            let mI =  Math.floor((hi+lo)/2 ) 
                            let tmpStr = renderText.substring(0, mI-1)


                            let lastChr = renderText.substring(mI, mI+1)
                            console.log(lastChr, mI);
                            
                     
                            // // pageWidth??
                            while (true) {
                                // interval analysis
                             
                                mI = Math.floor((hi+lo)/2 ) 
                               
                                
                                tmpStr = renderText.substring(anc, mI)
                                lastChr = renderText.substring(mI,mI+1)
                                   let measure = this.ctx.measureText(tmpStr);
                                let mLsChr = this.ctx.measureText(lastChr);
                                                                                            

                                if( (pageWidth-(measure.width+x) >0) && (pageWidth-(measure.width+x+mLsChr.width) <0 )) // can be the case that its never going to
                                  {
                                   //done ?
                                   console.log(tmpStr,mI);
                                   console.log("done");
                                   
                                   batch.push(tmpStr)
                                   console.log(batch);
                                   
                                   anc = mI +1                                    
                                   lo = mI +1
                                   hi = renderText.length-1
                                   console.log(anc, lo, hi);
                                   
                                    let remainText=  renderText.substring(anc, renderText.length-1)
                                    let remainWidth = this.ctx.measureText(remainText)

                                   if (remainWidth.width<pageWidth) {        
                                    batch.push(remainText)                                 
                                    break

                                    }



                                
                                }
                                
                                if((measure.width+x)>pageWidth ) {
                                    hi = mI 
                                }  
                                else {
                                     lo = mI
                                }

                                
                           
                   

                            }

                            



                            console.log(x, "beforeX");
                            
                            if (batch.length>0) {

                                                
                                


                                batch.forEach((itm)=>{  
                                    console.log(itm, "'itm");
                                    let msr = this.ctx.measureText(itm)
                                    if ((msr.width + x)> pageWidth){ 
                                        y += (maxHeight+2)
                                        x=10
                                    }                                
                                  this.ctx.fillText(itm, x,y)
                                  x+=msr.width

                                })

                            }

                            console.log(x, "afterX");

                            // this.lines[lineCount][3]= i
                                                       
                            // lineCount+=1
                            
                            
                            
                            // if (this.diacritics[0]) {
                            //  this.lines[lineCount] = 
                            //  [
                            //      0, y, 0, 0, 0, 0,0,0,0, [], boldcache
                            //  ] 
                                 
                            // } else {
                            //  this.lines[lineCount] = 
                            // [
                            //     0, y, 0, 0, 0, 0,0,0,0, [], 
                            // ]
                            // }
     
                            // this.lines[lineCount][2]= i 
                            
                            // this.lines[ lineCount][0]= maxHeight
                            // // maxHeight = 0 
                            // i+=1
                            //  chr =text[i];
                            //  metrics = this.ctx.measureText(chr) 
                        }  else {



                        }
                       
                        if (y<this.window.innerHeight){
                         this.lines[lineCount][9].push({x:(x+metrics.width)/2,y:y,i:i})
                         this.ctx.fillText(renderText, x,y)
                         if(this.diacritics[2]) {
                          
                          this.ctx.fillRect(x-2,y, Math.ceil(metrics.width)+1, 2)
                         }
                         if (this.diacritics[3]) {
                          this.ctx.fillRect(x-2,y-Math.ceil(metrics.actualBoundingBoxAscent/2), Math.ceil(metrics.width)+1, 2)
                         }
                         Token= false
                        } else {
     
                         
                             // if(typeof (w) == "undefined"){
                             //     console.log("set up the worker");
                                 
                             //     w = new Worker("./webworker.js")
                             //     w.onmessage = function(e) {
                             //         // console.log(e.data);
                                     
                             //     }
     
                             //     console.log(w);
     
                             // }
                             // if(typeof (w1) == "undefined"){
                             //     console.log("set up the worker");
                                 
                             //     w1 = new Worker("./webworker.js")
                                 
                             //     w1.onmessage = function(e) {
                             //        var data = (e.data);
                                     
                             //        data+=1
                             //     }
     
                             // }
                         
     
     
                          return
                        }
        
        
                      
                 
                       
                       
                        x+= Math.ceil(metrics.width)

                        if(newLine) {
                            x =10
                            y+= maxHeight+2;
                            newLine = false
                        }
                        
                                
                        
                        // part of the code responsible for rendering 

                        // if(Math.ceil(metrics.actualBoundingBoxAscent)>maxHeight){
                        //     maxHeight = Math.ceil(metrics.actualBoundingBoxAscent)
                        //  }
        
        
                        // if ((Math.ceil(metrics.width)+x)>=(pageWidth -20) || (chr.charCodeAt(0)=== 10)){
                        //     x =10
                        //     y+= maxHeight+2;
                         
     
                        //     this.lines[lineCount][3]= i
                            
                            
                        //     lineCount+=1
                            
                            
                            
                        //     if (this.diacritics[0]) {
                        //      this.lines[lineCount] = 
                        //      [
                        //          0, y, 0, 0, 0, 0,0,0,0, [], boldcache
                        //      ] 
                                 
                        //     } else {
                        //      this.lines[lineCount] = 
                        //     [
                        //         0, y, 0, 0, 0, 0,0,0,0, [], 
                        //     ]
                        //     }
     
                        //     this.lines[lineCount][2]= i 
                            
                        //     this.lines[ lineCount][0]= maxHeight
                        //     // maxHeight = 0 
                        //     i+=1
                        //      chr =text[i];
                        //      metrics = this.ctx.measureText(chr) 
                        // } 
                       
                        // if (y<this.window.innerHeight){
                        //  this.lines[lineCount][9].push({x:(x+metrics.width)/2,y:y,i:i})
                        //  this.ctx.fillText(chr, x,y)
                        //  if(this.diacritics[2]) {
                          
                        //   this.ctx.fillRect(x-2,y, Math.ceil(metrics.width)+1, 2)
                        //  }
                        //  if (this.diacritics[3]) {
                        //   this.ctx.fillRect(x-2,y-Math.ceil(metrics.actualBoundingBoxAscent/2), Math.ceil(metrics.width)+1, 2)
                        //  }
                        // } else {
     
                         
                        //      // if(typeof (w) == "undefined"){
                        //      //     console.log("set up the worker");
                                 
                        //      //     w = new Worker("./webworker.js")
                        //      //     w.onmessage = function(e) {
                        //      //         // console.log(e.data);
                                     
                        //      //     }
     
                        //      //     console.log(w);
     
                        //      // }
                        //      // if(typeof (w1) == "undefined"){
                        //      //     console.log("set up the worker");
                                 
                        //      //     w1 = new Worker("./webworker.js")
                                 
                        //      //     w1.onmessage = function(e) {
                        //      //        var data = (e.data);
                                     
                        //      //        data+=1
                        //      //     }
     
                        //      // }
                         
     
     
                        //   return
                        // }
        
        
        
                        
                        
                        
                       
                       
                        // x+= Math.ceil(metrics.width)



                        
                    }
                    
                    
                   
                   
             
                
              
                    
                
                
            }


// console.log(this.lines);

            
            
            
            
          
            
        }
              
 
        
        handleUnload() {


            
            // w.terminate()
            // w1.terminate()

        }



        handleMouseDown() {

        }

        handleMouseMove(e) {
            
    
            if(mouseDown) {

                let moveY = e.clientY - startY 
                
                tmpPrevMov = moveY-tmpPrevMov

                if(tmpPrevMov>0) {
                    
                    firstRenderLine= (this.lines[10][2])+1
                    
                    prevFirstRenderLine.push(this.lines[0][2])
                    console.log(prevFirstRenderLine);
                    
                   this.render()
            
                   
                } else if(tmpPrevMov<0){
                    
                    firstRenderLine = prevFirstRenderLine[prevFirstRenderLine.length-1]
                    if (firstRenderLine !=0){
                        prevFirstRenderLine = prevFirstRenderLine.slice(0, prevFirstRenderLine.length-1)
                        
                    }
                   this.render()

                }
            

               document.getElementById("scrollBarControler").style.cssText = `transform:translateY(${moveY + prevMove}px); width:100%; height:20px;background-color:blue`
                tmpPrevMov = moveY
               
             
            }

        }

        handleMouseUp(e) {
            if(mouseDown){
                  mouseDown = false 
            prevMove = e.clientY - startY + prevMove
            startY = 0 
            }
          
        }

  

       

        scrollMouseDown(e) {
           mouseDown = true           
           startY = e.clientY 
        
           
        }


}












class Widget {
    constructor (x,y,height, width, id,zIndex=0, img ) {
     this.type = type    
     
     this.id = id
     this.x = x
     this.y = y 
     this.height = height
     this.width = width
     this.img = img || 0
     this.zIndex = zIndex
  
    
     
    }
  }
  



