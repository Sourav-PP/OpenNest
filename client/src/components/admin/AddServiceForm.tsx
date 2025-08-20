import { useForm } from 'react-hook-form';
import { addServiceSchema, type addServiceData } from '../../lib/validations/admin/addServiceValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { adminApi } from '../../server/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';

const AddServiceForm = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<addServiceData>({
    resolver: zodResolver(addServiceSchema)
  });

  const onSubmit = async (data: addServiceData) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description',data.description);
      formData.append('file', data.bannerImage[0]);

      await adminApi.addService(formData);

      toast.success('Service created successfully');
      reset();
    } catch (err) {
      handleApiError(err);
    }
  };
    
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Add Service</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-admin-bg-box p-6 rounded-xl space-y-4  mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Input */}
          <div>
            <label className="block text-white text-sm mb-1">Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full p-4 rounded-lg bg-admin-extra-light text-white outline-none"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Banner Image Input */}
          <div className="space-y-1">
            <label className="block text-white text-sm mb-1">Banner Image</label>
            <div className="relative w-full bg-admin-extra-light rounded-lg p-0.5 flex justify-center items-center">
              <input
                type="file"
                accept="image/*"
                {...register('bannerImage')}
                className="w-full ms-1 p-2 rounded-lg bg-admin-extra-light text-white text-center file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:bg-gray-600 file:text-white file:hover:bg-gray-500 file:transition-colors"
              />
            </div>
            {errors.bannerImage && (<p className="text-red-400 text-sm mt-1">{errors.bannerImage.message}</p>)}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white text-sm mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full p-2 rounded-lg bg-admin-extra-light text-white outline-none"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="group text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary rounded-full group-hover:animate-glow-ring disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;
