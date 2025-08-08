import Header from "../../components/psychologist/Header"
import Sidebar from "../../components/psychologist/Sidebar"
import Profile from "../../components/psychologist/Profile"

const ProfilePage = () => {
  return (
    <div className="relative flex h-screen w-full bg-transparent text-primaryText">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <Profile />
      </div>
    </div>
  )
}

export default ProfilePage
