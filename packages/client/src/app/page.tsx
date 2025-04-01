"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserApi } from "@/service/backend";
import User from "@/data/user";
import { Tier } from "@/data/tiers";
import { setApiKeyCookie } from "@/lib/cookie";

export default function UserLoginPage() {
  const [username, setUsername] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [newAPIKey, setNewAPIKey] = React.useState("");

  const createUserAPI = () => {
    // create random id
    const id = Math.random().toString(36).substring(7);
    const user = new User(id, username, Tier.FREE);
    UserApi.createUser(user).then((key) => {
      setNewAPIKey(key);
    });
  };

  const connectAccount = () => {
    setApiKeyCookie(apiKey);
    window.location.replace("/chat");
  };

  if (newAPIKey !== "") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Acccount created {username}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your API Key</h2>
              <p className="text-lg font-semibold">{newAPIKey}</p>
              <Button
                className="w-full cursor-pointer"
                onClick={() => window.location.replace("/chat")}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Create an account</h2>
              <form className="space-y-4">
                <div>
                  <Label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    name="name"
                    placeholder="Your username"
                    className="mt-1 block w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </form>
              <Button className="w-full cursor-pointer" onClick={createUserAPI}>
                Create
              </Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Connect your account
              </h2>
              <form className="space-y-4">
                <div>
                  <Label
                    htmlFor="api-key"
                    className="block text-sm font-medium text-gray-700"
                  >
                    API Key
                  </Label>
                  <Input
                    id="api-key"
                    type="text"
                    name="key"
                    placeholder="Your API key"
                    className="mt-1 block w-full"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </form>
              <Button
                className="w-full cursor-pointer"
                onClick={connectAccount}
              >
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
