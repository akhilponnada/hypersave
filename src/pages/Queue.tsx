import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertTriangle, ShieldOff } from "lucide-react";
import { useEffect } from "react";

const Queue = () => {
  const { content, processQueue } = useContent();

  useEffect(() => {
    const interval = setInterval(() => {
      processQueue();
    }, 5000); // Process every 5 seconds

    return () => clearInterval(interval);
  }, [processQueue]);

  const queuedItems = content.filter(item => item.status !== 'processed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'sensitive':
        return <ShieldOff className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <h1 className="text-2xl font-semibold mb-6">Processing Queue</h1>
      <div className="space-y-4">
        {queuedItems.length > 0 ? (
          queuedItems.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{item.title}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {getStatusIcon(item.status!)}
                    <span className="capitalize">{item.status}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 truncate">{item.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">The queue is empty. All items have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;