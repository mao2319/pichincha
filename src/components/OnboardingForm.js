import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { apiService } from '@/services/api';
import { useAgentStore } from '@/stores/agentStore';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
export function OnboardingForm() {
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isProcessing } = useAgentStore();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Validate required fields
            if (!formData.firstName || !formData.documentNumber || !formData.product) {
                throw new Error('Please fill in all required fields (Name, Document, Product)');
            }
            // Call API to start onboarding
            const response = await apiService.startOnboarding({
                prospect_name: `${formData.firstName} ${formData.lastName || ''}`.trim(),
                document_id: formData.documentNumber,
                product: formData.product,
                email: formData.email,
                phone: formData.phone,
                document_type: formData.documentType,
            });
            if (!response.success) {
                throw new Error(response.error || 'Failed to start onboarding');
            }
            toast.success(response.message);
            setFormData({});
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to submit form';
            toast.error(message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "flex-1 max-w-4xl mx-auto p-8", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8 text-gray-900", children: "Client Onboarding Form" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("section", { className: "border-b pb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Personal Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "First Name *" }), _jsx("input", { type: "text", name: "firstName", value: formData.firstName || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Last Name" }), _jsx("input", { type: "text", name: "lastName", value: formData.lastName || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email *" }), _jsx("input", { type: "email", name: "email", value: formData.email || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Phone" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] })] })] }), _jsxs("section", { className: "border-b pb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Document Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Document Type *" }), _jsxs("select", { name: "documentType", value: formData.documentType || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2", required: true, children: [_jsx("option", { value: "", children: "Select a document type" }), _jsx("option", { value: "passport", children: "Passport" }), _jsx("option", { value: "national_id", children: "National ID" }), _jsx("option", { value: "driver_license", children: "Driver License" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Document Number *" }), _jsx("input", { type: "text", name: "documentNumber", value: formData.documentNumber || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Date of Birth" }), _jsx("input", { type: "date", name: "dateOfBirth", value: formData.dateOfBirth || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] })] })] }), _jsxs("section", { className: "border-b pb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Address Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Address" }), _jsx("input", { type: "text", name: "address", value: formData.address || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "City" }), _jsx("input", { type: "text", name: "city", value: formData.city || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Country" }), _jsx("input", { type: "text", name: "country", value: formData.country || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] })] })] }), _jsxs("section", { className: "border-b pb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Professional Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Occupation" }), _jsx("input", { type: "text", name: "occupation", value: formData.occupation || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Monthly Income" }), _jsx("input", { type: "number", name: "monthlyIncome", value: formData.monthlyIncome || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2" })] })] })] }), _jsxs("section", { className: "pb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-800", children: "Product Selection *" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Select Product" }), _jsxs("select", { name: "product", value: formData.product || '', onChange: handleInputChange, className: "mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2", required: true, children: [_jsx("option", { value: "", children: "Select a product" }), _jsx("option", { value: "cuenta_ahorros", children: "Cuenta de Ahorros (Savings Account)" }), _jsx("option", { value: "credito", children: "Cr\u00E9dito Personal (Personal Credit)" }), _jsx("option", { value: "tarjeta_credito", children: "Tarjeta de Cr\u00E9dito (Credit Card)" }), _jsx("option", { value: "inversion", children: "Inversi\u00F3n (Investment)" })] })] }) })] }), _jsx("div", { className: "flex gap-4", children: _jsx("button", { type: "submit", disabled: isSubmitting || isProcessing, className: "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition", children: isSubmitting || isProcessing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Processing..."] })) : ('Submit Onboarding') }) })] })] }) }));
}
//# sourceMappingURL=OnboardingForm.js.map