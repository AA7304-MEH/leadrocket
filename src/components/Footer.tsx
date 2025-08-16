import { Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-accent border-t border-primary/10 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-8 right-12 w-24 h-24 border border-primary/20 rounded-full" />
        <div className="absolute bottom-12 left-16 w-32 h-32 border border-primary/20 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center mb-8 md:mb-0 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">LR</span>
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
              </div>
              <div>
                <div className="font-bold text-xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  LeadRocket.ai
                </div>
                <div className="text-sm text-muted-foreground">Powered by AI</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12">
            <nav className="flex space-x-8">
              <a href="#terms" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-105">
                Terms
              </a>
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-105">
                Privacy
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-105">
                Contact
              </a>
            </nav>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary/10 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 LeadRocket.ai. All rights reserved. Made with ❤️ for ambitious founders.
          </p>
        </div>
      </div>
    </footer>
  );
};