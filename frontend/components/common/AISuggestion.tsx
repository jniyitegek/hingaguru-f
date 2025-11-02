import { FlaskConical, Sprout, Wrench } from "lucide-react";

const AISuggestion = () => {
    return ( 
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
                <Wrench className="text-green-600" size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-6">Get intelligent insights to optimize your farm&apos;s performance.</p>
            <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <Sprout size={18} />
                    <span className="font-medium text-sm">Get Crop Suggestions</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <FlaskConical size={18} />
                    <span className="font-medium text-sm">Identify Disease with AI</span>
                </button>
            </div>
        </div>
     );
}
 
export default AISuggestion;