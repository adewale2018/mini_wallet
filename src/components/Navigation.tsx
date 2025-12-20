import { Link, NavLink } from "react-router";

import { Home } from "lucide-react";

function Navigation() {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <Link
                to="/"
                className="w-8 h-8 bg-orange-600 rounded-lg items-center justify-center mr-3 hidden sm:flex"
              >
                <Home className="w-5 h-5 text-white " />
              </Link>
              <span className="text-xl font-bold text-gray-900">
                MiniWallet
              </span>
            </div>
          </div>
          <div className=" flex items-center ">
            <NavLink
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center"
            >
              {({ isActive }) => (
                <span
                  className={isActive ? "border-b-2 border-orange-600" : ""}
                >
                  Dashboard
                </span>
              )}
            </NavLink>
            <NavLink
              to="/transfer"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center"
            >
              {({ isActive }) => (
                <span
                  className={isActive ? "border-b-2 border-orange-600" : ""}
                >
                  Transfer
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navigation;
