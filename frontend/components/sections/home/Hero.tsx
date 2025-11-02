import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";

const HeroSection = () => {
    return ( 
        <section className="relative">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div 
                        className="relative rounded-3xl overflow-hidden flex flex-col justify-center"
                        style={{
                            backgroundImage: 'url(/farming.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '700px'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-800/30"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-3 h-full text-center px-8 py-24">
                            <Typography className={`text-5xl md:text-6xl font-bold text-white max-w-4xl`}>
                                Empowering Farmers with Smart Solutions
                            </Typography>
                            <Typography color={`white`} size={`lg`} className="max-w-3xl">

                                Hingaguru provides a comprehensive platform for managing your farm, from employee coordination to financial tracking and AI-powered insights.
                            </Typography>
                            <div className="flex gap-4">
                                <Button size={`lg`}>
                                    Get Started
                                </Button>
                                <Button variant={`outline`} size={`lg`}>
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
     );
}
 
export default HeroSection;