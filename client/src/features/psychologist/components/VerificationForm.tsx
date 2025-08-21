import { useForm } from 'react-hook-form';
// import { assets } from '../assets/assets'
import { verificationSchema, type verificationData } from '@/lib/validations/psychologist/verificationValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { assets } from '@/assets/assets';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '@/services/api/service';
import { psychologistApi } from '@/services/api/psychologist';
import { useDispatch } from 'react-redux';
import { updateVerificationStatus } from '@/redux/slices/authSlice';
import { handleApiError } from '@/lib/utils/handleApiError';


type Specialization = {
  id: string,
  name: string
}
const VerificationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  useEffect(() => {
    const fetchSpecialization = async () => {
      try {
        const res = await serviceApi.getAll();
        if(!res.data) {
          toast.error('Something went wrong');
          return;
        }
        const mapped = res.data.services.map((s:Specialization) => ({
          id: s.id,
          name: s.name
        }));

        setSpecializations(mapped);
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchSpecialization();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch

  } = useForm<verificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      specializations: [], // ✅ default it to an empty array
    },
  });

  const onSubmit = async( data: verificationData ) => {
    // const logFormData = (formData: FormData) => {
    //   for (const [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    //   }
    // };
    const formData = new FormData();

    formData.append('qualification', data.qualification);
    formData.append('defaultFee', data.defaultFee.toString());
    formData.append('aboutMe', data.aboutMe);
    data.specializations.forEach((spec) => {
      formData.append('specializations', spec);
    });

    formData.append('identificationDoc', data.identificationDoc[0]);
    formData.append('educationalCertification', data.educationalCertification[0]);
    formData.append('experienceCertificate', data.experienceCertificate[0]);
    // logFormData(formData);
    try {
      const res = await psychologistApi.submitVerification(formData);

      dispatch(updateVerificationStatus(true));
      toast.success(res.message);
      navigate('/psychologist/profile');
    } catch (err) {
      handleApiError(err);
    }
  };

  const identificationDoc = watch('identificationDoc') as FileList;
  const educationalCertification = watch('educationalCertification') as FileList;
  const experienceCertificate = watch('experienceCertificate') as FileList;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4">
      {/* Qualification */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.qualification} alt="" />
          <input
            type='text'
            {...register('qualification')}
            placeholder="qualification"
            className="input bg-transparent outline-none w-full"
          />
        </div>
        {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification.message}</p>}
      </div>

      {/* Default Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Default Fee</label>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-200">
          <img src={assets.rupee} alt="" />
          <input
            type='number'
            {...register('defaultFee', { valueAsNumber: true })}
            placeholder="Enter you default fee.."
            className="input bg-transparent outline-none w-full"
          />
        </div>
        {errors.defaultFee && <p className="text-red-500 text-sm">{errors.defaultFee.message}</p>}
      </div>

      {/* Specialization */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
    Specializations
        </label>
        <div className="space-y-3 mb-6">
          {specializations.map((spec) => (
            <label key={spec.id} className="relative flex items-center pl-10 cursor-pointer text-gray-700 text-sm select-none">
              <input
                type="checkbox"
                value={spec.id}
                {...register('specializations')}
                className="peer absolute opacity-0 h-0 w-0"
              />
              <span
                className="absolute left-0 top-0 h-5 w-5 rounded-md bg-gray-200 shadow-md transition-all duration-200 peer-checked:bg-[#5C68FF] peer-checked:shadow-lg"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-1.5 top-[3px] h-3 w-2 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              {spec.name}
            </label>
          ))}
        </div>
        {errors.specializations && (
          <p className="text-red-500 text-sm">{errors.specializations.message}</p>
        )}
      </div>

      {/* About Me */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About me</label>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-200">
          <textarea
            {...register('aboutMe')}
            rows={3}
            placeholder='Enter about you...'
            className="input bg-transparent outline-none w-full"
          />
        </div>
        {errors.aboutMe && <p className="text-red-500 text-sm">{errors.aboutMe.message}</p>}
      </div>

      {/* Upload ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID</label>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border border-gray-300 shadow-sm">
          <div className="flex items-center gap-2">
            <img src={assets.doc} alt="" className="w-5 h-5" />
            <span className="text-sm text-gray-600 truncate max-w-[200px] block">
              {identificationDoc?.[0]?.name || 'No file chosen'}
            </span>
          </div>

          <label className="px-3.5 py-1.5 bg-[#99afd5] w-24 h-8 hover:bg-[#8399c1] text-white text-sm font-medium rounded-md cursor-pointer transition-all duration-150">
            <span>Add File</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register('identificationDoc')}
              className="hidden"
            />
          </label>
        </div>

        {errors.identificationDoc && (
          <p className="text-red-500 text-sm mt-1">
            {errors.identificationDoc.message}
          </p>
        )}
      </div>


      {/* Upload Educational Certificate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Educational Certificate</label>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border border-gray-300 shadow-sm">
          <div className="flex items-center gap-2">
            <img src={assets.doc} alt="" className="w-5 h-5" />
            <span className="text-sm text-gray-600 truncate max-w-[200px] block">
              {educationalCertification?.[0]?.name || 'No file chosen'}
            </span>
          </div>

          <label className="px-3.5 py-1.5 bg-[#99afd5] w-24 h-8 hover:bg-[#8399c1] text-white text-sm font-medium rounded-md cursor-pointer transition-all duration-150">
            <span>Add File</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register('educationalCertification')}
              className="hidden"
            />
          </label>
        </div>

        {errors.educationalCertification && (
          <p className="text-red-500 text-sm mt-1">
            {errors.educationalCertification.message}
          </p>
        )}
      </div>

      {/* Upload Experience Certificate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Experience Certificate</label>

        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border border-gray-300 shadow-sm">
          <div className="flex items-center gap-2">
            <img src={assets.doc} alt="" className="w-5 h-5" />
            <span className="text-sm text-gray-600 truncate max-w-[200px] block">
              {experienceCertificate?.[0]?.name || 'No file chosen'}
            </span>
          </div>

          <label className="px-3.5 py-1.5 bg-[#99afd5] w-24 h-8 hover:bg-[#8399c1] text-white text-sm font-medium rounded-md cursor-pointer transition-all duration-150">
            <span>Add File</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register('experienceCertificate')}
              className="hidden"
            />
          </label>
        </div>

        {errors.experienceCertificate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.experienceCertificate.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="group text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary group-hover:animate-glow-ring"
        >
          {isSubmitting ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </form>

  );
};

export default VerificationForm;
