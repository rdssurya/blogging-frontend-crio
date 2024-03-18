import './App.css';
import HomePage from './Components/HomePage';
import Register from './Components/Register';
import Login from './Components/Login';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Blogs from './Components/Blogs';
import BlogDetails from './Components/BlogDetails';

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/blog" element={<BlogDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
