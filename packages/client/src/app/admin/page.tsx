"use client";

import React, { useEffect, useState } from "react";
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

type UserRate = {
  user: string;
  count: number;
  waitTime: number;
}[];

export default function UserRequestsPage() {
  const [userRates, setUserRates] = useState<UserRate>([]);
  const [users, setUsers] = useState<User[]>([]);

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
                  <TableCell>{
                    // @ts-ignore
                    `${user.tier}`
                  }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
