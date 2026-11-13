import "./App.css";
import Header from "./ui/components/Header/Header";
import Calendar from "./components/Calendar/Calendar";
import { ToastContainer } from "react-toastify";
import CalendarList from "./features/calendars/components/CalendarList/CalendarList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col bg-linear-to-r from-bright-pink/60 to-[#fcf1dc] min-h-screen">
        <ToastContainer />
        <Header />
        <div className="flex flex-col-reverse lg:flex-row lg:py-10 lg:px-4 lg:gap-4 max-w-7xl w-full">
          <div className="p-4 sm:px-6 lg:w-72 xl:w-80 lg:shrink-0 ">
            <CalendarList />
          </div>
          <div className="lg:flex-1 lg:justify-start">
            <Calendar />
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
