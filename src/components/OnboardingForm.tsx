import { useState } from 'react'
import { ProspectData } from '@/types'
import { apiService } from '@/services/api'
import { useAgentStore } from '@/stores/agentStore'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export function OnboardingForm() {
  const [formData, setFormData] = useState<Partial<ProspectData> & { product?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isProcessing } = useAgentStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.documentNumber || !formData.product) {
        throw new Error('Please fill in all required fields (Name, Document, Product)')
      }

      // Call API to start onboarding
      const response = await apiService.startOnboarding({
        prospect_name: `${formData.firstName} ${formData.lastName || ''}`.trim(),
        document_id: formData.documentNumber,
        product: formData.product,
        email: formData.email,
        phone: formData.phone,
        document_type: formData.documentType,
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to start onboarding')
      }

      toast.success(response.message)
      setFormData({})
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit form'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Client Onboarding Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Document Information */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Document Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document Type *
                </label>
                <select
                  name="documentType"
                  value={formData.documentType || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                  required
                >
                  <option value="">Select a document type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="driver_license">Driver License</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document Number *
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Address Information */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Income
                </label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Product Selection */}
          <section className="pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Product Selection *
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Product
                </label>
                <select
                  name="product"
                  value={formData.product || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                  required
                >
                  <option value="">Select a product</option>
                  <option value="cuenta_ahorros">Cuenta de Ahorros (Savings Account)</option>
                  <option value="credito">Crédito Personal (Personal Credit)</option>
                  <option value="tarjeta_credito">Tarjeta de Crédito (Credit Card)</option>
                  <option value="inversion">Inversión (Investment)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isProcessing}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition"
            >
              {isSubmitting || isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Onboarding'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
