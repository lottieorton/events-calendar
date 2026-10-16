import "./App.css";
import Header from "./components/Header/Header";
import Calendar from "./components/Calendar/Calendar";

function App() {
  return (
    <main className="flex flex-col h-14 bg-linear-to-r from-[#fae8e9] to-[#fcf1dc] min-h-screen p-4 gap-3">
      <Header />
      <Calendar />
    </main>
  );
}

export default App;
