// import { useEffect, useState, useRef } from "react";
// import instance from "../../lib/axios";
// import { toast } from "react-toastify";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_blue.css";

// const EditProfileForm = () => {
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     dateOfBirth: null,
//     gender: "",
//     defaultFees: "",
//     qualification: "",
//     aboutMe: "",
//     specialization: [],
//     profileImage: null,
//   });
//   const [availableSpecializations, setAvailableSpecializations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const profileRes = await instance.get('/psychologist/profile');
//         // const serviceRes = await instance.get('/services/specializations');
//         setProfile({
//           ...profileRes.data,
//           specialization: profileRes.data.specialization || [],
//           dateOfBirth: profileRes.data.dateOfBirth ? new Date(profileRes.data.dateOfBirth) : null,
//           profileImage: profileRes.data.profileImage || null,
//         });
//         setAvailableSpecializations(serviceRes.data);
//       } catch (error) {
//         toast.error("Error fetching profile or specializations");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (selectedDates) => {
//     setProfile((prev) => ({ ...prev, dateOfBirth: selectedDates[0] }));
//   };

// //   const handleSpecializationChange = (e) => {
// //     const { options } = e.target;
// //     const selected = Array.from(options)
// //       .filter((option) => option.selected)
// //       .map((option) => option.value);
// //     setProfile((prev) => ({ ...prev, specialization: selected }));
// //   };

//   const handleImageChange = (e) => {
//     setProfile((prev) => ({ ...prev, profileImage: e.target.files[0] }));
//   };

//   const handleImageButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(profile).forEach((key) => {
//       if (key === "specialization") {
//         formData.append(key, JSON.stringify(profile[key]));
//       } else if (key === "profileImage" && profile[key]) {
//         formData.append(key, profile[key]);
//       } else if (key === "dateOfBirth" && profile[key]) {
//         formData.append(key, profile[key].toISOString().split('T')[0]);
//       } else {
//         formData.append(key, profile[key] || "");
//       }
//     });
//     try {
//       await instance.put('/psychologist/profile', formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       toast.error("Error updating profile");
//     }
//   };

//   if (loading) return <p className="text-center py-10">Loading...</p>;

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
//       <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Edit Profile</h2>
//       <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
//         <div className="flex justify-center mb-8">
//           <div className="w-36 h-36 bg-gray-100 rounded-xl overflow-hidden ring-4 ring-indigo-200 transition-all duration-300 hover:ring-indigo-300">
//             {profile.profileImage ? (
//               <img src={URL.createObjectURL(profile.profileImage)} alt="Profile" className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">No Image</div>
//             )}
//           </div>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={profile.name}
//                 onChange={handleChange}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profile.email}
//                 onChange={handleChange}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
//               <input
//                 type="text"
//                 name="mobileNumber"
//                 value={profile.mobileNumber}
//                 onChange={handleChange}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
//               <Flatpickr
//                 value={profile.dateOfBirth}
//                 onChange={handleDateChange}
//                 options={{ dateFormat: "d/m/Y" }}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//                 placeholder="Select date"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
//               <input
//                 type="text"
//                 name="gender"
//                 value={profile.gender}
//                 onChange={handleChange}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Default Fees</label>
//               <input
//                 type="number"
//                 name="defaultFees"
//                 value={profile.defaultFees}
//                 onChange={handleChange}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
//               <input
//                 type="text"
//                 name="qualification"
//                 value={profile.qualification}
//                 onChange={handleChange}
//                 className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Profile Image</label>
//               <button
//                 type="button"
//                 onClick={handleImageButtonClick}
//                 className="w-full px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md flex items-center justify-center gap-2"
//               >
//                 <span>Choose File</span>
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//                 </svg>
//                 <input
//                   type="file"
//                   name="profileImage"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
//             <select
//               multiple
//               name="specialization"
//               value={profile.specialization}
//             //   onChange={handleSpecializationChange}
//               className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm h-32 overflow-y-auto"
//             >
//               {availableSpecializations.map((spec) => (
//                 <option key={spec} value={spec} selected={profile.specialization.includes(spec)}>
//                   {spec}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
//             <textarea
//               name="aboutMe"
//               value={profile.aboutMe}
//               onChange={handleChange}
//               className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 shadow-sm h-28 resize-none"
//             />
//           </div>
//           <div className="text-center">
//             <button
//               type="submit"
//               className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfileForm;