import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
}

export const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchMessages();
  }, [user, navigate]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('timestamp', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages",
        });
      } else {
        setMessages(data || []);
        processConversations(data || []);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processConversations = (messages: Message[]) => {
    if (!user) return;

    const conversationMap = new Map<string, Conversation>();

    messages.forEach((message) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: `User ${otherUserId.slice(0, 8)}`, // Simplified - in real app, fetch from profiles
          lastMessage: message.content,
          lastMessageTime: message.timestamp,
        });
      } else {
        const existing = conversationMap.get(otherUserId)!;
        if (new Date(message.timestamp) > new Date(existing.lastMessageTime)) {
          existing.lastMessage = message.content;
          existing.lastMessageTime = message.timestamp;
        }
      }
    });

    setConversations(Array.from(conversationMap.values()));
  };

  const handleSendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedConversation,
            content: newMessage.trim(),
          }
        ]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send message",
        });
      } else {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    }
  };

  const getConversationMessages = () => {
    if (!selectedConversation) return [];
    
    return messages.filter(
      (msg) => 
        (msg.sender_id === selectedConversation || msg.receiver_id === selectedConversation) &&
        (msg.sender_id === user?.id || msg.receiver_id === user?.id)
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-section-title text-primary">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Connect and communicate with your network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-primary">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 animate-pulse">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      onClick={() => setSelectedConversation(conversation.userId)}
                      className={`p-4 border-b cursor-pointer hover:bg-accent transition-smooth ${
                        selectedConversation === conversation.userId ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {conversation.userName[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {conversation.userName}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conversation.lastMessageTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message View */}
          <Card className="lg:col-span-2 shadow-soft">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-primary">
                    {conversations.find(c => c.userId === selectedConversation)?.userName || 'Chat'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-[500px] p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getConversationMessages().map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} size="icon" variant="hero">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};