import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestbookMessage } from "@shared/schema";

export default function GuestbookForm() {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/guestbook"],
  });

  const submitMutation = useMutation({
    mutationFn: async (messageData: { name: string; relationship: string; message: string }) => {
      const response = await apiRequest("POST", "/api/guestbook", messageData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Submitted!",
        description: "Your message has been submitted for review. Thank you for your kind words!",
      });
      // Reset form
      setName("");
      setRelationship("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !relationship || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      name: name.trim(),
      relationship,
      message: message.trim(),
    });
  };

  return (
    <section id="guestbook" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cinzel text-4xl md:text-5xl font-bold text-royal-blue mb-12 text-center"
          >
            Digital Guestbook
          </motion.h2>
          
          {/* Display Messages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="font-lora text-2xl text-soft-lilac mb-6 text-center">
              Messages from Friends & Family
            </h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-effect rounded-2xl p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {(messages as GuestbookMessage[]).map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-effect rounded-2xl p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold to-soft-lilac rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-lora text-lg text-royal-blue">
                          {msg.name} ({msg.relationship})
                        </h4>
                        <p className="font-opensans text-slate-gray mt-1">
                          {msg.message}
                        </p>
                        <p className="font-opensans text-xs text-slate-gray/70 mt-3">
                          {new Date(msg.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-slate-gray/50 mx-auto mb-4" />
                <p className="font-opensans text-slate-gray">
                  No messages yet. Be the first to leave a message!
                </p>
              </div>
            )}
          </motion.div>
          
          {/* Add Message Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-soft-lilac bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="font-lora text-2xl text-soft-lilac text-center">
                  Leave a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="guestbookName" className="font-opensans text-slate-gray">
                        Your Name *
                      </Label>
                      <Input
                        id="guestbookName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="border-2 border-soft-lilac focus:border-gold"
                        disabled={submitMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestbookRelationship" className="font-opensans text-slate-gray">
                        Relationship *
                      </Label>
                      <Select value={relationship} onValueChange={setRelationship} disabled={submitMutation.isPending}>
                        <SelectTrigger className="border-2 border-soft-lilac focus:border-gold">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Colleague">Colleague</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guestbookMessage" className="font-opensans text-slate-gray">
                      Your Message *
                    </Label>
                    <Textarea
                      id="guestbookMessage"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your wishes, memories, or congratulations..."
                      rows={4}
                      className="border-2 border-soft-lilac focus:border-gold"
                      disabled={submitMutation.isPending}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-soft-lilac to-gold text-white font-opensans font-semibold py-4 btn-3d"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        Submit Message
                      </>
                    )}
                  </Button>
                  
                  <p className="font-opensans text-sm text-slate-gray/70 text-center">
                    Messages will be reviewed before appearing publicly
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
