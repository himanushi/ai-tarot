import { Flex } from "@yamada-ui/react";
import { Outlet } from "react-router-dom";
import { Header } from "~/client/features/header/Header";
import { Sidebar } from "~/client/features/sidebar/Sidebar";

export const HomeLayout = () => (
  <Flex as="main" direction="column">
    <Header />
    <Flex as="section" direction="row">
      <Sidebar />
      <Outlet />
    </Flex>
  </Flex>
);
