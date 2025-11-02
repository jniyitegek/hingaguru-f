import { Button } from "../ui/button";

const CtaSection = () => {
    return ( 
        <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-16 text-center flex flex-col items-center shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to transform your farm management?
                        </h2>
                        <p className="text-xl text-green-50 mb-10 max-w-3xl mx-auto">
                            Join farmers using the revolutionary platform to maximize their results
                        </p>
                        <Button variant={`outline`}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </section>
     );
}
 
export default CtaSection;