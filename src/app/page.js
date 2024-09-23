
"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect } from "react";
import { text } from "./content";
import Editor from "./textEditor";



  let textPortal; //view port of




export default function Home() {




  function resize() {

  }



  useEffect(()=>{



 
      const editor = new Editor(window, document,document.getElementById("textPortal"), devicePixelRatio)
      editor.init()






     





  }, [])





  return (
    <main className={styles.main}>
     <div id="textWrapper" style={{display:"flex"}}>
      <canvas id="textPortal" style={{width:"1000px", height: "1000px"}}>

     </canvas>
     <div id="scrollBarContainer" style={{height:"100vh", width:"15px", backgroundColor:"red", position:"absolute", right:0}}>
        <div id="scrollBarControler" style={{backgroundColor:"blue", width:"100%", height:"20px", userSelect:"none"}}>
          
        </div>
     </div>
     </div>
    
    </main>
  );
}
