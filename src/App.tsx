import "./App.css";
import Header from "./ui/components/Header/Header";
import Calendar from "./components/Calendar/Calendar";

function App() {
  return (
    <main className="flex flex-col bg-linear-to-r from-bright-pink/60 to-[#fcf1dc] min-h-screen">
      <Header />
      <Calendar />
    </main>
  );
}

export default App;
