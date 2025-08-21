import Header from '../../../components/psychologist/Header';
import Sidebar from '../../../components/psychologist/Sidebar';
import CreateSlotForm from '../components/CreateSlotForm';
import SlotCalendar from '../components/SlotCalendar';
import { useState } from 'react';

const CreateSlotPage = () => {
  const [slotsChanged, setSlotsChanged] = useState(false);

  const handleSlotCreated = () => {
    setSlotsChanged(prev => !prev); 
  };
  return (
    <div className="flex h-screen w-full bg-gradient-to-b from-slate-100 to-blue-50 text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <CreateSlotForm onSlotCreated={handleSlotCreated}/>
        <SlotCalendar slotsChanged={slotsChanged}/>
      </div>
    </div>
  );
};

export default CreateSlotPage;