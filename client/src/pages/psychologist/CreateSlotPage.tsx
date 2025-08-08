import Header from "../../components/psychologist/Header"
import Sidebar from "../../components/psychologist/Sidebar"
import CreateSlotForm from "../../components/psychologist/CreateSlotForm"
import SlotCalendar from "@/components/psychologist/SlotCalendar"

const CreateSlotPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <CreateSlotForm />
        <SlotCalendar />
      </div>
    </div>
  )
}

export default CreateSlotPage