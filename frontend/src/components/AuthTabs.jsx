import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";

export default function AuthTabs() {
  return (
    <TabGroup className={"w-full h-full "}>
      <TabList
        className={"w-full  flex justify-center gap-5 px-5 items-center"}
      >
        <Tab
          className={
            "px-4 py-2 hover:bg-[#03045e] rounded text-[#03045e] font-medium text-2xl data-selected:bg-[#03045e] data-selected:text-white outline-0"
          }
        >
          Login
        </Tab>
        <Tab
          className={
            "px-4 py-2 hover:bg-amber-200 rounded text-[#03045e] font-medium text-2xl  data-selected:bg-[#03045e] data-selected:text-white outline-0"
          }
        >
          Sign up
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Login />
        </TabPanel>
        <TabPanel>
          <Signup />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
