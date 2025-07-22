import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold text-blue-600">StudentSphere</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload Question</Link>
      </div>
    </nav>
  );
}

export default Navbar;
