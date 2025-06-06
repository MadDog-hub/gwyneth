import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/AdminDashboard";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({ username, password });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  if (isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen gradient-royal flex items-center justify-center relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="rotating absolute top-10 left-10 text-6xl text-soft-lilac/30">
          <Crown />
        </div>
        <div className="floating delay-300 absolute top-20 right-20 text-4xl text-gold/40">
          <Crown />
        </div>
        <div className="rotating delay-700 absolute bottom-40 left-1/4 text-5xl text-soft-lilac/25">
          <Crown />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 z-10"
      >
        <Card className="border-4 border-gold bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold to-soft-lilac rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-cinzel text-2xl text-royal-blue">
              Admin Login
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-opensans text-slate-gray">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (sample123)"
                  className="border-2 border-soft-lilac focus:border-gold"
                  disabled={loginMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="font-opensans text-slate-gray">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (sample123)"
                  className="border-2 border-soft-lilac focus:border-gold"
                  disabled={loginMutation.isPending}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-gray text-slate-gray hover:bg-slate-gray hover:text-white"
                  asChild
                >
                  <a href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Site
                  </a>
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-royal-blue text-white hover:bg-royal-blue/90 btn-3d"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-sky-blue/10 rounded-lg">
              <p className="text-xs text-slate-gray text-center">
                Demo credentials: username: sample123, password: sample123
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
