import { Button } from "./components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-32 px-6">
      {/* Glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-900/40 to-purple-950/40 backdrop-blur-xl p-12 md:p-16 text-center shadow-2xl shadow-purple-500/10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-purple-100 to-purple-300 bg-clip-text text-transparent">
            Ready to Transform Learning?
          </h2>
          
          <p className="text-lg text-purple-200/70 mb-10 max-w-2xl mx-auto">
            Join thousands of students exploring the cosmos through immersive VR education. Start your aerospace journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-7 text-lg rounded-xl shadow-xl shadow-purple-500/30 border border-purple-400/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400/30 text-purple-200 hover:bg-purple-500/10 px-10 py-7 text-lg rounded-xl backdrop-blur-sm"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
