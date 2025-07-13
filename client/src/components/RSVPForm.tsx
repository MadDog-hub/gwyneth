import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestWithPlusGuests } from "@shared/schema";

export default function RSVPForm() {
  const [searchMode, setSearchMode] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [guest, setGuest] = useState<GuestWithPlusGuests | null>(null);
  const [attendance, setAttendance] = useState<string>("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [plusGuests, setPlusGuests] = useState<Array<{ name: string; relationship: string }>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async (searchData: { firstName: string; lastName: string }) => {
      const response = await apiRequest("POST", "/api/guests/search", searchData);
      return response.json() as Promise<GuestWithPlusGuests>;
    },
    onSuccess: (data) => {
      setGuest(data);
      setSearchMode(false);
      setPlusGuests(data.plusGuests.map(pg => ({ name: pg.name, relationship: pg.relationship || "" })));
      toast({
        title: "Guest Found!",
        description: `Welcome ${data.firstName} ${data.lastName}! You're invited as a ${data.role}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Guest Not Found",
        description: "Please check your name spelling or contact the host directly.",
        variant: "destructive",
      });
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async (rsvpData: {
      guestId: number;
      rsvpStatus: string;
      personalMessage?: string;
      plusGuests?: Array<{ name: string; relationship?: string }>;
    }) => {
      const response = await apiRequest("POST", "/api/rsvp", rsvpData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "RSVP Submitted!",
        description: "Thank you for your response. We can't wait to celebrate with you!",
      });
      // Reset form
      setSearchMode(true);
      setGuest(null);
      setFirstName("");
      setLastName("");
      setAttendance("");
      setPersonalMessage("");
      setPlusGuests([]);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both first and last name",
        variant: "destructive",
      });
      return;
    }

    searchMutation.mutate({ firstName: firstName.trim(), lastName: lastName.trim() });
  };

  const handleSubmitRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guest || !attendance) {
      toast({
        title: "Missing Information",
        description: "Please select your attendance status",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty plus guests
    const validPlusGuests = plusGuests.filter(pg => pg.name.trim() !== "");

    rsvpMutation.mutate({
      guestId: guest.id,
      rsvpStatus: attendance,
      personalMessage: personalMessage || undefined,
      plusGuests: attendance === "attending" ? validPlusGuests : undefined,
    });
  };

  const addPlusGuest = () => {
    if (!guest || plusGuests.length >= guest.allowedPlusGuests) {
      toast({
        title: "Cannot Add Guest",
        description: `You can only bring up to ${guest?.allowedPlusGuests} plus guests`,
        variant: "destructive",
      });
      return;
    }

    setPlusGuests([...plusGuests, { name: "", relationship: "" }]);
  };

  const removePlusGuest = (index: number) => {
    setPlusGuests(plusGuests.filter((_, i) => i !== index));
  };

  const updatePlusGuest = (index: number, field: "name" | "relationship", value: string) => {
    setPlusGuests(
      plusGuests.map((pg, i) => (i === index ? { ...pg, [field]: value } : pg))
    );
  };

  return (
    <section id="rsvp" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-4 text-[#3c83f6e6]">
              RSVP
            </h2>
            <p className="font-lora text-2xl text-[#c64e84]">
              Let Me Know You're Coming
            </p>
            <div className="rounded-2xl p-4 border-l-4 border-blue-500 mt-6 bg-[#fef2f2]">
              <p className="font-opensans text-blue-800 text-center">
                <strong>Note:</strong> Whilst we love little ones, we kindly request a child-free ceremony.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-soft-lilac bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8 md:p-12">
                {searchMode ? (
                  // Guest Search Form
                  (<form onSubmit={handleSearch} className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="font-lora text-2xl font-semibold text-royal-blue mb-2">
                        Find Your Invitation
                      </h3>
                      <p className="font-opensans text-slate-gray">
                        Enter your name to locate your invitation details
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-opensans text-slate-gray">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter your first name"
                          className="border-2 border-soft-lilac focus:border-gold"
                          disabled={searchMutation.isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-opensans text-slate-gray">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter your last name"
                          className="border-2 border-soft-lilac focus:border-gold"
                          disabled={searchMutation.isPending}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-royal-blue to-soft-lilac text-white font-opensans font-semibold py-4 btn-3d"
                      disabled={searchMutation.isPending}
                    >
                      {searchMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Find My Invitation
                        </>
                      )}
                    </Button>
                  </form>)
                ) : (
                  // RSVP Details Form
                  (<form onSubmit={handleSubmitRSVP} className="space-y-8">
                    {guest && (
                      <div className="p-6 bg-gold/10 rounded-xl border-l-4 border-gold">
                        <p className="font-lora text-lg text-royal-blue">
                          Welcome, {guest.firstName} {guest.lastName}!
                        </p>
                        <p className="font-opensans text-slate-gray">
                          You're invited as a {guest.role}. You can bring up to {guest.allowedPlusGuests} plus guests.
                        </p>
                      </div>
                    )}
                    <div className="space-y-4">
                      <Label className="font-opensans text-slate-gray text-lg">
                        Will you be attending?
                      </Label>
                      <RadioGroup value={attendance} onValueChange={setAttendance}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="attending" id="attending" />
                          <label htmlFor="attending" className="font-opensans text-slate-gray cursor-pointer">
                            Yes, I'll be there!
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not_attending" id="not_attending" />
                          <label htmlFor="not_attending" className="font-opensans text-slate-gray cursor-pointer">
                            Sorry, can't make it
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                    {attendance === "attending" && guest && guest.allowedPlusGuests > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <Label className="font-opensans text-slate-gray text-lg">
                            Plus Guests ({plusGuests.length}/{guest.allowedPlusGuests})
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addPlusGuest}
                            disabled={plusGuests.length >= guest.allowedPlusGuests}
                            className="border-soft-lilac text-soft-lilac hover:bg-soft-lilac hover:text-white"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Guest
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {plusGuests.map((plusGuest, index) => (
                            <div key={index} className="p-4 border-2 border-soft-lilac/30 rounded-xl">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-lora text-lg text-royal-blue">
                                  Plus Guest {index + 1}
                                </h4>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlusGuest(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="font-opensans text-slate-gray">Full Name</Label>
                                  <Input
                                    value={plusGuest.name}
                                    onChange={(e) => updatePlusGuest(index, "name", e.target.value)}
                                    placeholder="Enter full name"
                                    className="border-2 border-soft-lilac/50 focus:border-gold"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="font-opensans text-slate-gray">Relationship</Label>
                                  <Input
                                    value={plusGuest.relationship}
                                    onChange={(e) => updatePlusGuest(index, "relationship", e.target.value)}
                                    placeholder="e.g., Spouse, Friend"
                                    className="border-2 border-soft-lilac/50 focus:border-gold"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="personalMessage" className="font-opensans text-slate-gray">
                        Personal Message (Optional)
                      </Label>
                      <Textarea
                        id="personalMessage"
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        placeholder="Share your excitement or any special message..."
                        rows={4}
                        className="border-2 border-soft-lilac focus:border-gold"
                        disabled={rsvpMutation.isPending}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSearchMode(true);
                          setGuest(null);
                          setAttendance("");
                          setPersonalMessage("");
                          setPlusGuests([]);
                        }}
                        className="flex-1 border-slate-gray text-slate-gray hover:bg-slate-gray hover:text-white"
                        disabled={rsvpMutation.isPending}
                      >
                        Back to Search
                      </Button>
                      
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-royal-blue to-gold text-white font-opensans font-semibold py-4 btn-3d"
                        disabled={rsvpMutation.isPending}
                      >
                        {rsvpMutation.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Submit RSVP
                          </>
                        )}
                      </Button>
                    </div>
                  </form>)
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
