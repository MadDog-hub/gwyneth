import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Crown, 
  LogOut, 
  Users, 
  UserPlus, 
  MessageSquare, 
  BarChart3, 
  Check, 
  X, 
  Download,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GuestWithPlusGuests, GuestbookMessage } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    role: "",
    allowedPlusGuests: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: guests = [], isLoading: guestsLoading } = useQuery({
    queryKey: ["/api/admin/guests"],
  });

  const { data: guestbookMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/guestbook"],
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/statistics"],
  });

  // Mutations
  const addGuestMutation = useMutation({
    mutationFn: async (guestData: typeof newGuest) => {
      const response = await apiRequest("POST", "/api/admin/guests", guestData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Guest Added",
        description: "New guest has been successfully added to the list.",
      });
      setNewGuest({ firstName: "", lastName: "", role: "", allowedPlusGuests: 0 });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Guest",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (guestId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/guests/${guestId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Guest Deleted",
        description: "Guest has been successfully removed from the list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete Guest",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest("PUT", `/api/admin/guestbook/${messageId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Approved",
        description: "Message has been approved and is now visible to guests.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Approve Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/guestbook/${messageId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Deleted",
        description: "Message has been permanently deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guestbook"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guestbook"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGuest.firstName || !newGuest.lastName || !newGuest.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addGuestMutation.mutate(newGuest);
  };

  const exportGuestList = () => {
    if (!guests.length) {
      toast({
        title: "No Data to Export",
        description: "There are no guests to export.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ["First Name", "Last Name", "Role", "Attendance", "Message", "Plus Guests", "Submitted At"].join(","),
      ...(guests as GuestWithPlusGuests[]).map(guest => [
        guest.firstName,
        guest.lastName,
        guest.role,
        guest.rsvpStatus || "Pending",
        `"${guest.personalMessage || ""}"`,
        guest.plusGuests.length,
        guest.submittedAt ? new Date(guest.submittedAt).toLocaleDateString() : ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Guest list has been downloaded as CSV file.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-blue/20">
      {/* Header */}
      <header className="bg-white border-b border-gold/30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-soft-lilac rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-cinzel text-2xl font-bold text-royal-blue">
                  Admin Dashboard
                </h1>
                <p className="font-opensans text-sm text-slate-gray">
                  Erica Santos' Grand Celebration
                </p>
              </div>
            </div>

            <Button
              onClick={onLogout}
              variant="outline"
              className="border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="border-l-4 border-royal-blue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-opensans text-sm text-slate-gray">Total Guests</p>
                      <p className="font-cinzel text-2xl font-bold text-royal-blue">
                        {statistics?.totalGuests || 0}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-royal-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-opensans text-sm text-slate-gray">Attending</p>
                      <p className="font-cinzel text-2xl font-bold text-green-600">
                        {statistics?.attendingGuests || 0}
                      </p>
                    </div>
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-opensans text-sm text-slate-gray">Not Attending</p>
                      <p className="font-cinzel text-2xl font-bold text-red-600">
                        {statistics?.notAttendingGuests || 0}
                      </p>
                    </div>
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-opensans text-sm text-slate-gray">Pending RSVPs</p>
                      <p className="font-cinzel text-2xl font-bold text-orange-600">
                        {statistics?.pendingRSVPs || 0}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-soft-lilac">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-opensans text-sm text-slate-gray">Plus Guests</p>
                      <p className="font-cinzel text-2xl font-bold text-[#f04164]">
                        {statistics?.totalPlusGuests || 0}
                      </p>
                    </div>
                    <UserPlus className="w-8 h-8 text-soft-lilac" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="guests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="guests" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Guest Management</span>
            </TabsTrigger>
            <TabsTrigger value="guestbook" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Guestbook</span>
            </TabsTrigger>
            <TabsTrigger value="add-guest" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Guest</span>
            </TabsTrigger>
          </TabsList>

          {/* Guest Management Tab */}
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-cinzel text-xl text-royal-blue">
                    Guest List
                  </CardTitle>
                  <Button
                    onClick={exportGuestList}
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {guestsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : guests.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-gray/50 mx-auto mb-4" />
                    <p className="font-opensans text-slate-gray">
                      No guests have been added yet. Add your first guest to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(guests as GuestWithPlusGuests[]).map((guest) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border border-soft-lilac/30 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="font-lora font-semibold text-royal-blue">
                              {guest.firstName} {guest.lastName}
                            </p>
                            <p className="font-opensans text-sm text-slate-gray">
                              {guest.role}
                            </p>
                          </div>
                          <div>
                            <Badge
                              variant={
                                guest.rsvpStatus === "attending"
                                  ? "default"
                                  : guest.rsvpStatus === "not_attending"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                guest.rsvpStatus === "attending"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : guest.rsvpStatus === "not_attending"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                              }
                            >
                              {guest.rsvpStatus === "attending"
                                ? "Attending"
                                : guest.rsvpStatus === "not_attending"
                                ? "Not Attending"
                                : "Pending"}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-opensans text-sm">
                              Plus guests: {guest.plusGuests.length}/{guest.allowedPlusGuests}
                            </p>
                          </div>
                          <div>
                            {guest.submittedAt && (
                              <p className="font-opensans text-xs text-slate-gray">
                                RSVP: {new Date(guest.submittedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGuestMutation.mutate(guest.id)}
                          disabled={deleteGuestMutation.isPending}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guestbook Tab */}
          <TabsContent value="guestbook">
            <Card>
              <CardHeader>
                <CardTitle className="font-cinzel text-xl text-royal-blue">
                  Guestbook Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
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
                ) : guestbookMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-slate-gray/50 mx-auto mb-4" />
                    <p className="font-opensans text-slate-gray">
                      No guestbook messages have been submitted yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(guestbookMessages as GuestbookMessage[]).map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border rounded-lg ${
                          message.isApproved 
                            ? "border-green-200 bg-green-50" 
                            : "border-orange-200 bg-orange-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-lora font-semibold text-royal-blue">
                                {message.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {message.relationship}
                              </Badge>
                              <div className="flex items-center">
                                {message.isApproved ? (
                                  <Eye className="w-4 h-4 text-green-600" />
                                ) : (
                                  <EyeOff className="w-4 h-4 text-orange-600" />
                                )}
                                <span className="ml-1 text-xs text-slate-gray">
                                  {message.isApproved ? "Approved" : "Pending"}
                                </span>
                              </div>
                            </div>
                            <p className="font-opensans text-slate-gray mb-2">
                              {message.message}
                            </p>
                            <p className="font-opensans text-xs text-slate-gray">
                              Submitted: {new Date(message.submittedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {!message.isApproved && (
                              <Button
                                size="sm"
                                onClick={() => approveMessageMutation.mutate(message.id)}
                                disabled={approveMessageMutation.isPending}
                                className="bg-green-600 text-white hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMessageMutation.mutate(message.id)}
                              disabled={deleteMessageMutation.isPending}
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Guest Tab */}
          <TabsContent value="add-guest">
            <Card>
              <CardHeader>
                <CardTitle className="font-cinzel text-xl text-royal-blue">
                  Add New Guest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddGuest} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-opensans text-slate-gray">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={newGuest.firstName}
                        onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                        placeholder="Enter first name"
                        className="border-2 border-soft-lilac focus:border-gold"
                        disabled={addGuestMutation.isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-opensans text-slate-gray">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={newGuest.lastName}
                        onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                        placeholder="Enter last name"
                        className="border-2 border-soft-lilac focus:border-gold"
                        disabled={addGuestMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="font-opensans text-slate-gray">
                        Role *
                      </Label>
                      <Select 
                        value={newGuest.role} 
                        onValueChange={(value) => setNewGuest({ ...newGuest, role: value })}
                        disabled={addGuestMutation.isPending}
                      >
                        <SelectTrigger className="border-2 border-soft-lilac focus:border-gold">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Colleague">Colleague</SelectItem>
                          <SelectItem value="Neighbor">Neighbor</SelectItem>
                          <SelectItem value="Classmate">Classmate</SelectItem>
                          <SelectItem value="Relative">Relative</SelectItem>
                          <SelectItem value="18 Roses">18 Roses</SelectItem>
                          <SelectItem value="18 Candles">18 Candles</SelectItem>
                          <SelectItem value="18 Blue Bills">18 Blue Bills</SelectItem>
                          <SelectItem value="18 Male Guests/Friends">18 Male Guests/Friends</SelectItem>
                          <SelectItem value="18 Treasures">18 Treasures</SelectItem>
                          <SelectItem value="18 Shots/Toasts">18 Shots/Toasts</SelectItem>
                          <SelectItem value="Cake Ceremony">Cake Ceremony</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowedPlusGuests" className="font-opensans text-slate-gray">
                        Allowed Plus Guests (0-5)
                      </Label>
                      <Select 
                        value={newGuest.allowedPlusGuests.toString()} 
                        onValueChange={(value) => setNewGuest({ ...newGuest, allowedPlusGuests: parseInt(value) })}
                        disabled={addGuestMutation.isPending}
                      >
                        <SelectTrigger className="border-2 border-soft-lilac focus:border-gold">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-royal-blue to-soft-lilac text-white font-opensans font-semibold py-4 btn-3d"
                    disabled={addGuestMutation.isPending}
                  >
                    {addGuestMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Adding Guest...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Add Guest
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}