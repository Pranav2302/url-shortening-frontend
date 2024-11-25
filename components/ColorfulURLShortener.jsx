"use client";
import QRCode from "react-qr-code";
import { Canvg } from "canvg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCopy, QrCode } from "lucide-react";

export default function ColorfulURLShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [message, setMessage] = useState("");
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qrModalOpen, setQRModalOpen] = useState(false);
  const [qrUrl, setQRUrl] = useState("");

  const downloadQRCode = async () => {
    const svgElement = document.getElementById("qr-code");
    if (!svgElement) {
      alert("QR Code not found");
      return;
    }

    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = 256; // Adjust to match the size of your QR code
    canvas.height = 256;

    // Convert SVG to canvas
    const ctx = canvas.getContext("2d");
    const canvgInstance = await Canvg.from(ctx, svgElement.outerHTML);
    await canvgInstance.render();

    // Generate image URL from canvas
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    // Download the image
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "QR_Code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleGenerateQR = () => {
    if (!shortUrl) {
      showMessage("Generate a short URL first!");
      return;
    }
    setQRUrl(shortUrl);
    setQRModalOpen(true);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleShorten = async () => {
    if (!url) {
      showMessage("Please enter a URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to shorten URL");
      }

      const data = await response.json();
      const shortUrl = `${window.location.origin}/${data.id}`;
      setShortUrl(shortUrl);
      showMessage("URL shortened successfully!");
      setTimeout(() => {
        fetchAnalytics(data.id);
      }, 4000);
    } catch (error) {
      console.error("Error shortening URL:", error);
      showMessage(error.message || "Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showMessage("Copied to clipboard!");
    } catch (error) {
      showMessage("Failed to copy to clipboard. Please try manually.");
    }
  };

  const fetchAnalytics = async (shortId = null) => {
    try {
      // If no shortId is provided, fetch all short URLs' analytics
      const url = shortId ? `/url/analytics/${shortId}` : "/url/analytics/all";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();

      // If data is an array (multiple analytics), or a single object
      const analyticsData = Array.isArray(data) ? data : [data];

      const processedAnalytics = analyticsData.map((item) => ({
        shortUrl: `${window.location.origin}/${item.shortId || shortId}`,
        originalUrl: item.redirectUrl,
        clicks: item.Totalclicks || 0,
        lastVisited:
          item.analytics && item.analytics.length > 0
            ? new Date(
                item.analytics[item.analytics.length - 1].timestamp
              ).toLocaleString()
            : "Never",
      }));

      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      showMessage("Failed to fetch analytics. Please try again.");
    }
  };

  // Modify useEffect to fetch all analytics on initial load
  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      {message && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">URL Shortener</CardTitle>
          <CardDescription className="text-blue-100">
            Shorten your links with style!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="Enter your long URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button
              onClick={handleShorten}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </Button>
          </div>
        </CardContent>
        {shortUrl && (
          <CardFooter className="bg-gray-50 rounded-b-lg flex justify-between items-center p-4">
            <Input value={shortUrl} readOnly className="flex-grow mr-2" />
            <div className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="hover:bg-blue-100"
              >
                <ClipboardCopy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGenerateQR}
                className="hover:bg-purple-100"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Analytics Dashboard
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Track your link performance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-indigo-600">Short URL</TableHead>
                <TableHead className="text-indigo-600">Original URL</TableHead>
                <TableHead className="text-indigo-600">Clicks</TableHead>
                <TableHead className="text-indigo-600">Last Visited</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.map((item) => (
                <TableRow key={item.shortUrl} className="hover:bg-indigo-50">
                  <TableCell className="font-medium">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {item.shortUrl}
                    </a>
                  </TableCell>
                  <TableCell className="truncate max-w-xs">
                    <a
                      href={item.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {item.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>{item.clicks}</TableCell>
                  <TableCell>{item.lastVisited}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={qrModalOpen} onOpenChange={setQRModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code for Your Shortened URL</DialogTitle>
            <DialogDescription>
              Scan this QR code to quickly access your shortened link
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <QRCode
              id="qr-code"
              value={qrUrl}
              size={256}
              level={"H"}
              includeMargin={true}
            />
            <div className="flex space-x-2">
              <Button
                onClick={downloadQRCode}
                className="bg-green-500 hover:bg-green-600"
              >
                Download QR
              </Button>
              <Button variant="outline" onClick={() => setQRModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
