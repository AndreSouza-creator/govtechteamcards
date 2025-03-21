import React from 'react';
import "./intro.css";
import loader from "./../../img/GifAnimadoTecno_v1.gif"

function Intro() {
    return (<>
        
        <div className="introWrapper">
              <img src={loader} className='Tecnoloader'/>
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