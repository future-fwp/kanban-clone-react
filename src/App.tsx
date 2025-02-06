import { useAuth } from "./context/AuthContext";
import { Auth } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { BoardProvider } from "./context/BoardContext";
import { ToastContainer } from "react-toastify";
function App() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Auth />;
	}

	return (
		<BoardProvider>
			<Dashboard />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</BoardProvider>
	);
}

export default App;
