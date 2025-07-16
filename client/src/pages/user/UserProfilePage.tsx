import Header from "../../components/user/Header.tsx"
import Sidebar from "../../components/user/Sidebar.tsx"
import UserProfile from "../../components/user/UserProfile.tsx.tsx"
const UserProfilePage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <UserProfile />
      </div>
    </div>
  )
}

export default UserProfilePage
