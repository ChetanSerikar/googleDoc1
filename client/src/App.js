import TextEditor from "./TextEditor";
import { 
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route ,
  
} from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { redirect } from "react-router-dom";



function App() {
  return (
    // <div className="App">
    //   <TextEditor/>
    // </div>
    // <Switch>

    //     <Route path="/" exact>
    //       <Redirect to={`/documents/${uuidV4()}`} />
    //     </Route>

    //     <Route path="/documents/:id" >
    //         <TextEditor/>
    //     </Route>

    //   </Switch>
    <Router>
      
      <Routes>
        <Route path="/"  element={<Navigate to={`/documents/${uuidV4()}`}  replace />}>
           
        </Route>
        <Route path="documents/:id" element={ <TextEditor/>} />
      </Routes>
      
    </Router>
  );
}

export default App;
