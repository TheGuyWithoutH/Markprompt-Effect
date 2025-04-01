"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RateLimitApi, UserApi } from "@/service/backend";
import User from "@/data/user";
import { Tier } from "@/data/tiers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRate = {
  user: string;
  count: number;
  waitTime: number;
}[];

export default function UserRequestsPage() {
  const [userRates, setUserRates] = useState<UserRate>([]);
  const [users, setUsers] = useState<User[]>([]);
  const tiers = [Tier.FREE, Tier.PLUS, Tier.PRO];

  useEffect(() => {
    const interval = setInterval(() => {
      RateLimitApi.getRateStats().then((data) => {
        setUserRates(data);
      });
    }, 1000);

    UserApi.getUsers().then((data) => {
      setUsers(data);
    });

    return () => clearInterval(interval);
  }, []);

  // Handle dropdown changes by calling the API and updating the state.
  const handleTierChange = (userId: string, newTier: number) => {
    UserApi.changeTier(userId, Tier.fromNumber(newTier))
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? new User(userId, user.username, Tier.fromNumber(newTier))
              : user
          )
        );
      })
      .catch((err: Error) => {
        console.error("Error updating user tier:", err);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Request Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Key</TableHead>
                <TableHead>Request Count</TableHead>
                <TableHead>Remaining Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRates.map((user) => (
                <TableRow key={user.user}>
                  <TableCell>{user.user}</TableCell>
                  <TableCell>{user.count}</TableCell>
                  <TableCell>{user.waitTime}s</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <br
        style={{
          height: "50px",
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Select
                      value={`${user.tier.limit}`}
                      onValueChange={(value) =>
                        handleTierChange(user.id, parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem
                            key={tier.toString()}
                            value={`${tier.limit}`}
                          >
                            {tier.toString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
