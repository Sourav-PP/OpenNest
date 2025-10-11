import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';
import { addPlanSchema, type addPlanData } from '@/lib/validations/admin/addPlanValidation';
import { useEffect } from 'react';

const CreatePlanForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<addPlanData>({
    resolver: zodResolver(addPlanSchema),
  });

  const onSubmit = async (data: addPlanData) => {
    try {
      console.log('Submitting plan with data:', data);
      await adminApi.addPlan({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        currency: 'usd',
        creditsPerPeriod: Number(data.creditsPerPeriod),
        billingPeriod: data.billingPeriod as 'month' | 'year' | 'week',
      });

      toast.success('Service created successfully');
      reset();
    } catch (err) {
      handleApiError(err);
    }
  };

  useEffect(() => {
    console.log('Form errors:', errors);
  }, [errors]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Create Plan</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-admin-bg-box p-6 rounded-xl space-y-4 mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-white text-sm mb-1">Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full p-3 rounded-lg bg-admin-extra-light text-white outline-none"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-white text-sm mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              className="w-full p-3 rounded-lg bg-admin-extra-light text-white outline-none"
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
          </div>

          {/* Credits Per Period */}
          <div>
            <label className="block text-white text-sm mb-1">Credits per Period</label>
            <input
              type="number"
              {...register('creditsPerPeriod')}
              className="w-full p-3 rounded-lg bg-admin-extra-light text-white outline-none"
            />
            {errors.creditsPerPeriod && (
              <p className="text-red-400 text-sm mt-1">{errors.creditsPerPeriod.message}</p>
            )}
          </div>

          {/* Billing Period */}
          <div>
            <label className="block text-white text-sm mb-1">Billing Period</label>
            <select
              {...register('billingPeriod')}
              className="w-full p-3 rounded-lg bg-admin-extra-light text-white outline-none"
            >
              <option value="month">Month</option>
              <option value="year">Year</option>
              <option value="week">Week</option>
            </select>
            {errors.billingPeriod && (
              <p className="text-red-400 text-sm mt-1">{errors.billingPeriod.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-white text-sm mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full p-3 rounded-lg bg-admin-extra-light text-white outline-none"
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
            {isSubmitting ? 'Creating...' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlanForm;
