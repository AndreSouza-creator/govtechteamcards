import React from 'react';
import "./intro.css";
import loader from "./../../img/logoloader.mp4"

function Intro() {
    return (<>
        
        <div className="introWrapper">
        <video loop autoPlay muted className='Tecnoloader'>
         <source src={loader} type='video/mp4'></source>
        </video>
        <div className='wrapperTextType'>
           <h1 className="introbigTitle">
          <span v-html="'&nbsp;'" className="typewriter"></span>
        </h1>
        </div>
        </div>
        </>
    );
}

export default Intro;