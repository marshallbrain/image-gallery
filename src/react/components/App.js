import React from 'react';
import PersistentDialogs from "./PersistentDialogs";
import Home from "./Home";

function App(props) {
    
    return (
        <React.Fragment>
            <PersistentDialogs />
            <Home />
        </React.Fragment>
    );
}

export default App;
